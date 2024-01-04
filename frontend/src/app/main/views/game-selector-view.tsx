import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { change, add, selectors } from '../reducer';
import { List, ListItemButton, ListItemText, Menu, MenuItem, Divider, ListItemIcon } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useI18n } from '~/src/lib/i18n';


const GameField: React.ComponentType<{
  selected: string,
  games: Array<{ id: string, name: string }>,
  onChange: (id: string) => any,
  onCreate: () => any,
}> = ({ selected, games, onChange, onCreate }) => {
  const { t } = useI18n();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(games.findIndex(v => v.id === selected));
  const open = Boolean(anchorEl);
  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (
    id: string,
    index: number,
  ) => {
    onChange(id);
    setSelectedIndex(index);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openAddGame = () => {
    onCreate();
    setAnchorEl(null);
  }

  return (
    <>
      <div>
        <List component="nav" aria-label="Current Game">
          <ListItemButton
            id="lock-button"
            aria-haspopup="listbox"
            aria-controls="lock-menu"
            aria-label="selected game"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClickListItem}
          >
            <ListItemText primary={games[selectedIndex]?.name}/>
          </ListItemButton>
        </List>
        <Menu
          id="lock-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'lock-button',
            role: 'listbox',
          }}
        >
          {games.map((game, index) => (
            <MenuItem
              key={game.id}
              disabled={index === selectedIndex}
              selected={index === selectedIndex}
              onClick={() => handleMenuItemClick(game.id, index)}
            >
              {game.name}
            </MenuItem>
          ))}
          <Divider/>
          <MenuItem onClick={openAddGame}>
            <ListItemIcon>
              <Add fontSize="small"/>
            </ListItemIcon>
            {t('app.main.add')}
          </MenuItem>
        </Menu>
      </div>
    </>
  )
}

const GameSelectorView: React.ComponentType = () => {
  const dispatch = useDispatch();
  const game = useSelector(selectors.game);
  const games = useSelector(selectors.games);


  return (
    <GameField
      games={games}
      selected={game}
      onChange={(id) => {
        if (id !== game) dispatch(change({ id }))
      }}
      onCreate={() => {
        dispatch(add({}))
      }}
    />
  )
};

export { GameSelectorView };
