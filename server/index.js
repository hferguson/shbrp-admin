const express = require("express");
const app = express();
const routes = require('./routes/api');
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config('.env');	// Expect .env in server directory
const port = process.env.PORT || 5000;

// small note on strings in .env: remove the quotes.  Bad idea. that's what cost me 2 hrs today
console.log(`db URL: ${process.env.DB}`);
mongoose
  .connect(process.env.DB, {auth:{
    username: process.env.dbUser,
    password: process.env.dbPwd
}})
  .then(() => console.log(`Database connected successfully`))
  .catch((err) => console.log(err));

// Since mongoose's Promise is deprecated, we override it with Node's Promise
// Todo: Understand the above sentence better
mongoose.Promise = global.Promise;

// This is instead of explicitly defining the CORS headers.
app.use(cors());
// I think this is instead of bodyParser.json()
app.use(express.json());


// The api.js defines all the responses to our requests
app.use('/api', routes);


// Anything that doesn't fit the above will give an error
app.use((err, req, res, next) => {
  console.log(req);
  console.log(err);
  next();
});

app.listen(port, () => {
  // perform a database connection when server starts
  
  console.log(`Server is running on port: ${port}`);
});

