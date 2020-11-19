import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { ILesson } from '../../../interfaces/ILesson';
import classes from './PaymentOptions.module.scss';

export interface PaymentOptionProps {
    email: string | null;
    paidFor: string;
    lesson: ILesson;
    onSuccess?: () => void;
    onCancel?: () => void;
}
export const PaymentOptions: React.FC<PaymentOptionProps> = (props) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleClose = () => {
    // setOpen(false);
    // onCancel();
  };

  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Payment Methods</DialogTitle>
      <DialogContent>
        {/* <DialogContentText id="alert-dialog-description">
          Paymetn Methods
        </DialogContentText> */}
        <form
          noValidate
          autoComplete="off"
          className={classes.container}
        >
          <div>
            <Button variant="contained">EZ Cash or Card Payment</Button>
          </div>
          <div>
            <Button variant="contained">Add to Dialog bill</Button>
          </div>

        </form>
        {/* </DialogContentText> */}

      </DialogContent>
      <DialogActions>
        <Button
                    //   onClick={onSave}
          color="primary"
          autoFocus
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};
