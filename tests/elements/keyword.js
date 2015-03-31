module.exports = function (stylecow, assert) {
	var element, reader;

	element = new stylecow.Keyword('-moz-grab');
	assert.strictEqual('moz', element.vendor);
	assert.strictEqual('grab', element.name);
	assert.strictEqual('-moz-grab', element.toString());

	element = new stylecow.Keyword('-grab');
	assert.strictEqual(undefined, element.vendor);
	assert.strictEqual('-grab', element.name);
	assert.strictEqual('-grab', element.toString());

	element = new stylecow.Keyword('grab');
	assert.strictEqual(undefined, element.vendor);
	assert.strictEqual('grab', element.name);
	assert.strictEqual('grab', element.toString());

	reader = stylecow.Reader.fromString('-moz-html');
	element = stylecow.Keyword.create(reader);
	assert.strictEqual('moz', element.vendor);
	assert.strictEqual('html', element.name);
	assert.strictEqual('-moz-html', element.toString());

	reader = stylecow.Reader.fromString('-html');
	element = stylecow.Keyword.create(reader);
	assert.strictEqual(undefined, element.vendor);
	assert.strictEqual('-html', element.name);
	assert.strictEqual('-html', element.toString());
};
