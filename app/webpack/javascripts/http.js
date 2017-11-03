
export const get = (path, params = {}) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: path,
            data: params,
            success: (data) => {
                console.log('get successfully');
                resolve(data);
            },
            error: (data) => {
                console.log('fail to get');
                reject(data);
            },
            dataType: 'json'
        });
    })
}

export const create = (path, body) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            dataType: 'json',
            beforeSend: $.rails.CSRFProtection,
            url: path,
            data: body,
            success: (data) => {
                console.log('post successfully');
                resolve(data);
            },
            error: (data) => {
                console.log('fail to post');
                reject(data);
            }
        });
    })

}

export const update = (path, body, method = 'PATCH') => {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: method,
            dataType: 'json',
            beforeSend: $.rails.CSRFProtection,
            url: path,
            data: body,
            success: (data) => {
                console.log('update successfully');
                resolve(data);
            },
            error: (data) => {
                console.log('fail to update');
                reject(data);
            }
        });
    })

}