/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if (!element) {
      throw new Error('Отсутствует обязательный аргумент - элемент виджета.');
    }
    this.element = element;
    this.activeCountId = null;

    this.registerEvents();
    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    this.element.querySelector('.create-account').addEventListener('click', function(e) {
      App.getModal('createAccount').open();
    });

    this.element.addEventListener('click', (e) => {
      e.preventDefault();
      // e.stopPropagation();
      const accountEl = e.target.closest('.account');
      if (accountEl) {
        this.onSelectAccount(accountEl);
      }
    });
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    Account.list(
        User.current(),
        (err, response) => {
          console.log('AccountsWidget.update -> Account.list', err, response);
          if (err !== null) {
            console.warn(err);
          }
          this.clear();
          if (response && response.data) {
            this.renderItem(response.data);
          }
          if (response && !response.success) {
            console.warn('Не удалось получить список счетов. ', response.error);
          }
        }
    );
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const accountList = [...this.element.querySelectorAll('.account')];
    accountList.forEach(el => el.remove());
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount( element ) {
    this.element.querySelector('.active')?.classList.remove('active');
    this.activeCountId = element.dataset.id;
    element.classList.add('active');
    App.showPage( 'transactions', { account_id: element.dataset.id });
    // в формах создания доходов и расходов активный счёт будет выбран по умолчанию
    App.getForm('createExpense').renderAccountsList();
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item){
    return `<li class="account ${item.id === this.activeCountId ? 'active' : ''}" data-id="${item.id}">
                <a href="#">
                    <span>${item.name}</span> /
                    <span>${item.sum}</span>  ₽
                </a>
            </li>`;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data){
    const html = data.reduce((acc, el) => acc += this.getAccountHTML(el), '');
    this.element.insertAdjacentHTML('beforeend', html);
  }
}
