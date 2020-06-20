export interface RequestContext {
    postBody: () => Promise<Array<string>>,
    urlParams: () => { [id: string]: string },
    method: string,
    matchParams?: { [id: string]: string },
    hangupRequest: any,
}
export enum CrudType {
    CREATE = 'CREATE',
    READ = 'READ',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
}