import React from 'react';
import classes from './Footer.module.scss';
import packageJson from '../../../../package.json';

const Footer:React.FC = () => (
  <div className={classes.container}>
    Powered by AMSI @ 2020
    -
    {packageJson.version}

  </div>
);

export default Footer;
