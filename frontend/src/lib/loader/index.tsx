import * as React from 'react';
import { Container, Spinner } from 'react-bootstrap';

const Loader: React.ComponentType<{ loaded: boolean }> = ({ loaded, children }) => {
  if (!loaded) {
    return (
      <Container fluid className="d-flex justify-content-center">
        <Spinner animation="border" role="status" className="m-3">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }
  return <>{ children }</>
};

export { Loader };
