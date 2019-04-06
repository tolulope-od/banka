import chai from 'chai';
import { isEmpty } from '../server/validation/authValidation';

const { expect } = chai;

/* global it, describe */

/**
 * @description test for helper function
 */
describe('Account model', () => {
  it('Should return true for an empty string', () => {
    const emptyString = isEmpty(' ');
    expect(emptyString).to.equal(true);
  });
});
