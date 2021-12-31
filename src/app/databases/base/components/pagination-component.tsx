import * as React from 'react';
import { Dropdown, Grid, Pagination } from 'semantic-ui-react';
import { useI18n } from '~/src/app/i18n';

export interface Props {
  total: number;
  page: number;
  pageSize: number;
  changePage: (page: number) => any;
}

const BuildingsPagination: React.ComponentType<Props> = ({ total, page, pageSize, changePage }) => {
  const { t } = useI18n();
  return (
    <Grid centered doubling>
      <Grid.Row>
        <Pagination
          totalPages={ Math.floor(total / pageSize) + (total % pageSize === 0 ? 0 : 1) }
          activePage={ page + 1 }
          onPageChange={ (e, { activePage }) => {
            if (typeof activePage === 'number') changePage(activePage - 1);
          } }
        />
      </Grid.Row>
    </Grid>
  )
}

export default BuildingsPagination;
