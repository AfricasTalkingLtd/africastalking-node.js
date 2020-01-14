import express, { Application } from 'express';
import { expect } from 'chai';
import axios, { AxiosResponse } from 'axios';
import AfricasTalking from '../../src';
import { validCredentials } from '../fixtures';

describe('USSD', () => {
  const screens = {
    main: 'Welcome to Nat Oil \n1: For account info \n2: For lost gas cylinder',
    accountInfo: 'You are John Doe, registered on 01 Jan 2020',
    lostGasCylinder: 'To recover lost gas cylinder, call +2547XXXXXXXX',
    invalidOption: 'Invalid Option',
  };

  const handler = (params: any, next: Function): void => {
    let endSession = false;
    let msg = '';

    switch (params.text) {
      case '': msg = screens.main; break;
      case '1': msg = screens.accountInfo; endSession = true; break;
      case '2': msg = screens.lostGasCylinder; endSession = true; break;
      default: msg = screens.invalidOption; endSession = true; break;
    }

    next({ response: msg, endSession });
  };

  const expectStandardResponse = (result: AxiosResponse): void => {
    expect(result.headers['content-type']).to.match(/text\/plain/i);
    expect(result.status).to.equal(200);
    expect(result.data).to.match(/^(CON)|(END)/);
  };

  let app: Application;
  let server: any;
  const port = 3010;
  const axiosInstance = axios.create({
    baseURL: `http://localhost:${port}`,
  });

  const ussd = AfricasTalking(validCredentials).USSD;

  before(() => {
    app = express();

    app.post('/webhook/ussd', ussd(handler));
    server = app.listen(port, (err) => {
      if (err) {
        throw err;
      }
    });
  });

  after(() => {
    server.close();
  });

  it('shows screen: main', async () => {
    const result = await axiosInstance.post('/webhook/ussd', {
      text: '',
    });

    expectStandardResponse(result);
    expect(result.data).to.equal(`CON ${screens.main}`);
  });

  it('shows screen: account info', async () => {
    const result = await axiosInstance.post('/webhook/ussd', {
      text: '1',
    });

    expectStandardResponse(result);
    expect(result.data).to.equal(`END ${screens.accountInfo}`);
  });

  it('shows screen: lost gas cylinder', async () => {
    const result = await axiosInstance.post('/webhook/ussd', {
      text: '2',
    });

    expectStandardResponse(result);
    expect(result.data).to.equal(`END ${screens.lostGasCylinder}`);
  });

  it('shows screen: invalid option', async () => {
    const result = await axiosInstance.post('/webhook/ussd', {
      text: '20',
    });

    expectStandardResponse(result);
    expect(result.data).to.equal(`END ${screens.invalidOption}`);
  });
});
