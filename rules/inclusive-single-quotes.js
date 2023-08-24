module.exports = {
  meta: {
    type: 'layout', // You might need to adjust the type
    fixable: 'code',
  },
  create: function (context) {
    return {
      Literal(node) {
        const stringValue = node.value;
        const containsSingleQuote = stringValue.includes("'");
        const isDoubleQuoted = node.raw[0] === '"';

        if (containsSingleQuote && isDoubleQuoted) {
          context.report({
            node,
            message: 'Use single quotes for strings containing single quotes.',
            fix: (fixer) => fixer.replaceText(node, `'${stringValue}'`),
          });
        }
      },
    };
  },
};
