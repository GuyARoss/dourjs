import lazyTruth from '../utils/lazy-truth'
import { DataSourceModel, RequestContext, CrudType } from '../types'

// create handlers for each of the different method types.
// if "custom" we want to map that to a special extended endpoint
export default (datasource: DataSourceModel, operationTypes: Array<CrudType>) =>
  operationTypes.reduce(
    (a, c) =>
      typeof c !== 'function'
        ? {
            ...a,
            [c]: lazyTruth(
              {
                [CrudType.CREATE]: async (ctx: RequestContext) => {
                  const postData = await ctx.postBody()
                  return datasource.create(postData)
                },
                [CrudType.UPDATE]: async (ctx: RequestContext) => {
                  const postData = await ctx.postBody()
                  return datasource.update(postData)
                },
                [CrudType.DELETE]: async (ctx: RequestContext) => {
                  const postData = await ctx.postBody()
                  return datasource.delete(postData)
                },
                [CrudType.READ]: async ({ urlParams }: RequestContext) => {
                  const { offset, limit, ...rest } = urlParams()
                  return rest.hasOwnProperty('id')
                    ? datasource.findOne({ where: rest })
                    : datasource.findAllAndCountAll({
                        where: rest,
                        offset,
                        limit,
                      })
                },
              },
              (op) => op === c.toString(),
            ),
          }
        : {
            ...a,
            custom: [...a.custom, c],
          },
    { custom: [] },
  )
