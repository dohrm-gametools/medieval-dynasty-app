import * as React from 'react';
import { DropdownMenuProps } from 'react-bootstrap/DropdownMenu';
import { FormControl } from 'react-bootstrap';

const classnames = require('./index.module.css');

const SearchableMenu = React.forwardRef<any, DropdownMenuProps>(
  ({
     children,
     style,
     className,
     'aria-labelledby': labeledBy
   }, ref) => {
    const [ value, setValue ] = React.useState('');
    return (
      <div
        ref={ ref }
        style={ style }
        className={ className }
        aria-labelledby={ labeledBy }
      >
        <FormControl autoFocus
                     className="mx-3 my-2 w-auto"
                     placeholder="Type to filter..."
                     onChange={ (e) => setValue(e.target.value) }
                     value={ value }/>
        <ul className={ `list-unstyled ${classnames.list}` }>
          { React.Children.toArray(children).filter(
            (child) =>
              !value || (child as any).props.children.toLowerCase().startsWith(value.toLowerCase()),
          ) }
        </ul>
      </div>

    );
  }
);

export { SearchableMenu };
