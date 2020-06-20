import { CompositionContext } from './types';

export default (
    key: string, handler: any,
) => (ctx: CompositionContext) => {
    ctx.app.registerMiddleware(key, handler);
    return ctx
}