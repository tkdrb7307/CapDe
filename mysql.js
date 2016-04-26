var cheerio = require('cheerio');
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
  
	 
  connection.query("truncate weather",function(err){
  });
  
});
var url = 'http://www.kma.go.kr/wid/queryDFSRSS.jsp?zone=1144063000';
request(url, function(error, response, xml){
	if (error) {throw error};
	xml2js.parseString(xml, function(err, res){
		var xmljson = JSON.stringify(res.rss);
		var bd = res.rss.channel[0].item[0].description[0].body[0];
		var chk = 0;
		var cnt = 0;
		for( var i = 0 ; i < bd.data.length ; i++){
			if( chk == 0 && bd.data[i].hour != '3' ){
				continue;
			}
			var hour = parseInt(bd.data[i].hour,10);
			var temp = parseFloat(bd.data[i].temp);
			var reh = parseInt(bd.data[i].reh,10);
			var values = { 'temp' : temp, 'reh' : reh , 'Hour' : hour}; 
			connection.query('INSERT INTO weather SET ?', values, function(err,res){
			});
			cnt++;
			chk = 1;
			if( cnt == 8 )
				break;
		}
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
		
	});
	connection.end();
});
