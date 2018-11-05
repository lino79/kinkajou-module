(function(context) {
	'use strict';

	if (!context.requirejs) {
		throw new Error('Import require.js!');
	}

	if (!context.requirejs.isBrowser) {
		throw new Error('Import css files only from a browser!');
	}

	// Document head
	var head = document.getElementsByTagName('head')[0];
	
	// Original RequireJs load function
	var rload = context.requirejs.load;

	function getExt(path) {
		var ext = (('' + path).match(/\.([^.]*?)(?=\?|#|$)/) || [])[1];
		return ext ? ext.toLowerCase() : undefined;
	}

	function loadCss(context, moduleName, url) {
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = url;
		link.setAttribute('data-requirecontext', context.contextName);
		link.setAttribute('data-requiremodule', moduleName);
		link.addEventListener('load', context.onScriptLoad, false);
		link.addEventListener('error', context.onScriptError, false);
		head.appendChild(link);
		return link;
	}

	function getCssUrl(url) {
		var split = url.split('?');
		url = split[0];
		url = url.substring(0, url.length - '.js'.length);
		if (split.length > 1) {
			url += '?' + split[1];
		}
		return url;
	}

	// Css patch
	context.requirejs.load = function(context, moduleName, url) {
		if (getExt(moduleName) === 'css' && getExt(url) === 'js') {
			return loadCss(context, moduleName, getCssUrl(url));
		} else {
			return rload(context, moduleName, url);
		}
	};

})(this);