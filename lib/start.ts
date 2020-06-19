import http from 'http';
import httpServer, { RequestError, RequestContext } from './http-server';
import { EndpointHandler } from './route';
import lazyReturn from './lazy-return';
import matchParams from './match-params';
import lazyTruth from './lazy-truth';

const executeMiddleware = (middleware: Array<string>, req, resp) => {
    let next: boolean = true
    let count = 0

    while (!next || count < middleware.length) {
        middleware[count](req, resp, () => count += 1)
    }
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
            for (me in middleware) {
                const doNext = () => { }
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