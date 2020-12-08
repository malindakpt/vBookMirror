import { Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import classes from './PaymentGateway.module.scss';

interface Props {
  redirectUrl: string;
}
export const PaymentGateway: React.FC<Props> = ({ redirectUrl }) => {
  const { email } = useParams<any>();

  const [hash, setHash] = useState('');

  const sha256 = async (message: string) => {
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(message);

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string
    const hashHex = hashArray.map((b) => (`00${b.toString(16)}`).slice(-2)).join('');

    setHash(hashHex);
    return hashHex;
  };

  const get2digit = (n: number) => (n < 10 ? `0${n}` : n);

  const getDate = () => {
    // "2020-12-04 6:40:09"
    const now = new Date();
    // eslint-disable-next-line max-len
    const date = `${now.getFullYear()}-${get2digit(now.getMonth() + 1)}-${get2digit(now.getDate())} ${now.getHours()}:${get2digit(now.getMinutes())}:${get2digit(now.getSeconds())}`;

    console.log(date);
    return date;
  };

  useEffect(() => {
    getDate();
  }, []);

  const payGeine = () => {
    window.location.href = redirectUrl;
  };
  const [options, setOptions] = useState({
    merchantPgIdentifier: 'PG00008532',
    chargeTotal: '10.00',
    currency: 'LKR',
    orderId: '1234',
    invoiceNumber: 'INV000132',
    storeName: 'MCO0002398',
    txnToken: '',
    transactionDateTime: getDate(),
    sharedScret: '7b41da3d80654cfcb8bd7c9102080c75',
  });

  // MCO0002398LKR7b41da3d80654cfcb8bd7c9102080c752019-10-08 3:44:0910.00INV000132
  const handlePaymentSuccess = async () => {
    // window.location.href = redirectUrl;
    // eslint-disable-next-line max-len
    const token = `${options.storeName}${options.currency}${options.sharedScret}${options.transactionDateTime}${options.chargeTotal}${options.invoiceNumber}`;
    const sh = await sha256(token);
    console.log(token);
    console.log(sh);
    setOptions((prev) => {
      const clone = { ...prev };

      clone.txnToken = sh;

      console.log(options);
      return clone;
    });
  };

  return (
    <div>
      <div className={classes.header}>
        Payment Gateway
        {' '}
        {email}
      </div>
      <div>
        <Button onClick={payGeine}>Pay with Geine</Button>
        <form
          id="ext-merchant-frm"
          action="https://apps.genied.dialog.lk/merchant"
          method="post"
          acceptCharset="UTF-8"
          encType="application/x-www-form-urlencoded"
        >
          <input
            readOnly
            type="hidden"
            id="merchantPgIdentifier"
            name="merchantPgIdentifier"
            value={options.merchantPgIdentifier}
          />
          Total Price
          <input
            readOnly
            type="text"
            id="chargeTotal"
            name="chargeTotal"
            value={options.chargeTotal}
          />
          <input
            readOnly
            type="hidden"
            id="currency"
            name="currency"
            value={options.currency}
          />
          <input
            type="hidden"
            id="paymentMethod"
            name="paymentMethod"
            value="Genie"
          />
          <input
            readOnly
            type="hidden"
            id="orderId"
            name="orderId"
            value={options.orderId}
          />
          <input
            readOnly
            type="hidden"
            id="invoiceNumber"
            name="invoiceNumber"
            value={options.invoiceNumber}
          />
          <input
            readOnly
            type="hidden"
            id="successUrl"
            name="successUrl"
            value="https://akshara.lk/ok"
          />
          <input
            readOnly
            type="hidden"
            id="errorUrl"
            name="errorUrl"
            value="https://akshara.lk/error"
          />
          <input
            readOnly
            type="hidden"
            id="storeName"
            name="storeName"
            value={options.storeName}
          />
          <input
            type="hidden"
            id="transactionType"
            name="transactionType"
            value="SALE"
          />
          <input
            type="hidden"
            id="timeout"
            name="timeout"
            value="120"
          />
          <input
            readOnly
            // type="hidden"
            id="transactionDateTime"
            name="transactionDateTime"
            value={options.transactionDateTime}
          />
          <input
            type="hidden"
            id="language"
            name="language"
            value="en"
          />
          <input
            readOnly
            // type="hidden"
            id="txnToken"
            name="txnToken"
            // value="313607e9644f2472fca8f354b1207c4721d05ba64760fe466edf4df0b50bae6f"
            value={options.txnToken}
          />
          <input
            type="hidden"
            id="itemList"
            name="itemList"
            value=""
          />
          <input
            type="hidden"
            id="otherInfo"
            name="otherInfo"
            value=""
          />
          <input
            type="hidden"
            id="merchantCustomerPhone"
            name="merchantCustomerPhone"
            value=""
          />
          <input
            type="hidden"
            id="merchantCustomerEmail"
            name="merchantCustomerEmail"
            value=""
          />
          <input
            type="hidden"
            id="disableWebCheckoutQr"
            name="disableWebCheckoutQr"
            value=""
          />
          <input
            type="hidden"
            id="disableWebCheckoutGuest"
            name="disableWebCheckoutGuest"
            value=""
          />
          <input
            type="hidden"
            id="disableWebCheckoutSignIn"
            name="disableWebCheckoutSignIn"
            value=""
          />
          <input
            type="hidden"
            id="discountCode"
            name="discountCode"
            value=""
          />
          <input
            type="submit"
            value="Submit"
          />
        </form>
      </div>
      <div>
        PayHere
      </div>
      <Button onClick={handlePaymentSuccess}>Before Submit</Button>
    </div>
  );
};
