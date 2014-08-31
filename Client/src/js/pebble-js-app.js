//test
function ready(message)
{
	Pebble.sendAppMessage({0: 0, 1: message});
}

var IP;
// Called when JS is ready
Pebble.addEventListener("ready",
	function (e)
	{
		var getip = new XMLHttpRequest();
		getip.open('GET', 'http://blueshirtdesign.com/con/con.php?action=list&app=pebbleflix&nocallback=1', true);
		getip.onload = function (e)
		{
			if (getip.readyState == 4 && getip.status == 200)
			{
				if (getip.status == 200)
				{
					var response = JSON.parse(getip.responseText);
					IP = response[0].ip;
					ready("Connected to\n" + IP)
				}
			}
		};
		getip.send(null);
	});
// Called when incoming message from the Pebble is received
Pebble.addEventListener("appmessage",
	function (e)
	{
		console.log("Received Status: " + e.payload[0]);
		console.log("Received Message: " + e.payload[1]);
		var req = new XMLHttpRequest();
		if (e.payload[1] == "up")
		{
			req.open('GET', 'http://' + IP + ':8189/2', true);
		}
		else if (e.payload[1] == "down")
		{
			req.open('GET', 'http://' + IP + ':8189/3', true);
		}
		else
		{
			req.open('GET', 'http://' + IP + ':8189/1', true);
		}
		req.send(null);
	});