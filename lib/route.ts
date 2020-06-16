import Sequelize from 'sequelize';

import lazyTruth from './lazy-truth';

import crudTypes from './types/crud-operation.enum';

type opType = crudTypes;

// create handlers for each of the different method types.
// if "custom" we want to map that to a special extended endpoint
const createHandlers = (
    sequalizeModel: any,
    operationTypes: Array<opType>,
) => operationTypes.reduce((a, c) => typeof c !== 'function' ? ({
    ...a,
    [c]: lazyTruth({
        [crudTypes.CREATE]: (ctx: RoutingContext) => { },
        [crudTypes.UPDATE]: (ctx: RoutingContext) => { },
        [crudTypes.DELETE]: (ctx: RoutingContext) => { },
        [crudTypes.READ]: (ctx: RoutingContext) => { },
    }, (op) => op === c.toString()),
}) : ({
    ...a,
    custom: [...a.custom, c],
}), { custom: [] })

// @@ MOVE ME
interface RoutingContext {
    method: string,
    postData: Object,
    urlParams: Object,
}

const createEndpointHandler = (
    sequalizeInstance: any,
    model: any,
    operationsTypes: any,
) => {
    const sequalizeModel = sequalizeInstance.define(name, model)
    const handlers: { [id: string]: any } = createHandlers(
        sequalizeModel,
        operationsTypes,
    )

    return async (ctx: RoutingContext) => {
        const methodHandler = lazyTruth({
            get: handlers[crudTypes.READ],
            put: handlers[crudTypes.UPDATE],
            delete: handlers[crudTypes.DELETE],
            post: handlers[crudTypes.CREATE],
        }, (op) => op === ctx.method)

        if (!!methodHandler) {
            return methodHandler(ctx)
        }

        return Promise.all(handlers.custom.map((handler: any) => handler(
            ctx,
            sequalizeModel,
        )))
    }
}

export default (
    sequalizeInstance: any,
    initRoute: any,
) => (
    name: string,
    model: any,
    operationsTypes: Array<any>,
    ) => initRoute({
        endpointPath: name,
        endpointHandler: createEndpointHandler(
            sequalizeInstance,
            model,
            operationsTypes,
        ),
    })