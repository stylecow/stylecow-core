module.exports = function (stylecow, assert) {
	var element, reader;

	reader = stylecow.Reader.fromString(' min-width:  12px ');
	element = stylecow.ConditionalFeature.create(reader);
	assert.strictEqual('min-width', element.name);
	assert.strictEqual(undefined, element.vendor);
	assert.strictEqual(1, element.length);
	assert.strictEqual('Value', element[0].type);
	assert.strictEqual('min-width: 12px', element.toString());

	reader = stylecow.Reader.fromString(' -moz-os-version:  windows-xp ');
	element = stylecow.ConditionalFeature.create(reader);
	assert.strictEqual('os-version', element.name);
	assert.strictEqual('moz', element.vendor);
	assert.strictEqual(1, element.length);
	assert.strictEqual('Value', element[0].type);
	assert.strictEqual('-moz-os-version: windows-xp', element.toString());

	reader = stylecow.Reader.fromString('color');
	element = stylecow.ConditionalFeature.create(reader);
	assert.strictEqual('color', element.name);
	assert.strictEqual(undefined, element.vendor);
	assert.strictEqual(0, element.length);
	assert.strictEqual('color', element.toString());

	try {
		reader = stylecow.Reader.fromString(':invalid:');
		element = stylecow.ConditionalFeature.create(reader);
	} catch (error) {
		element = error;
	}

	assert.strictEqual('Unespected token: :invalid\nline: 1\ncol: 1\n', element.message);
};
