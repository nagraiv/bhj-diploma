/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if (!element) {
      throw new Error('Отсутствует обязательный аргумент - элемент страницы.');
    }
    this.element = element;

    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions || null);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.addEventListener('click', (event) => {
      if (event.target === this.element.querySelector('.remove-account')) {
        this.removeAccount();
      }
      // если кликнули на кнопку "удалить транзакцию" или картинку на ней
      const removeTransactionBtn = event.target.closest('.transaction__remove');
      if (removeTransactionBtn) {
        this.removeTransaction(removeTransactionBtn.dataset.id);
      }
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (this.lastOptions && confirm("Вы действительно хотите удалить счёт?")) {
      const data = new FormData();
      data.append('id', this.lastOptions.account_id);
      console.log(data);
      Account.remove( data , (err, response) => {
        console.log('TransactionPage.removeAccount -> Account.remove', err, response);
        if (err !== null) {
          console.warn(err);
        }
        if (response && response.success) {
          const accountsWidget = App.getWidget('accounts');
          accountsWidget.activeCountId = null;
          accountsWidget.update();
          App.getForm('createIncome').renderAccountsList();
          // метод renderAccountsList() обновляет список счетов сразу в двух формах: доходы и расходы
          // поэтому второй вызов не требуется
          // App.getForm('createExpense').renderAccountsList();
        } else {
          console.warn('Не получилось удалить счёт. ');
        }
      });
      this.clear();
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    if (confirm("Вы действительно хотите удалить транзакцию?")) {
      const data = new FormData();
      data.append('id', id);
      console.log(data);
      Transaction.remove(data, (err, response) => {
        console.log('TransactionPage.removeTransaction -> Transaction.remove', err, response);
        if (err !== null) {
          console.warn(err);
        }
        if (response && response.success) {
          // App.update()
          this.update();
          App.getWidget('accounts').update();
        } else {
          console.warn('Не получилось удалить транзакцию. ');
        }
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if (options && options.account_id) {
      this.lastOptions = options;
      Account.get(options.account_id, (err, response) => {
        console.log('TransactionPage.render -> Account.get', err, response);
        if (err !== null) {
          console.warn(err);
        }
        if (response && response.data) {
          this.renderTitle(response.data.name);
        }
        if (response && !response.success) {
          console.warn('Нет данных о счёте. ', response.error);
        }
      });
      Transaction.list({ 'account_id' : options.account_id }, (err, response) => {
        console.log('TransactionPage.render -> Transaction.list', err, response);
        if (err !== null) {
          console.warn(err);
        }
        if (response && response.data) {
          this.renderTransactions(response.data);
        }
        if (response && !response.success) {
          console.warn('Не удалось получить список транзакций. ', response.error);
        }
      });
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    delete this.lastOptions;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    this.element.querySelector('.content-title').textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    const dateObj = new Date(date.replace(' ', 'T'));
    return `${dateObj.toLocaleString('ru-RU', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric'
    })}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    return `<div class="transaction transaction_${item.type} row">
                <div class="col-md-7 transaction__details">
                    <div class="transaction__icon">
                        <span class="fa fa-money fa-2x"></span>
                    </div>
                    <div class="transaction__info">
                        <h4 class="transaction__title">${item.name}</h4>
                        <div class="transaction__date">${this.formatDate(item.created_at)}</div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="transaction__summ">${item.sum} <span class="currency">₽</span>
                    </div>
                </div>
                <div class="col-md-2 transaction__controls">
                    <button class="btn btn-danger transaction__remove" data-id="${item.id}">
                        <i class="fa fa-trash"></i>  
                    </button>
                </div>
            </div>`;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    const container = this.element.querySelector('.content');
    const html = data.reduce((acc, el) => acc += this.getTransactionHTML(el), '');
    container.innerHTML = '';
    container.insertAdjacentHTML('beforeend', html);
  }
}
