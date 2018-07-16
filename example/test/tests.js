var expect = require('chai').expect;
var request = require('request');

describe('Status and Content', _ => {
    describe('Landing Page', _ => {
        it('Exists', done => {
            request('http://localhost:3000', (error, response, body) => {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });

        it('Has the right content', done => {
            request('http://localhost:3000', (error, response, body) => {
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
            request('http://localhost:3000/sms', (error, response, body) => {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });

        it('Has the right content', done => {
            request('http://localhost:3000/sms', (error, response, body) => {
                expect(body).to.contain('<h4>Send SMS</h4>');
                expect(body).to.contain('<form id="bulkSmsForm" action="/sms/send-bulk" method="post">');
                expect(body).to.contain('<form id="premiumSmsForm" action="/sms/send-premium" method="post">');
                done();
            });
        });
    });

});
