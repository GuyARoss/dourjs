import router from './lib/router';
import types from './lib/model-types';
import crudType from './lib/types/crud-operation.enum';

import memoryStore from './example/memory-datasource';
import { RequestContext } from './lib/http-server';

const store = memoryStore();

// const app = router(store)

// app.route('/test', {
//     name: types.String,
// }, [
//     crudType.READ,
// ])

// app.route('/test/:poop', {
//     name: types.String,
// }, [
//     (ctx: RequestContext) => {
//         return ctx.matchParams
//     },
//     (ctx: RequestContext) => {
//         return 'cake me daddy!'
//     },
// ])


// app.start(3000, () => console.log('app start on port 3000'))

const compose = (any) => { }

export default compose({
    port: 3000,
    adapter: memoryStore,
    middleware: {
        auth: (request, response, next) => {

        }
    },
    routes: [
        {
            path: '/test',
            model: { name: types.String },
            operations: [
                crudType.READ,

            ],
        },
        {
            path: '/test/:poop',
            model: { name: types.String },
            operations: [
                (ctx: RequestContext) => {
                    return ctx.matchParams
                },
                (ctx: RequestContext) => {
                    return 'cake me daddy!'
                },
            ],
        },
    ],
})