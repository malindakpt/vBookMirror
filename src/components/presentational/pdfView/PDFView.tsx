import React, { useEffect } from 'react';

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
    <object
      className={classes.iframe}
      data={url}
      type="application/pdf"
    >
      <p>
        Your web browser doesn't have a PDF plugin.
        Instead you can
        {' '}
        <a
          href={url}
          target="_blank"
        >
          click here to
          download the Paper.
        </a>

      </p>
    </object>

  );
};
