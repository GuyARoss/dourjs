import http from 'http';
import httpServer, { RequestError, RequestContext } from './http-server';
import { EndpointHandler } from './route';
import lazyReturn from './lazy-return';
import matchParams from './match-params';
import lazyTruth from './lazy-truth';

export default ({ routes }: { routes: { [id: string]: EndpointHandler } }) => (
    port: number,
    cb: () => void,
) => {
    httpServer(port, async (
        request: RequestContext,
        handleErr: RequestError,
        httpRequest: http.IncomingMessage,
        httpResponse: http.ServerResponse,
    ) => {
        const incomingUri = httpRequest.url as string

        let matches;
        const endpoint = lazyTruth<EndpointHandler>(routes, (
            routeKey: string,
        ) => {
            const route = routes[routeKey]
            if (route.matchParams) {
                // @@ match the paths with the route
                matches = matchParams(routeKey, incomingUri)
                return !!matches
            }

            return routeKey === incomingUri
        })

        if (typeof endpoint === 'undefined') {
            handleErr('Resource Not Found', 404)
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