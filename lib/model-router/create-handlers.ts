import lazyTruth from '../utils/lazy-truth';

import { RequestContext } from '../http-server';

import crudTypes from '../types/crud-operation.enum';
import { DataSourceModel } from '../types/datasource-adapter.type';

// create handlers for each of the different method types.
// if "custom" we want to map that to a special extended endpoint
export default (
    datasource: DataSourceModel,
    operationTypes: Array<crudTypes>,
) => operationTypes.reduce((a, c) => typeof c !== 'function' ? ({
    ...a,
    [c]: lazyTruth({
        [crudTypes.CREATE]: async (
            ctx: RequestContext,
        ) => {
            const postData = await ctx.postBody()
            return datasource.create(postData)
        },
        [crudTypes.UPDATE]: async (
            ctx: RequestContext,
        ) => {
            const postData = await ctx.postBody();
            return datasource.update(postData);
        },
        [crudTypes.DELETE]: async (
            ctx: RequestContext,
        ) => {
            const postData = await ctx.postBody();
            return datasource.delete(postData);
        },
        [crudTypes.READ]: async ({
            urlParams,
        }: RequestContext,
        ) => {
            const { offset, limit, ...rest } = urlParams()
            return rest.hasOwnProperty('id') ?
                datasource.findOne({ where: rest }) :
                datasource.findAllAndCountAll({
                    where: rest,
                    offset,
                    limit,
                })
        },
    }, (op) => op === c.toString()),
}) : ({
    ...a,
    custom: [...a.custom, c],
}), { custom: [] })
