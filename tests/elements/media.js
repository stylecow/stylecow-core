module.exports = function (stylecow, assert) {
	var element, reader;

	reader = stylecow.Reader.fromString('@media not color and   (min-width: 23px) , screen { body { font-size: 23px;}}');
	element = stylecow.Media.create(reader);
	assert.strictEqual(2, element.length);
	assert.strictEqual('MediaQueries', element[0].type);
	assert.strictEqual('Block', element[1].type);
	assert.strictEqual(2, element[0].length);
	assert.strictEqual(1, element[1].length);
	assert.strictEqual('MediaQuery', element[0][0].type);
	assert.strictEqual('Rule', element[1][0].type);
	assert.strictEqual('@media not color and (min-width: 23px), screen {\n\tbody {\n\t\tfont-size: 23px;\n\t}\n}', element.toString());

	try {
		reader = stylecow.Reader.fromString('@media | non-valid');
		element = stylecow.Media.create(reader);
	} catch (e) {
		element = e;
	}

	assert.strictEqual('Unespected token: |<SPACE>\nline: 1\ncol: 8\n', element.message);
};
