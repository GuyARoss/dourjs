import http from 'http';

import extractUrlParams from './extract-url-params';

const parseRequest = (req: any) => {
    return new Promise((res, rej) => {
        const data: Array<string> = [];
        req.on('data', (chunk: any) => {
            data.push(chunk);
        });
        req.on('end', () => {
            if (req.method === 'POST') {
                res(JSON.parse(data.join('')));
            }

            res();
        });
        req.on('error', (err: string) => {
            rej(err);
        });
    });
};


const handleErr = (
    res: http.ServerResponse,
) => (err?: string, status = 500) => {
    const adjustedErr = { error: err };

    if (!!err) {
        res.writeHead(status, { 'Content-Type': 'application/json' });
    }
    res.write(JSON.stringify(adjustedErr));
    res.end();

    return;
};

export type RequestError = (err?: string, status?: number) => any;

export interface RequestContext {
    postBody: () => Promise<Array<string>>,
    urlParams: () => { [id: string]: string },
    method: string,
    matchParams?: { [id: string]: string },
    hangupRequest: any,
}

export type RequestHandler = (
    request: RequestContext,
    handleErr: RequestError,
    httpRequest: http.IncomingMessage,
    httpResponse: http.ServerResponse,
) => any

const httpOutBuilder = () => {
    return (res: http.ServerResponse, response: object, code: number) => {
        res.setHeader('X-Powered-By', 'Ethereal')

        if (response) {
            res.writeHead(code, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(response));
            return
        }

        res.writeHead(code);
    }
}

const HTTPServer = async (port: number, router: RequestHandler) => {
    const httpOut = httpOutBuilder();

    http.createServer(async (req, res) => {
        let hangup = false;
        const hangupRequest = () => {
            hangup = true
        }
        try {
            const requestContext = {
                postBody: async () => parseRequest(req),
                urlParams: () => extractUrlParams(req.url as string),
                method: req.method,
                hangupRequest,
            } as RequestContext

            const handlerResponse = await router(
                requestContext,
                handleErr(res),
                req,
                res,
            );

            if (!handlerResponse) {
                return;
            }

            if (!hangup) {
                httpOut(res, handlerResponse, 200)
            }
        } catch (err) {
            console.log('error!!!', err)
            httpOut(res, err, 500)
        }

        res.end();
    }).listen(port);
};

export default HTTPServer;