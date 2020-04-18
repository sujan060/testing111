/* tslint:disable no-console */
import { parseBlockExtraData } from '@celo/utils/src/istanbul'
import { readFileSync } from 'fs'
import yargs from 'yargs'

interface ParseGenesisFileArgv {
  genesisFile: string
}

export const command = 'parse-genesis'

export const describe = 'command for generating account address from private key'

export const builder = (argv: yargs.Argv) => {
  return argv.option('genesisFile', {
    type: 'string',
    description: 'genesis file',
    demand: 'Please, specify a path to the gensis file',
  })
}

export const handler = async (argv: ParseGenesisFileArgv) => {
  const genesis = JSON.parse(readFileSync(argv.genesisFile).toString())
  const extraData = parseBlockExtraData(genesis.extraData)
  console.log(extraData)
}
