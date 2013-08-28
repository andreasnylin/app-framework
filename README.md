app-framework
=============

A simple JavaScript framework to structure application code.
Requires jQuery

Example of usage
----------------

```javascript
App.module('A', {
	init: function () {
		console.log('Module ' + this.name + ' was initialized');
		$('#something').click(App.module('A').sayWhat);
	},
	name: 'A',
	sayWhat: function() {
		return 'what?';
	}
});

App.ready(function() {
  console.log('All modules are initialized. We are good to go!');
});
```
