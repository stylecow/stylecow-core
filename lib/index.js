import Reader from "./reader.js";
import Tokens from "./tokens.js";

// CSS elements
import Root from "./css/root.js";

// Basic
import Keyword from "./css/keyword.js";
import Unit from "./css/unit.js";
import Number from "./css/number.js";
import Ratio from "./css/ratio.js";
import Hex from "./css/hex.js";
import Operator from "./css/operator.js";
import Expression from "./css/expression.js";
import Comparator from "./css/comparator.js";
import Bang from "./css/bang.js";
import String from "./css/string.js";
import Comment from "./css/comment.js";
import Function from "./css/function.js";
import Value from "./css/value.js";
import Declaration from "./css/declaration.js";
import Block from "./css/block.js";
import Rule from "./css/rule.js";
import ExpressionName from "./css/extension-name.js";
import CustomProperty from "./css/custom-property.js";
import Keyframe from "./css/keyframe.js";
import AtRule from "./css/at-rule.js";
import NestedAtRule from "./css/nested-at-rule.js";
import Track from "./css/track.js";

// Selectors
import Selectors from "./css/selectors.js";
import Selector from "./css/selector.js";
import TypeSelector from "./css/type-selector.js";
import ClassSelector from "./css/class-selector.js";
import IdSelector from "./css/id-selector.js";
import Combinator from "./css/combinator.js";
import UniversalSelector from "./css/universal-selector.js";
import AttributeSelector from "./css/attribute-selector.js";
import PseudoClass from "./css/pseudo-class.js";
import PseudoClassFunction from "./css/pseudo-class-function.js";
import PseudoElement from "./css/pseudo-element.js";
import PlaceholderSelector from "./css/placeholder-selector.js";
import KeyframeSelector from "./css/keyframe-selector.js";

// Conditional selectors
import MediaQueries from "./css/media-queries.js";
import MediaQuery from "./css/media-query.js";
import ConditionalSelector from "./css/conditional-selector.js";
import ConditionalExpression from "./css/conditional-expression.js";
import ConditionalFeature from "./css/conditional-feature.js";
import ConditionalFeatureBoolean from "./css/conditional-feature-boolean.js";
import ConditionalFeatureRange from "./css/conditional-feature-range.js";

const classes = {
  Root,
  Keyword,
  Unit,
  Number,
  Ratio,
  Hex,
  Operator,
  Expression,
  Comparator,
  Bang,
  String,
  Comment,
  Function,
  Value,
  Declaration,
  Block,
  Rule,
  ExpressionName,
  CustomProperty,
  Keyframe,
  AtRule,
  NestedAtRule,
  Track,
  Selectors,
  Selector,
  TypeSelector,
  ClassSelector,
  IdSelector,
  Combinator,
  UniversalSelector,
  AttributeSelector,
  PseudoClass,
  PseudoClassFunction,
  PseudoElement,
  PlaceholderSelector,
  KeyframeSelector,
  MediaQueries,
  MediaQuery,
  ConditionalSelector,
  ConditionalExpression,
  ConditionalFeature,
  ConditionalFeatureBoolean,
  ConditionalFeatureRange,
};

export function parse(code, className, parent, file) {
  className = className || "Root";

  return classes[className].create(
    new Reader(new Tokens(code), file || ""),
    parent,
  );
}

export function parseFile(file) {
  return parse(Deno.readTextFileSync(file), "Root", null, file);
}

export function cssError(error) {
  const css = parse(`
        html, body {
            color: red !important;
            background: white !important;
        }
        body > * {
            display: none !important;
        }
        body::before {
            content: "message";
            font-family: monospace;
            white-space: pre;
            display: block;
            padding: 20px;
        }
    `);

  const content = css.get({
    type: "String",
    name: "message",
  });

  content.name = error.message.replace(/\n/g, "\\a ");

  return css;
}
