var request = require("request");
var express = require("express");
var net = require("net");
var gui = require("nw.gui");
var exec = require("child_process").exec;

var app = express();
var win = gui.Window.get();
var server;

var tray = new gui.Tray(
{
	icon: 'icon.png'
});

var menu = new gui.Menu();
var OpenMenu = new gui.MenuItem(
{
	type: 'normal',
	label: 'About'
})
var ExitMenu = new gui.MenuItem(
{
	type: 'normal',
	label: 'Exit'
})

menu.append(OpenMenu);
menu.append(ExitMenu);
tray.menu = menu;

// win.showDevTools()

ExitMenu.click = function()
{
	server.close();
	win.close(1);
};

OpenMenu.click = function()
{
	win.show();
};

win.on('close', function()
{
	this.hide();

});

var app = express();


var net = require('net');
function getNetworkIP(callback) {
  var socket = net.createConnection(80, 'www.google.com');
  socket.on('connect', function() {
    callback(undefined, socket.address().address);
    socket.end();
  });
  socket.on('error', function(e) {
    callback(e, 'error');
  });
}




function ping()
{	
	request("http://pr.ojectblue.com/con/chost.php", function(error, response, body) 
	{
		host=body
		
		getNetworkIP(function (error, ip) 
		{
			console.log(ip);
			request("http://blueshirtdesign.com/con/con.php?action=add&host=" + host + "&ip=" + ip + "&app=pebbleflix", function(error, response, body) 
			{
			});
			
			
			//New url using zeroconf
			//request("http://desolate-ridge-4131.herokuapp.com/add/pebbleflix/" + host + "/" + ip, function(error, response, body) {});
		});
	});
}

ping()





//Setup API endpoints.
app.get('/1', function(req, res)
{
	//Press space.
	keySend("49");
	res.send('Success');
});

app.get('/2', function(req, res)
{
	//Press up key.
	keySend("126");
	res.send('Success');
});

app.get('/3', function(req, res)
{
	//Press down key.
	keySend("125");
	res.send('Success');
});

server = app.listen(8189, function() {
    console.log('Listening on port %d', server.address().port);
});

//Press a key using applescript.
function keySend(keycode)
{
	var applescript = 'tell application "System Events" to key code ' + keycode;
	var script = "osascript -e '" + applescript + "'";
	exec(script);
}


global.setInterval(function ()
{
	ping();

}, 60000);