export default <T>(
  obj: { [id: string]: T },
  compareFn: (thing: string) => boolean,
): T | undefined => {
  const match = Object.keys(obj).find(compareFn)

  return match ? obj[match] : undefined
}
