import DataSourceAdapter, { DataSource, DataSourceModel } from '../lib/types/datasource-adapter.type';

export default (): DataSourceAdapter => {
    const storage = [{
        test: '1233',
        working: 'indeed',
    }];

    const configure = () => ({
        define: () => ({
            create: () => { },
            update: () => { },
            delete: () => { },
            findOne: () => { },
            findAllAndCountAll: async () => storage,
        }) as DataSourceModel,
    }) as DataSource

    return {
        configure,
        translateModel: (summfn) => {
            console.log(summfn)
        },
    }
}

