import { DataSourceAdapter, DataSource, DataSourceModel } from '../../types';

export default (): DataSourceAdapter => {
    console.warn(
        '\x1b[93m',
        'Warning: Memory Adapter: This datasource is not recommended for prod environments',
        '\x1b[0m',
    )

    let storage: Array<any> = [];

    const configure = () => ({
        define: () => ({
            create: async (data) => {
                storage.push(data)
                return true
            },
            update: async (data) => {
                storage = storage.map(x => (x.id === data.id) ? data : x)

                return data
            },
            delete: async (data) => {
                storage = storage.filter(x => x !== data.bind)
                return true
            },
            findOne: async ({ where }) => storage.find(
                x => x.id === where.id
            ),
            findAllAndCountAll: async () => ({
                data: storage,
                count: storage.length,
            }),
        }) as DataSourceModel,
    }) as DataSource

    return {
        configure,
        translateModel: () => { },
    }
}

