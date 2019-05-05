const mongoose = require( 'mongoose' )
require('dotenv').config()

const dbURI = process.env.DB_HOST

mongoose.connect(dbURI, { useNewUrlParser: true })

mongoose.connection.on('connected', function () {  
  console.log('Mongoose connection open to ' + dbURI);
}); 

mongoose.connection.on('error', function (err) {  
  console.log('Mongoose connection error: ' + err);
}); 

mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose connection disconnected'); 
});

process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose connection disconnected through app termination'); 
    process.exit(0); 
  }); 
});