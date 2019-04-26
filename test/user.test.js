import '@babel/polyfill';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);
const { expect } = chai;

/* global it, describe, before */

const API_PREFIX = '/api/v1';

let authToken;
let staffAuthToken;
let nonAdminStaffAuthToken;

describe('User Routes', () => {
  before(done => {
    const user = {
      email: 'thor@avengers.com',
      password: 'password1'
    };
    chai
      .request(app)
      .post(`${API_PREFIX}/auth/signin`)
      .send(user)
      .end((err, res) => {
        authToken = res.body.data[0].token;
        done();
      });
  });

  before(done => {
    const staff = {
      email: 'obiwan@therebellion.com',
      password: 'password123'
    };
    chai
      .request(app)
      .post(`${API_PREFIX}/auth/signin`)
      .send(staff)
      .end((err, res) => {
        staffAuthToken = res.body.data[0].token;
        done();
      });
  });

  before(done => {
    const staff = {
      email: 'kyloren@vader.com',
      password: 'password123'
    };
    chai
      .request(app)
      .post(`${API_PREFIX}/auth/signin`)
      .send(staff)
      .end((err, res) => {
        nonAdminStaffAuthToken = res.body.data[0].token;
        done();
      });
  });

  it('Should fetch all accounts owned by a user (staff)', done => {
    const userEmail = 'olegunnar@manutd.com';
    chai
      .request(app)
      .get(`${API_PREFIX}/user/${userEmail}/accounts`)
      .set('Authorization', staffAuthToken)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(200);
        expect(res.body).to.have.property('data');
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('Should respond with an error when trying to get accounts for non-existing user (staff)', done => {
    const userEmail = 'notreal@user.com';
    chai
      .request(app)
      .get(`${API_PREFIX}/user/${userEmail}/accounts`)
      .set('Authorization', staffAuthToken)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(404);
        expect(res.body)
          .to.have.property('error')
          .eql('User not found');
        expect(res.status).to.equal(404);
        done();
      });
  });

  it('Should only fetch all accounts owned by a user (client)', done => {
    const userEmail = 'thor@avengers.com';
    chai
      .request(app)
      .get(`${API_PREFIX}/user/${userEmail}/accounts`)
      .set('Authorization', authToken)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(200);
        expect(res.body).to.have.property('data');
        expect(res.status).to.equal(200);
        done();
      });
  });

  it("Should not fetch accounts owned by a user if they don't own them", done => {
    const userEmail = 'olegunnar@manutd.com';
    chai
      .request(app)
      .get(`${API_PREFIX}/user/${userEmail}/accounts`)
      .set('Authorization', authToken)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(403);
        expect(res.body)
          .to.have.property('error')
          .eql('You are not authorized to carry out that action');
        expect(res.status).to.equal(403);
        done();
      });
  });

  it("Should return an error message the user's email is invalid", done => {
    const userEmail = 'olegunnar@manutd';
    chai
      .request(app)
      .get(`${API_PREFIX}/user/${userEmail}/accounts`)
      .set('Authorization', authToken)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(400);
        expect(res.body)
          .to.have.property('error')
          .eql('Please provide a valid email address');
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('Should upgrade a client to a staff', done => {
    const userToUpdate = {
      userEmail: 'olegunnar@manutd.com'
    };
    chai
      .request(app)
      .patch(`${API_PREFIX}/user`)
      .set('Authorization', staffAuthToken)
      .send(userToUpdate)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(200);
        expect(res.body)
          .to.have.nested.property('data[0].type')
          .eql('staff');
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('Should not allow a staff to be changed to a staff again', done => {
    const userToUpdate = {
      userEmail: 'olegunnar@manutd.com'
    };
    chai
      .request(app)
      .patch(`${API_PREFIX}/user`)
      .set('Authorization', staffAuthToken)
      .send(userToUpdate)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(409);
        expect(res.body)
          .to.have.property('error')
          .eql('User is already a staff');
        expect(res.status).to.equal(409);
        done();
      });
  });

  it('Should return an error if the user being upgraded does not exist', done => {
    const userToUpdate = {
      userEmail: 'olesgunnars@manutd.com'
    };
    chai
      .request(app)
      .patch(`${API_PREFIX}/user`)
      .set('Authorization', staffAuthToken)
      .send(userToUpdate)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(404);
        expect(res.body)
          .to.have.property('error')
          .eql('User not found');
        expect(res.status).to.equal(404);
        done();
      });
  });

  it('Should return an error if a non-admin user tries to upgrade a user to a staff', done => {
    const userToUpdate = {
      userEmail: 'olegunnar@manutd.com'
    };
    chai
      .request(app)
      .patch(`${API_PREFIX}/user`)
      .set('Authorization', nonAdminStaffAuthToken)
      .send(userToUpdate)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(403);
        expect(res.body)
          .to.have.property('error')
          .eql('You are not allowed to carry out that action');
        expect(res.status).to.equal(403);
        done();
      });
  });

  it('Should return an error if no email is provided', done => {
    const userToUpdate = {
      userEmail: ' '
    };
    chai
      .request(app)
      .patch(`${API_PREFIX}/user`)
      .set('Authorization', nonAdminStaffAuthToken)
      .send(userToUpdate)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(400);
        expect(res.body)
          .to.have.property('error')
          .eql('User email is required');
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('Should return an error if the email is wrongly formatted', done => {
    const userToUpdate = {
      userEmail: 'olegunnarmanu'
    };
    chai
      .request(app)
      .patch(`${API_PREFIX}/user`)
      .set('Authorization', nonAdminStaffAuthToken)
      .send(userToUpdate)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(400);
        expect(res.body)
          .to.have.property('error')
          .eql('Please provide a valid email address');
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('Should return an error if the request body unnecessary keys', done => {
    const userToUpdate = {
      userEmail: 'olegunnar@manu.com',
      notNeeded: 'something'
    };
    chai
      .request(app)
      .patch(`${API_PREFIX}/user`)
      .set('Authorization', nonAdminStaffAuthToken)
      .send(userToUpdate)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(400);
        expect(res.body)
          .to.have.property('error')
          .eql('Only the user email is required');
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('Should create a new staff', done => {
    const newUser = {
      firstName: 'Clark',
      lastName: 'Kent',
      email: 'notsuperman@test.com'
    };
    chai
      .request(app)
      .post(`${API_PREFIX}/users`)
      .set('Authorization', staffAuthToken)
      .send(newUser)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(201);
        expect(res.body)
          .to.have.nested.property('data[0].type')
          .eql('staff');
        expect(res.status).to.equal(201);
        done();
      });
  });

  it('Should create a new staff', done => {
    const newUser = {
      admin: true,
      firstName: 'Bruce',
      lastName: 'Wayne',
      email: 'realbatman@wayne.com'
    };
    chai
      .request(app)
      .post(`${API_PREFIX}/users`)
      .set('Authorization', staffAuthToken)
      .send(newUser)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(201);
        expect(res.body)
          .to.have.nested.property('data[0].type')
          .eql('staff');
        expect(res.status).to.equal(201);
        done();
      });
  });

  it('Should not create a new staff if the user is a not an admin', done => {
    const newUser = {
      admin: false,
      firstName: 'Bruce',
      lastName: 'Wayne',
      email: 'realbatman@wayne.com'
    };
    chai
      .request(app)
      .post(`${API_PREFIX}/users`)
      .set('Authorization', nonAdminStaffAuthToken)
      .send(newUser)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(401);
        expect(res.body)
          .to.have.property('error')
          .eql('You are not allowed to carry out that action');
        expect(res.status).to.equal(401);
        done();
      });
  });

  it('Should not create a new staff if the email already exists', done => {
    const newUser = {
      admin: false,
      firstName: 'Bruce',
      lastName: 'Wayne',
      email: 'realbatman@wayne.com'
    };
    chai
      .request(app)
      .post(`${API_PREFIX}/users`)
      .set('Authorization', staffAuthToken)
      .send(newUser)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(409);
        expect(res.body)
          .to.have.property('error')
          .eql('Staff already exists');
        expect(res.status).to.equal(409);
        done();
      });
  });

  it('Should not create a new staff if the email field is empty', done => {
    const newUser = {
      admin: false,
      firstName: 'Bruce',
      lastName: 'Wayne',
      email: ''
    };
    chai
      .request(app)
      .post(`${API_PREFIX}/users`)
      .set('Authorization', staffAuthToken)
      .send(newUser)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(400);
        expect(res.body)
          .to.have.property('error')
          .eql('Email is required');
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('Should not create a new staff if the first name field is empty', done => {
    const newUser = {
      admin: false,
      firstName: '',
      lastName: 'Wayne',
      email: 'something@email.com'
    };
    chai
      .request(app)
      .post(`${API_PREFIX}/users`)
      .set('Authorization', staffAuthToken)
      .send(newUser)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(400);
        expect(res.body)
          .to.have.property('error')
          .eql('First name is required');
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('Should not create a new staff if the last name field is empty', done => {
    const newUser = {
      admin: false,
      firstName: 'Bruce',
      lastName: '',
      email: 'something@email.com'
    };
    chai
      .request(app)
      .post(`${API_PREFIX}/users`)
      .set('Authorization', staffAuthToken)
      .send(newUser)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(400);
        expect(res.body)
          .to.have.property('error')
          .eql('Last name is required');
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('Should not create a new staff if all the required fields are empty', done => {
    const newUser = {
      firstName: '',
      lastName: '',
      email: ''
    };
    chai
      .request(app)
      .post(`${API_PREFIX}/users`)
      .set('Authorization', staffAuthToken)
      .send(newUser)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(400);
        expect(res.body)
          .to.have.property('error')
          .eql('Please enter all required fields');
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('Should not create a new staff if the email field is empty', done => {
    const newUser = {
      admin: false,
      firstName: 'Bruce',
      lastName: 'Wayne',
      email: 'notemail'
    };
    chai
      .request(app)
      .post(`${API_PREFIX}/users`)
      .set('Authorization', staffAuthToken)
      .send(newUser)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(400);
        expect(res.body)
          .to.have.property('error')
          .eql('Please provide a valid email address');
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('Should not create a new staff if the admin value is not a boolean', done => {
    const newUser = {
      admin: 'lol',
      firstName: 'Bruce',
      lastName: 'Wayne',
      email: 'email@isreal.com'
    };
    chai
      .request(app)
      .post(`${API_PREFIX}/users`)
      .set('Authorization', staffAuthToken)
      .send(newUser)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(400);
        expect(res.body)
          .to.have.property('error')
          .eql('Please specify true or false for admin');
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('Should not create a new staff if the first name contains non-alphabets', done => {
    const newUser = {
      firstName: 'Cla77rk',
      lastName: 'Kent',
      email: 'notsuperman@test.com'
    };
    chai
      .request(app)
      .post(`${API_PREFIX}/users`)
      .set('Authorization', staffAuthToken)
      .send(newUser)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(400);
        expect(res.body)
          .to.have.property('error')
          .eql('First name can only contain alphabets');
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('Should not create a new staff if the last name contains non-alphabets', done => {
    const newUser = {
      firstName: 'Clark',
      lastName: '====00',
      email: 'notsuperman@test.com'
    };
    chai
      .request(app)
      .post(`${API_PREFIX}/users`)
      .set('Authorization', staffAuthToken)
      .send(newUser)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(400);
        expect(res.body)
          .to.have.property('error')
          .eql('Last name can only contain alphabets');
        expect(res.status).to.equal(400);
        done();
      });
  });
});
