/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
class CreateAccountForm extends AsyncForm {
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно в случае успеха, а также вызывает App.update()
   * и сбрасывает форму
   * */
  onSubmit(data) {
    Account.create(data, (err, response) => {
      console.log('CreateAccountForm.onSubmit -> Account.create', err, response);
      if (err !== null) {
        console.warn(err);
      }
      if (response && response.success) {
        App.getModal( 'createAccount' ).close();
        App.getForm('createAccount').element.reset();
        // новый счёт сразу делаем активным и настраиваем отображение страницы транзакций
        App.getWidget('accounts').activeCountId = response.account.id;
        App.getPage('transactions').lastOptions = { account_id: response.account.id };
        App.update();
      } else {
        console.warn('Ошибка создания счёта: ', response?.error);
      }
    });
  }
}
