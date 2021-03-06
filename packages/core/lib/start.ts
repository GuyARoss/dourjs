import http from 'http'
import { RequestContext } from '@dour/common/types'

import matchParams from './utils/match-params'
import lazyTruth from './utils/lazy-truth'

import httpServer, { RequestError } from './http-server'

export interface EndpointHandler {
  handler: (ctx: RequestContext) => any
  supportedOperations: any
  matchParams: boolean
}

export const executeMiddleware = async (
  middleware: { [id: string]: any },
  ctx: RequestContext,
) => {
  let count = 0
  let prev

  const middlewareKeys = Object.keys(middleware)
  const next = (id: string) => {
    if (id === undefined) {
      count += 1
      return
    }

    count = middlewareKeys.indexOf(id)
  }

  while (count < middlewareKeys.length) {
    if (prev === count) {
      return false
    }

    await middleware[middlewareKeys[count]](ctx, next)

    prev = count
  }

  return true
}

export default ({
  routes,
  middleware,
}: {
  routes: {
    [id: string]: EndpointHandler
  }
  middleware: any
}) => (): http.Server =>
    httpServer(
      async (
        ctx: RequestContext,
        handleErr: RequestError,
      ) => {
        const resolved = await executeMiddleware(
          middleware,
          ctx,
        )
        if (!resolved) {
          ctx.hangupRequest()
          return {}
        }

        const incomingUri = (ctx.request.url as string).split('?')[0]

        let matches
        const endpoint = lazyTruth<EndpointHandler>(
          routes,
          (routeKey: string) => {
            const route = routes[routeKey]
            if (route.matchParams) {
              matches = matchParams(routeKey, incomingUri)
              return !!matches
            }

            return routeKey === incomingUri
          },
        )

        if (typeof endpoint === 'undefined') {
          handleErr('resource not found', 404)
          return
        }

        if (ctx.request.method === 'OPTIONS') {
          // we currently don't support this mode, so just hangup the request
          ctx.response.setHeader('Allow', endpoint.supportedOperations.join(','))
          return
        }

        ctx.matchParams = matches
        return endpoint.handler(ctx)
      },
    )


