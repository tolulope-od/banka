export default class Mail {
  constructor(transaction, accountOwner, accountNumber, accountToCredit) {
    this.transaction = transaction;
    this.accountOwner = accountOwner;
    this.accountNumber = accountNumber;
    this.accountToCredit = accountToCredit;
  }

  getMailOptions() {
    return {
      from: 'transactions@banka.com',
      to: `${this.accountOwner.email}`,
      subject: `${this.transaction.type.toUpperCase()} alert for your Banka Account: ${
        this.accountNumber
      }`,
      html: `<h3>${this.transaction.type.toUpperCase()} Alert</h3><p>Hello ${
        this.accountOwner.firstName
      }, your account was credited with <bold>₦${this.transaction.amount}</bold> on ${
        this.transaction.createdOn
      }. Your account balance is <bold>₦${
        this.accountToCredit.balance
      }</bold> <br></p><p>Thank you for banking with us <br></p><p> © Banka Inc. </p> <p>https://banka-app.herokuapp.com</p>`
    };
  }
}
