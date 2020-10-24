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
      {list.map((item, idx) => (
        <div key={item.id}>
          <ListItem
            button
          >
            {
            Object.values(item).map((val: any) => <span key={val}>{`${val}`}</span>)
          }
          </ListItem>
          <Divider />
        </div>
      ))}

    </List>
  </div>
);
