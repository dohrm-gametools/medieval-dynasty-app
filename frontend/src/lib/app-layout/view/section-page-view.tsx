import * as React from 'react';
import { useDispatch } from 'react-redux';
import { actions } from '../reducer';

const SectionPageView: React.ComponentType<{ toolbar?: React.ReactNode, secondaryNavigation?: Array<{ key: string, path: string }> }> =
  ({ toolbar, secondaryNavigation, children }) => {
    const dispatch = useDispatch();
    React.useEffect(() => {
      dispatch(actions.changePage({ toolbar, secondaryNavigation }));
      return () => {
        dispatch(actions.changePage({ toolbar: null, secondaryNavigation: [] }));
      }
    });
    return <>{ children }</>;
  };

export default SectionPageView;
