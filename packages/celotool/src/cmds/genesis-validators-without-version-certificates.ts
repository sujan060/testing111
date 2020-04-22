import fs from 'fs'
import path from 'path'
import { addCeloEnvMiddleware, CeloEnvArgv } from 'src/lib/env-utils'
import { getNodeVmName } from 'src/lib/vm-testnet-utils'
import { runSshCommand } from './vm-exec'

export const command = 'genesis-validators-without-version-certificates'

export const describe =
  'shows which validators in the genesis set are not in the version certificate table'

export const builder = addCeloEnvMiddleware

function normalizeAddress(address: string) {
  return address.replace('0x', '').toLowerCase()
}

function check(versionCertificateTableInfo: any, genesisValidators: any) {
  // Create set of validators found in the version certificate table
  const versionCertificateValidatorSet = new Set()
  for (const address of Object.keys(versionCertificateTableInfo)) {
    versionCertificateValidatorSet.add(normalizeAddress(address))
  }

  const missingAddresses = []
  // Iterate through each genesis validator and check if in the version certificate table
  for (const element of genesisValidators) {
    const normalizedAddress = normalizeAddress(element.address)
    if (!versionCertificateValidatorSet.has(normalizedAddress)) {
      missingAddresses.push(`0x${normalizedAddress}`)
    }
  }
  console.log(
    'These genesis validators are not in the versionCertificateTable:\n',
    missingAddresses
  )
  console.log(`Count: ${missingAddresses.length}`)
}

export const handler = async (argv: CeloEnvArgv) => {
  const instanceName = await getNodeVmName(argv.celoEnv, `tx-node-private`, 0)
  const [output] = await runSshCommand(
    instanceName,
    `sudo docker exec geth geth attach --exec 'JSON.stringify(istanbul.versionCertificateTableInfo)'`
  )

  // Double parse because it's basically double stringified
  const versionCertificateTableInfo = JSON.parse(JSON.parse(output))

  const genesisValidators = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, `../../genesis_validators_${argv.celoEnv}.json`),
      'utf8'
    )
  )

  check(versionCertificateTableInfo, genesisValidators)
}
