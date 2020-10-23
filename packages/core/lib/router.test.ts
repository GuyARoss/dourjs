import { methodHandler } from './router';

describe('router', () => {
    describe('method handler', () => {
        it('creates the handler options', () => {
            expect(methodHandler('POST', '/test')).toEqual({
                handler: null,
                supportedOperations: ['CREATE'],
                matchParams: false,
            })
        })
        it('creates the handler options - MatchParams', () => {
            expect(methodHandler('POST', '/:test')).toEqual({
                handler: null,
                supportedOperations: ['CREATE'],
                matchParams: true,
            })
        })
    })
})