import stateMachine, { StateMachine, Event } from './utils/state-machine'

export interface Action<A, T> extends Event<A, T> { }

export default <A, T>(...actions: Array<Action<A, T>>): StateMachine => {
    const machine = stateMachine()

    actions.forEach(action => {
        machine.register(action)
    })

    return machine
}