import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);
const { expect } = chai;

/* global it, describe */

// Test server response
describe('Server', () => {
  it('Should return a response with a message', done => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        expect(res.body)
          .to.have.property('message')
          .eql('BANKA APP API RESPONSE SUCCESSFUL');
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('Should return an error when trying to GET an undefined route', done => {
    chai
      .request(app)
      .get('/somesillyroute')
      .end((err, res) => {
        expect(res.body)
          .to.have.property('status')
          .eql(404);
        expect(res.body)
          .to.have.property('error')
          .eql('Not found');
        expect(res.status).to.equal(404);
        done();
      });
  });
});
