const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
let request = require('request');
// const client = require("./db_connection");
// const queries = require("./db_queries");
// const checkJWT = require("./middleware");
app.use(morgan("short"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

app.get("/", async (req, res) => {
    request.post({
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: req.query.code,
            redirect_uri: 'http://localhost:3001',
            grant_type: 'authorization_code',
            client_id: 'xx',
            client_secret: 'xx',
        },
        json: true
    }, (error, response, body) => {
        if (error) {
            res.redirect(process.env.FRONTEND_URI || 'http://localhost:3000' + '/fuckit');
        } else {
            res.redirect(process.env.FRONTEND_URI || 'http://localhost:3000' + '/callback?access_token=' + body.access_token)
        }
    });
});

const server = app.listen(
    process.env.DB_URL === undefined ? 3001 : null,
    () => {
        console.log("Server Started!");
        // app.locals.db = client;
    }
);