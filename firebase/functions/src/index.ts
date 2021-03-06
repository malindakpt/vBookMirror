import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { privateKey } from './config';
import { Entity } from './util';

const cors = require('cors');

const bodyParser = require('body-parser');

const express = require('express');

const app = express();

app.use(
  cors({
    origin: '*',
  }),
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// initializing firebase functinalities
admin.initializeApp({
  credential: admin.credential.cert(privateKey as admin.ServiceAccount),
  databaseURL: 'https://akshara-8630e.firebaseio.com',
});
const db = admin.firestore();

enum StatusCode {
  CHARGED_BACK = -3,
  FAILED = -2,
  CANCELLED = -1,
  PENDING = 0,
  SUCCESS = '2'
}

export enum PaymentGateway { // Used by BE
  MANUAL,
  PAY_HERE,
  GEINE
}

app.post('/notify/1', (req: any, res: any) => {
  const ref = req.body.merchant_id;
  //   const ref2 = req.param('payhere_amount');
  const out = `1a: ${ref}  `;

  console.log(out);
  res.send({
    res: out,
  });
});



/**
 * Update payement status
 */
app.post('/notify/3', (req: any, res: any) => {
  const { body } = req;
  if (body.status_code === StatusCode.SUCCESS) {
    const [lessonId, paidFor, paymentType, amountPure] = body.order_id.split('##');
    const payment = {
      date: new Date().getTime(),
      amount: Number(body.payhere_amount),
      amountPure: Number(amountPure),
      ownerEmail: body.custom_1,
      ownerName: body.custom_2,
      paidFor,
      lessonId,
      paymentType: Number(paymentType),
      paymentRef: body.payment_id,
      status: body.status_code,
      paymentObject: body,
      gateway: PaymentGateway.PAY_HERE,
    };
    console.log(req.body);

    // Update payments
    db.collection(Entity.PAYMENTS_STUDENTS).add(payment).then((ref) => {
    }).catch((err) => {
      console.log(err, req.body);
    });
  }
  res.send({
    res: 'ok',
  });
});

exports.akshara = functions.https.onRequest(app); // firebase run
app.listen(4000, () => console.log('------------------Server started on :4000 new----------------------'));
