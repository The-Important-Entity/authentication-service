'use strict';
const express = require("express");
const Requester = require("./Requester");

const validateAccessKey = require("./routes/validateAccessKey");
const postLogin = require("./routes/postLogin");
const validateToken = require("./routes/validateToken");
const path = require("path");

class Router {
    constructor(config) {
        this.app = express();
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
        this.port = config.PORT;
        this.requester = new Requester(config.DB_SERVICE);
        this.crypto = require("crypto");
        this.jwt = require("jsonwebtoken");
        this.bcrypt = require("bcrypt");

        this.app.post("/access_key", validateAccessKey.bind(this));
        this.app.post("/login", postLogin.bind(this));
        this.app.post("/token", validateToken.bin(this));

        this.test_appid = new RegExp('^[A-Z0-9]{50,}$');

        this.private = path.join(__dirname, "../../private.key", 'utf8');
        this.public = path.join(__dirname, "../../public.key", 'utf8');

        this.jwtSignOptions = {
            expiresIn:  "12h",
            algorithm:  "RS256"
        };
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