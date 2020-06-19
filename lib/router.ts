import route from './route';
import start from './start';

import DataSourceAdapter from './types/datasource-adapter.type';
import { RequestContext } from './http-server';
import CRUDOperation from './types/crud-operation.enum';
import lazyTruth from './utils/lazy-truth';

interface EndpointHandler {
    handler: any,
    supportedOperations: any,
    matchParams?: any,
}

interface Route {
    endpointPath: string,
    endpointDetails: EndpointHandler,
}

const mapOperation = (method: string) => lazyTruth({
    'POST': [CRUDOperation.CREATE],
    'GET': [CRUDOperation.READ],
    'PUT': [CRUDOperation.UPDATE],
    'DELETE': [CRUDOperation.DELETE],
}, (current) => current === method)

const methodHandler = (
    method: string,
    path: string,
    baseHandler: (ctx: RequestContext) => EndpointHandler,
) => ({
    handler: baseHandler,
    supportedOperations: mapOperation(method),
    matchParams: path.includes('/:'),
})

export default () => {
    const routes = {} as { [id: string]: any };
    const middleware = {} as { [id: string]: any };
    const initRoute = (
        route: Route,
    ) => routes[route.endpointPath] = route.endpointDetails;

    return {
        registerMiddleware: (key: string, handler: any) => {
            middleware[key] = handler
        },
        // routeModel: route(
        //     datasource,
        //     initRoute,
        //     dataSourceAdapter.translateModel,
        // ),
        route: (handler: Route) => initRoute(handler),
        get: (
            path: string, handler: (ctx: RequestContext) => any,
        ) =>
            initRoute({
                endpointPath: path,
                endpointDetails: methodHandler('GET', path, handler),
            })
        ,
        post: (
            path: string, handler: (ctx: RequestContext) => any,
        ) =>
            initRoute({
                endpointPath: path,
                endpointDetails: methodHandler('POST', path, handler),
            })
        ,
        put: (
            path: string, handler: (ctx: RequestContext) => any,
        ) =>
            initRoute({
                endpointPath: path,
                endpointDetails: methodHandler('PUT', path, handler),
            })
        ,
        delete: (
            path: string, handler: (ctx: RequestContext) => any,
        ) =>
            initRoute({
                endpointPath: path,
                endpointDetails: methodHandler('DELETE', path, handler),
            })
        ,
        start: start({ routes, middleware }),
    }
}

