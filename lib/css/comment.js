(function (stylecow) {

	stylecow.Comment = function (name) {
		this.class = 'Comment';
		this.type = 'Comment';
		this.setText(name);
	};

	stylecow.Comment.create = function (reader) {
		var t = stylecow.Tokens;

		if (reader.currToken[0] === t.WHITESPACE) {
			reader.next();
		}

		if (reader.currToken[0] === t.COMMENT) {
			var element = new stylecow.Comment(reader.currToken[3]);
			reader.next();
			return element;
		}
	};

	stylecow.Comment.prototype = Object.create(stylecow.Base, {
		setText: {
			value: function (name) {
				if (name[0] === '!') {
					this.important = true;
					this.name = name.substr(1);
				} else {
					this.important = false;
					this.name = name;
				}
			}
		},

		toString: {
			value: function () {
				return '/*' + (this.important ? '!' : '') + this.name + '*/';
			}
		},

		toCode: {
			value: function (code) {
				if (!this.name || code.style.comments === 'none' || (code.style.comments === 'important' && !this.important)) {
					return false;
				}

				code.append(code.style.commentStart + this.name + code.style.commentEnd, this);
			}
		}
	});
})(require('../index'));
