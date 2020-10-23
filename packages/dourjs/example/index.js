const dour = require('../dist').default

const app = dour()

app.get('/test', () => {
    return 'working'
})

app.start(4220, () => console.log('started'))
