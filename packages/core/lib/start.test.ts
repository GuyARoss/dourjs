import { RequestContext } from '@dour/common/types'

import { executeMiddleware } from './start'

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