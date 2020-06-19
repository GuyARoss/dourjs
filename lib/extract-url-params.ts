export default (
    path: string,
): { [id: string]: string } => (path.includes('?')) ? path.
    split('?')[1].
    split('&').reduce((a, c) => {
        const [key, value] = c.split('=')
        return {
            ...a,
            [key]: value,
        }
    }, {}) : {}
