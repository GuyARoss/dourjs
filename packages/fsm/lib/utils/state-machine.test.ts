import stateMachine from './state-machine'

describe('state machine', () => {
    it('should abide call order', async () => {
        const callOrder: Array<string> = []

        const state = stateMachine()

        state.register<any, any>({
            name: '01',
            callback: async () => {
                callOrder.push('01')
            },
            transitionTo: '02',
            args: async () => ({})
        })

        state.register<any, any>({
            name: '02',
            callback: async () => {
                callOrder.push('02')
            },
            args: async () => ({})
        })

        const startResponse = state.start('01')
        expect(await startResponse.next()).toEqual({ "done": false, "value": { "data": undefined, "eventName": "01" } })
        expect(await startResponse.next()).toEqual({ "done": false, "value": { "data": undefined, "eventName": "02" } })
        expect(await startResponse.next()).toEqual({ "done": false, "value": { "eventName": "done" } })


        expect(callOrder).toEqual(['01', '02'])
    })
})