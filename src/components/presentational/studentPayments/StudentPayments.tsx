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
import { displayDate } from '../../../helper/util';

interface Props {
    paymentList: IPayment[];
}

export const StudentPayments: React.FC<Props> = ({ paymentList }) => {

    const [total, setTotal] = useState(0);

    useEffect(() => {
        const tot = paymentList.reduce((a, b) => a + b.amount, 0);
        setTotal(tot);
    }, [paymentList])

    return <div className={classes.body}><Accordion>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
        >
            <Typography className={classes.heading}>Total Payments Value: {total}</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <div>
                {paymentList.map((payment) => (
                    <div
                        className={classes.row}
                        key={payment.id}
                    >
                        <div>{displayDate(payment.date)}</div>
                        <div>{payment.ownerName}</div>
                        <div>{payment.ownerEmail}</div>
                        <div>{payment.amount}</div>
                    </div>
                ))}
            </div>
        </AccordionDetails>
    </Accordion></div>;
}