

if (process.platform=="darwin")
{
	var applescript = require("applescript");
}



var send = function(keycode) 
{
	if (process.platform=="darwin")
	{
		var script = 'tell application "System Events" to key code ' + keycode;
		applescript.execString(script, function(err, rtn){});	
	}

};

exports.send = send;