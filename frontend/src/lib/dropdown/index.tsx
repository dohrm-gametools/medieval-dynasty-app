import * as React from 'react';
import { Button, ButtonProps, Divider, List, ListItem, Menu, MenuList, MenuItem } from '@mui/material';
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';

export interface DropdownOptionGrouped {
  id: string;
  text?: string;
  icon?: React.ReactNode;
  render?: () => React.ReactNode;
  options: Array<DropdownOption>;
}

export interface DropdownOption {
  kind?: 'separator' | 'title';
  id: string;
  text?: string;
  icon?: React.ReactNode;
  render?: () => React.ReactNode;
}

export interface DropdownProps {
  text: string;
  options: Array<DropdownOption | DropdownOptionGrouped>;
  onChange: (id: string) => any;
  name?: string;
  selected?: string;
  filterable?: boolean;
  renderOption?: (id: string) => React.ReactNode;
  TriggerButton?: Omit<Partial<ButtonProps>, 'onClick' | 'id'>;
}

function content(props: DropdownProps, option: DropdownOptionGrouped | DropdownOption): React.ReactNode {
  return (
    <span>{ option.icon }{ option.render && option.render() || props.renderOption && props.renderOption(option.id) || option.text || option.id }</span>
  );
}

function renderGroup(props: DropdownProps, option: DropdownOptionGrouped, displaySeparator: boolean, onClick: (value: string) => any): Array<React.ReactNode> {
  return [
    <ListItem key={ `category-${ option.id }` }>{ content(props, option) }</ListItem>,
    <Divider key={ `div1-${ option.id }` }/>,
    // content(props, option),
    ...option.options.map(opt => renderOption(props, opt, onClick)),
    displaySeparator ? <Divider key={ `div2-${ option.id }` }/> : null,
  ];
}

function renderOption(props: DropdownProps, option: DropdownOption, onClick: (value: string) => any): React.ReactNode {
  if (option.kind === 'separator') return <Divider key={ option.id }/>;
  if (option.kind === 'title') return <React.Fragment key={ option.id }>{ content(props, option) }</React.Fragment>;
  return (
    <MenuItem
      key={ option.id }
      selected={ option.id === props.selected }
      onClick={ () => onClick(option.id) }>
      { content(props, option) }
    </MenuItem>
  );
}

const Dropdown: React.ComponentType<DropdownProps> = props => {
  const [ anchor, setAnchor ] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchor);
  const onClick = (evt: React.MouseEvent<HTMLElement>) => {
    setAnchor(evt.currentTarget);
  }
  const onClose = () => {
    setAnchor(null);
  }
  const onClickOpt = (id: string) => {
    props.onChange(id);
    onClose();
  };

  return (
    <>
      <Button
        id={ `${ props.name || '' }-button` }
        onClick={ onClick }
        aria-controls={ open ? `${ props.name || '' }-menu` : undefined }
        aria-haspopup="true"
        aria-expanded={ open ? 'true' : undefined }
        variant="contained"
        disableElevation
        endIcon={ <KeyboardArrowDownIcon/> }
        { ...props.TriggerButton || {} }
      >
        { props.text }
      </Button>
      <Menu
        id={ `${ props.name || '' }-menu` }
        MenuListProps={ {
          'aria-labelledby': `${ props.name }-button`
        } }
        sx={ {
          maxHeight: '400px'
        } }
        anchorEl={ anchor }
        open={ open }
        onClose={ onClose }
      >
        <MenuList>
          {
            props.options.map((option, idx) => {
              if (!!(option as any)[ 'options' ]) {
                return renderGroup(props, option as DropdownOptionGrouped, idx !== props.options.length - 1, onClickOpt);
              } else {
                return renderOption(props, option, onClickOpt)
              }
            })
          }
        </MenuList>
      </Menu>
    </>
  )
}

export { Dropdown };
