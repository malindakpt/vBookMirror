import React from 'react';
import Snackbar, { SnackbarOrigin } from '@material-ui/core/Snackbar';

export interface State extends SnackbarOrigin {
  open: boolean;
}
interface Props {
  text: string;
  state: State;
  handleClose: () => void;
}
export const Snack: React.FC<Props> = ({ text, state, handleClose }) => {
  const { vertical, horizontal, open } = state;

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        message={text}
        key={vertical + horizontal}
      />
    </div>
  );
};
