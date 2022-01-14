import * as React from 'react';
import { useSelector } from 'react-redux';

import { selectors } from '~/src/app/game/reducer';
import { Card, List, Table } from 'semantic-ui-react';
import { useI18n } from '~/src/lib/i18n';


const SummaryComponent: React.ComponentType = () => {
  const { t } = useI18n();
  const summary = useSelector(selectors.summary);
  return (
    <Card fluid>
      <Card.Content>
        <Card.Header>{ t('app.game.summary.title') }</Card.Header>
        <List>
          <List.Item>
            <List.Header>{ t('app.game.summary.tax.title') }: { summary.totalTax }</List.Header>
            <Table striped celled compact>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell width="8"/>
                  <Table.HeaderCell width="2">+</Table.HeaderCell>
                  <Table.HeaderCell width="2">-</Table.HeaderCell>
                  <Table.HeaderCell width="2"/>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>{ t(`app.game.summary.food.title`) }</Table.Cell>
                  <Table.Cell>{ summary.others.food?.produced || 0 }</Table.Cell>
                  <Table.Cell>{ summary.others.food?.consumed || 0 }</Table.Cell>
                  <Table.Cell>{ summary.others.food?.balance || 0 }</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>{ t(`app.game.summary.water.title`) }</Table.Cell>
                  <Table.Cell>{ summary.others.water?.produced || 0 }</Table.Cell>
                  <Table.Cell>{ summary.others.water?.consumed || 0 }</Table.Cell>
                  <Table.Cell>{ summary.others.water?.balance || 0 }</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>{ t(`app.game.summary.wood.title`) }</Table.Cell>
                  <Table.Cell>{ summary.others.wood?.produced || 0 }</Table.Cell>
                  <Table.Cell>{ summary.others.wood?.consumed || 0 }</Table.Cell>
                  <Table.Cell>{ summary.others.wood?.balance || 0 }</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </List.Item>
        </List>
      </Card.Content>
      <Card.Content>
        <Card.Header>{ t('app.game.summary.product.title') }</Card.Header>
        <Table striped celled compact>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width="8"/>
              <Table.HeaderCell width="2">+</Table.HeaderCell>
              <Table.HeaderCell width="2">-</Table.HeaderCell>
              <Table.HeaderCell width="2"/>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            { summary.productions.map(prod => (
              <Table.Row key={ prod.id }>
                <Table.Cell>{ t(`db.items.${ prod.id }`) }</Table.Cell>
                <Table.Cell>{ prod.produced }</Table.Cell>
                <Table.Cell>{ prod.consumed }</Table.Cell>
                <Table.Cell>{ prod.balance }</Table.Cell>
              </Table.Row>
            )) }
          </Table.Body>
        </Table>
      </Card.Content>
      <Card.Content>
        <Card.Header>{ t('app.game.summary.durability.title') }</Card.Header>
        <Table striped celled compact>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width="8"/>
              <Table.HeaderCell width="2">+</Table.HeaderCell>
              <Table.HeaderCell width="2">-</Table.HeaderCell>
              <Table.HeaderCell width="2"/>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            { summary.toolsDuration.map(prod => (
              <Table.Row key={ prod.id }>
                <Table.Cell>{ t(`db.tools.${ prod.id }`) }</Table.Cell>
                <Table.Cell>{ prod.produced }</Table.Cell>
                <Table.Cell>{ prod.consumed }</Table.Cell>
                <Table.Cell>{ prod.balance }</Table.Cell>
              </Table.Row>
            )) }
          </Table.Body>
        </Table>
      </Card.Content>
    </Card>
  );
}

export default SummaryComponent;
