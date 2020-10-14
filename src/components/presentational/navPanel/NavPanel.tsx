import React, { useContext } from 'react';
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
import { AppContext } from '../../../App';
import { adminRoutes, teacherRoutes, commonRoutes } from '../../router/Router';

interface NavLink{
  label: string;
  url: string;
}

const commonLinks: NavLink[] = commonRoutes.filter((r) => r[3]).map((r) => ({ url: r[0], label: r[2] }));

const teacherLinks: NavLink[] = teacherRoutes.filter((r) => r[3]).map((r) => ({ url: r[0], label: r[2] }));

const adminLinks: NavLink[] = adminRoutes.filter((r) => r[3]).map((r) => ({ url: r[0], label: r[2] }));

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
  const { isTeacher, isAdmin } = useContext(AppContext);

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
      {(isTeacher) && linkSegment(teacherLinks)}
      <Divider />
      {isAdmin() && linkSegment(adminLinks)}
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

          <a
            href="mailto: contact.akshara.lk@gmail.com"
            style={{ fontSize: '11px', textAlign: 'center', margin: '5px' }}
          >
            contact.akshara.lk@gmail.com
          </a>
        </Drawer>
      </>
    </div>
  );
};
