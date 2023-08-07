/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    let requestUrl = options.url;
    let requestData = options.data || null;
    let result = null;
    let error = null;
    xhr.onload = () => {
        result = xhr.response;
        options.callback(error, result);
    };
    xhr.onerror = () => {
        // console.warn('Ошибка соединения!');
        error = new Error('Ошибка соединения!');
        options.callback(error, result);
    };

    if (options.method.toUpperCase() === 'GET' && requestData) {
        let first = true;
        for ([key, value] of Object.entries(requestData)) {
            if (first) {
                requestUrl += '?';
                first = false;
            } else {
                requestUrl += '&';
            }
            requestUrl += `${key}=${value}`;
        }
        requestData = null;
    }
    // console.log('options.method & options.url & options.data: ', options.method, options.url, options.data);
    // console.log('requestUrl & requestData: ', requestUrl, requestData);

    if (options.responseType) {
        xhr.responseType = options.responseType;
    }
    try {
        xhr.open(options.method, requestUrl);
        xhr.send(requestData);
    }
    catch (err) {
        error = err;
        options.callback(error, result);
    }
};
