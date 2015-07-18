var request = require("request");
var express = require("express");
var net = require("net");
var gui = require("nw.gui");
var exec = require("child_process").exec;
var robot = require("robotjs");

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

//Ping zeroconf server every minute using Node.js timers.
global.setInterval(function()
{
	ping();

}, 60000);

ping();

//Setup API endpoints.
app.get('/1', function(req, res)
{
	//Press space.
	robot.keyTap("space");
	res.send('Success');
});

app.get('/2', function(req, res)
{
	//Press up key.
	robot.keyTap("up");
	res.send('Success');
});

app.get('/3', function(req, res)
{
	//Press down key.
	robot.keyTap("down");
	res.send('Success');
});

//Start API Server
server = app.listen(8189, function()
{
	console.log('Listening on port %d', server.address().port);
});

//Press a key using applescript.
function keySend(keycode)
{
	var applescript = 'tell application "System Events" to key code ' + keycode;
	var script = "osascript -e '" + applescript + "'";
	exec(script);
}

//Get external IP.
function getNetworkIP(callback)
{
	var socket = net.createConnection(80, 'www.google.com');
	socket.on('connect', function()
	{
		callback(undefined, socket.address().address);
		socket.end();
	});
	socket.on('error', function(e)
	{
		callback(e, 'error');
	});
}

//Ping zeroconf server.
function ping()
{
	request("http://blueshirtdesign.com/con/chost.php", function(error, response, body)
	{
		host = body

		getNetworkIP(function(error, ip)
		{
			request("http://blueshirtdesign.com/con/con.php?action=add&host=" + host + "&ip=" + ip + "&app=pebbleflix", function(error, response, body) {});

		});
	});
}