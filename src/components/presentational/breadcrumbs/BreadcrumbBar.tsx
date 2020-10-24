import React, { useContext } from 'react';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { Link } from 'react-router-dom';
import { AppContext } from '../../../App';

export const BreadcrumbBar = () => {
  const { breadcrumbs } = useContext(AppContext);

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      style={{
        background: 'rgb(71 58 183)',
        padding: '10px 20px',
        minHeight: '24px',
        marginBottom: '30px',
        boxShadow: '0 0px 8px 0 rgb(0 0 0 / 50%)',
      }}
    >
      {breadcrumbs?.map((bc) => (
        <Link
          style={{ textDecoration: 'none', color: 'grey' }}
          key={bc[0]}
          color="inherit"
          to={bc[1]}
        >
          {bc[0]}
        </Link>
      ))}
    </Breadcrumbs>
  );
};
