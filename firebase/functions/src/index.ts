import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { privateKey } from './config';

const cors = require('cors');

const bodyParser = require('body-parser');

const express = require('express');
// const serviceAccount = require('./akshara-8630e-firebase-adminsdk-epyf1-f2d7315ffb.json');

// import { response } from 'express';
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

app.post('/notify/1', (req: any, res: any) => {
  const ref = req.body.merchant_id;
  //   const ref2 = req.param('payhere_amount');
  const out = `1a: ${ref}  `;

  console.log(out);
  res.send({
    res: out,
  });
});

app.post('/notify/2', (req: any, res: any) => {
  const ref = req.body.merchant_id;
  //   const ref2 = req.param('payhere_amount');
  const out = `2a: ${ref}   `;

  console.log(out);
  res.send({
    res: out,
  });
});

app.post('/notify/3', (req: any, res: any) => {
  const { body } = req;

  if (body.status_code === StatusCode.SUCCESS) {
    const payment = {
      amount: body.payhere_amount,
      ownerEmail: body.custom_1,
      paidFor: body.custom_2,
      lessonId: body.order_id,
      paymentRef: body.payment_id,
      paymentObject: body,
    };
    console.log(req.body);
    db.collection('PAYMENTS_STUDENTS').add(payment).then((ref) => {
      // ok
    }).catch((err) => {
      console.log(err, req.bosy);
    });
  }
  res.send({
    res: 'ok',
  });
});

exports.akshara = functions.https.onRequest(app); // firebase run
app.listen(4000, () => console.log('------------------Server started on :4000----------------------'));
