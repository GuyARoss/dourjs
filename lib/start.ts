import http from 'http';
import httpServer, { RequestError } from './http-server';

// @@ move me
interface Route {
    endpointPath: string,
    endpointHandler: () => void,
}

export default ({ routes }: { routes: Array<Route> }) => (
    port: number,
    cb: () => void,
) => {
    httpServer(port, (
        resp: any,
        handleErr: RequestError,
        req: http.IncomingMessage,
    ) => {
        // @@ covert routes to lookup table,
        // upon request -> look up address -> use that handler
    })

    cb();
}