import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AsyncThunkAction } from '@reduxjs/toolkit';
import { useSearchParams } from 'react-router-dom';
import { Loader } from '~/src/lib/loader';
import { ColumnDef as Column, Table } from '~/src/lib/table';
import { ChangeParamsPayload, ReducerState } from '../reducer';

export { Column };

export interface Props {
  reduxKey: string;
  columns: Array<Column<any>>;
  paginatedItems(state: any): Array<any>;
  sort(state: any): string;
  page(state: any): number;
  pageSize(state: any): number;
  totalCount(state: any): number;
  reset(): { type: string };
  changeParams(payload: ChangeParamsPayload<any>): { payload: ChangeParamsPayload<any>; type: string };
  fetch(): AsyncThunkAction<Array<any>, void, {}>;
}

const ListComponent: React.ComponentType<{ queryChanged: (page: number, sort: string, pageSize: number) => any; } & Omit<Props, 'fetch' | 'reset'>> =
  ({
     reduxKey,
     queryChanged,
     columns,
     paginatedItems,
     sort,
     page,
     pageSize,
     totalCount,
     changeParams,
   }) => {
    const dispatch = useDispatch();
    const itemsV = useSelector(paginatedItems);
    const sortV = useSelector(sort);
    const pageV = useSelector(page);
    const pageSizeV = useSelector(pageSize);
    const totalCountV = useSelector(totalCount);
    const updateParams = (sort: string, page: number, pageSize: number) => {
      queryChanged(page, sort, pageSize);
      dispatch(changeParams({ sort: sort as any, page, pageSize }));
    }
    return (
      <Table
        tableId={ reduxKey }
        columns={ columns }
        data={ itemsV }
        sort={ sortV }
        totalCount={ totalCountV }
        pageSize={ pageSizeV }
        page={ pageV }
        changeSort={ newSort => updateParams(newSort, pageV, pageSizeV) }
        changePage={ newPage => updateParams(sortV, newPage, pageSizeV) }
        changePageSize={ newPageSize => updateParams(sortV, pageV, newPageSize) }
      />
    )
  }


const ListView: React.ComponentType<Props> =
  ({
     changeParams,
     fetch,
     reduxKey,
     reset,
     ...others
   }) => {
    const dispatch = useDispatch();
    const [ searchParams, setSearchParams ] = useSearchParams();
    const loaded = useSelector((state: any) => (state[ reduxKey ] as ReducerState<any>).loaded);
    const sort = searchParams.get('sort');
    const page = searchParams.get('page');
    const pageSize = searchParams.get('pageSize');
    const sortInStore = useSelector(others.sort);
    const pageInStore = useSelector(others.page);
    const pageSizeInStore = useSelector(others.pageSize);
    // Do binding with router.
    const queryChanged = (page: number, sort: string, pageSize: number) => {
      setSearchParams({ page: (page + 1).toString(), sort: sort, pageSize: pageSize.toString() })
    }
    React.useEffect(() => {
      if (!loaded) {
        dispatch(fetch());
        dispatch(changeParams({ page: page && parseInt(page) - 1 || 0, sort: sort || '' as any, pageSize: pageSize && parseInt(pageSize) || 25, }));
      } else {
        // Initialize the route in case of the page already loaded in the past :)
        queryChanged(pageInStore, sortInStore, pageSizeInStore);
      }
    }, [ loaded ]);
    return (
      <Loader loaded={ loaded }>
        <ListComponent queryChanged={ queryChanged } changeParams={ changeParams } reduxKey={ reduxKey } { ...others }/>
      </Loader>
    )
  };

export default ListView;
