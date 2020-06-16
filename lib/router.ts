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


    const routes = [];
    const initRoute = (initRoute: any) => {

    }

    return {
        route({ sequalizeInstance, initRoute }),
    }
}

