module.exports = function (stylecow, assert) {
	var element, reader;

	element = new stylecow.MediaFeature('min-width');
	element.push(new stylecow.Unit(12, 'px'));
	assert.strictEqual('min-width', element.name);
	assert.strictEqual(undefined, element.vendor);
	assert.strictEqual('(min-width: 12px)', element.toString());

	element = new stylecow.MediaFeature('-moz-os-version');
	element.push(new stylecow.Keyword('windows-xp'));
	assert.strictEqual('os-version', element.name);
	assert.strictEqual('moz', element.vendor);
	assert.strictEqual('(-moz-os-version: windows-xp)', element.toString());

	reader = stylecow.Reader.fromString(' (min-width:  12px )');
	element = stylecow.MediaFeature.create(reader);
	assert.strictEqual('min-width', element.name);
	assert.strictEqual(undefined, element.vendor);
	assert.strictEqual(1, element.length);
	assert.strictEqual('Unit', element[0].type);
	assert.strictEqual('(min-width: 12px)', element.toString());

	reader = stylecow.Reader.fromString('( -moz-os-version:  windows-xp )');
	element = stylecow.MediaFeature.create(reader);
	assert.strictEqual('os-version', element.name);
	assert.strictEqual('moz', element.vendor);
	assert.strictEqual(1, element.length);
	assert.strictEqual('Keyword', element[0].type);
	assert.strictEqual('(-moz-os-version: windows-xp)', element.toString());

	reader = stylecow.Reader.fromString('(color)');
	element = stylecow.MediaFeature.create(reader);
	assert.strictEqual('color', element.name);
	assert.strictEqual(undefined, element.vendor);
	assert.strictEqual(0, element.length);
	assert.strictEqual('(color)', element.toString());

	reader = stylecow.Reader.fromString(':invalid:');
	element = stylecow.MediaFeature.create(reader);
	assert.strictEqual(undefined, element);
};
