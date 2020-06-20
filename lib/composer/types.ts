import { Router } from '../router';

export interface CompositionContext {
    app: Router,
    values: { [id: string]: any }
}
