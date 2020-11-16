import React, { useState, useEffect } from 'react';

import classes from './PDFView.module.scss';

export const PDFView = () => {
  useEffect(() => {
    // disble context menu for avoid right click
    // document.addEventListener('contextmenu', (event) => event.preventDefault());
  }, []);

  return (
    <iframe
      contextMenu={(e: any) => { e.preventDefault(); }}
      className={classes.iframe}
      title="PDF"
      src="https://arxiv.org/pdf/quant-ph/0410100.pdf"
    />
  );
};
