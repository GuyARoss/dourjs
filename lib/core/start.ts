import http from 'http';

import matchParams from '../utils/match-params';
import lazyTruth from '../utils/lazy-truth';
import { RequestContext } from '../types';

import httpServer, { RequestError } from './http-server';

export interface EndpointHandler {
    handler: (ctx: RequestContext) => any,
    supportedOperations: any,
    matchParams: boolean,
}

export type MiddlewareNext = (nextMiddleware?: string) => void

const executeMiddleware = async (
    middleware: { [id: string]: any },
    req: http.IncomingMessage,
    resp: http.ServerResponse,
) => {
    let count = 0;
    let prev;

    const middlewareKeys = Object.keys(middleware)
    const next = (id: string) => {
        if (id === undefined) {
            count += 1
            return
        }

        count = middlewareKeys.indexOf(id);
    }
    while (count < middlewareKeys.length) {
        if (prev === count) {
            return false
        }

        await middleware[middlewareKeys[count]](req, resp, next)

        prev = count
    }

    return true
}

export default ({ routes, middleware }: {
    routes: {
        [id: string]: EndpointHandler,
    },
    middleware: any,
}) => (
    port: number,
    cb: () => void,
    ) => {
        console.log(routes)
        httpServer(port, async (
            request: RequestContext,
            handleErr: RequestError,
            httpRequest: http.IncomingMessage,
            httpResponse: http.ServerResponse,
        ) => {
            const resolved = await executeMiddleware(
                middleware,
                httpRequest,
                httpResponse,
            )
            if (!resolved) {
                request.hangupRequest()
                return {}
            }

            const incomingUri = httpRequest.url as string

            let matches;
            const endpoint = lazyTruth<EndpointHandler>(routes, (
                routeKey: string,
            ) => {
                const route = routes[routeKey]
                if (route.matchParams) {
                    matches = matchParams(routeKey, incomingUri)
                    return !!matches
                }

                return routeKey === incomingUri
            })

            if (typeof endpoint === 'undefined') {
                handleErr('resource not found', 404)
                return
            }

            if (request.method === 'OPTIONS') {
                httpResponse.setHeader(
                    'Allow',
                    endpoint.supportedOperations.join(','),
                )
            }

            return endpoint.handler({
                ...request,
                matchParams: matches,
            });
        })

        cb();
    }