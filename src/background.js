var runtimeOrExtension = chrome.runtime && chrome.runtime.sendMessage ? 'runtime' : 'extension';
var imeLanguageRulesPath = 'libs/jquery.ime/';

chrome[runtimeOrExtension].onMessage.addListener( function ( request, sender, sendResponse ) {
	if ( request.fileToInject !== undefined ) {
		chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
			chrome.scripting.executeScript({ 
				files: [imeLanguageRulesPath + request.fileToInject],
				world: chrome.scripting.ExecutionWorld.ISOLATED,
				target: {allFrames: true, tabId: tabs[0].id}
			}, function () {
				sendResponse( { 'injected': true } );
			} );
		});
	}
	else {
		sendResponse( { 'injected': false, 'errorMessage': 'No file specified' } );
	}
	return true;
});