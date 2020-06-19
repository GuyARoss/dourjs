import http from 'http';
import httpServer, { RequestError, RequestContext } from './http-server';
import { EndpointHandler } from './route';
import lazyReturn from './lazy-return';
import matchParams from './match-params';
import lazyTruth from './lazy-truth';

const executeMiddleware = async (
    middleware: { [id: string]: any }, req, resp, hangupRequest,
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
                handleErr(undefined, 404)
                return
            }

            if (request.method === 'OPTIONS') {
                httpResponse.setHeader('Allow', endpoint.supportedOperations.join(','))
            }

            return endpoint.handler({
                ...request,
                matchParams: matches,
            });
        })

        cb();
    }