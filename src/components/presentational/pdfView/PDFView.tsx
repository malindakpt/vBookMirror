import React, { useState, useEffect } from 'react';

import classes from './PDFView.module.scss';

interface Props {
    url: string;
}
export const PDFView: React.FC<Props> = ({ url }) => {
  useEffect(() => {
    // disble context menu for avoid right click
    // document.addEventListener('contextmenu', (event) => event.preventDefault());
  }, []);

  return (
    <iframe
      className={classes.iframe}
      title="PDF"
      src={url}
    />
  );
};
