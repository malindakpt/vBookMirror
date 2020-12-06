import { Button } from '@material-ui/core';
import React from 'react';
import { useParams } from 'react-router-dom';
import classes from './PaymentGateway.module.scss';

interface Props {
  redirectUrl: string;
}
export const PaymentGateway: React.FC<Props> = ({ redirectUrl }) => {
  const { email } = useParams<any>();

  const handlePaymentSuccess = () => {
    window.location.href = redirectUrl;
  };

  const payGeine = () => {
    window.location.href = redirectUrl;
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
            type="hidden"
            id="merchantPgIdentifier"
            name="merchantPgIdentifier"
            value="PG00008532"
          />
          Total Price
          <input
            type="text"
            id="chargeTotal"
            name="chargeTotal"
            value="10.00"
          />
          <input
            type="hidden"
            id="currency"
            name="currency"
            value="LKR"
          />
          <input
            type="hidden"
            id="paymentMethod"
            name="paymentMethod"
            value="Genie"
          />
          <input
            type="hidden"
            id="orderId"
            name="orderId"
            value="1234"
          />
          <input
            type="hidden"
            id="invoiceNumber"
            name="invoiceNumber"
            value="INV000132"
          />
          <input
            type="hidden"
            id="successUrl"
            name="successUrl"
            value="https://akshara.lk/ok"
          />
          <input
            type="hidden"
            id="errorUrl"
            name="errorUrl"
            value="https://akshara.lk/error"
          />
          <input
            type="hidden"
            id="storeName"
            name="storeName"
            value="MCO0002398"
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
            type="hidden"
            id="transactionDateTime"
            name="transactionDateTime"
            value="2020-12-04 6:40:09"
          />
          <input
            type="hidden"
            id="language"
            name="language"
            value=""
          />
          <input
            type="hidden"
            id="txnToken"
            name="txnToken"
            value="313607e9644f2472fca8f354b1207c4721d05ba64760fe466edf4df0b50bae6f"
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
      <Button onClick={handlePaymentSuccess}>Done</Button>
    </div>
  );
};
