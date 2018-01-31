import {getLoginUserId} from './componentService/util'
import {mock} from './mock'

let test = false, handler;
if (typeof($) === 'function') {
    test = false;
} else {
    test = true;
}
handler = !test ? $ : mock;
export const get = (path, params = {}) => {
    return new Promise((resolve, reject) => {
        handler.ajax({
            type: "GET",
            url: path,
            data: params,
            success: (data) => {
                // console.log('get successfully');
                resolve(data);
            },
            error: (data) => {
                // console.log('fail to get');
                reject(data);
            },
            dataType: 'json'
        });
    })
}

export const create = (path, body) => {
    return new Promise((resolve, reject) => {
        handler.ajax({
            type: "POST",
            dataType: 'json',
            beforeSend: handler.rails.CSRFProtection,
            url: path,
            data: body,
            success: (data) => {
                // console.log('post successfully');
                resolve(data);
            },
            error: (data) => {
                // console.log('fail to post');
                reject(data);
            }
        });
    })

}

export const Ddelete = (path, body, method = 'DELETE') => {
    return new Promise((resolve, reject) => {
        handler.ajax({
            type: method,
            dataType: 'json',
            beforeSend: handler.rails.CSRFProtection,
            url: path,
            data: body,
            success: (data) => {
                // console.log('update successfully');
                resolve(data);
            },
            error: (data) => {
                // console.log('fail to update');
                reject(data);
            }
        });
    })

}


export const update = (path, body, method = 'PATCH') => {
    return new Promise((resolve, reject) => {
        handler.ajax({
            type: method,
            dataType: 'json',
            beforeSend: handler.rails.CSRFProtection,
            url: path,
            data: body,
            success: (data) => {
                // console.log('update successfully');
                resolve(data);
            },
            error: (data) => {
                // console.log('fail to update');
                reject(data);
            }
        });
    })

}


export const put = (path, body, method = 'PUT') => {
    return new Promise((resolve, reject) => {
        handler.ajax({
            type: method,
            dataType: 'json',
            beforeSend: handler.rails.CSRFProtection,
            url: path,
            data: body,
            success: (data) => {
                // console.log('update successfully');
                resolve(data);
            },
            error: (data) => {
                // console.log('fail to update');
                reject(data);
            }
        });
    })

}

// ActionCable = require('actioncable');
// ActionCable.startDebugging();
const cable = test ? '' : ActionCable.createConsumer();
export const createWS = (options = {
    channel: 'HealthChannel',
    success: () => {

    },
    fail: () => {

    },
    feedback: (data) => {

    }
}) => {
    if (!options.channel) {
        return null
    }
    let status = false;
    let mCable = ActionCable.createConsumer()
    let handler = mCable.subscriptions.create({channel: options.channel}, {
        connected() {
            console.log('message client connected');
            status = true;
            if (options.success)
                options.success()
        },
        disconnected() {
            console.log('message client disconnected');
            status = false;
        },
        received(data) {
            console.log('message client received data', data);
            if (options.feedback)
                options.feedback(data)
        }
    });
    (function (times, cable) {
        let cnt = 1;
        let mInterval = setInterval(() => {
            if (status || cnt > times) {
                clearInterval(mInterval);
                if (cnt > times) {
                    if (options.fail) {
                        options.fail();
                    }
                }
            } else {
                if (!status) {
                    cable.connection.reopen();
                }
            }
            cnt++;
        }, 2500)//normally 2.5 second should be connected
    })(3, mCable);
    return handler;
}
export const Ws = class {
    sockHandler;
    connectedCall;
    disconnectedCall;
    receiveDataCall;
    connectedFailureCall;
    connected = false;
    cache = [];

    constructor(auction) {
        let user = getLoginUserId();
        let mixin = {
            connected: () => {
                if (this.connectedCall) {
                    this.connectedCall();
                }
                this.connected = true;
                if (this.cache.length > 0) {
                    this.cache.forEach(element => {
                        this.sockHandler.perform(element.action, element.data);
                    })
                    this.cache.splice(0, this.cache.length);
                }
            },
            disconnected: () => {
                if (this.disconnectedCall) {
                    this.disconnectedCall();
                }
                this.connected = false;
            },
            received: (data) => {
                if (this.receiveDataCall) {
                    this.receiveDataCall(data);
                }
            }
        };
        this.sockHandler = cable.subscriptions.create({
            channel: 'AuctionChannel',
            auction_id: `${auction}`,
            user_id: `${user}`
        }, mixin);
        // this.tryReconnect(2000)
        this.checkConnectionLooply(3);
    }

    // tryReconnect(time) {
    //     setTimeout(() => {
    //         if (!this.connected) {
    //             cable.connection.reopen();
    //         }
    //     }, time)
    // }

    checkConnectionLooply(times) {
        let cnt = 1;
        let mInterval = setInterval(() => {
            if (this.connected || cnt > times) {
                clearInterval(mInterval);
                if (cnt > times) {
                    if (this.connectedFailureCall) {
                        this.connectedFailureCall();
                    }
                }
            } else {
                if (!this.connected) {
                    cable.connection.reopen();
                }
            }
            cnt++;
        }, 2500)//normally 2.5 second should be connected
    }

    onConnected(callback) {
        this.connectedCall = callback;
        return this;
    }

    onDisconnected(callback) {
        this.disconnectedCall = callback;
        return this;
    }

    onReceivedData(callback) {
        this.receiveDataCall = callback;
        return this;
    }

    onConnectedFailure(callback) {
        this.connectedFailureCall = callback;
        return this;
    }

    sendMessage(action, data) {
        // console.log('send', data);
        if (!this.connected) {
            cable.connection.reopen();
            this.cache.push({action, data})
            return;
        }
        this.sockHandler.perform(action, data);
    }

    stopConnect() {
        cable.subscriptions.remove(this.sockHandler);
        cable.disconnect();
        if (this.cache.length > 0) {
            this.cache.splice(0, this.cache.length);
        }
    }

}