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
      if (response) {
        App.getModal( 'createAccount' ).close();
        App.getForm('createAccount').element.reset();
        App.update();
      }
    });
  }
}
