(function (stylecow) {

	//CSS elements
	require('./css/base');

	//Basic
	require('./css/keyword');
	require('./css/unit');
	require('./css/number');
	require('./css/string');
	require('./css/comment');
	require('./css/function');
	require('./css/value');
	require('./css/declaration');
	require('./css/block');
	require('./css/rule');

	//Selectors
	require('./css/selectors');
	require('./css/selector');
	require('./css/type-selector');
	require('./css/class-selector');
	require('./css/id-selector');
	require('./css/pseudo-class');
	require('./css/pseudo-element');
	require('./css/combinator');
	
	/*
	require('./css/pseudo-class-function');

	require('./css/root');
	require('./css/expression');
	require('./css/media-queries');
	require('./css/media-query');
	require('./css/atrule');
	*/

	require('./tokens');
	require('./reader');
	require('./coder');

	require('./error');

	//Change the current directory
	var cwd = process.cwd();

	stylecow.cwd = function (newCwd) {
		if (newCwd === undefined) {
			return cwd;
		}

		cwd = newCwd;

		return stylecow;
	};

})(require('./index'));
