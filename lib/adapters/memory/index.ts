import { DataSourceAdapter, DataSource, DataSourceModel } from '../../types'

export default (): DataSourceAdapter => {
  console.warn(
    '\x1b[93m',
    'Warning: Memory Adapter: This datasource is not recommended for prod environments',
    '\x1b[0m',
  )

  let storage: Array<any> = []

  const dataSource =
    ({
      define: () =>
        ({
          create: async (data) => {
            storage.push(data)
            return true
          },
          update: async (data) => {
            storage = storage.map((x) => (x.id === data.id ? data : x))

            return data
          },
          destroy: async ({ id }) => {
            storage = storage.filter((x) => x !== id)
            return true
          },
          findOne: async ({ where }) => storage.find((x) => x.id === where.id),
          findAndCountAll: async () => ({
            data: storage,
            count: storage.length,
          }),
        } as DataSourceModel),
    } as DataSource)

  return {
    dataSource,
    translateModel: () => { },
  }
}
