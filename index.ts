import router from './lib/router';
import types from './lib/model-types';
import crudType from './lib/types/crud-operation.enum';

import memoryStore from './example/memory-datasource';

const store = memoryStore();

const app = router(store)

app.route('/test', {
    name: types.String
}, [
    crudType.READ,
])

app.start(3000, () => console.log('app start on port 3000'))