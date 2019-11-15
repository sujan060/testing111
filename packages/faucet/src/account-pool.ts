import { Address } from '@celo/contractkit'
import { database } from 'firebase-admin'

const SECOND = 1000

export enum ActionResult {
  Ok,
  NoFreeAccount,
  ActionTimeout,
}

export interface AccountRecord {
  pk: string
  address: Address
  locked: boolean
}

export interface PoolOptions {
  retryWaitMS: number
  getAccountTimeoutMS: number
  actionTimeoutMS: number
}

export class AccountPool {
  constructor(
    private db: database.Database,
    private network: string,
    private options: PoolOptions = {
      getAccountTimeoutMS: 10 * SECOND,
      retryWaitMS: 3000,
      actionTimeoutMS: 50 * SECOND,
    }
  ) {}
  get accountsRef() {
    return this.db.ref(`/${this.network}/accounts`)
  }
  removeAll() {
    return this.accountsRef.remove()
  }
  addAccount(account: AccountRecord) {
    return this.accountsRef.push(account)
  }
  getAccounts() {
    return this.accountsRef.once('value').then((snap) => snap.val())
  }
  async doWithAccount(action: (account: AccountRecord) => Promise<any>): Promise<ActionResult> {
    const accountSnap = await this.tryLockAccountWithRetries()
    if (!accountSnap) {
      return ActionResult.NoFreeAccount
    }
    try {
      return withTimeout(
        this.options.actionTimeoutMS,
        async () => {
          await action(accountSnap.val())
          return ActionResult.Ok
        },
        () => ActionResult.ActionTimeout
      )
    } finally {
      await accountSnap.child('locked').ref.set(false)
    }
  }
  async tryLockAccountWithRetries() {
    let end = false
    let retries = 0
    const loop = async () => {
      while (!end) {
        const acc = await this.tryLockAccount()
        if (acc != null) {
          return acc
        } else {
          await wait(this.options.retryWaitMS)
          retries++
        }
      }
      return null
    }
    const onTimeout = () => {
      end = true
      return null
    }
    const account = await withTimeout(this.options.getAccountTimeoutMS, loop, onTimeout)
    if (account) {
      console.info(`LockAccount: ${account.val().address} (after ${retries - 1} retries)`)
    } else {
      console.warn(`LockAccount: Failed`)
    }
    return account
  }
  async tryLockAccount(): Promise<null | database.DataSnapshot> {
    const accountsSnap = await this.accountsRef.once('value')
    const accountKeys: string[] = []
    accountsSnap.forEach((accSnap) => {
      accountKeys.push(accSnap.key!)
    })
    for (const key of accountKeys) {
      const lockPath = accountsSnap.child(key + '/locked')
      if (!lockPath.val() && (await this.trySetLockField(lockPath.ref))) {
        return accountsSnap.child(key)
      }
    }
    return null
  }
  /**
   * Try to set `locked` field to true.
   *
   * @param lockRef Reference to lock field
   * @returns Wether it sucessfully updated the field
   */
  private async trySetLockField(lockRef: database.Reference) {
    const txres = await lockRef.transaction((curr: boolean) => {
      if (curr) {
        return // already locked, abort
      } else {
        return true
      }
    })
    return txres.committed
  }
}

function withTimeout<A>(
  timeout: number,
  fn: () => Promise<A>,
  onTimeout?: () => A | Promise<A>
): Promise<A> {
  return new Promise((resolve, reject) => {
    let timeoutHandler: number | null = setTimeout(() => {
      timeoutHandler = null

      if (onTimeout) {
        resolve(onTimeout())
      } else {
        reject(new Error(`Timeout after ${timeout} ms`))
      }
    }, timeout)

    fn()
      .then((val) => {
        if (timeoutHandler !== null) {
          clearTimeout(timeoutHandler)
          resolve(val)
        }
      })
      .catch((err) => {
        if (timeoutHandler !== null) {
          clearTimeout(timeoutHandler)
          reject(err)
        }
      })
  })
}

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
