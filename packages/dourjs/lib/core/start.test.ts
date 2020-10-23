import { executeMiddleware } from './start';
import { RequestContext } from '../types';

describe('start', () => {
    describe('executeMiddleware', () => {
        it('executes', async () => {
            const middleware = {
                "first": () => { }
            }

            expect(await executeMiddleware(
                middleware,
                {} as RequestContext,
            )).toEqual(false)
        })
    })
})