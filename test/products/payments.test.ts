/* eslint-disable @typescript-eslint/no-unused-expressions */

import 'mocha';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Client, CONSTANTS } from '../../dist';
import { validCredentials } from '../fixtures';

chai.use(chaiAsPromised);

describe('Payments', () => {
  const client = new Client(validCredentials);

  describe('mobileCheckout', () => {
    context('invalid options', () => {
      it('#mobileCheckout() cannot be empty', () => {
        expect(client.mobileCheckout({} as any)).to.be.rejected;
      });

      it('#mobileCheckout() must have productName/phoneNumber/currencyCode/amount params', () => {
        expect(client.mobileCheckout({
          productName: null,
          phoneNumber: null,
        } as any)).to.be.rejected;
      });

      it('#mobileCheckout() may have string map metadata', () => {
        expect(client.mobileCheckout({
          metadata: 'John Doe',
        } as any)).to.be.rejected;
      });
    });

    context('valid options', () => {
      it('mobileCheckout()', async () => {
        const result = await client.mobileCheckout({
          productName: 'TestProduct',
          phoneNumber: '+254711111111',
          currencyCode: 'KES',
          metadata: {
            id: '088930432excvmklevdf',
            name: 'John Doe',
          },
          amount: 234.5,
        });

        expect(result).to.have.property('status');
      });
    });
  });

  describe('mobileB2C', () => {
    context('invalid options', () => {
      it('#mobileB2C() cannot be empty', () => {
        expect(client.mobileB2C({} as any)).to.be.rejected;
      });

      it('#mobileB2C() must have productName/recipients', () => {
        expect(client.mobileB2C({
          productName: null,
        } as any)).to.be.rejected;
      });

      it('#mobileB2C() recipients must be limited to 10', () => {
        expect(client.mobileB2C({
          productName: 'TestProduct',
          recipients: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11],
        } as any)).to.be.rejected;
      });
    });

    context('valid options', () => {
      it('mobileB2C()', async () => {
        const result = await client.mobileB2C({
          productName: 'TestProduct',
          recipients: [
            {
              phoneNumber: '254711111111',
              currencyCode: 'KES',
              reason: CONSTANTS.REASON.SALARY,
              metadata: {
                id: '088930432excvmklevdf',
                name: 'John Doe',
              },
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
        expect(client.mobileB2B({} as any)).to.be.rejected;
      });

      it('#mobileB2B() may have string map metadata', () => {
        expect(client.mobileB2B({
          metadata: 'John Doe',
        } as any)).to.be.rejected;
      });
    });

    context('valid options', () => {
      it('mobileB2B()', async () => {
        const result = await client.mobileB2B({
          productName: 'TestProduct',
          provider: CONSTANTS.PROVIDER.ATHENA,
          transferType: CONSTANTS.TRANSFER_TYPE.B2B_TRANSFER,
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
        expect(client.mobileData({} as any)).to.be.rejected;
      });

      it('#mobileData() must have productName/recipients', () => {
        expect(client.mobileData({
          productName: null,
        } as any)).to.be.rejected;
      });
    });

    context('valid options', () => {
      it('mobileData()', async () => {
        // TODO: when mobileData finally accepts sandbox env, remove this:
        if (validCredentials.username === 'sandbox') return;

        const result = await client.mobileData({
          productName: 'TestProduct',
          recipients: [{
            phoneNumber: '+254711223344',
            quantity: 10,
            unit: 'GB',
            validity: 'Month',
            metadata: {
              id: '088930432excvmklevdf',
              name: 'John Doe',
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
        expect(client.walletTransfer({} as any)).to.be.rejected;
      });

      it('#walletTransfer() must have productName/targetProductCode/currencyCode/amount/metadata', () => {
        expect(client.walletTransfer({
          productName: 'TestProduct',
        } as any)).to.be.rejected;
      });

      it('#topupStash() cannot be empty', () => {
        expect(client.topupStash({} as any)).to.be.rejected;
      });

      it('#topupStash() must have productName/currencyCode/amount/metadata', () => {
        expect(client.topupStash({
          productName: 'TestProduct',
        } as any)).to.be.rejected;
      });
    });

    context('valid options', () => {
      it('walletTransfer()', async () => {
        const result = await client.walletTransfer({
          productName: 'TestProduct',
          targetProductCode: 3323,
          currencyCode: 'KES',
          amount: 50,
          metadata: {
            id: '088930432excvmklevdf',
            name: 'John Doe',
          },
        });

        expect(result).to.have.property('status');
      });

      it('topupStash()', async () => {
        const result = await client.topupStash({
          productName: 'TestProduct',
          currencyCode: 'KES',
          amount: 50,
          metadata: {
            id: '088930432excvmklevdf',
            name: 'John Doe',
          },
        });

        expect(result).to.have.property('status');
      });
    });
  });

  describe('Bank', () => {
    context('invalid options', () => {
      it('#bankCheckoutCharge() cannot be empty', () => {
        expect(client.bankCheckoutCharge({} as any)).to.be.rejected;
      });

      it('#bankCheckoutCharge() must have productName/bankAccount/currencyCode/amount/narration', () => {
        expect(client.bankCheckoutCharge({
          productName: null,
        } as any)).to.be.rejected;
      });

      it('#bankCheckoutCharge() may have string map metadata', () => {
        expect(client.bankCheckoutCharge({
          metadata: 'John Doe',
        } as any)).to.be.rejected;
      });

      it('#bankCheckoutValidate() cannot be empty', () => {
        expect(client.bankCheckoutValidate({} as any)).to.be.rejected;
      });

      it('#bankCheckoutValidate() must have transactionId/otp', () => {
        expect(client.bankCheckoutValidate({
          otp: '1234',
        } as any)).to.be.rejected;
      });

      it('#bankTransfer() cannot be empty', () => {
        expect(client.bankTransfer({} as any)).to.be.rejected;
      });

      it('#bankTransfer() must have productName/recipients', () => {
        expect(client.bankTransfer({
          productName: 'TestProduct',
        } as any)).to.be.rejected;
      });
    });

    context('valid options', () => {
      it('bankCheckoutCharge()', async () => {
        const result = await client.bankCheckoutCharge({
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
            id: '088930432excvmklevdf',
            name: 'John Doe',
          },
        });

        expect(result).to.have.property('status');
      });

      it('bankCheckoutValidate()', async () => {
        const result = await client.bankCheckoutValidate({
          transactionId: 'ATPid_SampleTxnId1',
          otp: '1234',
        });

        expect(result).to.have.property('status');
      });

      it('bankTransfer()', async () => {
        const result = await client.bankTransfer({
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
              id: '088930432excvmklevdf',
              name: 'John Doe',
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
        expect(client.cardCheckoutCharge({} as any)).to.be.rejected;
      });

      it('#cardCheckoutCharge() must have productName/paymentCard/currencyCode/amount/narration', () => {
        expect(client.cardCheckoutCharge({
          productName: 'TestProduct',
        } as any)).to.be.rejected;
      });

      it('#cardCheckoutCharge() may not have string map metadata', () => {
        expect(client.cardCheckoutCharge({
          metadata: 'John Doe',
        } as any)).to.be.rejected;
      });

      it('#cardCheckoutValidate() cannot be empty', () => {
        expect(client.cardCheckoutValidate({} as any)).to.be.rejected;
      });

      it('#cardCheckoutValidate() must have transactionId/otp', () => {
        expect(client.cardCheckoutValidate({
          otp: '1234',
        } as any)).to.be.rejected;
      });
    });

    context('valid options', () => {
      it('cardCheckoutCharge()', async () => {
        const result = await client.cardCheckoutCharge({
          productName: 'TestProduct',
          paymentCard: {
            number: '123456789000',
            cvvNumber: 654,
            expiryMonth: 7,
            expiryYear: 2025,
            authToken: '2345',
            countryCode: 'NG',
          },
          currencyCode: 'KES',
          amount: 50,
          narration: 'Test Payment',
          metadata: {
            id: '088930432excvmklevdf',
            name: 'John Doe',
          },
        });

        expect(result).to.have.property('status');
      });

      it('cardCheckoutValidate()', async () => {
        const result = await client.cardCheckoutValidate({
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
        expect(client.fetchProductTransactions({} as any)).to.be.rejected;
      });

      it('#fetchProductTransactions() must have productName and pageNumber/count filters', () => {
        expect(client.fetchProductTransactions({
          productName: 'TestProduct',
        } as any)).to.be.rejected;
      });

      it('#findTransaction() cannot be empty', () => {
        expect(client.findTransaction({} as any)).to.be.rejected;
      });

      it('#findTransaction() must have transactionId', () => {
        expect(client.findTransaction({
          transactionId: undefined,
        } as any)).to.be.rejected;
      });

      it('#fetchWalletTransactions() cannot be empty', () => {
        expect(client.fetchWalletTransactions({} as any)).to.be.rejected;
      });

      it('#fetchWalletTransactions() must have pageNumber/count filters', () => {
        expect(client.fetchWalletTransactions({
          filters: {
            pageNumber: '1',
          },
        } as any)).to.be.rejected;
      });
    });

    context('valid options', () => {
      it('fetchProductTransactions()', async () => {
        const result = await client.fetchProductTransactions({
          productName: 'TestProduct',
          filters: {
            pageNumber: '1',
            count: '10',
          },
        });

        expect(result).to.have.property('status');
      });

      it('findTransaction()', async () => {
        const result = await client.findTransaction({
          transactionId: 'ATPid_SampleTxnId1',
        });

        expect(result).to.have.property('status');
      });

      it('fetchWalletTransactions()', async () => {
        const result = await client.fetchWalletTransactions({
          filters: {
            pageNumber: '1',
            count: '10',
          },
        });

        expect(result).to.have.property('status');
      });

      it('fetchWalletBalance()', async () => {
        const result = await client.fetchWalletBalance();
        expect(result).to.have.property('status');
      });
    });
  });
});
