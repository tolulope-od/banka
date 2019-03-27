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
      .get('/test')
      .end((err, res) => {
        expect(res.body)
          .to.have.property('message')
          .eql('Response Returned Successfully');
        expect(res.status).to.equal(200);
        done();
      });
  });
});
