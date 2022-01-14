import * as React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { default as Header } from '../components/header';
import { default as SecondaryNavigation } from '../components/secondary-navigation';

const classnames = require('./app-view.module.css');

const AppLayout: React.ComponentType<{ routes: Array<{ key: string, path: string }>, title: string }> = props => {
  return (
    <>
      <Header
        title={ props.title }
        routes={ props.routes }
      />
      <Container fluid className={ `overflow-hidden ${ classnames.main }` }>
        <SecondaryNavigation/>
        <Row className={ `overflow-auto ${ classnames.content }` }>
          { props.children }
        </Row>
      </Container>
    </>
  )
}

export default AppLayout;
