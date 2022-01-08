export function paginate<Item extends any>(
  items: Array<Item>,
  options: { sort: string; pageSize: number; page: number; },
  supply: (item: Item, field: string) => any
): Array<Item> {
  let result = items;
  if (options.sort !== '') {
    const desc = options.sort.indexOf('-') === 0;
    const sort = desc ? options.sort.substring(1) : options.sort;
    result = items.sort((a, b) => {
      // @ts-ignore
      const va = !!supply ? supply(a, sort) : a[ sort ];
      // @ts-ignore
      const vb = !!supply ? supply(b, sort) : b[ sort ];
      if (va < vb) {
        return desc ? 1 : -1;
      } else if (va == vb) {
        return 0;
      } else {
        return desc ? -1 : 1;
      }
    })
  }
  const start = options.page * options.pageSize;
  const end = start + options.pageSize;

  return result.slice(start, end);
}
