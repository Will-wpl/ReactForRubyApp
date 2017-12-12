import {getLoginUserId} from './componentService/util'
import {mock} from './mock'
const test = false;
const handler = !test ? $ : mock;
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
export const createWS = (auction, methods = {}) => {
    if(test){
        return;
    }
    const cable = ActionCable.createConsumer();
    let user = getLoginUserId();
    // console.log(auction, cable);
    let handler = cable.subscriptions.create({
        channel: 'AuctionChannel',
        auction_id: auction.toString(),
        user_id:user.toString()
    }, {
        connected() {
            // console.log('---message client connected ---');
            handler.perform('check_in', {user_id: user});
        },
        disconnected() {

        },
        received(data) {
            // console.log('---message client received data ---', data);
        }
    });
    return handler;
}
export const Ws = class {
    sockHandler;
    connectedCall;
    disconnectedCall;
    receiveDataCall;
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
                if(this.cache.length > 0){
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
            received:(data) => {
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
            } else {
                if (!this.connected) {
                    cable.connection.reopen();
                }
            }
            cnt ++;
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

    sendMessage(action, data) {
        // console.log('send', data);
        if (!this.connected) {
            cable.connection.reopen();
            this.cache.push({action,data})
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