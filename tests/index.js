var stylecow = require('./../lib'),
	assert = require('assert');

//Check all elements
require('./elements/block')(stylecow, assert);
require('./elements/class-selector')(stylecow, assert);
require('./elements/combinator')(stylecow, assert);
require('./elements/comment')(stylecow, assert);
require('./elements/declaration')(stylecow, assert);
require('./elements/function')(stylecow, assert);
require('./elements/id-selector')(stylecow, assert);
require('./elements/keyword')(stylecow, assert);
require('./elements/media-feature')(stylecow, assert);
require('./elements/media-query')(stylecow, assert);
require('./elements/media-type')(stylecow, assert);
require('./elements/number')(stylecow, assert);
require('./elements/pseudo-class')(stylecow, assert);
require('./elements/pseudo-element')(stylecow, assert);
require('./elements/rule')(stylecow, assert);
require('./elements/selector')(stylecow, assert);
require('./elements/selectors')(stylecow, assert);
require('./elements/string')(stylecow, assert);
require('./elements/type-selector')(stylecow, assert);
require('./elements/unit')(stylecow, assert);
require('./elements/url')(stylecow, assert);
require('./elements/value')(stylecow, assert);
