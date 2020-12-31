import {
  Accordion, AccordionDetails, AccordionSummary, Button, TextField, Typography,
} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import { AppContext } from '../../../App';
import {
  addDoc, addDocWithId, deleteDoc, Entity, getDocsWithProps, getDocWithId, sendHttp,
} from '../../../data/Store';
import { useForcedUpdate } from '../../../hooks/useForcedUpdate';
import { ILesson } from '../../../interfaces/ILesson';
import { IPayment, PaymentGateway } from '../../../interfaces/IPayment';
import { PaymentStatus } from '../paymentOptions/requestPayment/RequestPaymentValidation';
import classes from './AddPayment.module.scss';
import Config from '../../../data/Config';
import { IAccessCodes } from '../../../interfaces/IAccessCodes';

interface Props {
  lesson: ILesson;
}
export const AddPayment: React.FC<Props> = ({ lesson }) => {
  const [onUpdate, forcedUpdate] = useForcedUpdate();
  const { showSnackbar, email } = useContext(AppContext);
 
  const [busy, setBusy] = useState<boolean>(false);

  const [accessCodes, setAccessCodes] = useState<IAccessCodes>({id: '', codes: ''});
  const [payments, setPayments] = useState<IPayment[]>([]);

  useEffect(() => {
    getDocWithId<IAccessCodes>(Entity.ACCESS_CODES, lesson.id).then((data) => data && setAccessCodes(data));
  }, [onUpdate, lesson]);

  const handleChange = (obj: Record<string, any>) => {
    setAccessCodes((prev) => {
      const clone = { ...prev, ...obj };
      return clone;
    });
  };

  const saveAccessCodes = () => {
    addDocWithId(Entity.ACCESS_CODES, lesson.id, accessCodes).then(() => {
      showSnackbar('Added access codes');
    })
  };

  return (
    <div className={classes.container}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Payment Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div style={{width: '100%'}}>
            <div className={classes.inputs}>

              <TextField
                className={classes.input}
                id="paymentRef"
                label="Payment Ref"
                value={accessCodes.codes}
                disabled={busy}
                onChange={(e) => handleChange({ codes: e.target.value })}
              />

              <Button onClick={saveAccessCodes}>Add Payment Codes</Button>
            </div>
            {accessCodes.codes.length > 0 && <div className={classes.codes}>
              {accessCodes.codes.split(',').map(code => <div key={code} className={classes.code}>{code}</div>)}
            </div>}
            {/* <div className={classes.payments}>
              {payments.sort((a, b) => a.date - b.date).map((pmt) => (
                <div
                  key={pmt.id}
                  className={classes.row}
                >
                  <div>{new Date(pmt.date).toDateString()}</div>
                  <div>{pmt.ownerEmail}</div>
                  <div>{pmt.paymentRef}</div>
                  <div>{pmt.disabled}</div>
             
                  <div>
                    {pmt.status === PaymentStatus.NOT_VALIDATED && payment.disabled && <DoneOutlineIcon
                      onClick={(e) => { saveAccessCodes(pmt.id); e.stopPropagation(); }}
                    />}
                  </div>
                </div>
              ))}
            </div> */}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
