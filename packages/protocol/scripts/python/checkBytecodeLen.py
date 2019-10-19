# TODO: implement in TS

import json
import os

from termcolor import colored

bytecodeLimit = 2**15 + 2**14 # doubled from Ethereum's bytecode limit
closeDifferential = 2**14

print("Limit: " + str(bytecodeLimit))
print("Close: " + str(bytecodeLimit - closeDifferential))

buildPath = "./build/contracts"
ignorePaths = ["interfaces", "proxies", "test", "libraries"]

for fileName in sorted(os.listdir(buildPath)):
  with open(buildPath + '/' + fileName, 'r') as f:
    contractData = json.load(f)

    srcPath = contractData["sourcePath"]
    dirEnds = srcPath.rindex('/')
    dirStarts = srcPath.rindex('/', 0, dirEnds)
    dirPath = srcPath[dirStarts+1:dirEnds]
    if (dirPath in ignorePaths):
      continue

    contractLen = len(contractData["deployedBytecode"])
    result = fileName + " bytecode len of " + str(contractLen)
    if contractLen > bytecodeLimit:
      print(colored(result, 'red'))
    elif contractLen > bytecodeLimit - closeDifferential:
      print(colored(result, 'yellow'))
    else:
      print(colored(result, 'green'))
