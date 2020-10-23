import { MapOf, Func } from '@dour/common/types'

export interface Event<A, T> {
    name: string,
    callback: Func<Promise<T>>,
    args?: Func<Promise<A>>,
    transitionTo?: string | undefined
}

export interface StateMachineResponse {
    eventName: string | undefined,
    data?: any
}

export interface StateMachine {
    register: <A, T> (event: Event<A, T>) => void,
    start: (entryEvent: string) => AsyncGenerator<StateMachineResponse>
}

export interface StateMachineSettings {

}

export default () => {
    const eventTable: MapOf<Event<any, any>> = {}

    // t -> response type
    // r -> required args
    const register = <A, T>(
        event: Event<A, T>
    ) => {
        eventTable[event.name] = event
    }

    async function* start<entryArgs>(
        entryEvent: string,
        context?: entryArgs,
    ): AsyncGenerator<StateMachineResponse> {
        try {
            let currentEventName: string | undefined = entryEvent
            let eventResponse;
            const callStack = []

            while (!!currentEventName) {
                if (!eventTable[currentEventName]) {
                    throw Error(`SM: cannot find event '${currentEventName}'.`)
                }
                callStack.push(currentEventName)

                const currentEvent: Event<any, any> =
                    eventTable[currentEventName]


                const callbackArgs: any = (currentEvent.args)
                    ? await currentEvent.args(eventResponse, context)
                    : eventResponse

                eventResponse = await currentEvent.callback(
                    callbackArgs,
                )
                currentEventName = currentEvent.transitionTo

                yield {
                    eventName: callStack[callStack.length - 1],
                    data: eventResponse
                }
            }
        } catch (err) {
            yield {
                eventName: 'error',
                data: {
                    message: err.message,
                    track: err.stack
                }
            }
        }

        yield {
            eventName: 'done'
        }
    }

    return {
        start,
        register
    }
}