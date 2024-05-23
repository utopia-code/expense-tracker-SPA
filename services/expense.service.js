/**
 * @class Service
 *
 * Manages the data of the application.
 */

class TransactionService {
  constructor() {
    this.transactions = (JSON.parse(localStorage.getItem("transactions")) || []).map(
      transaction => new Transaction(transaction.text, transaction.amount)
    );
  }

  bindTransactionListChanged(callback) {
      this.onTransactionListChanged = callback;
  }

  _commit(transactions) {
      this.onTransactionListChanged(transactions);
      localStorage.setItem("transactions", JSON.stringify(transactions));
  }

  addTransaction(text, amount) {
      this.transactions.push(new Transaction(text, amount));

      this._commit(this.transactions)
  }

  editTransaction(id, updatedAmount) {
    this.transactions = this.transactions.map((transaction) =>
      transaction.id === id 
      ? {id: transaction.id, text: transaction.text, amount: updatedAmount} 
      : transaction
    )

    this._commit(this.transactions)
  }

  deleteTransaction(id) {
    this.transactions = this.transactions.filter((transaction) => transaction.id !== id)

    this._commit(this.transactions)
  }
}
