app-framework
=============

A simple JavaScript framework to structure application code.
Requires jQuery

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
