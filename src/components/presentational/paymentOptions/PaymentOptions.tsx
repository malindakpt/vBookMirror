import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../App';
import { promptPayment, Util } from '../../../helper/util';
import { ILesson } from '../../../interfaces/ILesson';
import { ITeacher } from '../../../interfaces/ITeacher';
import classes from './PaymentOptions.module.scss';
import { RequestPaymentValidation } from './requestPayment/RequestPaymentValidation';

export enum SelectedPayMethod {
  NONE,
  MANUAL,
  PAY_HERE,
  GEINE
}

export interface PaymentOptionProps {
  email: string | null;
  paidFor: string;
  lesson: ILesson;
  teacher: ITeacher;
  onSuccess?: () => void;
  onCancel?: () => void;
}
export const PaymentOptions: React.FC<PaymentOptionProps> = (props) => {
  const {
    email, paidFor, lesson, teacher, onSuccess, onCancel,
  } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [mode, setMode] = useState<SelectedPayMethod>(SelectedPayMethod.NONE);
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
    const callback = () => { };
    if (email) {
      promptPayment(
        email,
        paidFor,
        lesson,
        teacher,
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
          {mode === SelectedPayMethod.NONE && (
            <>
              <div style={{ display: 'grid' }}>
                <div style={{ textAlign: 'center' }}>Online මුදල් ගෙවීම </div>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={showPayhere}
                >
                  EZ Cash / Bank Card Payment
                </Button>
              </div>
              <br />
              <div style={{ display: 'grid' }}>
                <div style={{ textAlign: 'center' }}>ගුරුවරයාට/ආයතනයට  මුදල් ගෙවා ඇත්නම්</div>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setMode(SelectedPayMethod.MANUAL)}
                >
                  Payment Validation
                </Button>
              </div>
            </>
          )}
          {mode === SelectedPayMethod.MANUAL && (
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
