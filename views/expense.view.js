/**
 * @class View
 *
 * Visual representation of the model.
 */

class TransactionView {
  constructor() {
    this.app = this.getElement('#root')

    this.title = this.createElement('h2', 'class')
    this.title.textContent = 'Expense Tracker'

    this.container = this.createElement('div', 'container')
    this.title_balance = this.createElement('h4')
    this.title_balance.textContent = 'Your Balance'
    this.main_title = this.createElement('h1')
    this.main_title.textContent = '$0.00'
    this.main_title.id = 'balance'

    this.inc_exp_container = this.createElement('div', 'inc-exp-container')

    this.inc_container = this.createElement('div')
    this.inc_title = this.createElement('h4')
    this.inc_title.textContent = 'Income'
    this.inc_content = this.createElement('p', ['money','plus'])
    this.inc_content.id = 'money-plus'
    this.inc_content.textContent = '+$0.00'
    this.inc_container.append(this.inc_title, this.inc_content)

    this.exp_container = this.createElement('div')
    this.exp_title = this.createElement('h4')
    this.exp_title.textContent = 'Expense'
    this.exp_content = this.createElement('p', ['money','minus'])
    this.exp_content.id = 'money-minus'
    this.exp_content.textContent = '-$0.00'
    this.exp_container.append(this.exp_title, this.exp_content)

    this.inc_exp_container.append(this.inc_container, this.exp_container)

    this.title_history = this.createElement('h3')
    this.title_history.textContent = 'History'
    this.list = this.createElement('ul', 'list')
    this.list.id = 'list'

    this.title_new_transaction = this.createElement('h3')
    this.title_new_transaction.textContent = 'Add new transaction'

    this.form = this.createElement('form')
    this.form.id = 'form'

    this.form_text_container = this.createElement('div', 'form-control')
    this.label_text = this.createElement('label')
    this.label_text.setAttribute('for', 'text')
    this.label_text.textContent = 'Text'
    this.input_text = this.createElement('input')
    this.input_text.id = 'text'
    this.input_text.type = 'text'
    this.input_text.placeholder = 'Enter text...'
    this.form_text_container.append(this.label_text, this.input_text)

    this.form_amount_container = this.createElement('div', 'form-control')
    this.label_amount = this.createElement('label')
    this.label_amount.setAttribute('for', 'amount')
    this.label_amount.innerHTML = 'Amount<br>(negative - expense, positive - income)'
    this.input_amount = this.createElement('input')
    this.input_amount.id = 'amount'
    this.input_amount.type = 'number'
    this.input_amount.placeholder = 'Enter amount...'
    this.form_amount_container.append(this.label_amount, this.input_amount)

    this.submitButton = this.createElement('button', 'btn')
    this.submitButton.textContent = 'Add transaction'
    
    this.form.append(this.form_text_container, this.form_amount_container, this.submitButton)

    this.container.append(
      this.title_balance, 
      this.main_title,
      this.inc_exp_container,
      this.title_history,
      this.list,
      this.title_new_transaction,
      this.form
    )

    this.app.append(this.title, this.container)

    this._temporaryTransactionAmount = ''
    this._initLocalListeners()
  }

  get _inputText() {
    return this.input_text.value
  }

  get _inputAmount() {
    return this.input_amount.value
  }

  _resetInputText() {
    this.input_text.value = ''
  }

  _resetInputAmount() {
    this.input_amount.value = ''
  }

  createElement(tag, className) {
    const element = document.createElement(tag)

    if (className) {
      if (Array.isArray(className)) {
        element.classList.add(...className)
      } else {
        element.classList.add(className)
      }
    }

    return element
  }

  getElement(selector) {
    const element = document.querySelector(selector)

    return element
  }

  displayTransactions(transactions) {

    while (this.list.firstChild) {
      this.list.removeChild(this.list.firstChild)
    }

    if (transactions.length === 0) {
      alert('Please add a text and amount');
    } else {
      transactions.forEach(transaction => {
        const sign = transaction.amount < 0 ? '-' : '+'

        const item = this.createElement('li')
        item.classList.add(transaction.amount < 0 ? 'minus' : 'plus')
        item.id = transaction.id
        item.textContent = transaction.text

        const span = this.createElement('span')
        span.contentEditable = true;
        span.classList.add('editable');
        span.textContent = `${sign}${Math.abs(transaction.amount)}`

        const deleteButton = this.createElement('button', 'delete-btn')
        deleteButton.textContent = 'x'

        item.append(span, deleteButton)

        this.list.append(item);

      })
    }

    const amounts = transactions.map(transaction => transaction.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

    const income = amounts
      .filter(item => item > 0)
      .reduce((acc, item) => (acc += item), 0)
      .toFixed(2);

    const expense = (
      amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *
      -1
    ).toFixed(2);

    this.main_title.textContent = `$${total}`;
    this.inc_content.textContent = `$${income}`;
    this.exp_content.textContent = `$${expense}`;


    // Debugging
    console.log(transactions);
  }

  _initLocalListeners() {
    this.list.addEventListener('input', event => {
      if(event.target.className === 'editable') {
        this._temporaryTransactionAmount = event.target.innerText;
      }
    })
  }

  bindAddTransaction(handler) {
    this.form.addEventListener('submit', event => {
      event.preventDefault()

      if (this._inputText && this._inputAmount) {
        handler(this._inputText, +this._inputAmount)
        this._resetInputText()
        this._resetInputAmount()
      }

    })
  }

  bindDeleteTransaction(handler) {
    this.list.addEventListener('click', event => {
      if (event.target.className === 'delete-btn') {
        const id = parseInt(event.target.parentElement.id)
        handler(id)
      }
    })
  }

  bindEditTransaction(handler) {
    this.list.addEventListener('focusout', event => {
      if (this._temporaryTransactionAmount) {
        const id = event.target.parentElement.id
        handler(+id, +this._temporaryTransactionAmount)
        this._temporaryTransactionAmount = ''
      }
    })
  }
}
