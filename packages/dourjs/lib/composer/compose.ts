import router, { Router } from '../core/router'

import { CompositionContext } from './types'

export default (...operations: Array<any>): Router => {
  let context = {
    app: router(),
    values: {} as { [id: string]: any },
  } as CompositionContext

  for (const operation in operations) {
    context = operations[operation](context)
  }

  return context.app
}
