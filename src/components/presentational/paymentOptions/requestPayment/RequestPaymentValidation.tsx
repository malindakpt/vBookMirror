import { Button, TextField } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../../App';
import {
  addDoc, Entity, getDocsWithProps, getDocWithId,
} from '../../../../data/Store';
import { Util } from '../../../../helper/util';
import { IAccessCodes } from '../../../../interfaces/IAccessCodes';
import { IPayment, PaymentGateway } from '../../../../interfaces/IPayment';
import { WhatsApp } from '../../whatsApp/WhatsApp';
import { PaymentOptionProps } from '../PaymentOptions';

export enum PaymentStatus {
  VALIDATED = 'VALIDATED',
  NOT_VALIDATED = 'NOT_VALIDATED'
}
const REQ_SENT = 'දැනටමත් ඔබගේ ඉල්ලීම යොමු කර ඇත. අවශ්‍යනම් පමණක් ගුරුවරයාට පණිවුඩයක් යොමු කරන්න.';

export const RequestPaymentValidation: React.FC<{ options: PaymentOptionProps }> = ({ options }) => {
  const {
    lesson, email, onSuccess, teacher,
  } = options;
  const [paymentRef, setPaymentRef] = useState<string | null>('');
  const [fetchedPaymentRef, setfetchedPaymentRef] = useState<string | null>('');
  const [busy, setBusy] = useState(false);
  const [resultMsg, setResultMsg] = useState('');
  const { showSnackbar } = useContext(AppContext);

  useEffect(() => {
    if (email) {
      getDocsWithProps<IPayment>(Entity.PAYMENTS_STUDENTS,
        {
          lessonId: lesson.id,
          status: PaymentStatus.NOT_VALIDATED,
          gateway: PaymentGateway.MANUAL,
          ownerEmail: email,
        }).then((data) => {
        if (data.length > 0) {
          setResultMsg(REQ_SENT);
          setPaymentRef(data[0].paymentRef);
          setfetchedPaymentRef(data[0].paymentRef);
        }
      });
    }
  }, [lesson, email]);

  const requestValidation = async () => {
    if (paymentRef === '') {
      showSnackbar('ගුරුවරයාගෙන් ලබාගත් අංකය ඇතුලත් කරන්න. Please contact the teacher for get a code.');
      return;
    }

    setBusy(true);

    if (email && paymentRef) {
      const paymentObj: IPayment = {
        date: new Date().getTime(),
        amount: lesson.price,
        lessonId: lesson.id,
        paymentType: lesson.type,
        paidFor: lesson.ownerEmail, // for calculating teacher salary
        paymentRef,
        paymentObject: lesson.topic,

        ownerEmail: email,
        ownerName: Util.fullName,

        status: PaymentStatus.NOT_VALIDATED,
        disabled: true, // This is mandetory when multiple payments exists and calculate the watch count
        watchedCount: 0,

        gateway: PaymentGateway.MANUAL,

        id: '',
      };
      getDocWithId<IAccessCodes>(Entity.ACCESS_CODES, lesson.id).then((access) => {
        if (access && access.codes.includes(paymentRef)) {
          getDocsWithProps<IPayment>(Entity.PAYMENTS_STUDENTS, { paymentRef, status: PaymentStatus.VALIDATED }).then((data) => {
            if (data.length === 0) {
              // Code is valid and no one has taken it. Then create a validated payment for him.
              paymentObj.status = PaymentStatus.VALIDATED;
              paymentObj.disabled = false;
              addDoc(Entity.PAYMENTS_STUDENTS, paymentObj).then(() => {
                showSnackbar('Payment Request Sent');
                setResultMsg(REQ_SENT);
                window.location.reload();
              });
            } else {
              showSnackbar('This code is already taken');
            }
          });
        } else {
          // Bank deposite scenarios. then dont have a valid token
          addDoc(Entity.PAYMENTS_STUDENTS, paymentObj).then(() => {
            showSnackbar('Payment Request Sent');
            setResultMsg(REQ_SENT);
          });
        }
        onSuccess && onSuccess();
      });
    }
  };

  return (
    <div style={{ display: 'grid' }}>
      <TextField
        id="ref"
        label="ඔබගේ අංකය/Ref. Code"
        value={paymentRef}
        onChange={(e) => setPaymentRef(e.target.value)}
        variant="outlined"
        style={{ margin: '5px' }}
      />
      <span style={{ color: 'red' }}>{resultMsg}</span>
      <br />
      {!fetchedPaymentRef && (
        <Button
          variant="contained"
          color="secondary"
          onClick={requestValidation}
          disabled={busy}
        >
          Send Validation Request
        </Button>
      )}
      <WhatsApp
        teacher={teacher}
        msgPrefix={`${email}:${paymentRef}` ?? ''}
      />

    </div>
  );
};
