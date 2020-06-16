import router, { CRUDOperation } from '../index';

app = router(
    // your settings.
)

app.middleware((req: any, res: any) => {
    // do some operation
})

app.route('test', [
    CRUDOperation.CREATE,
    CRUDOperation.READ,
])

app.route('special', [
    CRUDOperation.CREATE,
    findByType: (type: any, sql: any) => sql.findBy({ type }),
])

app.start(4000, () => {
    console.log('app started')
})