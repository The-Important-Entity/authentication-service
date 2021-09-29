'use strict';

const validateToken = async function(req, res){
    const token = req.body.token;

    if (!token) {
        res.status(400).send({"error": "Unauthorized"});
        return;
    }

    try {
        const organization = this.jwt.verify(token, this.public, this.jwtSignOptions);
        res.status(200).send(organization);
    } catch (err){
        res.status(400).send({"error": "Unauthorized"});
    }
}

module.exports = validateToken;