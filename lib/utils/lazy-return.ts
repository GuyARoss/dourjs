export default <T>(
    obj: { [id: string]: T },
    compareFn: (thing: string) => any,
): T | undefined => {
    for (const key in obj) {
        const resp = compareFn(key)
        if (resp) {
            return resp
        }
    }

    return undefined
}