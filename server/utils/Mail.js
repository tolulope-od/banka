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
      subject: `Credit alert for your Banka Account: ${this.accountNumber}`,
      html: `<h3>${this.transaction.type} Alert</h3><p>Hello ${
        this.accountOwner.firstName
      }, your account was credited with ${this.transaction.amount} Naira on ${
        this.transaction.createdOn
      }. Your account balance is ${
        this.accountToCredit.balance
      } <br></p><p>Thank you for banking with us <br></p><p>Banka Inc. </p>`
    };
  }
}
