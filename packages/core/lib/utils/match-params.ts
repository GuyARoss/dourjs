export default (comparer: string, incoming: string) => {
  const incomingSplit = incoming.split('/')
  const comparerSplit = comparer.split('/')

  if (comparerSplit.length !== incomingSplit.length) {
    return undefined
  }

  const params: { [id: string]: string } = {}
  for (let i = 0; i < comparerSplit.length; i++) {
    const currentComparer = comparerSplit[i]
    if (currentComparer.includes(':')) {
      params[currentComparer.replace(':', '')] = incomingSplit[i]
      continue
    }

    if (currentComparer !== incomingSplit[i]) {
      return undefined
    }
  }

  return params
}
