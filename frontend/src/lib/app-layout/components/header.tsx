import * as React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { useI18n } from '~/src/lib/i18n';


const Navigation: React.ComponentType<{ routes: Array<{ key: string, path: string }> }> = ({ routes }) => {
  const { pathname } = useLocation();
  const { t } = useI18n();
  const selectedRoute = routes.find(r => pathname.indexOf(r.path) === 0);
  return (
    <Nav className="me-auto">
      { routes.map(route => (
        <Nav.Link key={ route.key } as={ Link } to={ route.path } active={ selectedRoute === route }>
          { t(route.key) }
        </Nav.Link>)) }
    </Nav>
  )
}

const Header: React.ComponentType<{
  title: React.ReactNode,
  rootPath?: string,
  className?: string,
  routes: Array<{ key: string, path: string }>
}> =
  (props) => (
    <Navbar fixed="top" collapseOnSelect bg="dark" variant="dark" expand="lg" className={ `flex-column${ props.className ? ` ${ props.className }` : '' }` }>
      <Container fluid>
        <Navbar.Brand as={ Link } to={ props.rootPath || '/' } className="py-2 ml-lg-2 mx-3">{ props.title }</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-toggle"/>
        <Navbar.Collapse id="navbar-toggle" className="flex-column ml-lg-0 ml-3">
          <Navigation routes={ props.routes }/>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );

export default Header;
