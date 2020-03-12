---
description: View parameters of the network, including but not limited to configuration for the various Celo core smart contracts.
---

## Commands

### Parameters

View parameters of the network, including but not limited to configuration for the various Celo core smart contracts.

```
USAGE
  $ celocli network:parameters
```

_See code: [packages/cli/src/commands/network/parameters.ts](https://github.com/celo-org/celo-monorepo/tree/master/packages/cli/src/commands/network/parameters.ts)_

### Trace

Trace a transaction

```
USAGE
  $ celocli network:trace

OPTIONS
  --endBlock=endBlock        Ending block to trace
  --startBlock=startBlock    Starting block to trace
  --tracer=tracer            Javascript tracer code
  --transaction=transaction  Transaction hash to trace
```

_See code: [packages/cli/src/commands/network/trace.ts](https://github.com/celo-org/celo-monorepo/tree/master/packages/cli/src/commands/network/trace.ts)_
