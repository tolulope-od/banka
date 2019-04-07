import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);
const { expect } = chai;

/* global it, describe, before */

const API_PREFIX = '/api/v1';

let authToken;
let staffAuthToken;
const fakeAuthToken = 'jkkjkjkksdugvydy_.kdhdyuuuwll';
/**
 * @description Test for accounts endpoint
 */
describe('Account Route', () => {
  before(done => {
    const user = {
      email: 'thor@avengers.com',
      password: 'password123'
    };
    chai
      .request(app)
      .post(`${API_PREFIX}/auth/signin`)
      .send(user)
      .end((err, res) => {
        authToken = res.body.data.token;
        done();
      });
  });

  before(done => {
    const staff = {
      email: 'obiwan@therebellion.com',
      password: 'password1'
    };
    chai
      .request(app)
      .post(`${API_PREFIX}/auth/signin`)
      .send(staff)
      .end((err, res) => {
        staffAuthToken = res.body.data.token;
        done();
      });
  });

  it('Should create an account for a new user', done => {
    const newAccount = {
      type: 'savings'
    };
    chai
      .request(app)
      .post(`${API_PREFIX}/accounts`)
      .set('Authorization', authToken)
      .send(newAccount)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(201);
        expect(res.body).to.have.nested.property('data.accountNumber');
        expect(res.body)
          .to.have.property('message')
          .eql('Account created successfully');
        expect(res.status).to.equal(201);
        done();
      });
  });

  it('Should not create an account for a staff', done => {
    const newAccount = {
      type: 'current'
    };
    chai
      .request(app)
      .post(`${API_PREFIX}/accounts`)
      .set('Authorization', staffAuthToken)
      .send(newAccount)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(401);
        expect(res.body)
          .to.have.property('error')
          .eql('Only clients can create accounts');
        expect(res.status).to.equal(401);
        done();
      });
  });

  it('Should not create an account when the type is not specified', done => {
    const newAccount = {
      type: ''
    };
    chai
      .request(app)
      .post(`${API_PREFIX}/accounts`)
      .set('Authorization', authToken)
      .send(newAccount)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .to.eq(400);
        expect(res.body)
          .to.have.property('error')
          .to.eql('Account type is required');
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('Should not create an account when an invalid type is specified', done => {
    const newAccount = {
      type: 'credit'
    };
    chai
      .request(app)
      .post(`${API_PREFIX}/accounts`)
      .set('Authorization', authToken)
      .send(newAccount)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(400);
        expect(res.body)
          .to.have.property('error')
          .to.eql('Account type can only be either savings or current');
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('Should fetch all accounts for an authorized customer', done => {
    chai
      .request(app)
      .get(`${API_PREFIX}/accounts`)
      .set('Authorization', authToken)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(200);
        done();
      });
  });

  it('Should fetch all accounts under the bank for an authorized staff', done => {
    chai
      .request(app)
      .get(`${API_PREFIX}/accounts`)
      .set('Authorization', staffAuthToken)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(200);
        done();
      });
  });

  it('Should not allow a non-logged in user fetch accounts', done => {
    chai
      .request(app)
      .get(`${API_PREFIX}/accounts`)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(403);
        expect(res.body)
          .to.have.property('error')
          .eql('Unauthorized! You must be logged in for that');
        expect(res.status).to.equal(403);
        done();
      });
  });

  it('Should not allow a user with fake authentication fetch accounts', done => {
    chai
      .request(app)
      .get(`${API_PREFIX}/accounts`)
      .set('Authorization', fakeAuthToken)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(401);
        expect(res.body)
          .to.have.property('error')
          .eql('Token is invalid');
        done();
      });
  });

  it("Should edit an account's status when a staff accesses the route", done => {
    const newStatus = {
      status: 'dormant'
    };
    const accountNumber = 5563847290;
    chai
      .request(app)
      .patch(`${API_PREFIX}/accounts/${accountNumber}`)
      .set('Authorization', staffAuthToken)
      .send(newStatus)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(200);
        expect(res.body).to.have.nested.property('data.accountNumber');
        expect(res.status).to.equal(200);
        done();
      });
  });

  it("Should not edit an account's status if a non-staff user accesses the route", done => {
    const newStatus = {
      status: 'dormant'
    };
    const accountNumber = 5563847290;
    chai
      .request(app)
      .patch(`${API_PREFIX}/accounts/${accountNumber}`)
      .set('Authorization', authToken)
      .send(newStatus)
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

  it("Should not edit an account's status if the account number is more than 10 digits", done => {
    const newStatus = {
      status: 'dormant'
    };
    const accountNumber = 556384729990;
    chai
      .request(app)
      .patch(`${API_PREFIX}/accounts/${accountNumber}`)
      .set('Authorization', staffAuthToken)
      .send(newStatus)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(400);
        expect(res.body)
          .to.have.property('error')
          .eql('Account number must be 10 digits');
        expect(res.status).to.equal(400);
        done();
      });
  });

  it("Should not edit an account's status if a status is not provided", done => {
    const newStatus = { status: '' };
    const accountNumber = 5563847290;
    chai
      .request(app)
      .patch(`${API_PREFIX}/accounts/${accountNumber}`)
      .set('Authorization', staffAuthToken)
      .send(newStatus)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(400);
        expect(res.body)
          .to.have.property('error')
          .eql('Please specify a status, either active or dormant');
        expect(res.status).to.equal(400);
        done();
      });
  });

  it("Should not edit an account's status if an invalid status is provided", done => {
    const newStatus = { status: 'lkdlskl' };
    const accountNumber = 5563847290;
    chai
      .request(app)
      .patch(`${API_PREFIX}/accounts/${accountNumber}`)
      .set('Authorization', staffAuthToken)
      .send(newStatus)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(400);
        expect(res.body)
          .to.have.property('error')
          .eql('Status can only be active or dormant');
        expect(res.status).to.equal(400);
        done();
      });
  });

  it("Should not deactivate an account that's already deactived", done => {
    const newStatus = { status: 'dormant' };
    const accountNumber = 5563847290;
    chai
      .request(app)
      .patch(`${API_PREFIX}/accounts/${accountNumber}`)
      .set('Authorization', staffAuthToken)
      .send(newStatus)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(409);
        expect(res.body)
          .to.have.property('error')
          .eql('Account is already dormant');
        expect(res.status).to.equal(409);
        done();
      });
  });

  it('Should return an error for an invalid account number', done => {
    const newStatus = { status: 'dormant' };
    const accountNumber = '553s847290';
    chai
      .request(app)
      .patch(`${API_PREFIX}/accounts/${accountNumber}`)
      .set('Authorization', staffAuthToken)
      .send(newStatus)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(400);
        expect(res.body)
          .to.have.property('error')
          .eql('Account number can only contain digits');
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('Should return an error message when an account that does not exist is requested', done => {
    const newStatus = {
      status: 'dormant'
    };
    const accountNumber = 5563847299;
    chai
      .request(app)
      .patch(`${API_PREFIX}/accounts/${accountNumber}`)
      .set('Authorization', staffAuthToken)
      .send(newStatus)
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

  it('Should get a single account by the account number', done => {
    const accountNumber = 8897654324;
    chai
      .request(app)
      .get(`${API_PREFIX}/accounts/${accountNumber}`)
      .set('Authorization', staffAuthToken)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(200);
        expect(res.body).to.have.nested.property('data.accountNumber');
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('Should not get a non-existing single account', done => {
    const accountNumber = 5563847299;
    chai
      .request(app)
      .get(`${API_PREFIX}/accounts/${accountNumber}`)
      .set('Authorization', staffAuthToken)
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

  it('Should not get a single account record if the number is not an integer', done => {
    const accountNumber = '553s847290';
    chai
      .request(app)
      .get(`${API_PREFIX}/accounts/${accountNumber}`)
      .set('Authorization', staffAuthToken)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(400);
        expect(res.body)
          .to.have.property('error')
          .eql('Account number can only contain digits');
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('Should not get a single account if the account number is more than 10 digits', done => {
    const accountNumber = 556384729990;
    chai
      .request(app)
      .get(`${API_PREFIX}/accounts/${accountNumber}`)
      .set('Authorization', staffAuthToken)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(400);
        expect(res.body)
          .to.have.property('error')
          .eql('Account number must be 10 digits');
        expect(res.status).to.equal(400);
        done();
      });
  });
});
