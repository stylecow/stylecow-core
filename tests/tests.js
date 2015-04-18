var fs = require('fs');
var path = require('path');
var stylecow = require('../lib');

/*
var css = stylecow.parseFile(path.join(__dirname, 'bench', 'github.com.css'));
var coder = new stylecow.Coder(css, {
});

console.log(coder.code);
process.exit();
*/

var cases = fs.readdirSync(path.join(__dirname, 'bench'));

cases.forEach(function(name) {
	if (name[0] === '.') {
		return;
	}

	console.log(name);
	var inputFile = path.join(__dirname, 'bench', name);
	var css = stylecow.parseFile(inputFile);
});
