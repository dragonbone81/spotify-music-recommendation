const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
// const client = require("./db_connection");
// const queries = require("./db_queries");
// const checkJWT = require("./middleware");
app.use(morgan("short"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

app.get("/", async (req, res) => {
    res.json({success: true, message: 0, input: true});
});

const server = app.listen(
    process.env.DB_URL === undefined ? 3001 : null,
    () => {
        console.log("Server Started!");
        // app.locals.db = client;
    }
);