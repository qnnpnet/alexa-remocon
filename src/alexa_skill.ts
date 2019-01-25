import * as express from "express";
import sendSignal from "./utils/send_signal";

const api = express.Router();

// Handles the route for echo apis
api.post("/echo", function(req, res) {
  console.log("received echo request");
  let requestBody = "";

  // Will accumulate the data
  req.on("data", function(data) {
    requestBody += data;
  });

  // Called when all data has been accumulated
  req.on("end", function() {
    let responseBody = {};
    console.log(requestBody);
    console.log(JSON.stringify(requestBody));

    // parsing the requestBody for information
    const jsonData = JSON.parse(requestBody);
    if (jsonData.request.type == "LaunchRequest") {
      // crafting a response
      responseBody = {
        version: "0.1",
        response: {
          outputSpeech: {
            type: "PlainText",
            text: "Welcome to Echo Sample! Please say a command"
          },
          card: {
            type: "Simple",
            title: "Opened",
            content: "You started the Node.js Echo API Sample"
          },
          reprompt: {
            outputSpeech: {
              type: "PlainText",
              text: "Say a command"
            }
          },
          shouldEndSession: false
        }
      };
    } else if (jsonData.request.type == "IntentRequest") {
      const command = [];
      let outputSpeechText = "ok";
      let cardContent = jsonData.request.intent.name;
      switch (cardContent) {
        case "TurnOn":
          command.push("KEY_SETTOPPOWER");
          break;
        case "TurnOff":
          command.push("KEY_SETTOPPOWER");
          break;
        case "SBS":
          command.push("KEY_5");
          command.push("KEY_OK");
          break;
        case "KBS_ONE":
          command.push("KEY_9");
          command.push("KEY_OK");
          break;
        case "KBS_TWO":
          command.push("KEY_7");
          command.push("KEY_OK");
          break;
        case "MBC":
          command.push("KEY_9");
          command.push("KEY_OK");
          break;
        case "JTBC":
          command.push("KEY_1");
          command.push("KEY_5");
          command.push("KEY_OK");
          break;
        case "TVN":
          command.push("KEY_1");
          command.push("KEY_9");
          command.push("KEY_OK");
          break;
        case "Switch":
          command.push("KEY_SOURCE");
          break;
        case "ChannelDown":
          command.push("KEY_CHANNELDOWN");
          break;
        case "ChannelUp":
          command.push("KEY_CHANNELUP");
          break;
        case "VolumeDown":
          command.push("KEY_VOLUMEDOWN");
          break;
        case "VolumeUp":
          command.push("KEY_VOLUMEUP");
          break;
        case "Mute":
          command.push("KEY_MUTE");
          break;
        case "OK":
          command.push("KEY_OK");
          break;
        case "Exit":
          command.push("KEY_EXIT");
          break;
        default:
          outputSpeechText = "I don't know what you say!";
          cardContent =
            "I don't know what you say! You said " +
            jsonData.request.intent.name;
      }

      command.forEach(function(c) {
        setTimeout(function() {
          sendSignal(c);
        }, 400);
      });

      responseBody = {
        version: "0.1",
        response: {
          outputSpeech: {
            type: "PlainText",
            text: outputSpeechText
          },
          card: {
            type: "Simple",
            title: "Open Smart Hub",
            content: cardContent
          },
          shouldEndSession: true
        }
      };
    } else {
      // Not a recognized type
      responseBody = {
        version: "0.1",
        response: {
          outputSpeech: {
            type: "PlainText",
            text: "Could not parse data"
          },
          card: {
            type: "Simple",
            title: "Error Parsing",
            content: JSON.stringify(requestBody)
          },
          reprompt: {
            outputSpeech: {
              type: "PlainText",
              text: "Say a command"
            }
          },
          shouldEndSession: false
        }
      };
    }

    res.json(responseBody);
  });
});

export default api;
