/*
	App framework version 0.1 2013-08-28
	Created by Andreas Nylin andreas.nylin@gmail.com
*/
var App = new function () {
	var _modules = {},
		_readyHandlers = [];

	function _module() {
		var m, n;

		if (arguments.length === 1 && _modules[arguments[0]]) {
			return _modules[arguments[0]];
		}
		else if (arguments.length === 2) {
			n = arguments[0];
			m = arguments[1];
		}

		if (!m) {
			alert('Error: registering module.');
			return;
		}

		if (!('init' in m)) {
			alert('Error: module must have init method.');
			return;
		}

		_modules[n] = m;
		
		return this;
	}

	function _init() {				
		$(function () {
			var m;

			$.each(_modules, function () {
				if('init' in this) {
					this.init();
				}
			});
			
			$.each(_readyHandlers, function() {
				this.call(this);
			});
		});
	}
	
	function _ready(handler) {
	
		if(typeof handler !== 'function') {
			alert('Error: argument is not a function.');
			return;
		}
	
		_readyHandlers.push(handler);
		
		return this;
	}

	_init();

	return {
		module: _module,
		ready: _ready
	}
};
