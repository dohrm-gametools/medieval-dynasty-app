import * as React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItems, State } from '~/src/app/items/reducer';
import { default as ItemsList } from '../components/items-list';

const ListView: React.ComponentType = () => {
  const dispatch = useDispatch();
  const loaded = useSelector((state: State) => state.items.loaded);
  const items = useSelector((state: State) => state.items.items);

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
      <ItemsList items={items}/>
    </>
  )
};

export default ListView;
