import { createClusterIfNotExists, switchToClusterFromEnv, setupCluster } from 'src/lib/cluster'
import { installHelmChart } from 'src/lib/prom-to-sd-utils'
import { deploy } from 'src/lib/vm-testnet-utils'
import { InitialArgv } from '../../deploy/initial'

export const command = 'vm-testnet'
export const describe = 'upgrade a testnet on a VM'
export const builder = {}

export const handler = async (argv: InitialArgv) => {
  // deploy VM testnet with Terraform
  await deploy(argv.celoEnv)

  // set up Kubernetes cluster that will have prometheus to stackdriver statefulset
  console.info("Creating Kubernetes cluster if it doesn't exist...")
  const createdCluster = await createClusterIfNotExists()
  console.info('Switching to cluster...')
  await switchToClusterFromEnv()
  console.info('Setting up cluster...')
  await setupCluster(argv.celoEnv, createdCluster)

  // deploy prom to sd statefulset
  await installHelmChart(argv.celoEnv)
}
