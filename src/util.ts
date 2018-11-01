export function keyBy<T>(items: T[], keyFn: (item: T) => string): { [key: string]: T } {
   return items.reduce((acc: { [key: string]: T }, e) => {
      acc[keyFn(e)] = e
      return acc
   }, {})
}
