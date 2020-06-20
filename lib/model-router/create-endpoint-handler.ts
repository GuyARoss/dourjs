import lazyTruth from '../utils/lazy-truth';
import { RequestContext } from '../http-server';
import { EndpointHandler } from '../start';
import { DataSource } from '../types/datasource-adapter.type';
import crudTypes from '../types/crud-operation.enum';

import createHandlers from './create-handlers';

// creates the requested crud endpoints based on the provided 'operationTypes'
export default (
    name: string,
    datasource: DataSource,
    model: any,
    operationTypes: any,
): EndpointHandler => {
    const datasourceModel = datasource.define(name, model)
    const handlers: { [id: string]: any } = createHandlers(
        datasourceModel,
        operationTypes,
    )

    const handler = async (ctx: RequestContext) => {
        const methodHandler = lazyTruth({
            GET: handlers[crudTypes.READ],
            PUT: handlers[crudTypes.UPDATE],
            DELETE: handlers[crudTypes.DELETE],
            POST: handlers[crudTypes.CREATE],
        }, (op: string) => op === ctx.method)

        if (!!methodHandler) {
            return methodHandler(ctx)
        }

        const customHandlers = await Promise.all(
            handlers.custom.map((handler: any) => handler(
                ctx,
                datasourceModel,
            )))

        if (customHandlers.length === 1) {
            return customHandlers[0]
        }
        // @@ if no handler exists, we need to return method not avaliable.
        return customHandlers
    }

    return {
        handler,
        supportedOperations: operationTypes,
        matchParams: name.includes('/:'),
    }
}
