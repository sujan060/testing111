# TODO: implement in TS

import json
import os

from termcolor import colored

bytecodeLimit = 2**15 + 2**14 # doubled from Ethereum's bytecode limit
closeDifferential = 2**14

print("Limit: " + str(bytecodeLimit))
print("Close: " + str(bytecodeLimit - closeDifferential))

buildPath = "./build/contracts"
ignorePrefixes = ["Mock", "I"] # mocks and interfaces
ignoreSuffixes = ["Test.json", "Proxy.json"] # tests and proxies

parsedNames = []
for name in os.listdir(buildPath):
  use = True
  for prefix in ignorePrefixes:
    if name.startswith(prefix):
      use = False
      break
  for suffix in ignoreSuffixes:
    if name.endswith(suffix):
      use = False
      break
  if (use):
    parsedNames.append(name)

for fileName in sorted(parsedNames):
  with open(buildPath + '/' + fileName, 'r') as f:
    contractData = json.load(f)
    contractLen = len(contractData["deployedBytecode"])
    result = fileName + " bytecode len of " + str(contractLen)
    if contractLen > bytecodeLimit:
      print(colored(result, 'red'))
    elif contractLen > bytecodeLimit - closeDifferential:
      print(colored(result, 'yellow'))
    else:
      print(colored(result, 'green'))
