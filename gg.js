var cheerio = require('cheerio');
var array = require('node-array');
var request = require('request');
var xml2js = require('xml2js');
var mysql = require('mysql');
var fs = require('fs');
var connection = mysql.createConnection({
	host: 'localhost',
	port : 3306,
	user: 'root',
	password: 'wldhel92!@',
	database: 'ssg'
});

connection.connect(function(err, results) {
  if(err) {
    console.log('Connection Error: ' + error.message);
  }
});

connection.query("SELECT * from weather", function(err,rows){
	var mydata = [['HOUR','temp', 'reh'] ];
	var data = [];
	for( var i = 0 ; i < rows.length ; i++){
		data.push(rows[i].HOUR);
		data.push(rows[i].temp);
		data.push(rows[i].reh);
		mydata.push(data);
		data = [];
	}
	fs.readFile('./graph.html', 'utf8', function(err, data ){
		var graph = data.split('<mydata>');
		fs.writeFile('./newgraph.html', graph[0] + JSON.stringify(mydata) + graph[1] , function(err){
		});
	});
});
connection.end();
