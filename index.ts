/* Express style application */
import tbd from './lib';
import { RequestContext } from './lib/types';

tbd.get('/', (ctx: RequestContext) => {
})

tbd.start(3000, () => console.log('started'))