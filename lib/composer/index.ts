export { default as withMiddleware } from './with-middleware';
export { handleGet, handlePost, handlePut, handleDelete } from './handle-request-methods';

import compose from './compose';
export default compose;
