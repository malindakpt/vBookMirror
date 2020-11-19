import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../App';
import { promptPayment, Util } from '../../../helper/util';
import { ILesson } from '../../../interfaces/ILesson';
import { DialogAddToBill } from './dialogAddToBill/DialogAddToBill';
import classes from './PaymentOptions.module.scss';

export interface PaymentOptionProps {
    email: string | null;
    paidFor: string;
    lesson: ILesson;
    onSuccess?: () => void;
    onCancel?: () => void;
}
export const PaymentOptions: React.FC<PaymentOptionProps> = ({
  email, paidFor, lesson, onSuccess, onCancel,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [dialogAddToBill, setDialogAddToBill] = useState<boolean>(false);
  const { showSnackbar } = useContext(AppContext);

  const handleClose = () => {
    // setOpen(false);
    onCancel && onCancel();
  };

  useEffect(() => {
    setOpen(true);
  }, []);

  const showPayhere = () => {
    onCancel && onCancel();
    const callback = () => {};
    if (email) {
      promptPayment(
        email,
        paidFor,
        lesson,
        onSuccess ?? callback,
        showSnackbar,
      );
    } else {
      Util.invokeLogin();
    }
  };

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
            <Button
              variant="contained"
              onClick={showPayhere}
            >
              EZ Cash / Card Payment
            </Button>
          </div>
          <div>
            <Button
              variant="contained"
              onClick={() => setDialogAddToBill(true)}
            >
              Add to Dialog bill
            </Button>

          </div>

          { dialogAddToBill && <DialogAddToBill />}
        </form>
        {/* </DialogContentText> */}

      </DialogContent>
      <DialogActions>
        {/* <Button
                    //   onClick={onSave}
          color="primary"
          autoFocus
        >
          OK
        </Button> */}
        <Button
          onClick={handleClose}
          color="primary"
          autoFocus
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
