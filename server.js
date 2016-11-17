var express = require('express')
, app = express()
, server = require('http').createServer(app)
, port = process.env.PORT || 2002
, fs = require('fs')
, util = require('util');
var http = require('http');
var exec = require('child_process').exec;
var async = require('asyncawait/async');
var await = require('asyncawait/await');

// Creates the website server on the port #
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

// Express Routing
app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);

// Helper function to format the strings so that they don't include spaces and are all lowercase
var FormatString = function(string)
{
  var lowercaseString = string.toLowerCase();
  var formattedString = lowercaseString.replace(/\s/g,'');
  return formattedString;
};

function sleep(ms) {
  return new Promise(function(r) {
    setTimeout(r, ms);
  });
}

var sendCommand = function(command) {
  console.log("command:", command);
  http.get("http://qnnp.net:2002/api/remocon?command=" + command);
};

// Handles the route for echo apis
app.post('/api/echo', function(req, res){
  console.log("received echo request");
  var requestBody = "";

  // Will accumulate the data
  req.on('data', function(data){
    requestBody+=data;
  });

  // Called when all data has been accumulated
  req.on('end', function(){
    var responseBody = {};
    console.log(requestBody);
    // console.log(JSON.stringify(requestBody));

    // parsing the requestBody for information
    var jsonData = JSON.parse(requestBody);
    if (jsonData.request.type == "LaunchRequest") {
      // crafting a response
      responseBody = {
        "version": "0.1",
        "response": {
          "outputSpeech": {
            "type": "PlainText",
            "text": "Welcome to Echo Sample! Please say a command"
          },
          "card": {
            "type": "Simple",
            "title": "Opened",
            "content": "You started the Node.js Echo API Sample"
          },
          "reprompt": {
            "outputSpeech": {
              "type": "PlainText",
              "text": "Say a command"
            }
          },
          "shouldEndSession": false
        }
      };
    } else if (jsonData.request.type == "IntentRequest") {
      var command = [];
      var outputSpeechText = "ok";
      var cardContent = jsonData.request.intent.name;
      if (jsonData.request.intent.name == "TurnOn") {
        command.push("KEY_SETTOPPOWER");
      } else if (jsonData.request.intent.name == "TurnOff") {
        command.push("KEY_SETTOPPOWER");
      } else if (jsonData.request.intent.name == "SBS") {
        command.push("KEY_5");
        command.push("KEY_OK");
      } else if (jsonData.request.intent.name == "KBS_ONE") {
        command.push("KEY_9");
        command.push("KEY_OK");
      } else if (jsonData.request.intent.name == "KBS_TWO") {
        command.push("KEY_7");
        command.push("KEY_OK");
      } else if (jsonData.request.intent.name == "MBC") {
        command.push("KEY_9");
        command.push("KEY_OK");
      } else if (jsonData.request.intent.name == "JTBC") {
        command.push("KEY_1");
        command.push("KEY_5");
        command.push("KEY_OK");
      } else if (jsonData.request.intent.name == "TVN") {
        command.push("KEY_1");
        command.push("KEY_9");
        command.push("KEY_OK");
      } else if (jsonData.request.intent.name == "Switch") {
        command.push("KEY_SOURCE");
      } else if (jsonData.request.intent.name == "ChannelDown") {
        command.push("KEY_CHANNELDOWN");
      } else if (jsonData.request.intent.name == "ChannelUp") {
        command.push("KEY_CHANNELUP");
      } else if (jsonData.request.intent.name == "VolumeDown") {
        command.push("KEY_VOLUMEDOWN");
      } else if (jsonData.request.intent.name == "VolumeUp") {
        command.push("KEY_VOLUMEUP");
      } else if (jsonData.request.intent.name == "Mute") {
        command.push("KEY_MUTE");
      } else if (jsonData.request.intent.name == "OK") {
        command.push("KEY_OK");
      } else if (jsonData.request.intent.name == "Exit") {
        command.push("KEY_EXIT");
      } else {
        outputSpeechText = "I don't know what you say!";
        cardContent = "I don't know what you say! You said " + jsonData.request.intent.name;
      }

      for(var i = 0; i < command.length; i++) {
        var c = command[i];
        sleep(400).then(function() {
          sendCommand(c);
        });

        // async(function() {
        //   await sleep(400);
        //   sendCommand(c);
        // });
      }

      responseBody = {
          "version": "0.1",
          "response": {
            "outputSpeech": {
              "type": "PlainText",
              "text": outputSpeechText
            },
            "card": {
              "type": "Simple",
              "title": "Open Smart Hub",
              "content": cardContent
            },
            "shouldEndSession": true
          }
        };
    } else {
      // Not a recognized type
      responseBody = {
        "version": "0.1",
        "response": {
          "outputSpeech": {
            "type": "PlainText",
            "text": "Could not parse data"
          },
          "card": {
            "type": "Simple",
            "title": "Error Parsing",
            "content": JSON.stringify(requestBody)
          },
          "reprompt": {
            "outputSpeech": {
              "type": "PlainText",
              "text": "Say a command"
            }
          },
          "shouldEndSession": false
        }
      };
    }

    res.statusCode = 200;
    res.contentType('application/json');
    console.log("responseBody", responseBody);
    res.send(responseBody);
  });
});
