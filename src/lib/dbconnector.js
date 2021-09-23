'use strict';
const {Client} = require("pg");

class DBConnector {
    constructor(host, port, username, password, database) {
        this.client = new Client({
            "host": host,
            "user": username,
            "password": password,
            "database": database,
            "port": port,
        });

        this.client.connect();
    }

    async getSecrets(app_id){
        try {
            const response = await this.client.query("SELECT secret FROM organization.access_keys WHERE organization.access_keys.app_id=$1", [app_id]);
            return response.rows;
        }
        catch(err) {
            return [];
        }
    }

    close(){
        this.client.close();
    }
}

module.exports = DBConnector;