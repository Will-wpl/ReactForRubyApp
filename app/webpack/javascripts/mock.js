export const mock = {
    ajax: (params) => {
        if (params.success) {
            params.success(getDataByUrl(params.url))
        }
        if (params.error) {
            params.error({})
        }
    },
    rails : {CSRFProtection:''}
}

const getDataByUrl = (url) => {
    switch(url) {
        case '/api/':
            return {};
        default:
            return null;
    }
}