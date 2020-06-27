import { MiddlewareHandler } from '../types';

import { CompositionContext } from './types'

export default (
  key: string, handler: MiddlewareHandler,
) => (ctx: CompositionContext) => {
  ctx.app.use(key, handler)
  return ctx
}
