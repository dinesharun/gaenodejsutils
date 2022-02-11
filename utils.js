const tts = require('@google-cloud/text-to-speech');
const fs  = require('fs');
const utl = require('util');
var adm = null;

async function getSynthAud(req, res) {
  /* get Text to speech state */
  const ttsSt = await adm.getConfigVal("ttsState");

  /* Check if allowed */
  if(ttsSt == true) {
    const ttsClient = new tts.TextToSpeechClient({projectId: 'dinesarunblog', keyFilename: "./utils/dinesharunblog-4c137a60af35.json"});
  
    const ttsText = req.query.ttst;
    const ttsLang = ((req.query.ttsl === undefined) ? ('en-IN') : (req.query.ttsl));
    const ttsGndr = ((req.query.ttsg === undefined) ? ('FEMALE') : (req.query.ttsg));
  
    const request = {
     input: {text: ttsText},
     voice: {languageCode: ttsLang, ssmlGender: ttsGndr},
     audioConfig: {audioEncoding: 'MP3'}
    };
  
    const [response] = await ttsClient.synthesizeSpeech(request);
     res.writeHead(200, {
              'Content-Type': 'audio/mp3',
              'Content-Length': response.audioContent.length
          });
     res.write(response.audioContent);
     res.end();
  } else {
    /* Reply as failure */
    res.status(403);
    res.send("Not allowed");
  }
}

/* ------ Exports of this utils app ------ */
module.exports = {
  /* ------ Function to initialize the utils app ------ */
  initApp: function(app, express, admin) {
    /* Initialize the session related things */
    app.use(express.json());

    /* Route the get synthesised audio requests */
    app.get("/getSynthAud", (req, res) => {
      getSynthAud(req, res);
    });

    /* Save reference */
    adm = admin;
  }
};
