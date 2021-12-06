import {
  Accordion, AccordionDetails, AccordionSummary, Button, TextField, Typography,
} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { AppContext } from '../../../App';
import {
  addDocWithId, deleteDoc, Entity, getDocsWithProps, getDocWithId,
} from '../../../data/Store';
import { useForcedUpdate } from '../../../hooks/useForcedUpdate';
import { ILesson } from '../../../interfaces/ILesson';
import { IPayment } from '../../../interfaces/IPayment';
import classes from './AddPaymentCodes.module.scss';
import { IAccessCodes } from '../../../interfaces/IAccessCodes';
import { displayDate } from '../../../helper/util';

interface Props {
  lesson: ILesson;
}
export const AddPayment: React.FC<Props> = ({ lesson }) => {
  const [onUpdate, forcedUpdate] = useForcedUpdate();
  const { showSnackbar } = useContext(AppContext);

  const [accessCodes, setAccessCodes] = useState<IAccessCodes>({ id: '', codes: '' });
  const [givenAccessCodes, setGivenAccessCodes] = useState<IAccessCodes>({ id: '', codes: '' });

  const [payments, setPayments] = useState<IPayment[]>([]);

  useEffect(() => {
    getDocWithId<IAccessCodes>(Entity.GIVEN_ACCESS_CODES, lesson.id).then((data) => data && setGivenAccessCodes(data));
    getDocWithId<IAccessCodes>(Entity.ACCESS_CODES, lesson.id).then((data) => data && setAccessCodes(data));
    getDocsWithProps<IPayment>(Entity.PAYMENTS_STUDENTS, { lessonId: lesson.id }).then((data) => data && setPayments(data));
  }, [onUpdate, lesson]);

  // const handleChange = (obj: Record<string, any>) => {
  //   setAccessCodes((prev) => {
  //     const clone = { ...prev, ...obj };
  //     return clone;
  //   });
  // };

  const saveAccessCodes = (codes: IAccessCodes) => {
    addDocWithId(Entity.ACCESS_CODES, lesson.id, codes).then(() => {
      showSnackbar('Added access codes');
    });
  };

  const saveGivenAccessCodes = (codes: IAccessCodes) => {
    addDocWithId(Entity.GIVEN_ACCESS_CODES, lesson.id, codes).then(() => {
      showSnackbar('Saved');
    });
  };

  const copyAllCodes = () => {
    navigator.clipboard.writeText(accessCodes.codes);
  }

  const giveAccessCode = (code: string) => {
    console.log(code);
    navigator.clipboard.writeText(code)

    let newCodes;
    if(givenAccessCodes.codes.includes(code)) {
      newCodes = `${givenAccessCodes.codes.replace(code, '')}`;
    } else {
      newCodes = `${givenAccessCodes.codes.replace(code, '')}${code},`;
    }
   
    setGivenAccessCodes({id: givenAccessCodes.id, codes: newCodes});
    showSnackbar(`${code} copied`);
    saveGivenAccessCodes({id: givenAccessCodes.id, codes: newCodes});

  }

  const generateAccessCodes = () => {
    let next = Math.round(Math.random()*100000);
    let allCodes = `${next},`;

    for (let t = 0; t< 300 ; t += 1){
      next += Math.round(Math.random()*10000);
      allCodes = `${allCodes}${next},`;
    }
    console.log(allCodes); 
    const acc = {id: accessCodes.id, codes: allCodes};
    setAccessCodes(acc);
    saveAccessCodes(acc);
  }

  const deletePayment = (id: string) => {
    const res = window.confirm('Are you sure you need to remove this payment');
    if (res === true) {
      deleteDoc(Entity.PAYMENTS_STUDENTS, id).then(() => {
        showSnackbar('Payment removed');
        forcedUpdate();
      });
    }
  };

  const isGiven = (code: string) => givenAccessCodes.codes.includes(code);

  return (
    <div className={classes.container}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Payment Codes and Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div style={{ width: '100%' }}>
            <div>

              {/* <TextField
                fullWidth
                className={classes.input}
                id="paymentRef"
                label="Enter Payment Codes(No spaces) Eg. A123,B321,C32"
                value={accessCodes.codes}
                onChange={(e) => handleChange({ codes: e.target.value })}
              /> */}

              {/* <Button onClick={saveAccessCodes}>Save Payment Codes</Button> */}
              <Button onClick={copyAllCodes}>Copy All Payment Codes</Button>
              { accessCodes?.codes?.length < 1 && <Button onClick={generateAccessCodes}>Generate Payment Codes</Button>}
            </div>
            {accessCodes.codes.length > 0 && (
            <div className={classes.codes}>
              {accessCodes.codes.split(',').map((code) => (
                code.length > 2 && <div
                  key={code}
                  className={ isGiven(code) ? classes.given : classes.code}
                  onClick={() => giveAccessCode(code)}
                  onKeyDown={() => giveAccessCode(code)}
                  role="button"
                  tabIndex={0}
                >
                  {code}
                </div>
              ))}
            </div>
            )}
            <div className={classes.payments}>
              {payments.sort((a, b) => a.date - b.date).map((pmt) => (
                <div
                  key={pmt.id}
                  className={classes.row}
                >
                  <div>{displayDate(pmt.date)}</div>
                  <div>{pmt.ownerEmail}</div>
                  <div>{pmt.paymentRef}</div>
                  <div>{pmt.disabled}</div>

                  <div>
                    <DeleteForeverIcon
                      onClick={(e) => { deletePayment(pmt.id); e.stopPropagation(); }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
