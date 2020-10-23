import { CompositionContext } from './types'
import { DataSourceAdapter } from '../types'
import router from '../model-router'

export const handleModel = (path: string, model: any, options: any) => (
  ctx: CompositionContext,
) => {
  const autoCrud = ctx.values.autoCrud

  if (typeof autoCrud === 'undefined') {
    throw Error(
      'handleModel: withModelRouter should be applied before handleModel',
    )
  }

  ctx.app.route(autoCrud(path, model, options))
  return ctx
}

export const withModelRouter = (adapter: DataSourceAdapter) => (
  ctx: CompositionContext,
) => {
  ctx.values.adapter = adapter
  ctx.values.autoCrud = router(adapter)

  return ctx
}
