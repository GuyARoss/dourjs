import http from 'http';
import httpServer, { RequestError } from './http-server';

import RoutingContext from './types/routing-context';

export default ({ routes }: { routes: { [id: string]: any } }) => (
    port: number,
    cb: () => void,
) => {
    httpServer(port, async (
        resp: any,
        handleErr: RequestError,
        req: http.IncomingMessage,
    ) => {
        const endpoint = routes[req.url as string]
        const ctx = {
            method: req.method.toLowerCase(),
            urlParams: {}
        } as RoutingContext;

        // console.log(await endpoint())

        if (!!endpoint) {
            const endpointResponse = await endpoint(ctx)
            return endpointResponse;
        }

        handleErr('Resource Not Found', 404)
    })

    cb();
}