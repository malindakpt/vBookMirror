import React, { useContext, useEffect, useState } from 'react';
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
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';
import packageJson from '../../../../package.json';
import { AppContext } from '../../../App';
import { adminRoutes, teacherRoutes, commonRoutes } from '../../router/Router';
import { Entity, getDocsWithProps } from '../../../data/Store';
import { ITeacher } from '../../../interfaces/ITeacher';

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
  const {
    isTeacher, isAdmin, setEmail, setIsTeacher,
  } = useContext(AppContext);
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<ITeacher|null>();

  const [customerEmail, setCustomerEmail] = useState<string>('');

  useEffect(() => {
    getDocsWithProps<ITeacher[]>(Entity.TEACHERS, {}).then((data) => {
      setTeachers(data);
    });
  }, []);

  const toggleDrawer = (open: any) => (event: any) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setShow(open);
  };

  const onTeacherChange = (newVal: ITeacher|null) => {
    // const idx = teachers.findIndex((t) => t.id === newVal?.id);
    // console.log('se', newVal);
    if (newVal) {
      setEmail(newVal.ownerEmail);
      setSelectedTeacher(newVal);
      setIsTeacher(true);
    }
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

          <div style={{ display: 'grid' }}>
            <a
              href="mailto: contact.akshara.lk@gmail.com"
              style={{ fontSize: '11px', textAlign: 'center', margin: '5px' }}
            >
              contact.akshara.lk@gmail.com
            </a>
            <a
              href="tel:0771141194"
              style={{ fontSize: '11px', textAlign: 'center', margin: '5px' }}
            >
              0771141194
            </a>
          </div>
          <div>
            {teachers && isAdmin() && (
            <Autocomplete
              id="combo-box-demo"
              value={selectedTeacher}
              options={teachers}
              getOptionLabel={(option: ITeacher) => option.name}
              style={{ width: 200, height: 100, margin: 'auto' }}
              renderInput={(params: any) => (
                <TextField
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...params}
                  label="Select Teacher"
                />
              )}
              onChange={(event: any, newValue: ITeacher | null) => {
                onTeacherChange(newValue);
                console.log(newValue);
              }}
            />
            )}
          </div>
          {teachers && isAdmin() && (
          <div style={{ display: 'grid' }}>
            <TextField
              // className={classes.input}
              id="customerEmail"
              label="Customer Email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
            <Button onClick={() => {
              setEmail(customerEmail);
              alert(`Logged in as: ${customerEmail}`);
            }}
            >
              Set Customer
            </Button>
          </div>
          )}
          <div style={{ padding: '10px' }}>
            version:
            {packageJson.version}
          </div>
        </Drawer>
      </>

    </div>
  );
};
