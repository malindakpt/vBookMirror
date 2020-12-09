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
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          ප්‍රශ්ණ පත්‍රය භාගත කිරීමට මෙහි ක්ලික් කරන්න . Download the Paper.
        </a>

      </p>
    </object>

  );
};
