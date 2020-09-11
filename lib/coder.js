export default class Coder {
  constructor(style) {
    this.style(style || "normal");
    this.styles = getDefaultStyles();
  }

  use(module) {
    module(this);

    return this;
  }

  addStyle(name, style) {
    Object.keys(this.styles.normal).forEach(function (i) {
      if (!(style.hasOwnProperty(i))) {
        throw new Error(`Missing "${i}" property in the custom code style`);
      }
    });

    this.styles[name] = style;

    return this;
  }

  style(name) {
    this.styleName = name;

    return this;
  }

  // available modes: "auto", "embed", "file", "none"
  sourceMap(mode) {
    if (["auto", "embed", "none", "file"].indexOf(mode) === -1) {
      throw new Error("Mode no valid");
    }

    return this;
  }

  run(css) {
    this.codeStyle = this.styles[this.styleName];
    this.indentStr = "";
    this.indent = [];
    this.column = 1;
    this.line = 1;
    this.code = "";

    css.toCode(this);

    return {
      css: this.code,
    };
  }

  get(name) {
    return this.codeStyle[name];
  }

  appendStyle(name) {
    this.append(this.codeStyle[name]);

    return this;
  }

  append(code) {
    for (let i = 0, l = code.length; i < l; i++) {
      this.code += code[i];

      if (code[i] === "\n") {
        ++this.line;
        this.code += this.indentStr;
        this.column = this.indentStr.length;
      } else {
        ++this.column;
      }
    }
  }

  pushIndentation() {
    this.indent.push(this.codeStyle["indentation"]);
    this.indentStr = this.indent.join("");
  }

  popIndentation() {
    const indent = this.indent.pop();

    if (this.code.substr(-indent.length) === indent) {
      this.code = this.code.slice(0, -indent.length);
    }

    this.indentStr = this.indent.join("");
  }
}

function getDefaultStyles() {
  return {
    "normal": {
      "indentation": "\t",
      "block-opening-bracket-before": " ",
      "block-opening-bracket-after": "\n",
      "block-closing-bracket-before": "",
      "block-closing-bracket-after": "",
      "declaration-before": "",
      "declaration-after": "\n",
      "declaration-colon-before": "",
      "declaration-colon-after": " ",
      "declaration-comma-before": "",
      "declaration-comma-after": " ",
      "selector-comma-before": "",
      "selector-comma-after": "\n",
      "rule-before": "",
      "rule-after": "\n",
      "string-quotes": "'",
      "number-leading-zero": true,
      "comparator-before": " ",
      "comparator-after": " ",
      "selector-combinator-before": " ",
      "selector-combinator-after": " ",
      "function-opening-parenthesis-after": "",
      "function-closing-parenthesis-before": "",
      "function-comma-before": "",
      "function-comma-after": " ",
      "comment-before": "\n",
      "comment-after": "\n",
      "comments": "all", // (all|important|none)
      "at-rule-block-before": "",
      "at-rule-block-after": "\n",
      "at-rule-inline-before": "",
      "at-rule-inline-after": "\n",
    },
    "minify": {
      "indentation": "",
      "block-opening-bracket-before": "",
      "block-opening-bracket-after": "",
      "block-closing-bracket-before": "",
      "block-closing-bracket-after": "",
      "declaration-before": "",
      "declaration-after": "",
      "declaration-colon-before": "",
      "declaration-colon-after": "",
      "declaration-comma-before": "",
      "declaration-comma-after": "",
      "selector-comma-before": "",
      "selector-comma-after": "",
      "rule-before": "",
      "rule-after": "",
      "string-quotes": "'",
      "number-leading-zero": false,
      "comparator-before": "",
      "comparator-after": "",
      "selector-combinator-before": "",
      "selector-combinator-after": "",
      "function-opening-parenthesis-after": "",
      "function-closing-parenthesis-before": "",
      "function-comma-before": "",
      "function-comma-after": "",
      "comment-before": "",
      "comment-after": "",
      "comments": "none", // (all|important|none)
      "at-rule-block-before": "",
      "at-rule-block-after": "",
      "at-rule-inline-before": "",
      "at-rule-inline-after": "",
    },
  };
}
