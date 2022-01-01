import * as React from 'react';
import { useSelector } from 'react-redux';

import { selectors } from '~/src/app/game/reducer';
import { Card, Grid, List, Table } from 'semantic-ui-react';
import { useI18n } from '~/src/app/i18n';


const SummaryComponent: React.ComponentType = () => {
  const { t } = useI18n();
  const summary = useSelector(selectors.summary);
  console.log(summary);
  return (
    <Card fluid>
      <Card.Content>
        <Card.Header>Summary</Card.Header>
        <List>
          <List.Item>
            <List.Header>Tax: { summary.totalTax }</List.Header>
            <List.Header>Food : { 0 }</List.Header>
            <List.Header>Water : { 0 }</List.Header>
            <List.Header>Wood : { 0 }</List.Header>
          </List.Item>
        </List>
      </Card.Content>
      <Card.Content>
        <Card.Header>Products</Card.Header>
        <Table striped celled compact>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width="6">Item</Table.HeaderCell>
              <Table.HeaderCell width="2">+</Table.HeaderCell>
              <Table.HeaderCell width="2">-</Table.HeaderCell>
              <Table.HeaderCell width="2">Balance</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            { summary.productions.map(prod => (
              <Table.Row key={ prod.itemId }>
                <Table.Cell>{ t(`db.items.${ prod.itemId }`) }</Table.Cell>
                <Table.Cell>{ prod.produced }</Table.Cell>
                <Table.Cell>{ prod.consumed }</Table.Cell>
                <Table.Cell>{ prod.balance }</Table.Cell>
              </Table.Row>
            )) }
          </Table.Body>
        </Table>
      </Card.Content>
      <Card.Content>
        <Card.Header>Durability</Card.Header>
        <Table striped celled compact>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width="6">Tool</Table.HeaderCell>
              <Table.HeaderCell width="2">+</Table.HeaderCell>
              <Table.HeaderCell width="2">-</Table.HeaderCell>
              <Table.HeaderCell width="2">Balance</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            { summary.toolsDuration.map(prod => (
              <Table.Row key={ prod.toolId }>
                <Table.Cell>{ t(`db.tools.${ prod.toolId }`) }</Table.Cell>
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
