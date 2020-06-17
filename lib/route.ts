import lazyTruth from './lazy-truth';

import crudTypes from './types/crud-operation.enum';
import RoutingContext from './types/routing-context';
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
        [crudTypes.CREATE]: (
            ctx: RoutingContext,
        ) => datasource.create(ctx.postData),
        [crudTypes.UPDATE]: (
            ctx: RoutingContext,
        ) => datasource.update(ctx.postData),
        [crudTypes.DELETE]: (
            ctx: RoutingContext,
        ) => datasource.delete(ctx.postData),
        [crudTypes.READ]: ({
            urlParams: { offset, limit, ...rest },
        }: RoutingContext,
        ) =>
            rest.hasOwnProperty('id') ?
                datasource.findOne({ where: rest }) :
                datasource.findAllAndCountAll({
                    where: rest,
                    offset,
                    limit,
                }),

    }, (op) => op === c.toString()),
}) : ({
    ...a,
    custom: [...a.custom, c],
}), { custom: [] })


// creates the requested crud endpoints based on the provided 'operationTypes'
const createEndpointHandler = (
    name: string,
    datasource: DataSource,
    model: any,
    operationsTypes: any,
) => {
    const datasourceModel = datasource.define(name, model)
    const handlers: { [id: string]: any } = createHandlers(
        datasourceModel,
        operationsTypes,
    )

    console.log('datmodel', datasourceModel)

    return async (ctx: RoutingContext) => {
        console.log(ctx)
        const methodHandler = lazyTruth({
            get: handlers[crudTypes.READ],
            put: handlers[crudTypes.UPDATE],
            delete: handlers[crudTypes.DELETE],
            post: handlers[crudTypes.CREATE],
        }, (op) => op === ctx.method)
        console.log('mh', methodHandler)

        if (!!methodHandler) {
            const resp = methodHandler(ctx)
            console.log('look at me', resp)
            return resp
        }

        return {}

        // @@@ ya need to do an undefined check on this.
        // return Promise.all(handlers.custom.map((handler: any) => handler(
        //     ctx,
        //     sequalizeModel,
        // )))
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