'use strict';
const express = require("express");
const Requester = require("./Requester");
const crypto = require("crypto")

class Router {
    constructor(config) {
        this.app = express();
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
        this.port = config.PORT;
        this.requester = new Requester(config.DB_SERVICE);

        this.app.post("/access_key", this.validateAccessKey.bind(this));

        this.test_appid = new RegExp('^[A-Z0-9]{50,}$')
    }

    async validateAccessKey(req, res) {
        try {
            const auth_token = req.body.auth_token;
            const namespace = req.body.namespace;
            const method = req.body.method;
            const url = req.body.url;
            const date = req.body.date;
            const nonce = req.body.nonce;

            if (!auth_token || !method || !url || !date || !nonce || !namespace){
                res.status(400).send("Bad Input");
                return;
            }

            const arr = auth_token.split(":");
            if (arr.length != 2) {
                res.status(400).send("Bad Input");
                return;
            }
            const app_id = arr[0];
            if (!this.test_appid.test(app_id)) {
                res.status(400).send("Bad Input");
                return;
            }
            const hash = arr[1];

            const secrets = await this.requester.getSecrets(app_id, namespace);
            if (!secrets || secrets.length == 0) {
                res.status(200).send("Unauthorized");
                return;
            }

            for (var i = 0; i < secrets.length; i++){
                const str = method + '\n' + url + '\n' + date + '\n' + nonce + '\n' + app_id
                const new_hash = crypto.createHmac('sha256', secrets[i].secret).update(str).digest('hex');

                if (new_hash == hash) {
                    res.status(200).send("Authorized");
                    return;
                }
            }
            res.status(200).send("Unauthorized");
        }
        catch(err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
    }

    start() {
        try {
            this.server = this.app.listen(this.port, function(){
                console.log("Auth Service listening on port " + this.port.toString());
            }.bind(this));
        }
        catch(err) {
            throw(err);
        }
    }

    stop(){
        try {
            this.server.close();
            this.dbconn.close();
        }
        catch(err) {
            throw err;
        }
    }
}

module.exports = Router;