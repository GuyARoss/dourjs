import { CompositionContext } from './types'

export const handleGet = (route: string, handler: any) => (
  ctx: CompositionContext,
) => {
  ctx.app.get(route, handler)
  return ctx
}

export const handlePost = (route: string, handler: any) => (
  ctx: CompositionContext,
) => {
  ctx.app.post(route, handler)
  return ctx
}

export const handlePut = (route: string, handler: any) => (
  ctx: CompositionContext,
) => {
  ctx.app.put(route, handler)
  return ctx
}
export const handleDelete = (route: string, handler: any) => (
  ctx: CompositionContext,
) => {
  ctx.app.delete(route, handler)
  return ctx
}
