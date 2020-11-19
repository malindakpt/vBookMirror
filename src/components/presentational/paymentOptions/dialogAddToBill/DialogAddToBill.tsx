import { Button, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import Config from '../../../../data/Config';
import { sendHttp } from '../../../../data/Store';

export const DialogAddToBill = () => {
  const [phone, setPhone] = useState<string>('+94771141194');
  const [code, setCode] = useState<string>('');

  const [verifySent, setVerifySent] = useState<boolean>(false);

  const sendVerification = () => {
    setVerifySent(true);
    sendHttp(Config.dialogPaymentUrl, {
      phone,
      amount: 1,
    });
  };

  return (
    <div>
      { verifySent ? (
        <div style={{ display: 'grid' }}>
          <TextField
      // className={classes.input}
            id="desc"
            label="Enter Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button onClick={sendVerification}>
            Make Payment
          </Button>
        </div>
      )
        : (
          <div style={{ display: 'grid' }}>
            <TextField
        // className={classes.input}
              id="desc"
              label="Phone Number"
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
