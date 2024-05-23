/**
 * @class Model
 *
 * Manages the data of the application.
 */

class Transaction {
  constructor(text, amount) {
    this.id = this.generateID();
    this.text = text;
    this.amount = amount;
  }

  generateID() {
    return Math.floor(Math.random() * 100000000);
  }
}
