import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Row, Col, Collapse } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { SectionPageView } from '~/src/lib/app-layout';
import { Loader } from '~/src/lib/loader';
import { cleanup, list, selectors } from '../reducer';
import { default as SummaryView } from '../components/summary-view';


const GameView: React.ComponentType = () => {
  const listLoaded = useSelector(selectors.listLoaded);
  const loading = useSelector(selectors.loading);
  return (
    <Loader loaded={ listLoaded }>
      <Row className="flex-md-column flex-lg-row">
        <Col className="col-lg-8 col-md-12">
          <Outlet/>
        </Col>
        <Col>
          Summary here
          {/*<SummaryView/>*/ }
        </Col>
      </Row>
    </Loader>
  )
};

const PageView: React.ComponentType<{ rootPath: string }> = ({ rootPath }) => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(list());
    return () => {
      dispatch(cleanup());
    };
  })
  return (
    <SectionPageView secondaryNavigation={ [
      { key: 'app.game.tabs.workers', path: `${ rootPath }/workers` },
      { key: 'app.game.tabs.buildings', path: `${ rootPath }/buildings` },
    ] }>
      <GameView/>
    </SectionPageView>
  );
}

export default PageView;
