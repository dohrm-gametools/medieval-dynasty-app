import * as React from 'react';
import { AppContext, AppItems } from '../context/app-context';


interface Props {
  toolbar?: React.ComponentType;
  rightDrawer?: React.ComponentType;
}

const SectionPageView: React.ComponentType<Props> =
  ({ toolbar, rightDrawer, children }) => {
    const { load } = React.useContext(AppContext);

    React.useEffect(() => {
      load({ RightDrawer: rightDrawer, Toolbar: toolbar });
      console.log('in');
      return () => {
        console.log('out');
        load({ RightDrawer: undefined, Toolbar: undefined });
      }
    }, [ load ]);
    return <>{ children }</>;
  };

export default SectionPageView;
