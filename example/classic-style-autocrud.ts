import memoryStore from '../example/memory-datasource';
import { RequestContext, CrudType } from '../lib/types';
import ethereal, { modelRouter, ModelTypes } from '../lib';

const app = ethereal()

const store = memoryStore();
const autoCrud = modelRouter(store)

app.route(autoCrud('/test/:poop', {
    name: ModelTypes.String,
}, [CrudType.READ, CrudType.READ]))


app.route(autoCrud('/custom/:poop', {
    name: ModelTypes.String,
}, [
    (ctx: RequestContext) => {
        return ctx.matchParams
    },
]))


app.start(3002, () => console.log('app start on port 3002'))
