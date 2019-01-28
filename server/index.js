const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const axios = require("axios");
const qs = require("querystring");
// const client = require("./db_connection");
// const queries = require("./db_queries");
// const checkJWT = require("./middleware");
app.use(morgan("short"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

app.get("/", async (req, res) => {
    const spotify = await axios.post('https://accounts.spotify.com/api/token', qs.stringify({
        grant_type: "authorization_code",
        code: req.query.code,
        redirect_uri: 'http://localhost:3001',
        client_id: 'xx',
        client_secret: 'xx'
    }), {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    console.log(spotify.data);
    res.redirect(`http://localhost:3000/callback?access_token=${spotify.data.access_token}`);
});

const server = app.listen(
    process.env.DB_URL === undefined ? 3001 : null,
    () => {
        console.log("Server Started!");
        // app.locals.db = client;
    }
);