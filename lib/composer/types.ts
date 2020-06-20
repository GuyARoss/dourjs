import { Router } from '../core/router';

export interface CompositionContext {
    app: Router,
    values: { [id: string]: any }
}
