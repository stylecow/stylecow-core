module.exports = function (stylecow, assert) {
	var element, reader;

	element = new stylecow.Charset();
	element.push(new stylecow.String('UTF-8'));
	assert.strictEqual('@charset "UTF-8";', element.toString());

	reader = stylecow.Reader.fromString('@charset "utf-8"');
	element = stylecow.Charset.create(reader);
	assert.strictEqual(1, element.length);
	assert.strictEqual('String', element[0].type);
	assert.strictEqual('@charset "utf-8";', element.toString());

	try {
		reader = stylecow.Reader.fromString('@charset utf-8');
		element = stylecow.Charset.create(reader);
	} catch (e) {
		element = e;
	}

	assert.strictEqual('Unespected token: utf-8<EOF>\nline: 10\ncol: 1\n', element.message);
};
