import { DataSourceAdapter } from '../types'

import createEndpointHandler from './create-endpoint-handler'

export default (datasourceAdapter: DataSourceAdapter) => (
  path: string, model: any, operationsTypes: Array<any>) => ({
    endpointPath: path,
    endpointDetails: createEndpointHandler(
      path,
      datasourceAdapter.dataSource,
      datasourceAdapter.translateModel(model),
      operationsTypes,
    ),
  })
