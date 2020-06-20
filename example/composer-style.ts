import http from 'http';

import types from '../lib/model-types';
import memoryStore from '../example/memory-datasource';
import { RequestContext } from '../lib/http-server';
import { MiddlewareNext } from '../lib/start';
import CRUDOperation from '../lib/types/crud-operation.enum';
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
    }, [CRUDOperation.READ]),
    handleGet('/test', (ctx: RequestContext) => {
        return 'test123'
    }),
).start(3002, () => console.log('app start on port 3002'))
