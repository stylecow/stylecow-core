module.exports = function (stylecow, assert) {
	var element, reader;

	reader = stylecow.Reader.fromString('@font-face  { font-family:\n "Bitstream Vera Serif Bold" ;  src: url("https://mdn.mozillademos.org/files/2468/VeraSeBd.ttf" )  ; \t}');
	element = stylecow.AtRule.create(reader);
	assert.strictEqual('font-face', element.name);
	assert.strictEqual(undefined, element.vendor);
	assert.strictEqual(1, element.length);
	assert.strictEqual('Block', element[0].type);
	assert.strictEqual(2, element[0].length);
	assert.strictEqual('Declaration', element[0][0].type);
	assert.strictEqual('@font-face {\n\tfont-family: "Bitstream Vera Serif Bold";\n\tsrc: url("https://mdn.mozillademos.org/files/2468/VeraSeBd.ttf");\n}', element.toString());

	reader = stylecow.Reader.fromString('@-moz-font-feature-values font { font-family:\n "Bitstream Vera Serif Bold" ;  src: url("https://mdn.mozillademos.org/files/2468/VeraSeBd.ttf" )  ; \t}');
	element = stylecow.AtRule.create(reader);
	assert.strictEqual('font-feature-values', element.name);
	assert.strictEqual('moz', element.vendor);
	assert.strictEqual(2, element.length);
	assert.strictEqual('Keyword', element[0].type);
	assert.strictEqual('Block', element[1].type);
	assert.strictEqual(2, element[1].length);
	assert.strictEqual('Declaration', element[1][0].type);
	assert.strictEqual('@-moz-font-feature-values font {\n\tfont-family: "Bitstream Vera Serif Bold";\n\tsrc: url("https://mdn.mozillademos.org/files/2468/VeraSeBd.ttf");\n}', element.toString());

	try {
		reader = stylecow.Reader.fromString('@font-face not-valid {blue}');
		element = stylecow.AtRule.create(reader);
	} catch (error) {
		element = error;
	}

	assert.strictEqual('Unespected token: not-valid<SPACE>\nline: 1\ncol: 12\n', element.message);
};
