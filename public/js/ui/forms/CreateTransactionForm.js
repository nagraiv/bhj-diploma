/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    Account.list(
      User.current(),
      (err, response) => {
        console.log('CreateTransactionForm.renderAccountsList -> Account.list', err, response);
        if (err !== null) {
          console.warn(err);
        }
        if (response && response.data) {
          const selectIncome = document.getElementById('income-accounts-list');
          const selectExpense = document.getElementById('expense-accounts-list');
          selectIncome.innerHTML = '';
          selectExpense.innerHTML = '';
          response.data.forEach(account => {
            selectIncome.insertAdjacentHTML('beforeend', `<option value="${account.id}">${account.name}</option>`);
            selectExpense.insertAdjacentHTML('beforeend', `<option value="${account.id}">${account.name}</option>`);
          });
        }
        if (response && !response.success) {
          console.warn('Не удалось получить список счетов. ', response.error);
        }
      }
    );

  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      console.log('CreateTransactionForm.onSubmit -> Transaction.create', err, response);
      if (err !== null) {
        console.warn(err);
      }
      if (response && response.success) {
        App.getModal( 'newIncome' ).close();
        App.getModal( 'newExpense' ).close();
        App.getForm('createIncome').element.reset();
        App.getForm('createExpense').element.reset();
        App.update();
      } else {
        console.warn('Не удалось добавить транзакцию. ', response.error);
      }
    });
  }
}
