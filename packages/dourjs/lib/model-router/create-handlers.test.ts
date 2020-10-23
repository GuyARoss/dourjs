import createHandler from './create-handlers';
import { DataSourceModel, CrudType } from '../types'


let mockDatasource = {} as DataSourceModel

beforeEach(() => {
    mockDatasource = ({
        create: () => "create",
        update: () => "update",
        destroy: () => "delete",
        findOne: () => "findOne",
        findAndCountAll: () => "findAndCountAll",
    }) as DataSourceModel
})

describe('create handlers', () => {
    it('creates an object of handlers provided valid args', () => {
        const resp = createHandler(mockDatasource, [
            CrudType.CREATE,
            CrudType.DELETE,
            CrudType.READ,
            CrudType.UPDATE
        ])

        expect(resp[CrudType.CREATE].length).toEqual(1)
        expect(resp[CrudType.DELETE].length).toEqual(1)
        expect(resp[CrudType.READ].length).toEqual(1)

        expect(resp[CrudType.UPDATE].length).toEqual(1)
    })
    it('creates an object of custon handlers provided valid args', () => {
        const resp = createHandler(mockDatasource, [
            (ctx) => { },
            (ctx) => { }
        ])
        expect(resp.custom.length).toEqual(2)
    })
    describe('crud operation maps to correct datasource operation', () => {
        it('CREATE', async () => {
            const resp = await createHandler(mockDatasource, [CrudType.CREATE])
            expect(await resp[CrudType.CREATE]({
                postBody: () => { },
            })).toEqual("create")
        })
        it('UPPDATE', async () => {
            const resp = await createHandler(mockDatasource, [CrudType.UPDATE])
            expect(await resp[CrudType.UPDATE]({
                postBody: () => { },
            })).toEqual("update")
        })
        it('DELETE', async () => {
            const resp = await createHandler(mockDatasource, [CrudType.DELETE])
            expect(await resp[CrudType.DELETE]({
                urlParams: () => ({ offset: undefined, limit: undefined }),
            })).toEqual("delete")
        })
        describe('READ', () => {
            it('findOne', async () => {
                const resp = await createHandler(mockDatasource, [CrudType.READ])
                expect(await resp[CrudType.READ]({
                    urlParams: () => ({ offset: undefined, limit: undefined, id: 'test' }),
                })).toEqual("findOne")
            })
            it('findAllAndCount', async () => {
                const resp = await createHandler(mockDatasource, [CrudType.READ])
                expect(await resp[CrudType.READ]({
                    urlParams: () => ({ offset: undefined, limit: undefined }),
                })).toEqual("findAndCountAll")
            })
        })

    })
})