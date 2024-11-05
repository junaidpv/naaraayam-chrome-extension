var runtimeOrExtension = chrome.runtime && chrome.runtime.sendMessage ? 'runtime' : 'extension';
var imeLanguageRulesPath = 'libs/jquery.ime/';

chrome[runtimeOrExtension].onMessage.addListener( function ( request, sender, sendResponse ) {
	if ( request.fileToInject !== undefined ) {
		chrome.scripting.executeScript({
			files: [imeLanguageRulesPath + request.fileToInject],
			world: chrome.scripting.ExecutionWorld.ISOLATED,
			target: {allFrames: true, tabId: sender.tab.id}
		}, function () {
			sendResponse( { 'injected': true } );
		} );
	}
	else {
		sendResponse( { 'injected': false, 'errorMessage': 'No file specified' } );
	}
	return true;
});