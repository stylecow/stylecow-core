(function (stylecow) {

	//CSS elements
	require('./css/base');
	
	require('./css/root');
	require('./css/rule');
	require('./css/block');
	require('./css/declaration');
	require('./css/function');
	require('./css/value');
	require('./css/keyword');
	require('./css/string');
	require('./css/expression');
	require('./css/comment');
	require('./css/selectors');
	require('./css/selector');
	require('./css/combinator');
	require('./css/media-queries');
	require('./css/media-query');
	require('./css/atrule');

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
