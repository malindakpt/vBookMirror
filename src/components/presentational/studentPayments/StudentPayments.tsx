import React, {
    useCallback,
    useEffect, useRef, useState,
  } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { IPayment } from "../../../interfaces/IPayment";
import classes from './StudentPayments.module.scss';

interface Props {
    paymentList: IPayment[];
}

export const StudentPayments: React.FC<Props> = ({paymentList}) => <Accordion>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="panel1a-content"
      id="panel1a-header"
    >
      <Typography className={classes.heading}>Attendance Details</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <div>
        {paymentList.map((payment) => (
            <div
              className={classes.container}
              key={payment.id}
            >
              <div>{payment.date}</div>
            </div>
          ))}
      </div>
    </AccordionDetails>
  </Accordion>