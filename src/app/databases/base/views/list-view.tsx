import * as React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { AsyncThunkAction } from '@reduxjs/toolkit';
import { ChangeParamsPayload, ReducerState } from '../reducer';
import { Column, useTable } from 'react-table';
import { default as TableComponent } from '../components/table-component';
import { default as PaginationComponent } from '../components/pagination-component';

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

const ListComponent: React.ComponentType<{
  queryChanged: (page: number, sort: string) => any;
} & Omit<Props, 'reduxKey' | 'fetch' | 'reset'>> =
  ({
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
    const updateParams = (sort: string, page: number) => {
      queryChanged(page, sort);
      dispatch(changeParams({ sort: sort as any, page, pageSize: pageSizeV }));
    }
    const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows, } = useTable({ columns, data: itemsV, });
    return (
      <>
        <TableComponent
          tableProps={ getTableProps() }
          tableBodyProps={ getTableBodyProps() }
          data={ rows }
          prepareRow={ prepareRow }
          headerGroups={ headerGroups }
          sort={ sortV }
          changeSort={ newSort => updateParams(newSort, pageV) }
        />
        <PaginationComponent
          pageSize={ pageSizeV }
          page={ pageV }
          total={ totalCountV }
          changePage={ newPage => updateParams(sortV, newPage) }
        />
      </>
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
    const sortInStore = useSelector(others.sort);
    const pageInStore = useSelector(others.page);
    // Do binding with router.
    const queryChanged = (page: number, sort: string) => {
      setSearchParams({ page: (page + 1).toString(), sort: sort })
    }
    React.useEffect(() => {
      if (!loaded) {
        dispatch(fetch());
        dispatch(changeParams({
          page: page && parseInt(page) - 1 || 0,
          sort: sort || '' as any,
          pageSize: 20,
        }));
      } else {
        // Initialize the route in case of the page already loaded in the past :)
        queryChanged(pageInStore, sortInStore);
      }
    }, [ loaded ]);
    return (
      <>
        <Dimmer active={ !loaded }>
          <Loader content="Loading"/>
        </Dimmer>
        { loaded ? <ListComponent queryChanged={ queryChanged } changeParams={ changeParams } { ...others }/> : null }
      </>
    )
  };

export default ListView;
