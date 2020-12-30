import { Accordion, AccordionDetails, AccordionSummary, Button, TextField, Typography } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../App';
import { addDoc, deleteDoc, Entity, getDocsWithProps } from '../../../data/Store';
import { useForcedUpdate } from '../../../hooks/useForcedUpdate';
import { ILesson } from '../../../interfaces/ILesson';
import { IPayment, PaymentGateway } from '../../../interfaces/IPayment';
import { PaymentStatus } from '../paymentOptions/requestPayment/RequestPaymentValidation';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import classes from './AddPayment.module.scss';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SaveIcon from '@material-ui/icons/Save';

interface Props {
    lesson: ILesson;
}
export const AddPayment: React.FC<Props> = ({ lesson }) => {
    const [onUpdate, forcedUpdate] = useForcedUpdate();
    const { showSnackbar, email } = useContext(AppContext);
    const newPayment: IPayment = {
        date: new Date().getTime(),
        amount: lesson.price,
        lessonId: lesson.id,
        paymentType: lesson.type,
        paidFor: lesson.ownerEmail, // for calculating teacher salary
        paymentRef: '',
        paymentObject: lesson.topic,

        ownerEmail: '',
        ownerName: '',

        status: PaymentStatus.NOT_VALIDATED,
        disabled: true, // This is mandetory when multiple payments exists and calculate the watch count
        watchedCount: 0,

        gateway: PaymentGateway.MANUAL,

        id: '',
        createdAt: 0,
    }
    const [busy, setBusy] = useState<boolean>(false);

    const [payment, setPayment] = useState<IPayment>(newPayment);
    const [payments, setPayments] = useState<IPayment[]>([]);

    useEffect(() => {
        getDocsWithProps<IPayment[]>(Entity.PAYMENTS_STUDENTS, { lessonId: lesson.id }).then(data => setPayments(data))
    }, [onUpdate]);

    const handleChange = (obj: Record<string, any>) => {
        setPayment((prev) => {
            const clone = { ...prev, ...obj };
            return clone;
        });
    };

    const addPayment = () => {
        if (!payment.ownerEmail.includes('@gmail') || payment.paymentRef === '') {
            showSnackbar('Invalid inputs!');
            return;
        }
        setBusy(true);
        addDoc(Entity.PAYMENTS_STUDENTS, payment).then(() => {
            showSnackbar('Payment added!');
            forcedUpdate();
            setBusy(false)
        });
    };

    const deleteItem = (id: string) => {
        deleteDoc(Entity.PAYMENTS_STUDENTS, id).then(() => {
            showSnackbar('Removed');
            forcedUpdate();
        });
    };

    return (
        <>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography >Payment Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        <div className={classes.inputs}>
                            
                            <TextField
                                className={classes.input}
                                id="ownerEmail"
                                label="Student Email"
                                inputProps={{ maxLength: 140 }}
                                value={payment.ownerEmail}
                                disabled={busy}
                                onChange={(e) => handleChange({ ownerEmail: e.target.value })}
                            />

                            <TextField
                                className={classes.input}
                                id="paymentRef"
                                label="Payment Ref"
                                inputProps={{ maxLength: 140 }}
                                value={payment.paymentRef}
                                disabled={busy}
                                onChange={(e) => handleChange({ paymentRef: e.target.value })}
                            />

                            <SaveIcon onClick={addPayment} />
                        </div>
                        <div>
                            <table><tbody>{payments.map(pmt =>
                                <tr key={pmt.id}>
                                    <td>{pmt.ownerEmail}</td>
                                    <td>{pmt.paymentRef}</td>
                                    <td> <DeleteForeverIcon
                                        onClick={(e) => { deleteItem(pmt.id); e.stopPropagation(); }}
                                    /></td>
                                </tr>)}</tbody></table>

                        </div>
                    </Typography>
                </AccordionDetails>
            </Accordion>

        </>
    );
};
