import * as React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItems, State } from '~/src/app/items/reducer';
import { default as ItemsList } from '../components/items-list';
import { useSearchParams } from 'react-router-dom';

const ItemsListView: React.ComponentType = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const loaded = useSelector((state: State) => state.items.loaded);
  const items = useSelector((state: State) => state.items.items);
  const sort = searchParams.get('sort');
  const page = searchParams.get('page');
  const pageSize = searchParams.get('pageSize');
  const queryChanged = (page: number, sort: string, pageSize: number) => {
    setSearchParams({ page: (page + 1).toString(), sort: sort, pageSize: pageSize.toString() })
  }

  React.useEffect(() => {
    if (!loaded) {
      dispatch(fetchItems());
    }
  });
  return (
    <>
      <Dimmer active={!loaded}>
        <Loader content="Loading"/>
      </Dimmer>
      <ItemsList
        items={items}
        page={page && parseInt(page) - 1 || 0}
        sort={sort || ''}
        pageSize={pageSize && parseInt(pageSize) || 10}
        queryChanged={queryChanged}
      />
    </>
  )
};

export default ItemsListView;
