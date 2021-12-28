import * as React from 'react';
import { Link } from 'react-router-dom'
import { Outlet } from 'react-router';
import {
  Container,
  Divider,
  Dropdown,
  Grid,
  Header,
  Image,
  List,
  Menu,
  Segment,
  Button,
  Flag, FlagNameValues, ButtonGroup
} from 'semantic-ui-react';
import { useI18n } from '~/src/app/i18n';


export const MainLayout: React.ComponentType<{ menus?: Array<{ key: string, link: string }> }> = ({ menus, children }) => {
  const { t, lang, setSelectedLang, supportedLanguages } = useI18n();
  return (
    <div>
      <Menu fixed='top' inverted to="/">
        <Container>
          <Menu.Item as={Link} header to="/">
            {/*<Image size='mini' src='/logo.png' style={{ marginRight: '1.5em' }}/>*/}
            Medieval Dynasty App
          </Menu.Item>
          {(menus || []).map(menu => <Menu.Item key={menu.key} as={Link} to={menu.link} selected>{t(`menu.${menu.key}.title`)}</Menu.Item>)}
          <Menu.Menu position="right">
            <Dropdown item text={t('menu.languages.title')}>
              <Dropdown.Menu>
                {supportedLanguages.map(sl => (
                  <Dropdown.Item key={sl} selected={sl === lang} value={sl} onClick={(e, { value }) => setSelectedLang(value as string)}>
                    <Flag name={t(`menu.languages.mapping.${sl}`) as FlagNameValues}/>
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>
        </Container>
      </Menu>

      <Container text style={{ paddingTop: '7em' }}>
        <Outlet/>
      </Container>

      {/*<Segment inverted vertical style={{ margin: '5em 0em 0em', padding: '5em 0em' }}>*/}
      {/*  <Container textAlign='center'>*/}
      {/*    <Divider inverted section/>*/}
      {/*    <Image centered size='mini' src='/logo.png'/>*/}
      {/*    <List horizontal inverted divided link size='small'>*/}
      {/*      <List.Item as='a' href='#'>*/}
      {/*        Site Map*/}
      {/*      </List.Item>*/}
      {/*      <List.Item as='a' href='#'>*/}
      {/*        Contact Us*/}
      {/*      </List.Item>*/}
      {/*      <List.Item as='a' href='#'>*/}
      {/*        Terms and Conditions*/}
      {/*      </List.Item>*/}
      {/*      <List.Item as='a' href='#'>*/}
      {/*        Privacy Policy*/}
      {/*      </List.Item>*/}
      {/*    </List>*/}
      {/*  </Container>*/}
      {/*</Segment>*/}
    </div>
  );
}
