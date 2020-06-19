import extractUrlParams from './extract-url-params';

describe('extractUrlParams', () => {
    it('handles more than one param', () => {
        expect(extractUrlParams('/?test=cat&fork=mouse')).toEqual({
            test: 'cat',
            fork: 'mouse',
        })
    })
    it('handles an invalid string', () => {
        expect(extractUrlParams('/')).toEqual({})
    })
    it('handles a single param', () => {
        expect(extractUrlParams('/?test=cat')).toEqual({
            test: 'cat',
        })
    })
})