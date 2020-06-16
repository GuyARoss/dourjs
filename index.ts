import Sequelize from 'sequelize';

import router, { route } from './lib/router';

import start from './lib//start';

start({ routes: {} })(3001, () => { console.log('started!!') })

// import CRUDOperation from './lib/crud-operation.enum';

// const model = () => ({
//     username: Sequelize.STRING,
//     birthday: Sequelize.DATE,
// })

// route(model, [CRUDOperation.CREATE, CRUDOperation.READ])

// @@ middleware
// @@ custom operations
