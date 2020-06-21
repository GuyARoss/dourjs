import router from './core/router'
import modelRouter, { ModelTypes } from './model-router'
import { CrudType } from './types'

const modeler = {
    router: modelRouter,
    ...ModelTypes,
}

const crudTypes = CrudType

export {
    crudTypes,
    modeler,
}

const dour = router
export default dour
