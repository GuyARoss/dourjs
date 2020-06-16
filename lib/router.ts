import Sequelize from 'sequelize';

import route from './route';

interface RouterConfig {
    database: string,
    username: string,
    password: string,
}

export default async (config: RouterConfig) => {
    const sequalizeInstance = new Sequelize(
        config.database,
        config.password,
        config.username,
        {
            host: 'localhost',
            dialect: 'postgresql',
        }
    );

    await sequalizeInstance.sync()

    // @@ garbage.. :/ prob not going to be collected...
    const routes = {} as { [id: string]: any };
    const initRoute = (route: {
        endpointPath: string,
        endpointHandler: any,
    }) => routes[route.endpointPath] = route.endpointHandler;

    return {
        route({ sequalizeInstance, initRoute })
    }
}

