/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
class User {
  static URL = '/user';
      /**
   * Устанавливает текущего пользователя в
   * локальном хранилище.
   * */
  static setCurrent(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Удаляет информацию об авторизованном
   * пользователе из локального хранилища.
   * */
  static unsetCurrent() {
    localStorage.removeItem('user');
  }

  /**
   * Возвращает текущего авторизованного пользователя
   * из локального хранилища
   * */
  static current() {
    return JSON.parse(localStorage.getItem('user'));
  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch(callback) {
    console.log('User.fetch');
    createRequest({
      url: this.URL + '/current',
      method: 'GET',
      responseType: 'json',
      data: User.current(),
      callback: (err, response) => {
        console.log('User.fetch', response);
        if (err !== null) {
          console.warn(err);
        }
        if (response && response.user) {
          this.setCurrent(response.user);
        }
        if (!response?.success) {
          this.unsetCurrent();
        }
        callback();
      }
    });
  }

  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static login(data, callback) {
    console.log('User.login', data);
    createRequest({
      url: this.URL + '/login',
      method: 'POST',
      responseType: 'json',
      data,
      callback: (err, response) => {
        console.log('User.login', err, response);
        if (err !== null) {
          console.warn(err);
        }
        if (response && response.user) {
          this.setCurrent(response.user);
          callback();
        }
        if (response && !response.success) {
          console.warn('Авторизация провалена. ', response.error);
        }
        App.getForm('login').element.reset();
      }
    });
  }

  /**
   * Производит попытку регистрации пользователя.
   * После успешной регистрации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register(data, callback) {
    console.log('User.register', data);
    createRequest({
      url: this.URL + '/register',
      method: 'POST',
      responseType: 'json',
      data,
      callback: (err, response) => {
        console.log('User.register', err, response);
        if (err !== null) {
          console.warn(err);
        }
        if (response && response.user) {
          this.setCurrent(response.user);
          callback();
        }
        if (response && !response.success) {
          console.warn('Регистрация пользователя невозможна. ', response.error);
        }
        App.getForm('register').element.reset();
      }
    });
  }

  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout(callback) {
    console.log('User.logout');
    createRequest({
      url: this.URL + '/logout',
      method: 'POST',
      responseType: 'json',
      data: '',
      callback: (err, response) => {
        console.log('User.logout', response);
        if (err !== null) {
          console.warn(err);
        }
        if (response.success) {
          this.unsetCurrent();
          callback();
        } else {
          console.warn('Произошла ошибка. ', response.error);
        }
      }
    });
  }
}
