// v4 uuid ty https://stackoverflow.com/a/2117523
export default () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g, (c: string) => {
        const rnd = Math.random() * 16 | 0, v = c === 'x' ? rnd :
            (rnd & 0x3 | 0x8);
        return v.toString(16);
    });