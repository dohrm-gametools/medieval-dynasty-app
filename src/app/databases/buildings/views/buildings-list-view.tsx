import * as React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { changeParams, fetch, State } from '~/src/app/databases/buildings/reducer';
import { default as BuildingsList } from '../components/buildings-list';
import { useSearchParams } from 'react-router-dom';

const BuildingsListView: React.ComponentType = () => {
  const dispatch = useDispatch();
  const [ searchParams, setSearchParams ] = useSearchParams();
  const loaded = useSelector((state: State) => state.buildings.loaded);
  const sort = searchParams.get('sort');
  const page = searchParams.get('page');
  const pageSize = searchParams.get('pageSize');
  // Do binding with router.
  const queryChanged = (page: number, sort: string, pageSize: number) => {
    setSearchParams({ page: (page + 1).toString(), sort: sort, pageSize: pageSize.toString() })
  }
  React.useEffect(() => {
    if (!loaded) {
      dispatch(fetch());
      dispatch(changeParams({
        page: page && parseInt(page) - 1 || 0,
        sort: sort || '' as any,
        pageSize: pageSize && parseInt(pageSize) || 10,
      }));
    }
  }, [ loaded ]);
  return (
    <>
      <Dimmer active={ !loaded }>
        <Loader content="Loading"/>
      </Dimmer>
      { loaded ? <BuildingsList queryChanged={ queryChanged }/> : null }
    </>
  )
};

export default BuildingsListView;
