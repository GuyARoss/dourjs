export interface DataSource {
    // creates the collection/ table of the datasource.
    define: (name: string, model: Object) => any,
}

export interface DataSourceModel {
    create: (arg: any) => any,
    update: (arg: any) => any,
    delete: (arg: any) => any,
    findOne: (arg: any) => any,
    findAllAndCountAll: (arg: any) => any,
}

interface DataSourceAdapter {
    configure: () => DataSource,
    translateModel: (args: any) => void,
}

export default DataSourceAdapter