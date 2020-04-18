#!/usr/bin/env bash
set -euo pipefail

# Runs all truffle migrations in protocol/migrations/
#
# Flags:
# -n: Name of the network to migrate to

yarn run migrate "$@" && yarn run set_block_gas_limit "$@"
