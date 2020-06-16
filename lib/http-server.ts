import http from 'http';

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
) => (err: string, status = 500) => {
    const adjustedErr = { error: err };

    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(adjustedErr));
    res.end();

    return;
};

export type RequestError = (err: string, status?: number) => any;

export type RequestHandler = (
    resp: any,
    handleErr: RequestError,
    req: http.IncomingMessage,
) => any

const HTTPServer = async (port: number, handler: RequestHandler) => {
    http.createServer(async (req, res) => {
        try {
            const { resp, err } = await parseRequest(req)
                .then((resp) => ({ resp, err: undefined }))
                .catch((err) => ({ resp: undefined, err }));

            if (err) {
                const adjustedErr = { error: err.message };

                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(adjustedErr));
                res.end();

                return;
            }

            const httpResponse = await handler(resp, handleErr(res), req);
            if (!httpResponse) {
                return;
            }

            const jsonResp = JSON.stringify(httpResponse);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(jsonResp);
            res.end();
        } catch (err) {
            console.log(err)
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(err));
            res.end();
        }

    }).listen(port);
};

export default HTTPServer;