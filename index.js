'use strict';

exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

		 
    if (event.session.application.applicationId !== "Application ID") {
        context.fail("Invalid Application ID");
    }

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // add any session init logic here
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId
        + ", sessionId=" + session.sessionId);

    var cardTitle = "Welcome"
    var speechOutput = 'willkommen im Herman Hollerith Zentrum. Du kannst nach kaffeemaschine fragen: sage einfach wie mache ich kaffee, gibt es noch kaffee oder wie alt ist der kaffee';
    callback(session.attributes,
        buildSpeechletResponse(cardTitle, speechOutput, "", false));
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId
        + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // dispatch custom intents to handlers here
    if (intentName == 'anleitung') {
        handleTestRequest(intent, session, callback);
    } else if (intentName == 'ThermosIntent') {
        getLiquidHeightFromThermos(intent, session, callback);
    } else if (intentName == 'wasser')  {
                handleTestRequest1(intent, session, callback);
    }
    else if (intentName == 'alt')  {
                handleTestRequest2(intent, session, callback);
    }
    {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // Add any cleanup logic here
}

function handleTestRequest(intent, session, callback) {
    var speechOutput = 'Kaffee am HHZ zu kochen ist ganz einfach. Fülle zwei Liter Wasser von oben in die Kaffeemaschine. Gib 1-2 Messlöffel Kaffeepulver in den Filter und betätige den Kippschalter. '+
    'Wenn der Kaffee durchgelaufen ist, musst du nur noch den Pumpspender an die Kaffeekanne anbringen. Das war’s. Das schaffst du schon. ' ;
    callback(session.attributes,
        buildSpeechletResponseWithoutCard(speechOutput, "", 'true'));
}

// Getting DATA
const https = require("https");
function getLiquidHeightFromThermos(intent, session, callback) {
      
    https.get('Your IP (localtunnel IP)', res => {
      res.setEncoding("utf8");
      let body = "";
      res.on("data", data => {
        body += data;
      });
      res.on("end", () => {
        body = JSON.parse(body);
        callback(session.attributes,
            buildSpeechletResponseWithoutCard(body, "", 'true'));
      });
    });
}

// FN Number of Cups

const roundTo = require('round-to');
const https = require("https");
function getNumCups (intent, session, callback) {
    var weight = 3000;     
    const empty  = 1700;
    const  cup = 200 ;
    roundTo(data, 0);
    var data;
    data = (weight - empty) / cup;
    var speechOutput = 'data';
    callback(session.attributes,
    buildSpeechletResponseWithoutCard(speechOutput ,"", 'true')
    )
} 


function handleTestRequest1(intent, session, callback) {
    var speechOutput = 'es sind noch +"data"' ;
    callback(session.attributes,
        buildSpeechletResponseWithoutCard(speechOutput, "", 'true'));
}

function handleTestRequest2(intent, session, callback) {
    var speechOutput = 'der kaffee wurde heute morgen  gekocht' ;
    callback(session.attributes,
        buildSpeechletResponseWithoutCard(speechOutput, "", 'true'));
}


// ------- Helper functions to build responses -------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}
```
