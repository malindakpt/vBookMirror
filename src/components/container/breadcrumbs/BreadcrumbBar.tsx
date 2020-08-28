import React, { useContext } from 'react';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import { AppContext } from '../../../App';

export const BreadcrumbBar = () => {
  const { breadcrumbs } = useContext(AppContext);

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {breadcrumbs.map((bc) => (
        <Link
          key={bc[0]}
          color="inherit"
          href={bc[1]}
        >
          {bc[0]}
        </Link>
      ))}
    </Breadcrumbs>
  );
};
