import React from 'react';
import clsx from 'clsx';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/BorderClear';
import MailIcon from '@material-ui/icons/BlurOn';
import { Link } from 'react-router-dom';

interface NavLink{
  label: string;
  url: string;
}

const commonLinks: NavLink[] = [{ label: 'Home', url: '/exams' }, { label: 'Register Student', url: '/regStudent' }];
const adminLinks: NavLink[] = [{ label: 'Register Teacher', url: '/regTeacher' }, { label: 'Revenue Reports', url: '/revenue' }, { label: 'Settings', url: '/settings' }];

const useStyles = makeStyles({
  list: {
    width: 250,
    textDecoration: 'none',
  },
  fullList: {
    width: 'auto',
  },
});

export const NavPanel = () => {
  const classes = useStyles();
  const [show, setShow] = React.useState(false);

  const toggleDrawer = (open: any) => (event: any) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setShow(open);
  };

  const linkSegment = (links: NavLink[]) => (
    <List>
      {links.map((item, index) => (
        <Link
          to={item.url}
          key={item.label}
          style={{ textDecoration: 'none', color: '#5d5d5d' }}
        >
          <ListItem button>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        </Link>
      ))}
    </List>
  );

  const list = () => (
    <div
      className={clsx(classes.list)}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      {linkSegment(commonLinks)}
      <Divider />
      {linkSegment(adminLinks)}
    </div>
  );

  return (
    <div>
      <>
        <Button onClick={toggleDrawer(true)}>
          <MenuIcon htmlColor="white" />
        </Button>

        <Drawer
          anchor="left"
          open={show}
          onClose={toggleDrawer(false)}
        >
          {list()}
        </Drawer>
      </>
    </div>
  );
};
