import http from 'http'
export interface RequestContext {
  postBody: () => Promise<any>
  urlParams: () => { [id: string]: string }
  hangupRequest: () => void,

  request: http.IncomingMessage,
  response: http.ServerResponse,

  matchParams?: { [id: string]: string }
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
  destroy: (arg: any) => any
  findOne: (arg: any) => any
  findAndCountAll: (arg: any) => any
}

export interface DataSourceAdapter {
  dataSource: DataSource,
  translateModel: (args: any) => void
}

export type MiddlewareNext = (nextMiddleware?: string) => void

export type MiddlewareHandler = (
  ctx: RequestContext,
  next: MiddlewareNext,
) => void