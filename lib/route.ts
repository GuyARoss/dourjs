import lazyTruth from './lazy-truth';

import { RequestContext } from './http-server';

import crudTypes from './types/crud-operation.enum';
import { DataSource, DataSourceModel } from './types/datasource-adapter.type';

type opType = crudTypes;

// create handlers for each of the different method types.
// if "custom" we want to map that to a special extended endpoint
export const createHandlers = (
    datasource: DataSourceModel,
    operationTypes: Array<opType>,
) => operationTypes.reduce((a, c) => typeof c !== 'function' ? ({
    ...a,
    [c]: lazyTruth({
        [crudTypes.CREATE]: async (
            ctx: RequestContext,
        ) => {
            const postData = await ctx.postBody()
            return datasource.create(postData)
        },
        [crudTypes.UPDATE]: async (
            ctx: RequestContext,
        ) => {
            const postData = await ctx.postBody();
            return datasource.update(postData);
        },
        [crudTypes.DELETE]: async (
            ctx: RequestContext,
        ) => {
            const postData = await ctx.postBody();
            return datasource.delete(postData);
        },
        [crudTypes.READ]: async ({
            urlParams,
        }: RequestContext,
        ) => {
            const { offset, limit, ...rest } = urlParams()
            return rest.hasOwnProperty('id') ?
                datasource.findOne({ where: rest }) :
                datasource.findAllAndCountAll({
                    where: rest,
                    offset,
                    limit,
                })
        },
    }, (op) => op === c.toString()),
}) : ({
    ...a,
    custom: [...a.custom, c],
}), { custom: [] })

export interface EndpointHandler {
    handler: (ctx: RequestContext) => any,
    supportedOperations: any,
    matchParams: boolean,
}

// creates the requested crud endpoints based on the provided 'operationTypes'
const createEndpointHandler = (
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
        }, (op) => op === ctx.method)

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

        return customHandlers
    }

    return {
        handler,
        supportedOperations: operationTypes,
        matchParams: name.includes('/:'),
    }
}

export default (
    datasource: DataSource,
    initRoute: any,
    translateModel: any,
) => (
    name: string,
    model: any,
    operationsTypes: Array<any>,
    ) => initRoute({
        endpointPath: name,
        endpointHandler: createEndpointHandler(
            name,
            datasource,
            translateModel(model),
            operationsTypes,
        ),
    })