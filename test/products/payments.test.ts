/* eslint-disable @typescript-eslint/no-unused-expressions */

import 'mocha';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { AfricasTalking, CONSTANTS } from '../../dist';
import { validCredentials } from '../fixtures';

chai.use(chaiAsPromised);

describe('Payments', () => {
  const at = AfricasTalking(validCredentials);

  describe('mobileCheckout', () => {
    context('invalid options', () => {
      it('#mobileCheckout() cannot be empty', () => {
        expect(at.mobileCheckout({} as any)).to.be.rejected;
      });

      it('#mobileCheckout() must have productName/phoneNumber/currencyCode/amount params', () => {
        expect(at.mobileCheckout({
          productName: null,
          phoneNumber: null,
        } as any)).to.be.rejected;
      });

      it('#mobileCheckout() may have string map metadata', () => {
        expect(at.mobileCheckout({
          metadata: 'Joe',
        } as any)).to.be.rejected;
      });
    });

    context('valid options', () => {
      it('mobileCheckout()', async () => {
        const result = await at.mobileCheckout({
          productName: 'TestProduct',
          phoneNumber: '+254718769882',
          currencyCode: 'KES',
          metadata: { Joe: 'Biden', id: 'VP' },
          amount: 234.5,
        });

        expect(result).to.have.property('status');
      });
    });
  });

  describe('mobileB2C', () => {
    context('invalid options', () => {
      it('#mobileB2C() cannot be empty', () => {
        expect(at.mobileB2C({} as any)).to.be.rejected;
      });

      it('#mobileB2C() must have productName/recipients', () => {
        expect(at.mobileB2C({
          productName: null,
        } as any)).to.be.rejected;
      });

      it('#mobileB2C() recipients must be limited to 10', () => {
        expect(at.mobileB2C({
          productName: 'Joe',
          recipients: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11],
        } as any)).to.be.rejected;
      });
    });

    context('valid options', () => {
      it('mobileB2C()', async () => {
        const result = await at.mobileB2C({
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
      });
    });
  });

  describe('mobileB2B', () => {
    context('invalid options', () => {
      it('#mobileB2B() cannot be empty', () => {
        expect(at.mobileB2B({} as any)).to.be.rejected;
      });

      it('#mobileB2B() may have string map metadata', () => {
        expect(at.mobileB2B({
          metadata: 'Joe',
        } as any)).to.be.rejected;
      });
    });

    context('valid options', () => {
      it('mobileB2B()', async () => {
        const result = await at.mobileB2B({
          productName: 'TestProduct',
          provider: CONSTANTS.PROVIDER.ATHENA as any,
          transferType: CONSTANTS.TRANSFER_TYPE.B2B_TRANSFER as any,
          currencyCode: 'KES',
          amount: 100,
          destinationChannel: '456789',
          destinationAccount: 'octopus',
          metadata: { notes: 'Account top-up for July 2017' },
        });

        expect(result).to.have.property('status');
      });
    });
  });

  describe('mobileData', () => {
    context('invalid options', () => {
      it('#mobileData() cannot be empty', () => {
        expect(at.mobileData({} as any)).to.be.rejected;
      });

      it('#mobileData() must have productName/recipients', () => {
        expect(at.mobileData({
          productName: null,
        } as any)).to.be.rejected;
      });
    });

    context('valid options', () => {
      it('mobileData()', async () => {
        const result = await at.mobileData({
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
      });
    });
  });

  describe('Wallet', () => {
    context('invalid options', () => {
      it('#walletTransfer() cannot be empty', () => {
        expect(at.walletTransfer({} as any)).to.be.rejected;
      });

      it('#walletTransfer() must have productName/targetProductCode/currencyCode/amount/metadata', () => {
        expect(at.walletTransfer({
          productName: 'Joe',
        } as any)).to.be.rejected;
      });

      it('#topupStash() cannot be empty', () => {
        expect(at.topupStash({} as any)).to.be.rejected;
      });

      it('#topupStash() must have productName/currencyCode/amount/metadata', () => {
        expect(at.topupStash({
          productName: 'Joe',
        } as any)).to.be.rejected;
      });
    });

    context('valid options', () => {
      it('walletTransfer()', async () => {
        const result = await at.walletTransfer({
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
      });

      it('topupStash()', async () => {
        const result = await at.topupStash({
          productName: 'TestProduct',
          currencyCode: 'KES',
          amount: 50,
          metadata: {
            Joe: 'Biden',
            id: 'VP',
          },
        });

        expect(result).to.have.property('status');
      });
    });
  });

  describe('Bank', () => {
    context('invalid options', () => {
      it('#bankCheckoutCharge() cannot be empty', () => {
        expect(at.bankCheckoutCharge({} as any)).to.be.rejected;
      });

      it('#bankCheckoutCharge() must have productName/bankAccount/currencyCode/amount/narration', () => {
        expect(at.bankCheckoutCharge({
          productName: null,
        } as any)).to.be.rejected;
      });

      it('#bankCheckoutCharge() may have string map metadata', () => {
        expect(at.bankCheckoutCharge({
          metadata: 'Joe',
        } as any)).to.be.rejected;
      });

      it('#bankCheckoutValidate() cannot be empty', () => {
        expect(at.bankCheckoutValidate({} as any)).to.be.rejected;
      });

      it('#bankCheckoutValidate() must have transactionId/otp', () => {
        expect(at.bankCheckoutValidate({
          otp: '1234',
        } as any)).to.be.rejected;
      });

      it('#bankTransfer() cannot be empty', () => {
        expect(at.bankTransfer({} as any)).to.be.rejected;
      });

      it('#bankTransfer() must have productName/recipients', () => {
        expect(at.bankTransfer({
          productName: 'TestProduct',
        } as any)).to.be.rejected;
      });
    });

    context('valid options', () => {
      it('bankCheckoutCharge()', async () => {
        const result = await at.bankCheckoutCharge({
          productName: 'TestProduct',
          bankAccount: {
            accountName: 'Test Bank Account',
            accountNumber: '1234567890',
            bankCode: CONSTANTS.BANK.FCMB_NG,
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
      });

      it('bankCheckoutValidate()', async () => {
        const result = await at.bankCheckoutValidate({
          transactionId: 'ATPid_SampleTxnId1',
          otp: '1234',
        });

        expect(result).to.have.property('status');
      });

      it('bankTransfer()', async () => {
        const result = await at.bankTransfer({
          productName: 'TestProduct',
          recipients: [{
            bankAccount: {
              accountName: 'Test Bank Account',
              accountNumber: '1234567890',
              bankCode: CONSTANTS.BANK.FCMB_NG,
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
      });
    });
  });

  describe('Card', () => {
    context('invalid options', () => {
      it('#cardCheckoutCharge() cannot be empty', () => {
        expect(at.cardCheckoutCharge({} as any)).to.be.rejected;
      });

      it('#cardCheckoutCharge() must have productName/paymentCard/currencyCode/amount/narration', () => {
        expect(at.cardCheckoutCharge({
          productName: 'Joe',
        } as any)).to.be.rejected;
      });

      it('#cardCheckoutCharge() may not have string map metadata', () => {
        expect(at.cardCheckoutCharge({
          metadata: 'Joe',
        } as any)).to.be.rejected;
      });

      it('#cardCheckoutValidate() cannot be empty', () => {
        expect(at.cardCheckoutValidate({} as any)).to.be.rejected;
      });

      it('#cardCheckoutValidate() must have transactionId/otp', () => {
        expect(at.cardCheckoutValidate({
          otp: '1234',
        } as any)).to.be.rejected;
      });
    });

    context('valid options', () => {
      // TODO: fix API error: The request content was malformed: Expected String as JsString
      it('cardCheckoutCharge()', async () => {
        const result = await at.cardCheckoutCharge({
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
      });

      it('cardCheckoutValidate()', async () => {
        const result = await at.cardCheckoutValidate({
          transactionId: 'ATPid_SampleTxnId1',
          otp: '1234',
        });

        expect(result).to.have.property('status');
      });
    });
  });

  describe('Query', () => {
    context('invalid options', () => {
      it('#fetchProductTransactions() cannot be empty', () => {
        expect(at.fetchProductTransactions({} as any)).to.be.rejected;
      });

      it('#fetchProductTransactions() must have productName and pageNumber/count filters', () => {
        expect(at.fetchProductTransactions({
          productName: 'Joe',
        } as any)).to.be.rejected;
      });

      it('#findTransaction() cannot be empty', () => {
        expect(at.findTransaction({} as any)).to.be.rejected;
      });

      it('#findTransaction() must have transactionId', () => {
        expect(at.findTransaction({
          transactionId: undefined,
        } as any)).to.be.rejected;
      });

      it('#fetchWalletTransactions() cannot be empty', () => {
        expect(at.fetchWalletTransactions({} as any)).to.be.rejected;
      });

      it('#fetchWalletTransactions() must have pageNumber/count filters', () => {
        expect(at.fetchWalletTransactions({
          filters: {
            pageNumber: '1',
          },
        } as any)).to.be.rejected;
      });
    });

    context('valid options', () => {
      it('fetchProductTransactions()', async () => {
        const result = await at.fetchProductTransactions({
          productName: 'Joe',
          filters: {
            pageNumber: '1',
            count: '10',
          },
        });

        expect(result).to.have.property('status');
      });

      it('findTransaction()', async () => {
        const result = await at.findTransaction({
          transactionId: 'ATPid_SampleTxnId1',
        });

        expect(result).to.have.property('status');
      });

      it('fetchWalletTransactions()', async () => {
        const result = await at.fetchWalletTransactions({
          filters: {
            pageNumber: '1',
            count: '10',
          },
        });

        expect(result).to.have.property('status');
      });

      it('fetchWalletBalance()', async () => {
        const result = await at.fetchWalletBalance();
        expect(result).to.have.property('status');
      });
    });
  });
});
