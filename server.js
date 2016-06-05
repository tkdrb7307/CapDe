var express = require('express');
var app = express();
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'qwer1234',
    database: 'myDB'
});


connection.connect(function(err, results){
    if(err)
        console.log('Connection Error: ' + err.message);
    else 
        console.log('Database Connected!');
    connection.query("truncate myTABLE",function(err){
    });
});
app.get('/',function( req,res ){
    var time = getTIME();
    var co2 = parseInt(req.query.co2);
    var tempe = parseFloat(req.query.tempe);
    var humi =  parseFloat(req.query.humi);
    console.log(req.query);

    var values = { 'TEMPE' : tempe, 'CO2' : co2, 'HUMI' : humi ,'TIME' : time };
    connection.query('INSERT INTO myTABLE SET ?', values, function(err,res){
    });

    //var DI = 0.72*(tempe+humi) + 40.6;
    //res.send('0');
    
    if(tempe <= 25.0)
        res.send('0');
    else if(tempe <= 26.0)
        res.send('1');
    else if(tempe <= 27.0)
        res.send('2');
    else 
        res.send('3');   
});

app.get('/table',function(req,res ){
     
    
     connection.query("SELECT * from myTABLE", function(err,rows){
     console.log(rows);
     });
});

app.listen(3000, function(){
    console.log("access");
});
function getTIME( ){
    var date = new Date();

    var hour = date.getHours();
    var inthour = parseInt(hour) + 9;
    if( inthour >= 24 )
        inthour -= 24;
    hour = inthour.toString();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    return  hour + ":" + min + ":" + sec;
}
