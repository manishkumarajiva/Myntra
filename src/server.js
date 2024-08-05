require('dotenv').config();
const app = require('./index');
const connectDB = require('./config/database.js');
const cloudinary = require('cloudinary');

//Set PORT
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  console.log("Database Connected Successfully");
}).catch((err) => {
  console.log("Database Connection Error \n", err.message);
});



cloudinary.config({
  cloud_name: "dem0ykgrw",
  api_key: 557386554636936,
  api_secret: "pjodRfEqcY5skagSKgVrMBydw5c",
  secure: true
});


app.listen(PORT, () => console.log(`Express listening on port ${PORT}`));



// Automatic Login
// cookiesSyntex
// setcookie(name,value,expires,path,domain,secure,httpOnly)
// set time in millisecond ----->> hours,minuts,second * millisecond(1000)

// Content Security Policy (CSP)
// https://github.com/manishkumarajiva/backendProject.git






// .populate("user")
// ./populate({path : 'user', match : {isAdmin : false,}});

// ./populate({
//     path : 'userid',
//     match : {name : {$regex : '.*aditya.*', $option : 'i'}}
// })

// match: {name : {$eq : 'devagya'}} --- $ne, gte,  lte gt lt 

/* .populate({
    path : 'user',
    select : ''name',
    select : ['name','email'],
    options : {
        short : {name : 1},
        limit : 2
    }
}) */

/*--------- New Populate
    .populate({
        path : 'user', 
        populate({
        path : 'comment'
        model : 'comments',
        populate : {
            path : 'post',
            model : 'posts'
        }
    })})
 */




/*  Comparison
The following operators queries:

$eq: Values are equal
$ne: Values are not equal
$gt: Value is greater than another value
$gte: Value is greater than or equal to another value
$lt: Value is less than another value
$lte: Value is less than or equal to another value
$in: Value is matched within an array


Logical
The following operators can logically compare multiple queries.

$and: Returns documents where both queries match
$or: Returns documents where either query matches
$not: Returns documents where the query does not match
$nor: Returns documents where both queries fail to match
$xor: 

Evaluation
The following operators assist in evaluating documents.

$regex: Allows the use of regular expressions when evaluating field values
$text: Performs a text search
$where: Uses a JavaScript expression to match documents 


The following operators update

$currentDate: Sets the field value to the current date
$inc: Increments the field value
$rename: Renames the field
$set: Sets the value of a field
$unset: Removes the field from the document
Array
The following operators assist with updating arrays.

$addToSet: Adds distinct elements to an array
$pop: Removes the first or last element of an array
$pull: Removes all elements from an array that match the query
$push: Adds an element to an array

*/



/*
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/tokenRotationExample', { useNewUrlParser: true, useUnifiedTopology: true });
const userSchema = new mongoose.Schema({
  username: String,
  refreshToken: String,
});

const User = mongoose.model('User', userSchema);

// Secret key for signing tokens (replace with a secure key in production)
const secretKey = 'your-secret-key';

// Function to generate a new JWT token
function generateToken(userId) {
  return jwt.sign({ userId }, secretKey, { expiresIn: '1h' }); // Expires in 1 hour
}

// Function to handle token rotation
async function rotateToken(userId) {
  const newToken = generateToken(userId);

  // Update the user's refreshToken in the database
  await User.updateOne({ _id: userId }, { refreshToken: newToken });

  return newToken;
}

// Middleware to validate the token and update it if needed
async function validateAndRotateToken(req, res, next) {
  const token = req.headers.authorization;

  try {
    const decodedToken = jwt.verify(token, secretKey);
    const userId = decodedToken.userId;

    // Check if the user's token needs rotation (e.g., based on time or specific conditions)
    const user = await User.findById(userId);

    if (user && user.refreshToken === token) {
      const currentTime = Date.now() / 1000; // Current time in seconds

      if (decodedToken.exp - currentTime < 1800) {
        // If the token is about to expire in the next 30 minutes, rotate it
        const newToken = await rotateToken(userId);
        req.user = { userId, token: newToken };
      } else {
        // Token is still valid, proceed with the request
        req.user = { userId, token };
      }
    } else {
      // Invalid user or token, deny access
      return res.status(401).json({ message: 'Invalid token' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Example protected route using token rotation middleware
app.get('/protected', validateAndRotateToken, (req, res) => {
  res.json({ message: 'Protected route', user: req.user });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
 */