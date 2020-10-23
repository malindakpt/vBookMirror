import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export interface Props {
  onAccept: () => void;
  onCancel: () => void;
}
export const AlertDialog: React.FC<Props> = ({ onAccept, onCancel }) => {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
    onCancel();
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Please confirm</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            එක්  මුදල් ගෙවීමක් සඳහා මෙම පාඩම වාර 2ක්  නැරඹිය හැකිය.
            ඔබට මෙම අවස්ථාවේ  සම්පුර්ණයෙන් පාඩම නැරඹිය හැකිනම් පමණක් ඉදිරියට යන්න.
            නැති නම් ඔබට අවශ්‍ය වෙනත් ඕනෑම වේලාවක උත්සහ කරන්න.

          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            Per a payment you are allowed to watch this lesson for 2 times.
            Continue to watch, if you can manage to watch the full video now. Else please try again
            at any time when you can manage to watch full video.
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
