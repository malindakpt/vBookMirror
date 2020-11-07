/* eslint-disable max-len */
import React, { useContext, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { TextField } from '@material-ui/core';
import { addDoc, Entity } from '../../../data/Store';
import { IStudentInfo } from '../../../interfaces/IStudentInfo';
import { addToStorage, getFromStorage, LocalStorageKeys } from '../../../data/LocalStorage';
import { AppContext } from '../../../App';

export interface Props {
    reference: string;
}
export const CollectInfo: React.FC<Props> = ({ reference }) => {
  const [open, setOpen] = useState<boolean>(false);

  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [ownerEmail, setOwnerEmail] = useState<string>('');
  const [birthYear, setBirthYear] = useState<string>('');

  const { email, isTeacher, showSnackbar } = useContext(AppContext);
  const handleClose = () => {
    // setOpen(false);
    // onCancel();
  };

  useEffect(() => {
    if (isTeacher === false && !getFromStorage(LocalStorageKeys.STUDENT_INFO)) {
      setOpen(true);
    }
  }, [email, isTeacher]);

  const addStudentInfo = () => {
    const info: IStudentInfo = {
      id: '',
      createdAt: 0,
      name,
      phone,
      ownerEmail,
      birthYear: Number(birthYear),
      reference,
    };
    addToStorage(LocalStorageKeys.STUDENT_INFO, info);
    addDoc<IStudentInfo>(Entity.STUDENT_INFO, info).then(() => console.log('Student Added'));
  };

  const onSave = () => {
    const year = Number(birthYear);
    if (name === '') {
      showSnackbar('Please add the Name of the student');
    } else if (phone.length !== 10) {
      showSnackbar('Please add phone number in 0771234567 format');
    } else if (isNaN(year) || year < 2000) {
      showSnackbar('Birth year should be > 2000');
    } else {
      addStudentInfo();
      setOpen(false);
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Enter student details to watch video</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <DialogContentText id="alert-dialog-description">
              Enter student details to watch video(SI)
            </DialogContentText>
            <div>
              <TextField
                id="name"
                label="Name"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <TextField
                id="phone"
                label="Phone Number"
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <TextField
                id="birthYear"
                label="Birth Year"
                onChange={(e) => setBirthYear(e.target.value)}
              />
            </div>
            <div>
              <TextField
                id="email"
                label="Email Address"
                onChange={(e) => setOwnerEmail(e.target.value)}
              />
            </div>
          </DialogContentText>

        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="primary"
          >
            CANCEL
          </Button>
          <Button
            onClick={onSave}
            color="primary"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
