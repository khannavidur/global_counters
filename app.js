/*jshint multistr: true ,node: true*/
"use strict";

var
    /* NODE internal */
    UTIL                = require('util'),
    PATH                = require('path'),
    HTTP                = require('http'),
    HTTPS               = require('https'),

    /* NPM Third Party */
    EXPRESS             = require('express'),
    _                   = require('lodash'),
    MYSQL               = require('mysql'),

    /* Global Variables */
    APP                 = EXPRESS(),
    PORT                = _.get(process,'env.PORT',3000),
    CONNECTION          = MYSQL.createConnection({
        host         : 'localhost',
        user         : 'root',
        password     : '',
        database     : 'counter_engine'
    }),
    QUERY               = "SELECT * from counters";

/*
    Conencting with sql db
*/
CONNECTION.connect();

/*
    Setting http and https hits' pool size
*/
_.set(HTTP,'globalAgent.maxSockets',500);
_.set(HTTPS,'globalAgent.maxSockets',500);

/*
    creating the web server
*/
HTTP.createServer(APP)
.on('error',function(error){
    console.log('Error in creating HTTP Server', error);
    process.exit(1);
})
.listen(PORT, function(){
    console.log('Global Counter Service listening on port - ', PORT);
});

APP.get('/',function(request,response){
    console.log("welcome");
    sqlExecute(response);
});

function sqlExecute(response){ 
    CONNECTION.query(QUERY, function(err, rows, fields) {
        if (err) {
            response
                .status(500)
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
                .send();
        } else{
            console.log('The data is: ', rows);
            response
                .status(200)
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
                .send(rows);
        }      
    });
}
