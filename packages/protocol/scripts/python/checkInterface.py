import os
import sys

fileName = sys.argv[1]
filePath = fileName.split('/')
contract = filePath[-1]
path = '/'.join(filePath[0:-1])

signatures = []

def parseSolForFunctionSignatures(txt, endDelim):
  global signatures

  # improve in future
  endDelim = '(' 
  startDelim = "\n  function"

  startIdx = txt.find(startDelim)
  endIdx = txt.find(endDelim, startIdx)
  if startIdx != -1 and endIdx != -1:
    startIdx += len(startDelim) + 1
    sig = txt[startIdx:endIdx].replace('\n', '').replace("  ", '')
    signatures.append(sig)
    parseSolForFunctionSignatures(txt[endIdx:], endDelim)

interface = ""
with open(path + '/interfaces/I' + contract, 'r') as ifile:
  interface = ifile.read()
  ifile.close()

parseSolForFunctionSignatures(interface, ';')
# print(signatures)
iSignatures = frozenset(signatures)

signatures = []
impl = ""
with open(path + '/' + contract, 'r') as file:
  impl = file.read()
  file.close()

parseSolForFunctionSignatures(impl, "{")
# print(signatures)
implSignatures = frozenset(signatures)

print(iSignatures.difference(implSignatures))
