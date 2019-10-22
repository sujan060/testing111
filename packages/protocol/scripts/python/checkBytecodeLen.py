# TODO: implement in TS

import json
import os

from termcolor import colored

bytecodeLimit = 2**15 + 2**14 # doubled from Ethereum's bytecode limit
closeDifferential = 2**14

print(colored("Limit " + str(bytecodeLimit), 'magenta', attrs=['bold']))

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
    valueStr = ''
    if contractLen > bytecodeLimit:
      valueStr = colored(str(contractLen), 'red')
    elif contractLen > bytecodeLimit - closeDifferential:
      valueStr = colored(str(contractLen), 'yellow')
    else:
      valueStr = colored(str(contractLen), 'green')
    
    if (valueStr):
      print(fileName[:-5] + ' ' + valueStr)
