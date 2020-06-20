
import DataSourceAdapter from '../types/datasource-adapter.type';

import createEndpointHandler from './create-endpoint-handler';

export default (
    datasourceAdapter: DataSourceAdapter,
) => {
    const datasource = datasourceAdapter.configure();

    return (
        name: string,
        model: any,
        operationsTypes: Array<any>,
    ) => ({
        endpointPath: name,
        endpointDetails: createEndpointHandler(
            name,
            datasource,
            datasourceAdapter.translateModel(model),
            operationsTypes,
        ),
    })
}
