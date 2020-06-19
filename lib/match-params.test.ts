import matchParams from './match-params';

describe('matchParams', () => {
    it('matches correctly', () => {
        expect(matchParams('/test/:cat', '/test/toast')).toEqual({
            cat: 'toast',
        })
    })
    it('matches multiple comparers', () => {
        expect(matchParams(
            '/test/:cat/bla/:foo',
            '/test/toast/bla/bar',
        )).toEqual({
            cat: 'toast',
            foo: 'bar',
        })
    })
    it('failes match for different length uris', () => {
        expect(matchParams(
            '/test/:cat/bla/:foo',
            '/test/toast/bla',
        )).toBeUndefined()
    })

    it('failes match for different uris', () => {
        expect(matchParams(
            '/test/:cat/bla/:foo',
            '/weather/toast/bla/rea',
        )).toBeUndefined()
    })
})