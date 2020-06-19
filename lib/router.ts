
import route from './route';
import start from './start';

import DataSourceAdapter from './types/datasource-adapter.type';

export default (dataSourceAdapter: DataSourceAdapter) => {
    const datasource = dataSourceAdapter.configure();

    const routes = {} as { [id: string]: any };
    const middleware = [];
    const initRoute = (route: {
        endpointPath: string,
        endpointHandler: any,
    }) => routes[route.endpointPath] = route.endpointHandler;

    return {
        registerMiddleware: (handler: any) => middleware.push(handler),
        route: route(datasource, initRoute, dataSourceAdapter.translateModel),
        start: start({ routes, middleware }),
    }
}

