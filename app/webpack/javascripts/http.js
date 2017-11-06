
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

export const Ws = class {
    ActionCable = require('actioncable');
    sockHandler;
    cable;
    connectedCall;
    disconnectedCall;
    receiveDataCall;
    constructor(port, auction, methods = {}) {
        this.cable = ActionCable.createConsumer(`ws://localhost:${port}/cable`);
        let user = document.getElementById('user_id');
        let mixin = {
            connected: () => {
                this.sockHandler.checkIn({user_id: user});
                if (this.connectedCall) {
                    this.connectedCall();
                }
            },
            disconnected: () => {
                if (this.disconnectedCall) {
                    this.disconnectedCall();
                }
            },
            received:(data) => {
                if (this.receiveDataCall) {
                    this.receiveDataCall(data);
                }
            },
            checkIn: (params) => {
                return this.sockHandler.perform('check_in', params);
            }
            // normal channel code goes here...
        };
        for (let method in methods) {
            mixin[method] = methods[method];
        }
        this.sockHandler = this.cable.subscriptions.create({
            channel: 'AuctionChannel',
            auction_id: auction,
            user_id: user
        }, mixin);

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
        this.sockHandler.perform(action, data);
    }

    close() {
        this.cable.subscriptions.remove(this.sockHandler);
    }

}