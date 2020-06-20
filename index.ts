import compose, {
    withMiddleware,
    withModelRouter,
    handleModel,
    handleGet,
} from './lib/composer';
import { ModelTypes } from './lib/model-router';
import memoryStore from './lib/adapters/memory';
import { RequestContext } from './lib/types';

// const store = memoryStore();

compose(
    handleGet('/test', ({ response }) => {
        response.write('Hello World!')
        // heapdump.writeSnapshot('countouring.heapsnapshot');
        // return 'test123'
    }),
).start(3002, () => console.log('app start on port 3002'))
