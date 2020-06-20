import Sequelize from 'sequelize'

interface SequelizeConfig {
  database: string
  username: string
  password: string
  host: string
  dialect: string
}

const configure = async (config: SequelizeConfig) => {
  const sequalizeInstance = new Sequelize(
    config.database,
    config.password,
    config.username,
    {
      host: config.host,
      dialect: config.dialect,
    },
  )

  await sequalizeInstance.sync()

  return sequalizeInstance
}
