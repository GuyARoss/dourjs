export interface RequestContext {
  postBody: () => Promise<Array<string>>
  urlParams: () => { [id: string]: string }
  method: string
  matchParams?: { [id: string]: string }
  hangupRequest: any
}
export enum CrudType {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export interface DataSource {
  // creates the collection/ table of the datasource.
  define: (name: string, model: Object) => any
}

export interface DataSourceModel {
  create: (arg: any) => any
  update: (arg: any) => any
  delete: (arg: any) => any
  findOne: (arg: any) => any
  findAllAndCountAll: (arg: any) => any
}

export interface DataSourceAdapter {
  configure: () => DataSource
  translateModel: (args: any) => void
}

export type MiddlewareNext = (nextMiddleware?: string) => void
