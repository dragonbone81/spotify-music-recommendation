const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const request = require('request');
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3001';
const CLIENT_ID = process.env.CLIENT_ID || 'xxxx';
const CLIENT_SECRET = process.env.CLIENT_SECRET || 'xxxx';
app.use(morgan("short"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json({url: CLIENT_URL})
});
app.get("/login", async (req, res) => {
    request.post({
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: req.query.code,
            redirect_uri: `${SERVER_URL}/login`,
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
        },
        json: true
    }, (error, response, body) => {
        console.log(body, `${SERVER_URL}/login`);
        if (error) {
            res.redirect(CLIENT_URL + '/fuckit');
        } else {
            res.redirect(`${CLIENT_URL}/callback?access_token=${body.access_token}&refresh_token=${body.refresh_token}`)
        }
    });
});
app.get("/refresh", async (req, res) => {
    request.post({
        url: 'https://accounts.spotify.com/api/token',
        form: {
            refresh_token: req.query.refresh_token,
            grant_type: 'refresh_token',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
        },
        json: true
    }, (error, response, body) => {
        if (error) {
            res.json({ohShit: ':('});
        } else {
            res.json({access_token: body.access_token});
        }
    });
});

app.listen(process.env.PROD === undefined ? 3001 : null);