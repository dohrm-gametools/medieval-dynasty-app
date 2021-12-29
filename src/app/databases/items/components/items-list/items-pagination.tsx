import * as React from 'react';
import { Grid, Dropdown, Header, Pagination, Label } from 'semantic-ui-react';
import { useI18n } from '~/src/app/i18n';

export interface Props {
  total: number;
  page: number;
  pageSize: number;
  changePage: (page: number) => any;
  changePageSize: (pageSize: number) => any;
}

const ItemsPagination: React.ComponentType<Props> = ({ total, page, pageSize, changePage, changePageSize }) => {
  const { t } = useI18n();
  return (
    <Grid>
      <Grid.Row centered verticalAlign="middle">
        <Grid.Column width="5">
          <Pagination
            totalPages={ Math.floor(total / pageSize) + (total % pageSize === 0 ? 0 : 1) }
            activePage={ page + 1 }
            onPageChange={ (e, { activePage }) => {
              if (typeof activePage === 'number') changePage(activePage - 1);
            } }
          />
        </Grid.Column>
        <Grid.Column width="3">
          { t('pagination.pageSize') }
          <Dropdown
            inline
            onChange={ (e, { value }) => {
              if (typeof value === 'number') changePageSize(value)
            } }
            value={ pageSize }
            options={ [
              { value: 10, text: '10' },
              { value: 20, text: '20' },
              { value: 30, text: '30' },
              { value: 50, text: '50' },
              { value: 100, text: '100' },
            ] }/>
        </Grid.Column>

      </Grid.Row>
    </Grid>
  )
}

export default ItemsPagination;
