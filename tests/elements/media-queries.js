module.exports = function (stylecow, assert) {
	var element, reader;

	reader = stylecow.Reader.fromString('only screen');
	element = stylecow.MediaQueries.create(reader);
	assert.strictEqual(1, element.length);
	assert.strictEqual('MediaQuery', element[0].type);
	assert.strictEqual('Keyword', element[0][0].type);
	assert.strictEqual('Keyword', element[0][1].type);
	assert.strictEqual('only screen', element.toString());

	reader = stylecow.Reader.fromString('  not color and   (min-width: 23px) , screen ');
	element = stylecow.MediaQueries.create(reader);
	assert.strictEqual(2, element.length);
	assert.strictEqual('MediaQuery', element[0].type);
	assert.strictEqual('MediaQuery', element[1].type);
	assert.strictEqual('Keyword', element[0][0].type);
	assert.strictEqual('Keyword', element[0][1].type);
	assert.strictEqual('Keyword', element[1][0].type);
	assert.strictEqual('not color and (min-width: 23px), screen', element.toString());

	try {
		reader = stylecow.Reader.fromString('12(color)');
		element = stylecow.MediaQuery.create(reader);
	} catch (error) {
		element = error;
	}

	assert.strictEqual('Unespected token: 12(\nline: 1\ncol: 1\n', element.message);
};
