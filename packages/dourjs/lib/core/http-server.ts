import http from 'http'

import { RequestContext } from '../types'
import extractUrlParams from '../utils/extract-url-params'

const parseRequest = (req: any) => new Promise((res, rej) => {
  const data: Array<string> = []

  req.on('data', (chunk: any) => {
    data.push(chunk)
  })
  req.on('end', () => {
    if (data.length > 0) {
      res(JSON.parse(data.join('')))
      return
    }

    res()
  })
  req.on('error', (err: string) => {
    rej(err)
  })
})

const handleErr = (res: http.ServerResponse) => (
  err?: string,
  status = 500,
) => {
  httpOut(res, { error: err }, status)
}

export type RequestError = (err?: string, status?: number) => any

export type RequestHandler = (
  request: RequestContext,
  handleErr: RequestError,
) => any

const httpOut = (res: http.ServerResponse, response: object, code: number) => {
  if (typeof response === 'object') {
    res.writeHead(code, { 'Content-Type': 'application/json' })
    res.write(JSON.stringify(response))
    return
  }

  res.writeHead(code, { 'Content-Type': 'text/plain' })
  res.write(response)
}

const setRequiredHeaders = (res: http.ServerResponse) => {
  res.setHeader('X-Powered-By', 'node-dour')
}

const createRequestContext = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  hangupRequest: any,
) => ({
  postBody: async () => parseRequest(req),
  urlParams: () => extractUrlParams(req.url as string),
  method: req.method,
  hangupRequest,
  request: req,
  response: res,
}) as RequestContext

const HTTPServer = (router: RequestHandler): http.Server =>
  http
    .createServer(async (req, res) => {
      setRequiredHeaders(res)

      let hangup = false
      const hangupRequest = () => {
        hangup = true
      }

      try {
        const requestContext = createRequestContext(req, res, hangupRequest)

        const handlerResponse = await router(
          requestContext,
          handleErr(res),
        )

        // the handler can either handle the output  
        // or the http server can handle the output
        if (!hangup && handlerResponse) {
          httpOut(res, handlerResponse, 200)
        }
      } catch (err) {
        httpOut(res, err.toString(), 500)
      }

      // we do this here rather than the httpOut so we ensure it is closed.
      res.end()
    })


export default HTTPServer
