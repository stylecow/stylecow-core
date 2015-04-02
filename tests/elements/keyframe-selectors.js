module.exports = function (stylecow, assert) {
	var element, reader;

	element = new stylecow.KeyframeSelectors();
	element.push(new stylecow.Keyword('from'));
	element.push(new stylecow.Unit(50, '%'));
	element.push(new stylecow.Keyword('to'));
	assert.strictEqual('from, 50%, to', element.toString());

	reader = stylecow.Reader.fromString('from');
	element = stylecow.KeyframeSelectors.create(reader);
	assert.strictEqual(1, element.length);
	assert.strictEqual('Keyword', element[0].type);
	assert.strictEqual('from', element.toString());

	reader = stylecow.Reader.fromString('  25%  ,  40% ');
	element = stylecow.KeyframeSelectors.create(reader);
	assert.strictEqual(2, element.length);
	assert.strictEqual('Unit', element[0].type);
	assert.strictEqual('Unit', element[1].type);
	assert.strictEqual('25%, 40%', element.toString());

	try {
		reader = stylecow.Reader.fromString('45&');
		element = stylecow.KeyframeSelectors.create(reader);
	} catch (error) {
		element = error;
	}
	
	assert.strictEqual('Unespected token: 45&\nline: 1\ncol: 1\n', element.message);
};
