import { Button, TextField } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import { AppContext } from '../../../../App';
import Config from '../../../../data/Config';
import { sendHttp } from '../../../../data/Store';

interface Props {
    hideCancel: () => void;
    onSuccess: () => void;
}

export const DialogAddToBill: React.FC<Props> = ({ hideCancel }) => {
  const { showSnackbar } = useContext(AppContext);
  const [phone, setPhone] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [serverRef, setServerRef] = useState<string>('');

  const [verifySent, setVerifySent] = useState<boolean>(false);
  const [confirmSent, setConfirmSent] = useState<boolean>(false);

  const sendVerification = () => {
    if (phone.length !== 10) {
      showSnackbar('Add phone number in 0771234567 format');
      return;
    }

    const edited = `+94${phone.substr(1)}`;

    // console.log(edited);

    setVerifySent(true);
    sendHttp(Config.dialogPaymentUrl, {
      phone: edited,
      amount: 1,
    }).then((data: any) => {
      setServerRef(data.message);
      console.log(data.message);
    });
  };

  const startPayment = () => {
    hideCancel();
    setConfirmSent(true);

    sendHttp(Config.dialogConfirmUrl, {
      serverRef,
      pin,
    }).then((data: any) => {
      if (data.status === 'SUCCESS') {
        console.log(data);
      } else {
        showSnackbar('Payment Done');
      }
    });
  };

  return (
    <div>
      { verifySent ? (
        <div style={{ display: 'grid' }}>
          <TextField
            id="pin"
            label="Enter Code"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
          {!confirmSent && (
          <Button onClick={startPayment}>
            Make Payment
          </Button>
          )}
        </div>
      )
        : (
          <div style={{ display: 'grid' }}>
            <TextField
              id="desc"
              label="Phone (07XXXXXXXX)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Button onClick={sendVerification}>
              Send Verification Code
            </Button>
          </div>

        )}
    </div>
  );
};
