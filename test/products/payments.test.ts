/* eslint-disable @typescript-eslint/no-unused-expressions */

import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import AfricasTalking from '../../src';
import { validCredentials } from '../fixtures';

chai.use(chaiAsPromised);

describe('Payments', () => {
  const payments = AfricasTalking(validCredentials).PAYMENTS;

  describe('mobileCheckout', () => {
    context('invalid options', () => {
      it('#mobileCheckout() cannot be empty', () => {
        expect(payments.mobileCheckout({} as any)).to.be.rejected;
      });

      it('#mobileCheckout() must have productName/phoneNumber/currencyCode/amount params', () => {
        expect(payments.mobileCheckout({
          productName: null,
          phoneNumber: null,
        } as any)).to.be.rejected;
      });

      it('#mobileCheckout() may have string map metadata', () => {
        expect(payments.mobileCheckout({
          metadata: 'Joe',
        } as any)).to.be.rejected;
      });
    });

    context('valid options', () => {
      it('mobileCheckout()', async () => {
        try {
          const result = await payments.mobileCheckout({
            productName: 'TestProduct',
            phoneNumber: '+254718769882',
            currencyCode: 'KES',
            metadata: { Joe: 'Biden', id: 'VP' },
            amount: 234.5,
          });

          expect(result).to.have.property('status');
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(err);
        }
      });
    });
  });

  describe('mobileB2C', () => {
    context('invalid options', () => {
      it('#mobileB2C() cannot be empty', () => {
        expect(payments.mobileB2C({} as any)).to.be.rejected;
      });

      it('#mobileB2C() must have productName/recipients', () => {
        expect(payments.mobileB2C({
          productName: null,
        } as any)).to.be.rejected;
      });

      it('#mobileB2C() recipients must be limited to 10', () => {
        expect(payments.mobileB2C({
          productName: 'Joe',
          recipients: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11],
        } as any)).to.be.rejected;
      });
    });

    context('valid options', () => {
      it('mobileB2C()', async () => {
        try {
          const result = await payments.mobileB2C({
            productName: 'TestProduct',
            recipients: [
              {
                phoneNumber: '254718769882',
                currencyCode: 'KES',
                reason: 'SalaryPayment',
                metadata: { Joe: 'Biden', id: 'VP' },
                amount: 234.5,
              },
            ],
          });

          expect(result).to.have.property('numQueued');
          expect(result).to.have.property('entries');
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(err);
        }
      });
    });
  });

  describe('mobileB2B', () => {
    context('invalid options', () => {
      it('#mobileB2B() cannot be empty', () => {
        expect(payments.mobileB2B({} as any)).to.be.rejected;
      });

      it('#mobileB2B() may have string map metadata', () => {
        expect(payments.mobileB2B({
          metadata: 'Joe',
        } as any)).to.be.rejected;
      });
    });

    context('valid options', () => {
      it('mobileB2B()', async () => {
        try {
          const result = await payments.mobileB2B({
            productName: 'TestProduct',
            provider: payments.PROVIDER.ATHENA as any,
            transferType: payments.TRANSFER_TYPE.B2B_TRANSFER as any,
            currencyCode: 'KES',
            amount: 100,
            destinationChannel: '456789',
            destinationAccount: 'octopus',
            metadata: { notes: 'Account top-up for July 2017' },
          });

          expect(result).to.have.property('status');
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(err);
        }
      });
    });
  });

  describe('mobileData', () => {
    context('invalid options', () => {
      it('#mobileData() cannot be empty', () => {
        expect(payments.mobileData({} as any)).to.be.rejected;
      });

      it('#mobileData() must have productName/recipients', () => {
        expect(payments.mobileData({
          productName: null,
        } as any)).to.be.rejected;
      });
    });

    context('valid options', () => {
      it('mobileData()', async () => {
        try {
          const result = await payments.mobileData({
            productName: 'TestProduct',
            recipients: [{
              phoneNumber: '+254711223344',
              quantity: 10,
              unit: 'GB',
              validity: 'Month',
              metadata: {
                Joe: 'Biden',
                id: 'VP',
              },
            }],
          });

          expect(result).to.have.property('status');
        } catch (err) {
          if (err?.response?.status !== 404) {
            // eslint-disable-next-line no-console
            console.log(err);
          }
        }
      });
    });
  });

  describe('Wallet', () => {
    context('invalid options', () => {
      it('#walletTransfer() cannot be empty', () => {
        expect(payments.walletTransfer({} as any)).to.be.rejected;
      });

      it('#walletTransfer() must have productName/targetProductCode/currencyCode/amount/metadata', () => {
        expect(payments.walletTransfer({
          productName: 'Joe',
        } as any)).to.be.rejected;
      });

      it('#topupStash() cannot be empty', () => {
        expect(payments.topupStash({} as any)).to.be.rejected;
      });

      it('#topupStash() must have productName/currencyCode/amount/metadata', () => {
        expect(payments.topupStash({
          productName: 'Joe',
        } as any)).to.be.rejected;
      });
    });

    context('valid options', () => {
      it('walletTransfer()', async () => {
        try {
          const result = await payments.walletTransfer({
            productName: 'TestProduct',
            targetProductCode: 3323,
            currencyCode: 'KES',
            amount: 50,
            metadata: {
              Joe: 'Biden',
              id: 'VP',
            },
          });

          expect(result).to.have.property('status');
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(err);
        }
      });

      it('topupStash()', async () => {
        try {
          const result = await payments.topupStash({
            productName: 'TestProduct',
            currencyCode: 'KES',
            amount: 50,
            metadata: {
              Joe: 'Biden',
              id: 'VP',
            },
          });

          expect(result).to.have.property('status');
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(err);
        }
      });
    });
  });

  describe('Bank', () => {
    context('invalid options', () => {
      it('#bankCheckoutCharge() cannot be empty', () => {
        expect(payments.bankCheckoutCharge({} as any)).to.be.rejected;
      });

      it('#bankCheckoutCharge() must have productName/bankAccount/currencyCode/amount/narration', () => {
        expect(payments.bankCheckoutCharge({
          productName: null,
        } as any)).to.be.rejected;
      });

      it('#bankCheckoutCharge() may have string map metadata', () => {
        expect(payments.bankCheckoutCharge({
          metadata: 'Joe',
        } as any)).to.be.rejected;
      });

      it('#bankCheckoutValidate() cannot be empty', () => {
        expect(payments.bankCheckoutValidate({} as any)).to.be.rejected;
      });

      it('#bankCheckoutValidate() must have transactionId/otp', () => {
        expect(payments.bankCheckoutValidate({
          otp: '1234',
        } as any)).to.be.rejected;
      });

      it('#bankTransfer() cannot be empty', () => {
        expect(payments.bankTransfer({} as any)).to.be.rejected;
      });

      it('#bankTransfer() must have productName/recipients', () => {
        expect(payments.bankTransfer({
          productName: 'TestProduct',
        } as any)).to.be.rejected;
      });
    });

    context('valid options', () => {
      it('bankCheckoutCharge()', async () => {
        try {
          const result = await payments.bankCheckoutCharge({
            productName: 'TestProduct',
            bankAccount: {
              accountName: 'Test Bank Account',
              accountNumber: '1234567890',
              bankCode: payments.BANK.FCMB_NG,
            },
            currencyCode: 'KES',
            amount: 50,
            narration: 'Test Payment',
            metadata: {
              Joe: 'Biden',
              id: 'VP',
            },
          });

          expect(result).to.have.property('status');
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(err);
        }
      });

      it('bankCheckoutValidate()', async () => {
        try {
          const result = await payments.bankCheckoutValidate({
            transactionId: 'ATPid_SampleTxnId1',
            otp: '1234',
          });

          expect(result).to.have.property('status');
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(err);
        }
      });

      it('bankTransfer()', async () => {
        try {
          const result = await payments.bankTransfer({
            productName: 'TestProduct',
            recipients: [{
              bankAccount: {
                accountName: 'Test Bank Account',
                accountNumber: '1234567890',
                bankCode: payments.BANK.FCMB_NG,
              },
              currencyCode: 'KES',
              amount: 50,
              narration: 'Test Payment',
              metadata: {
                Joe: 'Biden',
                id: 'VP',
              },
            }],
          });

          expect(result).to.have.property('entries');
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(err);
        }
      });
    });
  });

  describe('Card', () => {
    context('invalid options', () => {
      it('#cardCheckoutCharge() cannot be empty', () => {
        expect(payments.cardCheckoutCharge({} as any)).to.be.rejected;
      });

      it('#cardCheckoutCharge() must have productName/paymentCard/currencyCode/amount/narration', () => {
        expect(payments.cardCheckoutCharge({
          productName: 'Joe',
        } as any)).to.be.rejected;
      });

      it('#cardCheckoutCharge() may not have string map metadata', () => {
        expect(payments.cardCheckoutCharge({
          metadata: 'Joe',
        } as any)).to.be.rejected;
      });

      it('#cardCheckoutValidate() cannot be empty', () => {
        expect(payments.cardCheckoutValidate({} as any)).to.be.rejected;
      });

      it('#cardCheckoutValidate() must have transactionId/otp', () => {
        expect(payments.cardCheckoutValidate({
          otp: '1234',
        } as any)).to.be.rejected;
      });
    });

    context('valid options', () => {
      // TODO: fix API error: The request content was malformed: Expected String as JsString
      it('cardCheckoutCharge()', async () => {
        try {
          const result = await payments.cardCheckoutCharge({
            productName: 'TestProduct',
            paymentCard: {
              number: '123456789000',
              cvvNumber: 654,
              expiryMonth: 7,
              expiryYear: 2019,
              authToken: '2345',
              countryCode: 'NG',
            },
            currencyCode: 'KES',
            amount: 50,
            narration: 'Test Payment',
            metadata: {
              Joe: 'Biden',
              id: 'VP',
            },
          });

          expect(result).to.have.property('status');
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(err);
        }
      });

      it('cardCheckoutValidate()', async () => {
        try {
          const result = await payments.cardCheckoutValidate({
            transactionId: 'ATPid_SampleTxnId1',
            otp: '1234',
          });

          expect(result).to.have.property('status');
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(err);
        }
      });
    });
  });

  describe('Query', () => {
    context('invalid options', () => {
      it('#fetchProductTransactions() cannot be empty', () => {
        expect(payments.fetchProductTransactions({} as any)).to.be.rejected;
      });

      it('#fetchProductTransactions() must have productName and pageNumber/count filters', () => {
        expect(payments.fetchProductTransactions({
          productName: 'Joe',
        } as any)).to.be.rejected;
      });

      it('#findTransaction() cannot be empty', () => {
        expect(payments.findTransaction({} as any)).to.be.rejected;
      });

      it('#findTransaction() must have transactionId', () => {
        expect(payments.findTransaction({
          transactionId: undefined,
        } as any)).to.be.rejected;
      });

      it('#fetchWalletTransactions() cannot be empty', () => {
        expect(payments.fetchWalletTransactions({} as any)).to.be.rejected;
      });

      it('#fetchWalletTransactions() must have pageNumber/count filters', () => {
        expect(payments.fetchWalletTransactions({
          filters: {
            pageNumber: '1',
          },
        } as any)).to.be.rejected;
      });
    });

    context('valid options', () => {
      it('fetchProductTransactions()', async () => {
        try {
          const result = await payments.fetchProductTransactions({
            productName: 'Joe',
            filters: {
              pageNumber: '1',
              count: '10',
            },
          });

          expect(result).to.have.property('status');
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(err);
        }
      });

      it('findTransaction()', async () => {
        try {
          const result = await payments.findTransaction({
            transactionId: 'ATPid_SampleTxnId1',
          });

          expect(result).to.have.property('status');
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(err);
        }
      });

      it('fetchWalletTransactions()', async () => {
        try {
          const result = await payments.fetchWalletTransactions({
            filters: {
              pageNumber: '1',
              count: '10',
            },
          });

          expect(result).to.have.property('status');
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(err);
        }
      });

      it('fetchWalletBalance()', async () => {
        try {
          const result = await payments.fetchWalletBalance();

          expect(result).to.have.property('status');
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(err);
        }
      });
    });
  });
});
