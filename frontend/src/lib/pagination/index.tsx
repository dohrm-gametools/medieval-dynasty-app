import * as React from 'react';
import { Col, Container, Pagination as BSPagination, Row } from 'react-bootstrap';

export interface PaginationProps {
  total: number;
  page: number;
  pageSize: number;
  changePage: (page: number) => any;
}

function computePagination(totalPage: number, page: number): Array<number | ''> {
  const result: Array<number | ''> = [];
  if (totalPage > 1) {
    if (totalPage <= 7) {
      let i = 1
      while (i <= totalPage) {
        result.push(i++);
      }
    } else {
      if (page <= 3) {
        result.push(1, 2, 3, 4, 5, 6, '', totalPage);
      } else if (totalPage - page <= 2) {
        result.push(1, '', totalPage - 5, totalPage - 4, totalPage - 3, totalPage - 2, totalPage - 1, totalPage);
      } else {
        result.push(1, '', page - 2, page - 1, page, page + 1, page + 2, '', totalPage);
      }
    }
  }
  return result;
}

const Pagination: React.ComponentType<PaginationProps> = ({ total, page, pageSize, changePage }) => {
  const totalPages = Math.floor(total / pageSize) + (total % pageSize === 0 ? 0 : 1);
  const pageArray = computePagination(totalPages, page + 1);
  const onClick = (nextPage: number) => {
    if (nextPage < 0 || nextPage >= totalPages || nextPage === page) return () => {};
    return () => changePage(nextPage);
  };
  return (
    <Container fluid>
      <Row className="justify-content-center">
        <Col md="auto">
          <BSPagination>
            { pageArray.map((c, idx) => {
              const result = [];
              if (idx === 0) {
                result.push(
                  <BSPagination.First key="first-page" onClick={ onClick(0) }/>,
                  <BSPagination.Prev key="prev-page" onClick={ onClick(page - 1) }/>
                );
              }
              if (c === '') {
                result.push(<BSPagination.Ellipsis key={ idx }/>);
              } else {
                result.push(<BSPagination.Item key={ idx } active={ page === c - 1 } onClick={ onClick(c - 1) }>{ c }</BSPagination.Item>)
              }
              if (idx === pageArray.length - 1) {
                result.push(
                  <BSPagination.Next key="next-page" onClick={ onClick(page + 1) }/>,
                  <BSPagination.Last key="last-page" onClick={ onClick(totalPages - 1) }/>
                );
              }
              return result;
            }) }
          </BSPagination>
        </Col>
      </Row>
    </Container>
  )
}

export { Pagination };
