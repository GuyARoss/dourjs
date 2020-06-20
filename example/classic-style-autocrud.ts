import memoryStore from '../example/memory-datasource';
import { RequestContext } from '../lib/http-server';
import ModelType from '../lib/model-types';
import modelRouter from '../lib/model-router';
import router from '../lib/router';
import CRUDOperation from '../lib/types/crud-operation.enum';

const app = router()

const store = memoryStore();
const autoCrud = modelRouter(store)

app.route(autoCrud('/test/:poop', {
    name: ModelType.String,
}, [CRUDOperation.READ, CRUDOperation.READ]))


app.route(autoCrud('/custom/:poop', {
    name: ModelType.String,
}, [
    (ctx: RequestContext) => {
        return ctx.matchParams
    },
]))


app.start(3002, () => console.log('app start on port 3002'))
