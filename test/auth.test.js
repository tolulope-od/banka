import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);
const { expect } = chai;

/* global it, describe */

const API_PREFIX = '/api/v1/auth';

/**
 * @description Test for sign up endpoint
 */
describe('User', () => {
  it('Should register a new user', done => {
    const newUser = {
      firstName: 'Darth',
      lastName: 'Vader',
      email: 'darth@theempire.com',
      password: 'empireRulez',
      password2: 'empireRulez'
    };
    chai
      .request(app)
      .post(`${API_PREFIX}/signup`)
      .send(newUser)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(201);
        expect(res.body).to.have.property('data');
        expect(res.body)
          .to.have.property('message')
          .eql('User registered successfully');
        expect(res.status).to.equal(201);
        done();
      });
  });

  it('Should register a new user', done => {
    const newUser = {
      firstName: 'Severus',
      lastName: 'Snape',
      email: 'snape@hogwarts.com',
      password: 'mischiefmanaged',
      password2: 'mischiefmanaged'
    };
    chai
      .request(app)
      .post(`${API_PREFIX}/signup`)
      .send(newUser)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(201);
        expect(res.body).to.have.property('data');
        expect(res.body)
          .to.have.property('message')
          .eql('User registered successfully');
        expect(res.status).to.equal(201);
        done();
      });
  });

  it('Should not register a new user with an empty first name field', done => {
    const newUser = {
      firstName: '',
      lastName: 'MarVell',
      email: 'captain@marvel.com',
      password: 'quantum',
      password2: 'quantum'
    };
    chai
      .request(app)
      .post(`${API_PREFIX}/signup`)
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

  it('Should not register a user with an empty last name field', done => {
    const newUser = {
      firstName: 'Carol',
      lastName: '',
      email: 'carol@marvell.com',
      password: 'quantom1',
      password2: 'quantom2'
    };
    chai
      .request(app)
      .post(`${API_PREFIX}/signup`)
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

  it('Should not register a user with an empty email field', done => {
    const newUser = {
      firstName: 'Bon',
      lastName: 'Iver',
      email: '',
      password: '715creeks',
      password2: '715creeks'
    };
    chai
      .request(app)
      .post(`${API_PREFIX}/signup`)
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

  it('Should not register a user with an empty password field', done => {
    const newUser = {
      firstName: 'Bon',
      lastName: 'Iver',
      email: 'boniver@creeks.com',
      password: '',
      password2: '715Creeks'
    };
    chai
      .request(app)
      .post(`${API_PREFIX}/signup`)
      .send(newUser)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(400);
        expect(res.body)
          .to.have.property('error')
          .eql('Password is required');
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('Should not register a user without matching passwords', done => {
    const newUser = {
      firstName: 'Bon',
      lastName: 'Iver',
      email: 'boniver@creeks.com',
      password: '715Creeks',
      password2: 'creeks'
    };
    chai
      .request(app)
      .post(`${API_PREFIX}/signup`)
      .send(newUser)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(400);
        expect(res.body)
          .to.have.property('error')
          .eql('Passwords must match');
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('Should not register a user with an existing email address', done => {
    const newUser = {
      firstName: 'Thor',
      lastName: 'Odinson',
      email: 'thor@avengers.com',
      password: 'password123',
      password2: 'password123'
    };
    chai
      .request(app)
      .post(`${API_PREFIX}/signup`)
      .send(newUser)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(409);
        expect(res.body)
          .to.have.property('error')
          .eql('User already exists');
        expect(res.status).to.equal(409);
        done();
      });
  });

  it('Should not register a new user with empty input fields', done => {
    const newUser = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      password2: ''
    };
    chai
      .request(app)
      .post(`${API_PREFIX}/signup`)
      .send(newUser)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(400);
        expect(res.body)
          .to.have.property('error')
          .eql('All fields are required');
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('Should not register a new user with an invalid email', done => {
    const newUser = {
      firstName: 'Marshall',
      lastName: 'Matters',
      email: 'eminem',
      password: 'superman1',
      password2: 'superman1'
    };
    chai
      .request(app)
      .post(`${API_PREFIX}/signup`)
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

  it('Should not register a new user with an invalid password length', done => {
    const newUser = {
      firstName: 'Marshall',
      lastName: 'Matters',
      email: 'eminem@eminem.com',
      password: 'supes',
      password2: 'supes'
    };
    chai
      .request(app)
      .post(`${API_PREFIX}/signup`)
      .send(newUser)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(400);
        expect(res.body)
          .to.have.property('error')
          .eql('Password must be at least 6 characters long');
        expect(res.status).to.equal(400);
        done();
      });
  });

  it('Should not register a new user with if confirm password field is missing', done => {
    const newUser = {
      firstName: 'Marshall',
      lastName: 'Matters',
      email: 'eminem@eminem.com',
      password: 'superman123',
      password2: ''
    };
    chai
      .request(app)
      .post(`${API_PREFIX}/signup`)
      .send(newUser)
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(400);
        expect(res.body)
          .to.have.property('error')
          .eql('Confirm password field is required');
        expect(res.status).to.equal(400);
        done();
      });
  });
});
