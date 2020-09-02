import React from 'react';
import Button from '@material-ui/core/Button';
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
  // const [state, setState] = React.useState<State>({
  //   open: false,
  //   vertical: 'top',
  //   horizontal: 'center',
  // });
  const { vertical, horizontal, open } = state;

  // const handleClick = (newState: SnackbarOrigin) => () => {
  //   // setState({ open: true, ...newState });
  //   setState((prev) => {
  //     const next = { ...prev, open: true };
  //     return next;
  //   });
  // };

  // const handleClose = () => {
  //   setState({ ...state, open: false });
  // };

  const buttons = (
    <>
      {/* <Button onClick={handleClick({ vertical: 'top', horizontal: 'center' })}>Top-Center</Button> */}
    </>
  );

  return (
    <div>
      {buttons}
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
