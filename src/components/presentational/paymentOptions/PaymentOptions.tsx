import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../App';
import { promptPayment, Util } from '../../../helper/util';
import { ILesson } from '../../../interfaces/ILesson';
import classes from './PaymentOptions.module.scss';
import { RequestPaymentValidation } from './requestPayment/RequestPaymentValidation';

export interface PaymentOptionProps {
    email: string | null;
    paidFor: string;
    lesson: ILesson;
    onSuccess?: () => void;
    onCancel?: () => void;
}
export const PaymentOptions: React.FC<PaymentOptionProps> = (props) => {
  const {
    email, paidFor, lesson, onSuccess, onCancel,
  } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [paymentValidation, setPaymentValidation] = useState<boolean>(false);
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
          <div style={{ display: 'grid' }}>
            <div>ගුරුවරයාට/ආයතනයට  මුදල් ගෙවා ඇත්නම්</div>
            <Button
              variant="contained"
              onClick={() => setPaymentValidation(true)}
            >
              Payment Validation Req.
            </Button>
          </div>

          { paymentValidation && (
            <RequestPaymentValidation options={{ ...props, onSuccess: () => setOpen(false) }} />
          )}
        </form>

      </DialogContent>
      <DialogActions>
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
