import { DataSourceAdapter } from '../types'

import createEndpointHandler from './create-endpoint-handler'

export default (datasourceAdapter: DataSourceAdapter) => (
  name: string, model: any, operationsTypes: Array<any>) => ({
    endpointPath: name,
    endpointDetails: createEndpointHandler(
      name,
      datasourceAdapter.dataSource,
      datasourceAdapter.translateModel(model),
      operationsTypes,
    ),
  })
