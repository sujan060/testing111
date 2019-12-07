import { upgradeValidator } from 'src/lib/vm-testnet-utils'
import { envVar, fetchEnv } from 'src/lib/env-utils'
import yargs from 'yargs'
import { UpgradeArgv } from '../../deploy/upgrade'

export const command = 'vm-validators'
export const describe = 'Performs a rolling upgrade on each validator'

type VmValidatorArgv = UpgradeArgv & {
  from: number
  to: number
}

export const builder = (argv: yargs.Argv) => {
  return argv
    .option('from', {
      describe: 'Index to start from (zero indexed)',
      default: -1, // defaults to envVar.VALIDATORS - 1
      type: 'number',
    })
    .option('to', {
      describe: 'Index to end at (inclusive, zero indexed)',
      default: 0,
      type: 'number',
    })
}

export const handler = async (argv: VmValidatorArgv) => {
  // default to highest validator
  let from = argv.from
  if (argv.from < 0) {
    from = parseInt(fetchEnv(envVar.VALIDATORS), 10) - 1
  }
  const to = argv.to

  console.info(
    `Upgrading VM validators one by one.\nEnv: ${argv.celoEnv}\nFrom: ${from}\nTo: ${to}`
  )

  let step = from < to ? 1 : -1

  const upToInclusive = (i: number, bound: number) => {
    if (step > 0) {
      return i <= bound
    }
    return i >= bound
  }

  for (let i = from; upToInclusive(i, to); i += step) {
    await upgradeValidator(argv.celoEnv, i)
  }
}
