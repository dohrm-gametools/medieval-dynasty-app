import * as React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { Worker } from '~/src/api';
import { useI18n } from '~/src/lib/i18n';

function formReducer(state: Worker, action: { type: string, payload: any }): Worker {
  const isSkills = action.type.indexOf('skills.') === 0;
  if (isSkills) {
    return { ...state, skills: { ...state.skills, [ action.type.substring('skills.'.length) ]: action.payload } };
  }
  return { ...state, [ action.type ]: action.payload };
}

const WorkerForm: React.ComponentType<{ worker: Worker, onSave: (updated: Worker) => void, cancel: () => void }> =
  ({
     worker,
     onSave,
     cancel
   }) => {
    const { t } = useI18n();
    const [ state, dispatch ] = React.useReducer(formReducer, worker);

    return (
      <Modal show
             size="xl"
             onHide={ cancel }
             backdrop="static"
             keyboard={ false }>
        <Modal.Header closeButton>
          <Modal.Title>{ t('app.game.tabs.workers') }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Form.Group as={ Col }>
                <Form.Label>{ t('app.game.worker.name') }</Form.Label>
                <Form.Control
                  type="text"
                  value={ state.name }
                  onChange={ (e) => dispatch({ type: 'name', payload: e.target.value }) }
                />
              </Form.Group>
              <Form.Group as={ Col }>
                <Form.Label>{ t('app.game.worker.age') }</Form.Label>
                <Form.Control
                  type="number"
                  value={ state.age }
                  min={ 0 }
                  onChange={ (e) => dispatch({ type: 'age', payload: parseInt(e.target.value) }) }
                />
              </Form.Group>
              <Form.Group as={ Col }>
                <Form.Label>{ t('app.game.worker.sex') }</Form.Label>
                <Form.Select
                  value={ state.sex }
                  onChange={ (e) => dispatch({ type: 'sex', payload: e.target.value }) }
                >
                  <option value="f">{ t('app.game.worker.sex.f') }</option>
                  <option value="m">{ t('app.game.worker.sex.m') }</option>
                </Form.Select>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={ Col }>
                <Form.Label>{ t('app.game.worker.extraction') }</Form.Label>
                <Form.Control
                  type="number"
                  value={ state.skills.extraction }
                  min={ 1 }
                  onChange={ (e) => dispatch({ type: 'skills.extraction', payload: parseInt(e.target.value) }) }
                />
              </Form.Group>
              <Form.Group as={ Col }>
                <Form.Label>{ t('app.game.worker.hunting') }</Form.Label>
                <Form.Control
                  type="number"
                  value={ state.skills.hunting }
                  min={ 1 }
                  onChange={ (e) => dispatch({ type: 'skills.hunting', payload: parseInt(e.target.value) }) }
                />
              </Form.Group>
              <Form.Group as={ Col }>
                <Form.Label>{ t('app.game.worker.farming') }</Form.Label>
                <Form.Control
                  type="number"
                  value={ state.skills.farming }
                  min={ 1 }
                  onChange={ (e) => dispatch({ type: 'skills.farming', payload: parseInt(e.target.value) }) }
                />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={ Col }>
                <Form.Label>{ t('app.game.worker.diplomacy') }</Form.Label>
                <Form.Control
                  type="number"
                  value={ state.skills.diplomacy }
                  min={ 1 }
                  onChange={ (e) => dispatch({ type: 'skills.diplomacy', payload: parseInt(e.target.value) }) }
                />
              </Form.Group>
              <Form.Group as={ Col }>
                <Form.Label>{ t('app.game.worker.survival') }</Form.Label>
                <Form.Control
                  type="number"
                  value={ state.skills.survival }
                  min={ 1 }
                  onChange={ (e) => dispatch({ type: 'skills.survival', payload: parseInt(e.target.value) }) }
                />
              </Form.Group>
              <Form.Group as={ Col }>
                <Form.Label>{ t('app.game.worker.crafting') }</Form.Label>
                <Form.Control
                  type="number"
                  value={ state.skills.crafting }
                  min={ 1 }
                  onChange={ (e) => dispatch({ type: 'skills.crafting', payload: parseInt(e.target.value) }) }
                />
              </Form.Group>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={ () => cancel() }>{ t('cancel') }</Button>
          <Button variant="primary" onClick={ () => onSave(state) }>{ t('save') }</Button>
        </Modal.Footer>
      </Modal>
    )
  }

export default WorkerForm;
