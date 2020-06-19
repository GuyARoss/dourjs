import http from 'http';
import router from './lib/router';
import types from './lib/model-types';
import crudType from './lib/types/crud-operation.enum';

import memoryStore from './example/memory-datasource';
import { RequestContext } from './lib/http-server';

const store = memoryStore();

const app = router(store)

app.route('/test', {
    name: types.String,
}, [
    crudType.READ,
])

app.registerMiddleware('test', (
    httpRequest: http.IncomingMessage,
    httpResponse: http.ServerResponse,
    next,
) => {
    console.log(httpRequest.headers['test'])
    if (!!httpRequest.headers['test']) {
        next()
        return
    }

    httpResponse.writeHead(402, { 'Content-Type': 'application/json' });
    httpResponse.end();
})

app.route('/test/:poop', {
    name: types.String,
}, [
    (ctx: RequestContext) => {
        return ctx.matchParams
    },
    (ctx: RequestContext) => {
        return 'cake me daddy!'
    },
])


app.start(3000, () => console.log('app start on port 3000'))

// const compose = (any) => { }

// export default compose({
//     port: 3000,
//     adapter: memoryStore,
//     middleware: {
//         auth: (request: , response, next) => {
//             if (request[])
//         }
//     },
//     routes: [
//         {
//             path: '/test',
//             model: { name: types.String },
//             operations: [
//                 crudType.READ,

//             ],
//         },
//         {
//             path: '/test/:poop',
//             model: { name: types.String },
//             operations: [
//                 (ctx: RequestContext) => {
//                     return ctx.matchParams
//                 },
//                 (ctx: RequestContext) => {
//                     return 'cake me daddy!'
//                 },
//             ],
//         },
//     ],
// })