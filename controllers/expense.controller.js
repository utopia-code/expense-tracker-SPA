/**
 * @class Controller
 *
 * Links the user input and the view output.
 *
 * @param model
 * @param view
 */

class TransactionController {
  constructor(service, view) {
    this.service = service
    this.view = view

    this.service.bindTransactionListChanged(this.onTransactionListChanged);
    this.view.bindAddTransaction(this.handleAddTransaction);
    this.view.bindDeleteTransaction(this.handleDeleteTransaction);
    this.view.bindEditTransaction(this.handleEditTransaction);
    this.onTransactionListChanged(this.service.transactions);
  }

  onTransactionListChanged = (transactions) => {
    this.view.displayTransactions(transactions)
  }

  handleAddTransaction = (transactionText, transactionAmount) => {
    this.service.addTransaction(transactionText, transactionAmount);
  };

  handleDeleteTransaction = id => {
    this.service.deleteTransaction(id);
  };

  handleEditTransaction = (id, transactionAmount) => {
    this.service.editTransaction(id, transactionAmount);
  };
}
