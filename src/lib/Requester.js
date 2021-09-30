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
            return response.data
        }
        catch(err) {
            return [];
        }
    }

    async getSecretsWithoutNamespace(app_id) {
        try {
            const response = await axios.post(this.url + "/secret_key", {
                "app_id": app_id
            });
            return response.data
        }
        catch(err) {
            return [];
        }
    }

    async getOrganization(name) {
        try {
            const response = await axios.get(this.url + "/organization/" + name);
            return response.data;
        }
        catch {
            return [];
        }
    }
}

module.exports = Requester;