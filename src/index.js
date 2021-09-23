'use strict';
const Router = require("./lib/router");

class AuthService {
    constructor(config) {
        this.router = new Router(config);
    }

    async start(){
        try {
            this.router.start();
            return this;
        }
        catch(err) {
            throw err;
        }
    }

    async stop(){
        try {
            this.router.stop();
        }
        catch(err) {
            throw err;
        }
    }
}

module.exports = AuthService;