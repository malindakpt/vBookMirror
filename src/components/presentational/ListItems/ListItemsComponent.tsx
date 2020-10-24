import React from 'react';
import {
  ListItem, List, Divider,
} from '@material-ui/core';
import classes from './ListItems.module.scss';

interface Props{
  list: any[];
}
export const ListItems:React.FC<Props> = ({ list }) => (
  <div className={classes.root}>
    <List
      component="nav"
      aria-label="mailbox folders"
    >
      {list.map((item) => (
        <div key={item.id}>
          <ListItem
            button
          >
            {
            Object.entries(item).map(([key, val]) => <span key={key}>{`${val}`}</span>)
          }
          </ListItem>
          <Divider />
        </div>
      ))}

    </List>
  </div>
);
