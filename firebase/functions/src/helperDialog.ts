import { config } from 'firebase-functions';
import { dialogApiUrl, tokenOptions } from './config';
import { sendError, sendSuccess, StatusType } from './util';

const request = require('request');

const DEFAULT_JSON_HEADERS = {
  'content-type': 'application/json',
  accept: 'application/json',
};

export const requestToken = (phone: string) => {
  console.log(`${phone}: Requesting token...${new Date()}`);
  return new Promise((resolve, reject) => {
    request(tokenOptions, (error: any, resp: any) => {
      try {
        const res = JSON.parse(resp.body);
        resolve(res.access_token);
      } catch (e) {
        console.error('Failed to parse token', error);
        reject();
      }
    });
  });
};

export const dialogCharge = async (res: any, phone: any, amount: any) => {
  if (!phone || !amount) {
    sendError(
      res,
      `Charge req: Error in params -> phone: ${phone}, amount: ${amount}`,
    );
    return;
  }

  const chargeReqOptions = {
    uri: `${dialogApiUrl}/charge`,
    method: 'POST',
    headers: { ...DEFAULT_JSON_HEADERS, authorization: '--null' },
    body: JSON.stringify({
      msisdn: `tel:${phone}`,
      description: 'PreBook reservation completed!',
      taxable: 'true',
      callbackURL: 'null',
      txnRef: 'null',
      amount,
    }),
  };

  try {
    const token = await requestToken(phone);
    chargeReqOptions.headers.authorization = `Bearer ${token}`;

    request(chargeReqOptions, (error2: any, response2: any) => {
      if (response2) {
        try {
          const body = JSON.parse(response2.body);
          if (body.statusCode === StatusType.ERROR) {
            console.log(`${phone}: Charge request failed. ${new Date()}`);
            sendError(res, body.message);
          } else {
            console.log(`${phone}: Charge request completed. ${new Date()}`);
            sendSuccess(res, body.data.serverRef);
          }
        } catch (e) {
          sendError(
            res,
            'Failed to connect the Dialog server. Please try again. 001',
          );
        }
      } else {
        sendError(
          res,
          'Failed to connect the Dialog server. Please try again. 002',
        );
      }
    });
  } catch (e) {
    sendError(
      res,
      'Error occured while token refresh. Pleas contact us or try again in few minutes',
    );
  }
};

export const dialogConfirm = async (res: any, pin: any, ref: any) => {
  if (!pin || !ref) {
    sendError(res, `SubmmitPin: Error in params -> pin:${pin}, ref: ${ref}`);
    return;
  }

  const submitPinOptions = {
    uri: `${dialogApiUrl}/submitPin`,
    method: 'POST',
    headers: { ...DEFAULT_JSON_HEADERS, authorization: 'null' },
    body: JSON.stringify({
      pin,
      serverRef: ref,
    }),
  };

  try {
    const token = await requestToken(ref);
    submitPinOptions.headers.authorization = `Bearer ${token}`;

    console.log(`Sending pin submit request...${new Date()}`);
    request(submitPinOptions, (error2: any, response2: any) => {
      if (response2) {
        try {
          const resObj = JSON.parse(response2.body);

          if (resObj.statusCode === 'ERROR') {
            if (resObj.message) {
              sendError(res, resObj.message);
            } else {
              sendSuccess(res, 'Error: resObj.message: undefined|null');
            }
          } else {
            console.log(`Pin verified.    ${new Date()}`);
            sendSuccess(res, '');
          }
        } catch (e) {
          console.error('Error while parsing token', response2);
          sendSuccess(res, 'Error while parsing token');
        }
      } else {
        sendSuccess(res, 'Error: response: undefined|null');
      }
    });
  } catch (e) {
    sendSuccess(
      res,
      'Error occured while token refresh. Pleas contact us or try again in few minutes',
    );
  }
};
