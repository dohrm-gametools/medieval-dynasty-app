import * as React from 'react';
import { Worker } from '~/src/api';
import { useI18n } from '~/src/app/i18n';
import { Button, Form, Modal } from 'semantic-ui-react';

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
      <Modal open
             onClose={ cancel }
             closeOnEscape={ false }
             closeOnDimmerClick={ false }>
        <Modal.Header>{ t('app.game.tabs.worker') }</Modal.Header>
        <Modal.Content>
          <Form onSubmit={ () => onSave(state) }>
            <Form.Group>
              <Form.Input
                type="text"
                label={ t('app.game.worker.name') }
                value={ state.name }
                onChange={ (e, { value }) => dispatch({ type: 'name', payload: value }) }
              />
              <Form.Input
                type="number"
                label={ t('app.game.worker.age') }
                value={ state.age }
                min={ 0 }
                onChange={ (e, { value }) => dispatch({ type: 'age', payload: parseInt(value) }) }
              />
              <Form.Select
                fluid
                label={ t('app.game.worker.sex') }
                value={ state.sex }
                options={ [
                  { value: 'f', text: t('app.game.worker.sex.f') },
                  { value: 'm', text: t('app.game.worker.sex.m') }
                ] }
                onChange={ (e, { value }) => dispatch({ type: 'sex', payload: value }) }
              />
            </Form.Group>
            <Form.Group>
              <Form.Input
                type="number"
                label={ t('app.game.worker.extraction') }
                value={ state.skills.extraction }
                min={ 1 }
                onChange={ (e, { value }) => dispatch({ type: 'skills.extraction', payload: parseInt(value) }) }
              />
              <Form.Input
                type="number"
                label={ t('app.game.worker.crafting') }
                value={ state.skills.crafting }
                min={ 1 }
                onChange={ (e, { value }) => dispatch({ type: 'skills.crafting', payload: parseInt(value) }) }
              />
              <Form.Input
                type="number"
                label={ t('app.game.worker.farming') }
                value={ state.skills.farming }
                min={ 1 }
                onChange={ (e, { value }) => dispatch({ type: 'skills.farming', payload: parseInt(value) }) }
              />
            </Form.Group>
            <Form.Group>
              <Form.Input
                type="number"
                label={ t('app.game.worker.hunting') }
                value={ state.skills.hunting }
                min={ 1 }
                onChange={ (e, { value }) => dispatch({ type: 'skills.hunting', payload: parseInt(value) }) }
              />
              <Form.Input
                type="number"
                label={ t('app.game.worker.diplomacy') }
                value={ state.skills.diplomacy }
                min={ 1 }
                onChange={ (e, { value }) => dispatch({ type: 'skills.diplomacy', payload: parseInt(value) }) }
              />
              <Form.Input
                type="number"
                label={ t('app.game.worker.survival') }
                value={ state.skills.survival }
                min={ 1 }
                onChange={ (e, { value }) => dispatch({ type: 'skills.survival', payload: parseInt(value) }) }
              />
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={ () => cancel() }>{ t('cancel') }</Button>
          <Button onClick={ () => onSave(state) }>{ t('save') }</Button>
        </Modal.Actions>
      </Modal>
    )
  }

export default WorkerForm;
