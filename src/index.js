require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');

//Create App
const app = express();
const routes = require('./routes/index.api.js');

//Handle JSON
app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.use(cookieParser(process.env.SECRET_KEY,{httpOnly : true}));

//Handle Logger and CORS
app.use(morgan('dev'));
app.use(cors('*'));

//Set Path
app.use("/uploads",express.static('uploads'));


//Testing Routes
app.get("/",function(req,res){
    res.send(`<h1> Welcome Express's Home Page </h1>`);
});

app.use('/',routes);


const VoiceResponse = require('twilio').twiml.VoiceResponse;

// app.post('/voice', (request, response) => {
//   const twiml = new VoiceResponse();
//   twiml.say('To get to your extraction point, get on your bike and go down ' +
//   'the street. Then Left down an alley. Avoid the police cars. Turn left ' +
//   'into an unfinished housing development. Fly over the roadblock. Go ' +
//   'passed the moon.');
//   response.type('text/xml');
//   response.send(twiml.toString());
// });

module.exports = app;
