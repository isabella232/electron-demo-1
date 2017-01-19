if (navigator.userAgent.indexOf('electron') != -1)
{
	function onAccessApproved(desktop_id)
	{
		if (!desktop_id)
		{
			console.log('Desktop Capture access rejected.');
			return;
		}

		window.DESKTOP_ID = desktop_id;
		console.log("Desktop sharing started...desktop_id:" + desktop_id);
/*        
		navigator.webkitGetUserMedia(
        {
			audio: false,
			video:
            {
				mandatory:
                {
					chromeMediaSource: 'desktop',
					chromeMediaSourceId: desktop_id,
					minWidth: 1280,
					maxWidth: 1280,
					minHeight: 720,
					maxHeight: 720
				}
			}
		}, gotStream, getUserMediaError);

		function gotStream(stream)
		{
			console.log('gotStream');
		}

		function getUserMediaError(e)
		{
			console.log('getUserMediaError: ' + JSON.stringify(e, null, '---'));
		}
*/        
	}

	function receiveMessage(event)
	{
		console.log("Got message in BJN: " + JSON.stringify(event));
    
		var event_data = JSON.parse(event.data);
		if (event_data.type === 'gotScreenSharing' && event_data.sourceId)
     		{
     			console.log('Use desktop capture ID in BlueJeans = ' + event_data.sourceId);
        
			onAccessApproved(event_data.sourceId);
		}
}
	window.addEventListener("message", receiveMessage, false);

	setTimeout(function ()
	{
		console.log("Test");   

		if (window.parent)
    	{
    		var event_data = {'type':'getScreen'};

	        parent.postMessage(JSON.stringify(event_data), "*");
    	}
	}, 1000);

	window.chrome = {};
	window.chrome.runtime = {};
	window.chrome.webstore = {};
	window.chrome.webstore.install = function(){};

	window.chrome.runtime.sendMessage = function(extensionId, message, responseCallback)
	{
		console.log("Extension is " + extensionId);
		console.log("message is " + JSON.stringify(message));

		if (message && message.type && message.type === 'ping')
		{
			console.log("Got the PING!");
		
			if (responseCallback)
			{
				console.log("Run the PING callback");

				responseCallback({"type":"pong"});
			}
		}
		else if (message && message.type && message.type === 'getScreen')
		{
			console.log("Got the getScreen -- sending " + window.DESKTOP_ID );
			responseCallback({"type":"gotScreenSharing", "sourceId":window.DESKTOP_ID, "desktopMediaRequestId":0});
		}
		else
		{
			console.log('Unknown message');
		}

		return true;
	};
 
	// Used to fake the UI so it thinks the extension is installed
	var elemDiv = document.createElement('div');
	elemDiv.className = 'InMeetingExtensionIsInstalled';
	elemDiv.setAttribute('data-extension-id','nodamnmigpadbnfioofpbacngdlcidgn');
	document.body.appendChild(elemDiv);
}
