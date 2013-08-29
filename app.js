/*
	App framework version 0.3 2013-08-29
	Created by Andreas Nylin andreas.nylin@gmail.com
*/
var App = new function () {
	// Stores all modules
	var _modules = {},
		// Stores all ready handlers
		_readyHandlers = [],
		// Stores all global values
		_globals = [],
		// Keeps track of how many unnamed modules that have been registered
		_unnamedIndex = 0,
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
		var module, name;

		if (arguments.length === 1) {
			var argument = arguments[0];

			if(_util.isString(argument)) {
				return _modules[argument];
			}
			else if(_util.isObject(argument)) {
				_registerModule('unnamed' + _unnamedIndex++, argument);
			}
		}
		else if (arguments.length === 2) {
			var name = arguments[0],
				module = arguments[1];

			_registerModule(name, module);
		}
		else {
			alert('Error: registering module.');
		}
		
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
	* Parameters: {String} sriptUrl 
	* - The script source to load
	* Parameters: {Function} callback 
	* - Callback method to run when the script has loaded
	*/
	function _loadScript(module, sriptUrl, callback) {
		var script = document.createElement('script');
		document.head.appendChild(script);
		script.src = sriptUrl;
		script.onload = function () {
			callback.call(module);
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
		// TODO: Rewrite this
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
	}

	/**
	* Initialize the app
	*/
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

	_init();

	/**
	* Public methods
	*/
	return {
		module: _module,
		ready: _ready,
		global: _global
	}
};
