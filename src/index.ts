import * as express from "express";
import * as http from "http";
import api from "./app";

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

// Creates the website server on the port #
server.listen(port, function() {
  console.log("Server listening at port %d", port);
});

// configure Express
app.set("views", __dirname + "/views");
app.set("view engine", "html");

// Express Routing
app.use(express.static(__dirname + "/../public"));
app.engine("html", require("ejs").renderFile);

app.use("/api", api);
