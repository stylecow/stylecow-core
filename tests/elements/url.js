module.exports = function (stylecow, assert) {
	var element, reader;

	element = new stylecow.Url('http://example.com');
	assert.strictEqual('http://example.com', element.name);
	assert.strictEqual('url("http://example.com")', element.toString());

	reader = stylecow.Reader.fromString('url("http://example.com")');
	element = stylecow.Url.create(reader);
	assert.strictEqual('http://example.com', element.name);

	reader = stylecow.Reader.fromString('url(http://example.com)');
	element = stylecow.Url.create(reader);
	assert.strictEqual('http://example.com', element.name);

	reader = stylecow.Reader.fromString('"http://example.com"');
	element = stylecow.Url.create(reader);
	assert.strictEqual('http://example.com', element.name);

	reader = stylecow.Reader.fromString('@ non-valid');
	element = stylecow.Url.create(reader);
	assert.strictEqual(undefined, element);
};
