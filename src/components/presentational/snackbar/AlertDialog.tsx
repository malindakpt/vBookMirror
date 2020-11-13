/* eslint-disable max-len */
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export enum AlertMode {
  VIDEO, LIVE, COPY_NAME
}
export interface Props {
  onAccept: () => void;
  onCancel: () => void;
  type: AlertMode;
}
export const AlertDialog: React.FC<Props> = ({ onAccept, onCancel, type }) => {
  const handleClose = () => {
    // setOpen(false);
    onCancel();
  };

  const msgs = [
    {
      en: 'Per a payment you are allowed to watch this lesson for 2 times. Continue to watch, if you can manage to watch the full video now. Else please try again at any time when you can manage to watch full video.',
      si: ' එක්  මුදල් ගෙවීමක් සඳහා මෙම පාඩම වාර 2ක්  නැරඹිය හැකිය. ඔබට මෙම අවස්ථාවේ  සම්පුර්ණයෙන් පාඩම නැරඹිය හැකිනම් පමණක් ඉදිරියට යන්න. නැති නම් ඔබට අවශ්‍ය වෙනත් ඕනෑම වේලාවක උත්සහ කරන්න.',

    },
    {
      en: 'Accept the microphone access from here(otherwise you will not here the voice of the teacher) and there after you can mute the microphone',
      si: 'Microphone සක්‍රීය කිරීමට අවශ්‍ය වුවහොත්  එය සක්‍රිය කිරීමට ඉඩ දෙන්න(Allow Microphone)(නැතිනම් ඔබට ගුරුවරයාගේ හඬ ඇසෙන්නේ නැත ).  සම්බන්දතාව ගොඩනැගුනු පසුව Microphone විසන්ධි කල හැකිය.',
    },
    {
      en: 'Use the same email account for login to Zoom(You can logout Zoom and login again with \'Sign In with Google\' for confirm). Otherwise your payment will not indicated to teacher',
      si: `අක්ෂර.lk  සඳහා යෙදූ  email එකම Zoom සඳහා login වීමටද භාවිත කරන්න(තහවුරු කර ගැනීමට Zoom නැවත Sign Out කර  
        'Sign In with Google' තෝරන්න). නැතහොත් ඔබගේ මුදල් ගෙවීම ගුරුවරයාට පෙන්වන්නේ නැත.`,
    },
  ];

  return (
    <div>
      <Dialog
        open
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Please confirm</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {msgs[type].si}
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            {msgs[type].en}
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
            onClick={onAccept}
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
