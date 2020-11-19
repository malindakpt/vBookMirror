import { Button, TextField } from '@material-ui/core';
import React, { useState } from 'react';

export const DialogAddToBill = () => {
  const [phone, setPhone] = useState<string>('');
  const [verifySent, setVerifySent] = useState<boolean>(false);

  const sendVerification = () => {
    setVerifySent(true);
  };

  return (
    <div>
      { verifySent ? (
        <div style={{ display: 'grid' }}>
          <TextField
      // className={classes.input}
            id="desc"
            label="Enter Code"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
            <Button onClick={() => setVerifySent(true)}>
              Send Verification Code
            </Button>
          </div>

        )}
    </div>
  );
};
