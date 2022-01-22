import * as React from 'react';
import { useDispatch } from 'react-redux';
import { actions } from '../reducer';

const SectionPageView: React.ComponentType<{ toolbar?: React.ReactNode }> =
  ({ toolbar, children }) => {
    const dispatch = useDispatch();
    React.useEffect(() => {
      dispatch(actions.changePage({ toolbar }));
      return () => {
        dispatch(actions.changePage({ toolbar: null }));
      }
    });
    return <>{ children }</>;
  };

export default SectionPageView;
