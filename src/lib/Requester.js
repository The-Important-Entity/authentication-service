'use strict';
const axios = require("axios");

class Requester {
    constructor(url) {
        this.url = url;
    }

    async getSecrets(app_id, namespace) {
        try {
            const response = await axios.post(this.url + "/secret_key", {
                "app_id": app_id,
                "namespace": namespace
            });
        }
        catch(err) {
            return [];
        }
    }
}

module.exports = Requester;