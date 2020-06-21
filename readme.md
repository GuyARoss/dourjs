# Dour
Lightweight, performant, barebones web service framework for Node.js.

__Classic Style__
```js
import dour from 'dour'
const app = dour()

app.get('/', ctx => 'Hello, World!')

app.start(3000, () => console.log('App started on port 3000'))
```

__Composer Style__
```js
import compose, { handleGet } from 'dour/composer';

compose(
    handleGet('/', (ctx) => 'Hello, World!')
).start(3000, () => console.log('App started on port 3000'))
```

## Installation
First download Node.js, then install with `npm install`
```bash
$ npm install dour
```

## Features
- Low dependencies (install what you need)
- Low heap footprint
- Highly performant
- Built-in routing context

## Framework Benchmark
|   | Dour (1.0.0)  | Express (4.17.1)  | Koa (2.13.0)  |
|---|---------------|-------------------|---------------|
| Dependencies          | 1  | 30 | 23  | 
| Runtime Heapsize      | 2.5mb | 4.5mb | 3.8mb  |
| Average Response-Time  | 2.9ms  | 3.07ms  | 2.92ms  |

## Basic Usage
### Auto CRUD
#### (classic)
```js
import dour, { modeler, crudTypes } from 'dour'
import { dourMemory } from 'dour/adapters'

const app = dour() 

// ~ pass in the corrasponding adapter into the model router.
const autoCrud = modeler.Router(dourMemory())

// ~ specify the model schema
const userModel = {
    id: modeler.String,
    firstName: modeler.String,
    created: modeler.Date,
    age: modeler.Number
}

// ~ specify route path, model & available CRUD options.
app.route(autoCrud('/users', userModel, [crudTypes.READ]))
app.start(3000)
```

#### (compose)
```js
import dour, { modeler } from 'dour'

import { dourMemory } from 'dour/adapters'
import compose, { withModelRouter, handleModel } from 'dour/compose'

compose(
    withModelRouter(dourMemory()),
    handleModel('/users', {
        firstName: modeler.String,
        created: modeler.Date,
        age: modeler.Number,
    }, [crudTypes.READ, crudTypes.CREATE, crudTypes.DELETE, crudTypes.UPDATE]),
).start(3000)

```