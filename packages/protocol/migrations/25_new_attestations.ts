module.exports = (deployer: any, _, accounts) => {
  console.log(accounts)
  const Attestations = artifacts.require('Attestations')
  deployer
    .deploy(Attestations)
    .then(() => console.log('new attestations implementation:', Attestations.address))
}
