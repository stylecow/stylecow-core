module.exports = function (stylecow, assert) {
	var element, reader;

	element = new stylecow.Namespace();
	element.push(new stylecow.Url('http://www.w3.org/1999/xhtml'));
	assert.strictEqual('@namespace url("http://www.w3.org/1999/xhtml");', element.toString());

	reader = stylecow.Reader.fromString('@namespace svg "http://www.w3.org/2000/svg";');
	element = stylecow.Namespace.create(reader);
	assert.strictEqual(2, element.length);
	assert.strictEqual('Keyword', element[0].type);
	assert.strictEqual('Url', element[1].type);
	assert.strictEqual('@namespace svg url("http://www.w3.org/2000/svg");', element.toString());

	reader = stylecow.Reader.fromString('@namespace +3 "non-valid"');
	element = stylecow.Import.create(reader);
	assert.strictEqual(undefined, element);
};
