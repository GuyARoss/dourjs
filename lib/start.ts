import http from 'http';
import httpServer, { RequestError } from './http-server';

import RoutingContext from './types/routing-context';

// @@ move me
interface Route {
    endpointPath: string,
    endpointHandler: () => void,
}

export default ({ routes }: { routes: { [id: string]: any } }) => (
    port: number,
    cb: () => void,
) => {
    httpServer(port, (
        resp: any,
        handleErr: RequestError,
        req: http.IncomingMessage,
    ) => {
        const endpoint = routes[req.url as string]
        const ctx = {} as RoutingContext;

        if (!!endpoint) {
            return endpoint(ctx);
        }

        handleErr('Resource Not Found', 404)
    })

    cb();
}