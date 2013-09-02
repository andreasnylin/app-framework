/*
	App framework version 0.5 2013-09-02
	Created by Andreas Nylin andreas.nylin@gmail.com
*/
var App = (function () {
	'use strict';
	// Stores all modules
	var _modules = {},
		// Stores all ready handlers
		_readyHandlers = [],
		// Stores all global values
		_globals = {},
		// Keeps track of how many unnamed modules that have been registered
		_unnamedIndex = 0,
		// Keeps track of how many modules there are left to init
		_modulesToInit = 0,
		// Common utilities
		_util = {
			isString: function(a) {
				return typeof a === 'string';
			},
			isFunction: function(a) {
				return typeof a === 'function';
			},
			isObject: function(a) {
				return typeof a === 'object';
			}
		};

	/**
	* Registers or returns a module depending on the arguments
	* Parameters: {String} name 
	* - Returns the module with the specified name
	* Parameters: {Object} module 
	* - Registers a module
	* Parameters: {String} name, {Object} module 
	* - Registers a module with the specified name
	*/
	function _module() {
		if (arguments.length === 1) {
			var argument = arguments[0];

			// Single string argument - return the module with the specified name
			if(_util.isString(argument)) {
				return _modules[argument];
			}
			// Single object argument - register unnamed module
			else if(_util.isObject(argument)) {
				_registerModule('unnamed' + _unnamedIndex++, argument);
			}
		}
		// Two arguments - register module with name
		else if (arguments.length === 2) {
			var name = arguments[0],
				module = arguments[1];

			_registerModule(name, module);
		}
		else {
			alert('Error: registering module.');
		}

		_modulesToInit++;
		
		return this;
	}

	/**
	* Registers a module
	* Parameters: {String} name 
	* - Name of the module to register
	* Parameters: {Object} module 
	* - Module to register
	*/
	function _registerModule(name, module) {
		if(_validateModule(module)) {
			module.name = name;
			_modules[name] = module;
		}
	}

	/**
	* Validates the module and makes sure it has the right format
	* Parameters: {Object} module 
	* - The module to validate
	*/
	function _validateModule(module) {
		if (!('init' in module)) {
			alert('Error: module must have init method.');
			return false;
		}

		return true;
	}

	/**
	* Loads the script from the specified url and runs the callback when done
	* Parameters: {Object} module 
	* - The current module that requires the script
	* Parameters: {String} or {Array} scripts 
	* - The script(s) source to load. Single string url or array of urls.
	* Parameters: {Function} callback 
	* - Callback method to run when the script has loaded
	*/
	function _loadScript(module, scripts, callback) {
		var scriptArray = _util.isString(scripts) ? [scripts] : scripts,
			scriptsToLoad = scriptArray.length,
			scriptElement,
			currentScript,
			scriptLoaded = function() {
				if(--scriptsToLoad === 0) {
					callback.call(module);
				}
			};

		while(currentScript = scriptArray.shift()) {
			scriptElement = document.createElement('script');
			document.head.appendChild(scriptElement);

			scriptElement.onload = scriptLoaded;
			scriptElement.src = currentScript;
		}
	}
	
	/**
	* Registers methods to run when all modules have loaded
	* Parameters: {Function} handler 
	* - Method to run when all modules are loaded
	*/
	function _ready(handler) {
		if(typeof handler !== 'function') {
			alert('Error: argument is not a function.');
			return;
		}
	
		_readyHandlers.push(handler);
		
		return this;
	}

	/**
	* Registers a global value for the app
	* Parameters: {String} name 
	* - Key of the value to store
	* Parameters: {Any} value 
	* - The value to store
	* Parameters: {Object} values
	* - Object with keys/values to store
	*/
	function _global() {
		if (arguments.length === 1) {
			var argument = arguments[0];
			
			if(_util.isObject(argument)) {
				for (var key in argument) {
					if(argument.hasOwnProperty(key)) {
						_globals[key] = argument[key];
					}
				}

				return this;
			}
			else if(_util.isString(argument)) {
				return _globals[argument];
			}
		}
		else if (arguments.length === 2) {
			var name = arguments[0],
				value = arguments[1];

			_globals[name] = value;

			return this;
		}
	}

	/**
	* Initialize the app
	*/
	function _init() {				
		$(function () {
			// Loop each module and run the init method
			$.each(_modules, function () {
				// Load scripts before running init method
				if ('require' in this) {
					_loadScript(this, 
						this.require, 
						function() { 
							this.init();
							_runReadyHandlers();
					});
				}
				// Run the init method of the module
				else if('init' in this) {
					this.init();
					_runReadyHandlers();
				}
			});
		});
	}

	// Loops all ready handlers and calls them
	function _runReadyHandlers() {
		if(--_modulesToInit === 0) {
			$.each(_readyHandlers, function() {
				this.call(this);
			});
		}
	}

	_init();

	/**
	* Public methods
	*/
	return {
		module: _module,
		ready: _ready,
		global: _global
	};
})();
