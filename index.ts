import Sequelize from 'sequelize';

import router, { route } from './lib/router';

// import CRUDOperation from './lib/crud-operation.enum';

// const model = () => ({
//     username: Sequelize.STRING,
//     birthday: Sequelize.DATE,
// })

// route(model, [CRUDOperation.CREATE, CRUDOperation.READ])

// @@ middleware
// @@ custom operations


router({ database: 'test', username: 'test', password: 'test' })