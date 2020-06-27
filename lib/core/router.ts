import { RequestContext, CrudType, MiddlewareHandler } from '../types'
import lazyTruth from '../utils/lazy-truth'

import start from './start'

interface EndpointHandler {
  handler: any
  supportedOperations: any
  matchParams?: any
}

interface Route {
  endpointPath: string
  endpointDetails: EndpointHandler
}

const mapOperation = (method: string) =>
  lazyTruth(
    {
      POST: [CrudType.CREATE],
      GET: [CrudType.READ],
      PUT: [CrudType.UPDATE],
      DELETE: [CrudType.DELETE],
    },
    (current) => current === method,
  )

export const methodHandler = (
  method: string,
  path: string,
  baseHandler: (ctx: RequestContext) => EndpointHandler,
) => ({
  handler: baseHandler,
  supportedOperations: mapOperation(method),
  matchParams: path.includes('/:'),
})

export interface Router {
  use: (key: string, handler: MiddlewareHandler) => void
  route: (handler: Route) => void
  get: (path: string, handler: (ctx: RequestContext) => any) => void
  post: (path: string, handler: (ctx: RequestContext) => any) => void
  put: (path: string, handler: (ctx: RequestContext) => any) => void
  delete: (path: string, handler: (ctx: RequestContext) => any) => void
  start: (port: number, cb?: () => void) => void
}

export default (): Router => {
  const routes = {} as { [id: string]: any }
  const middleware = {} as { [id: string]: MiddlewareHandler }
  const initRoute = (route: Route) =>
    (routes[route.endpointPath] = route.endpointDetails)

  return {
    use: (key: string, handler: MiddlewareHandler) => {
      middleware[key] = handler
    },
    route: (handler: Route) => initRoute(handler),
    get: (path: string, handler: (ctx: RequestContext) => any) =>
      initRoute({
        endpointPath: path,
        endpointDetails: methodHandler('GET', path, handler),
      }),
    post: (path: string, handler: (ctx: RequestContext) => any) =>
      initRoute({
        endpointPath: path,
        endpointDetails: methodHandler('POST', path, handler),
      }),
    put: (path: string, handler: (ctx: RequestContext) => any) =>
      initRoute({
        endpointPath: path,
        endpointDetails: methodHandler('PUT', path, handler),
      }),
    delete: (path: string, handler: (ctx: RequestContext) => any) =>
      initRoute({
        endpointPath: path,
        endpointDetails: methodHandler('DELETE', path, handler),
      }),
    start: start({ routes, middleware }),
  }
}
