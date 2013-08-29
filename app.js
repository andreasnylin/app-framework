/*
	App framework version 0.2 2013-08-29
	Created by Andreas Nylin andreas.nylin@gmail.com
*/
var App = new function () {
	var _modules = {},
		_readyHandlers = [],
		_globals = [],
		_unnamedIndex = 0;

	function _module() {
		var m, n;

		if (arguments.length === 1 && typeof arguments[0] === 'string') {
			return _modules[arguments[0]];
		}
		else if (arguments.length === 1 && typeof arguments[0] === 'object') {
			n = 'unnamed' + _unnamedIndex++;
			m = arguments[0];
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

	function _loadScript(module, src, callback) {
		var script = document.createElement('script');
		document.head.appendChild(script);
		script.src = src;
		script.onload = function () {
			callback.call(module);
		}
	}

	function _init() {				
		$(function () {
			var m;

			$.each(_modules, function () {
				if ('require' in this) {
					_loadScript(this, this.require, this.init);
				}
				else if('init' in this) {
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

	var _global = function () {
		if (arguments.length === 1 && typeof arguments[0] === 'object') {
			for (var key in arguments[0]) {
				_globals[key] = arguments[0][key];
			}

			return this;
		}
		else if (arguments.length === 1 && typeof arguments[0] === 'string') {
			return _globals[arguments[0]];
		}
		else if (arguments.length === 2 && typeof arguments[0] === 'string') {
			_globals[arguments[0]] = arguments[1];

			return this;
		}
	};

	_init();

	return {
		module: _module,
		ready: _ready,
		global: _global
	}
};
