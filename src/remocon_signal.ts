import * as FauxMo from "fauxmojs";
import * as express from "express";
import sleep from "./utils/sleep";
import sendSignal from "./utils/send_signal";

const api = express.Router();

// WEMO virtual device
const fauxMo = new FauxMo({
  devices: [
    {
      name: "tv",
      port: 11000,
      handler: action => {
        console.log("tv action:", action);
        sendSignal("KEY_SETTOPPOWER");
      }
    }
  ]
});

api.get("/", (req, res) => {
  return res.render("index");
});

// Handles the route for echo apis
api.post("/signal", (req, res) => {
  if (req.query.commands) {
    console.log("commands", req.query.commands);
    const commands = req.query.commands.split(",");
    commands.forEach(async command => {
      sendSignal(command);
      await sleep(200);
    });
    return res.status(200).end();
  }
  return res.status(401).send("Missing parameter");
});

export default api;
