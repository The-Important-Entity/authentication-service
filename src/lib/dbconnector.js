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
        const response = await this.client.query("select secret from organization.access_keys where organization.access_keys.app_id=$1", [app_id]);
        return response.rows;
    }

    close(){
        this.client.close();
    }
}

module.exports = DBConnector;