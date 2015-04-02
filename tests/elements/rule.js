module.exports = function (stylecow, assert) {
	var element, reader;

	reader = stylecow.Reader.fromString('#foo    >   p.bar:hover   +    ::selection ,   div \n >  \t p { font-size: 23px;}');
	element = stylecow.Rule.create(reader);
	assert.strictEqual(2, element.length);
	assert.strictEqual('Selectors', element[0].type);
	assert.strictEqual('Block', element[1].type);
	assert.strictEqual(2, element[0].length);
	assert.strictEqual(1, element[1].length);
	assert.strictEqual('Selector', element[0][0].type);
	assert.strictEqual('Declaration', element[1][0].type);
	assert.strictEqual('#foo > p.bar:hover + ::selection, div > p {\n\tfont-size: 23px;\n}', element.toString());

	element = true;
	try {
		reader = stylecow.Reader.fromString('| non-valid');
		element = stylecow.Rule.create(reader);
	} catch (e) {
		element = e;
	}

	assert.strictEqual('Unespected token: |<SPACE>\nline: 1\ncol: 1\n', element.message);
};
