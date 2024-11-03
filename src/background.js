var runtimeOrExtension = chrome.runtime && chrome.runtime.sendMessage ? 'runtime' : 'extension';
var imeLanguageRulesPath = 'libs/jquery.ime/';

console.log(runtimeOrExtension)

function doInCurrentTab(tabCallback) {
	chrome.tabs.query(
		{ currentWindow: true, active: true },
		function (tabArray) { tabCallback(tabArray[0]); }
	);
}

chrome[runtimeOrExtension].onMessage.addListener( function ( request, sender, sendResponse ) {
	console.log(request)
	if ( request.fileToInject !== undefined ) {
		var activeTabId;
		// doInCurrentTab( function(tab){ activeTabId = tab.id } );
		chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
			// console.log(tabs[0].url);
			// activeTabId = tabs[0].id;
			chrome.scripting.executeScript({ 
				files: [imeLanguageRulesPath + request.fileToInject],
				world: chrome.scripting.ExecutionWorld.ISOLATED,
				// args: [jQuery],
				target: {allFrames: true, tabId: tabs[0].id}
			}, function () {
				sendResponse( { 'injected': true } );
			} );
		});
		// console.log(activeTabId);
	}
	else {
		sendResponse( { 'injected': false, 'errorMessage': 'No file specified' } );
	}
	return true;
});