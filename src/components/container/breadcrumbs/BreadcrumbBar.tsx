import React, { useContext } from 'react';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { Link } from 'react-router-dom';
import { AppContext } from '../../../App';

export const BreadcrumbBar = () => {
  const { breadcrumbs } = useContext(AppContext);

  return (
    <Breadcrumbs aria-label="breadcrumb">
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
