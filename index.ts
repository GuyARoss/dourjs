import router from './lib/router';
import types from './lib/model-types';

import memoryStore from './example/memory-datasource';
import { RequestContext } from './lib/http-server';

import modelRouter from './lib/model-router';

const store = memoryStore();

const app = router()

const autoCrud = modelRouter(store)

app.route(autoCrud('/test/:poop', {
    name: types.String,
}, [
    (ctx: RequestContext) => {
        return ctx.matchParams
    },
    (ctx: RequestContext) => {
        return 'cake me daddy!'
    },
]))

app.get('/test', (ctx: RequestContext) => {
    console.log('being called!')
    return "working!"
})

app.start(3002, () => console.log('app start on port 3002'))

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