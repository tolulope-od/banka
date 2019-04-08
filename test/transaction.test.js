import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);
const { expect } = chai;

/* global it, describe, before */

const API_PREFIX = '/api/v1';

let authToken;
let staffAuthToken;

/**
 * @description Tests for transactions routes
 */
describe('Transaction Route', () => {
  before(done => {
    const user = {
      email: 'thor@avengers.com',
      password: 'password123'
    };
    chai
      .request(app)
      .post(`${API_PREFIX}/auth/signin`)
      .send(user)
      .end((_err, res) => {
        authToken = res.body.data.token;
        done();
      });
  });

  before(done => {
    const staff = {
      email: 'kyloren@vader.com',
      password: 'bensolo'
    };
    chai
      .request(app)
      .post(`${API_PREFIX}/auth/signin`)
      .send(staff)
      .end((_err, res) => {
        staffAuthToken = res.body.data.token;
        done();
      });
  });

  it("Should let a cashier credit a customer's account", done => {
    const creditTransaction = {
      creditAmount: 500900.05
    };
    const accountNumber = 8897654324;
    chai
      .request(app)
      .post(`${API_PREFIX}/transactions/${accountNumber}/credit`)
      .set('Authorization', staffAuthToken)
      .send(creditTransaction)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(201);
        expect(res.body).to.have.nested.property('data.transactionId');
        expect(res.body)
          .to.have.nested.property('data.transactionType')
          .eql('credit');
        expect(res.body)
          .to.have.property('message')
          .eql('Account credited successfully');
        expect(res.status).to.equal(201);
        done();
      });
  });

  it('Should not let a customer credit an account', done => {
    const creditTransaction = {
      creditAmount: 500900.05
    };
    const accountNumber = 8897654324;
    chai
      .request(app)
      .post(`${API_PREFIX}/transactions/${accountNumber}/credit`)
      .set('Authorization', authToken)
      .send(creditTransaction)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(401);
        expect(res.body)
          .to.have.property('error')
          .eql('You are not authorized to carry out that action');
        expect(res.status).to.equal(401);
        done();
      });
  });

  it('Should not credit an account that does not exist', done => {
    const creditTransaction = {
      creditAmount: 500900.05
    };
    const accountNumber = 7897654324;
    chai
      .request(app)
      .post(`${API_PREFIX}/transactions/${accountNumber}/credit`)
      .set('Authorization', staffAuthToken)
      .send(creditTransaction)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(404);
        expect(res.body)
          .to.have.property('error')
          .eql('Account does not exist');
        expect(res.status).to.equal(404);
        done();
      });
  });

  it('Should not credit an account with a negative input', done => {
    const creditTransaction = {
      creditAmount: -500900.05
    };
    const accountNumber = 8897654324;
    chai
      .request(app)
      .post(`${API_PREFIX}/transactions/${accountNumber}/credit`)
      .set('Authorization', staffAuthToken)
      .send(creditTransaction)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(400);
        expect(res.body)
          .to.have.property('error')
          .eql('Credit transaction cannot be less than 1 Naira');
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('Should not credit an account if an invalid amount is provided', done => {
    const creditTransaction = {
      creditAmount: '5sggy0d'
    };
    const accountNumber = 8897654324;
    chai
      .request(app)
      .post(`${API_PREFIX}/transactions/${accountNumber}/credit`)
      .set('Authorization', staffAuthToken)
      .send(creditTransaction)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(400);
        expect(res.body)
          .to.have.property('error')
          .eql('Transactions can only contain digits');
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('Shold not credit an account if the input is empty', done => {
    const creditTransaction = {
      creditAmount: ''
    };
    const accountNumber = 8897654324;
    chai
      .request(app)
      .post(`${API_PREFIX}/transactions/${accountNumber}/credit`)
      .set('Authorization', staffAuthToken)
      .send(creditTransaction)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(400);
        expect(res.body)
          .to.have.property('error')
          .eql('Transaction amount cannot be empty');
        expect(res.status).to.equal(400);
        done();
      });
  });
});
