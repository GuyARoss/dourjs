import http from 'http'

export interface RequestContext {
    postBody: () => Promise<any>
    urlParams: () => { [id: string]: string }
    hangupRequest: () => void,

    request: http.IncomingMessage,
    response: http.ServerResponse,

    matchParams?: { [id: string]: string }
}
export enum CrudType {
    CREATE = 'CREATE',
    READ = 'READ',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
}

export type MiddlewareNext = (nextMiddleware?: string) => void

export type MiddlewareHandler = (
    ctx: RequestContext,
    next: MiddlewareNext,
) => void

export type MapOf<T> = { [key: string]: T }

export type Func<T> = (...args: any) => T