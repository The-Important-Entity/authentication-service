'use strict';

const postLogin = async function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        res.status(400).send({"error": "Missing username or password"});
        return;
    }
    try {
        const organizations = await this.requester.getOrganization(username);
        if (organizations.length != 1) {
            res.status(500).send({"error": "Internal Server Error"});
            return;
        }
        const org = organizations[0];
        console.log(org);
        if (await this.bcrypt.compare(password, org.password)){
            // ACCESS GRANTED
            const payload = {
                organization: username
            }
            const token = this.jwt.sign(payload, this.private, this.jwtSignOptions);
            res.status(200).send({"token": token});
        }
        else {
            res.status(400).send({"error": "Unauthorized"});
        }  
    }
    catch(err) {
        res.status(400).send({"error": "Unauthorized"});
    }
}

module.exports = postLogin;