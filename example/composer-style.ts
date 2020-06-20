import http from 'http';

import types from '../lib/model-router/model-types';
import memoryStore from '../lib/adapters/memory';
import { MiddlewareNext } from '../lib/core/start';
import { CrudType, RequestContext } from '../lib/types';
import compose, { withMiddleware, handleGet } from '../lib/composer';
import { withModelRouter, handleModel } from '../lib/model-router';

const store = memoryStore();

export default compose(
    withMiddleware('auth', (
        req: http.IncomingMessage,
        resp: http.ServerResponse,
        next: MiddlewareNext,
    ) => {
        if (req.headers['authorization'] !== 'test') {
            resp.writeHead(401)
            return
        }

        next()
    }),
    withModelRouter(store),
    handleModel('/test/:poop', {
        name: types.String,
    }, [CrudType.READ]),
    handleGet('/test', (ctx: RequestContext) => {
        return 'test123'
    }),
).start(3002, () => console.log('app start on port 3002'))
