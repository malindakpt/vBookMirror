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
        // eslint-disable-next-line react/no-array-index-key
        <div key={idx}>
          <ListItem
            button
          >

            {Object.values(item).map((val: any, index:number) => (
              // eslint-disable-next-line react/no-array-index-key
              <span key={index}>{`${val}`}</span>))}
          </ListItem>
          <Divider />
        </div>
      ))}

    </List>
  </div>
);
