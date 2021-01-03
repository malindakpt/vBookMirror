import { Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { LessonType } from '../../../../interfaces/ILesson';
import { IPayment, PaymentGateway } from '../../../../interfaces/IPayment';

interface IPaySuccess{
    invoice_number: string;
    charge_total: string;
    gross_amount: string;
    trx_ref_number: string;
    trx_date_time: string;
    message: string;
    code: string;
    status: string;
    other_info: string;
    txn_token: string;
}
export const PaySuccess = () => {
    const location = useLocation();
    const history = useHistory();

    const [params, setParams] = useState<IPaySuccess>();

    useEffect(() => {
        const parmsStr = location.search.split('?')[1];
        const paramsArr =  parmsStr.split('&');
        const obj: any = {};
        paramsArr.forEach(par => {
            const keyVal = par.split('=');
            obj[keyVal[0]] = keyVal[1];
        });

        const paymentInfo = obj.other_info.split('##');
       
        const payment: IPayment = {
            id: '',
            date: paymentInfo[0],
            amount: Number(paymentInfo[1]),
            amountPure: Number(paymentInfo[2]), // we can get actual price from this for reports
            lessonId: paymentInfo[3],
            paymentType: Number(paymentInfo[4]),
            paidFor: paymentInfo[5], // for calculating teacher salary
            paymentRef: 'N/A',
            paymentObject: 'Genie', // payment response come from PG as it is
        
            gateway: PaymentGateway.GEINE,
        
            ownerEmail: paymentInfo[6],
            ownerName: 'N/A',
        
            status: '',
            disabled: false, // This is mandetory when multiple payments exists and calculate the watch count
            watchedCount: 0,
            createdAt: 0
        }

        setParams(obj);
        
        console.log(obj, payment);
    }, []);

    const openLesson = () => {
        history.push('');
    }

    return <div>Pay OK <Button onClick={openLesson}>Open Lesson</Button></div>
}