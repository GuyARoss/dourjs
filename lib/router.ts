
import route from './route';
import start from './start';

import DataSourceAdapter from './types/datasource-adapter.type';

export default (dataSourceAdapter: DataSourceAdapter) => {
    const datasource = dataSourceAdapter.configure();

    const routes = {} as { [id: string]: any };
    const initRoute = (route: {
        endpointPath: string,
        endpointHandler: any,
    }) => routes[route.endpointPath] = route.endpointHandler;

    return {
        route: route(datasource, initRoute, dataSourceAdapter.translateModel),
        start: start({ routes }),
    }
}

