import http from 'http';
import DataSourceAdapter from './types/datasource-adapter.type';

export type Middleware = (
    request: http.IncomingMessage,
    response: http.ServerResponse,
    next: (id?: string) => void,
) => Promise<void>

export interface Composition {
    port: number,
    adapter: DataSourceAdapter,
    middleware: Middleware
}

export default () => {

}