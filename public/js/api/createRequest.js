/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    if (options.method.toUpperCase() === 'GET' && options.data) {
        let first = true;
        for ([key, value] of Object.entries(options.data)) {
            if (first) {
                options.url += '?';
                first = false;
            } else {
                options.url += '&';
            }
            options.url += `${key}=${value}`;
        }
    }
    console.log(options.url, options.data);

    xhr.open(options.method, options.url);
    xhr.responseType = options.responseType;

    xhr.onload = () => {
        try {
            const result = xhr.response;
            options.callback(null, result);
        } catch (e) {
            options.callback(e, null);
        }
    };

    xhr.onerror = () => {
        console.warn('Ошибка соединения!');
    };

    if (options.method.toUpperCase() === 'GET') {
        xhr.send();
    } else {
        xhr.send(options.data);
    }

};
