const expect = require('chai').expect;
const request = require('request');

const baseUrl = 'http://localhost:3000';


describe('Status and Content', _ => {
    describe('Landing Page', _ => {
        it('Exists', done => {
            request(baseUrl, (error, response, body) => {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });

        it('Has the right content', done => {
            request(baseUrl, (error, response, body) => {
                expect(body).to.contain('<a id="home" href="/"><h1>Africa\'s Talking</h1></a>');
                expect(body).to.contain('<a href="/sms" class="btn btn-outline-secondary">Send SMS</a>');
                expect(body).to.contain('<a href="" class="btn btn-outline-secondary">Send Airtime</a>');
                expect(body).to.contain('<a href="" class="btn btn-outline-secondary">Mobile Checkout</a>');
                expect(body).to.contain('<a href="" class="btn btn-outline-secondary">Card Checkout</a>');
                expect(body).to.contain('<a href="" class="btn btn-outline-secondary">Bank Checkout</a>');
                expect(body).to.contain('<a href="" class="btn btn-outline-secondary">Voice</a>');
                done();
            });
        });
    });

    describe('SMS Page', _ => {
        it('Exists', done => {
            request(`${baseUrl}/sms`, (error, response, body) => {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });

        it('Has the right content', done => {
            request(`${baseUrl}/sms`, (error, response, body) => {
                expect(body).to.contain('<h4>Send SMS</h4>');
                expect(body).to.contain('<form id="bulkSmsForm" action="/sms/send-bulk" method="post">');
                expect(body).to.contain('<form id="premiumSmsForm" action="/sms/send-premium" method="post">');
                done();
            });
        });
    });

});

describe('Actions', _ => {
    const bulkSms = {
        to: '+254700595009, +254714107163',
        message: 'Im a lumberjack, I sleep all day and code all night'
    }

    describe('Sending bulk SMS', _ => {
        it('Submits and redirects to the right page', done => {
            // request.post({ url: baseUrl + '/sms/send-bulk', formData: bulkSms }, (error, response, body) => {
            request.post({ url: `${baseUrl}/sms/send-bulk`, form: bulkSms, headers: {'Content-Type': 'application/json'}}, (error, response, body) => {
                expect(response.statusCode).to.equal(200);
                // test redirect to blank sms form
                expect(body).to.contain('<form id="bulkSmsForm" action="/sms/send-bulk" method="post">');
                done();
            });
        });
    });

    const premiumSms = {
        from: "23132",
        to: '+254700595009, +254714107163',
        keyword: "jdeveloper",
        linkId: "LINKID",
        retryDurationInHours: "1",
        message: 'Im a lumberjack, I sleep all day and code all night'
    }

    describe('Sending premium SMS', _ => {
        it('Submits and redirects to the right page', done => {
            // request.post({ url: baseUrl + '/sms/send-bulk', formData: bulkSms }, (error, response, body) => {
            request.post({ url: `${baseUrl}/sms/send-premium`, form: premiumSms, headers: { 'Content-Type': 'application/json' } }, (error, response, body) => {
                expect(response.statusCode).to.equal(200);
                // test redirect to blank sms form
                expect(body).to.contain('<form id="premiumSmsForm" action="/sms/send-premium" method="post">');
                done();
            });
        });
    });
});
