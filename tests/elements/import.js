module.exports = function (stylecow, assert) {
	var element, reader;

	element = new stylecow.Import();
	element.push(new stylecow.Url('http://example.com'));
	assert.strictEqual('@import url("http://example.com");', element.toString());

	reader = stylecow.Reader.fromString('@import url("http://example.com")');
	element = stylecow.Import.create(reader);
	assert.strictEqual(1, element.length);
	assert.strictEqual('Url', element[0].type);
	assert.strictEqual('@import url("http://example.com");', element.toString());

	reader = stylecow.Reader.fromString('@import "../styles.css" only screen;');
	element = stylecow.Import.create(reader);
	assert.strictEqual(2, element.length);
	assert.strictEqual('Url', element[0].type);
	assert.strictEqual('MediaQueries', element[1].type);
	assert.strictEqual('@import url("../styles.css") only screen;', element.toString());

	reader = stylecow.Reader.fromString('@non-valid non-valid');
	element = stylecow.Import.create(reader);
	assert.strictEqual(undefined, element);
};
