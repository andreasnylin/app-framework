app-framework
=============

A simple JavaScript framework to structure application code.

The goals of this framework is to be able to:
- register global values for the application
- register modules for the application in separate code files
- requesting external scripts for modules and run the module once the script have loaded
- run code when all modules have loaded

...and doing this without littering the global namespace.

Requires jQuery for now

Example of usage
----------------

```javascript
App.global({
	'a': 1,
	'b': 2
})
.global('c', 3)
.module('A', {
	init: function () {
		console.log('Module ' + this.name + ' was initialized');
	},
	helloWorld: function() {
		console.log('Hello world!');
	}
})
.module({
	init: function () {
		console.log('Unnamed module was initialized');
	}
})
.ready(function() {
	App.module('A').helloWorld();
	console.log('All done!');
	console.log(App.global('c'));
});

// This could be in another js file
App.module('B', {
	init: function () {
		console.log('Module ' + this.name + ' was initialized');
	},
	require: ['required-lib.js', 'required-lib2.js']
})
```

Documentation
-------------

###App.global()

Use to register or read global values used in the application
```javascript
// Register a global value
App.global('name', 'value');

// Register a several global values
App.global({ 'a': 1, 'b', 2 });

// Retrieve a global value
App.global('name');
```

###App.module()

Use to register or retrieve a module.
```javascript
// Register a module
App.module('name', { 
	init: function () { 
		// ... 
	}
});

// Register a unnamed module
App.module({ 
	init: function () { 
		// ... 
	}
});

// Register a module and required scripts
App.module({ 
	init: function () { 
		// ...
	},
	require: ['script1.js', 'script2.js']
});

// Retrieve a module
App.module('name');
```

###App.ready()

Use to register a handler that should run when all modules have been initialized.

```javascript
App.ready(function() { 
	// ...
}); 
```
