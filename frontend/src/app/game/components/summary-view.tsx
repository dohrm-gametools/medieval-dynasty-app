import * as React from 'react';
import { useSelector } from 'react-redux';
// import { Card, List, Table } from 'semantic-ui-react';
import {
  Card, CardContent, CardHeader,
  Box,
  List, ListItem, ListItemText,
  Table, TableHead, TableRow, TableBody, TableCell, Divider
} from '@mui/material';

import { selectors } from '~/src/app/game/reducer';
import { useI18n } from '~/src/lib/i18n';


const SummaryComponent: React.ComponentType = () => {
  const { t } = useI18n();
  const summary = useSelector(selectors.summary);
  return (
    <Card>
      <CardHeader title={ t('app.game.summary.title') }/>
      <CardContent>
        <h4>{ t('app.game.summary.tax.title') }: { summary.totalTax }</h4>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell variant="head" width="8"/>
              <TableCell variant="head" width="2">+</TableCell>
              <TableCell variant="head" width="2">-</TableCell>
              <TableCell variant="head" width="2"/>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{ t(`app.game.summary.food.title`) }</TableCell>
              <TableCell>{ summary.others.food?.produced || 0 }</TableCell>
              <TableCell>{ summary.others.food?.consumed || 0 }</TableCell>
              <TableCell>{ summary.others.food?.balance || 0 }</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{ t(`app.game.summary.water.title`) }</TableCell>
              <TableCell>{ summary.others.water?.produced || 0 }</TableCell>
              <TableCell>{ summary.others.water?.consumed || 0 }</TableCell>
              <TableCell>{ summary.others.water?.balance || 0 }</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{ t(`app.game.summary.wood.title`) }</TableCell>
              <TableCell>{ summary.others.wood?.produced || 0 }</TableCell>
              <TableCell>{ summary.others.wood?.consumed || 0 }</TableCell>
              <TableCell>{ summary.others.wood?.balance || 0 }</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <h4>{ t('app.game.summary.product.title') }</h4>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell variant="head" width="8"/>
              <TableCell variant="head" width="2">+</TableCell>
              <TableCell variant="head" width="2">-</TableCell>
              <TableCell variant="head" width="2"/>
            </TableRow>
          </TableHead>
          <TableBody>
            { summary.productions.map(prod => (
              <TableRow key={ prod.id }>
                <TableCell>{ t(`db.items.${ prod.id }`) }</TableCell>
                <TableCell>{ prod.produced }</TableCell>
                <TableCell>{ prod.consumed }</TableCell>
                <TableCell>{ prod.balance }</TableCell>
              </TableRow>
            )) }
          </TableBody>
        </Table>
        <h4>{ t('app.game.summary.durability.title') }</h4>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell variant="head" width="8"/>
              <TableCell variant="head" width="2">+</TableCell>
              <TableCell variant="head" width="2">-</TableCell>
              <TableCell variant="head" width="2"/>
            </TableRow>
          </TableHead>
          <TableBody>
            { summary.toolsDuration.map(prod => (
              <TableRow key={ prod.id }>
                <TableCell>{ t(`db.tools.${ prod.id }`) }</TableCell>
                <TableCell>{ prod.produced }</TableCell>
                <TableCell>{ prod.consumed }</TableCell>
                <TableCell>{ prod.balance }</TableCell>
              </TableRow>
            )) }
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default SummaryComponent;
