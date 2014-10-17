Blockly.Blocks['create_element'] = {
  init: function() {
    this.setOutput(true, 'Element');
    this.appendDummyInput().appendField('a new')
      .appendField(new Blockly.FieldDropdown([
        ['<p>', 'p'],
        ['<span>', 'span'],
        ['<div>', 'div']
      ]), 'TAG').appendField('element');
  }
};

Blockly.JavaScript['create_element'] = function(block) {
  return [
    "document.createElement(" +
    Blockly.JavaScript.quote_(block.getFieldValue('TAG')) + ")",
    Blockly.JavaScript.ORDER_ATOMIC
  ];
};

Blockly.Blocks['query_selector'] = {
  SELECTORS: ['body'],
  init: function() {
    var selectors = this.SELECTORS.map(function(sel) {
      return [sel, sel];
    });

    this.setOutput(true, 'Element');
    this.appendDummyInput().appendField('the')
      .appendField(new Blockly.FieldDropdown(selectors), 'SELECTOR')
      .appendField('element');
  }
};

Blockly.JavaScript['query_selector'] = function(block) {
  return [
    "document.querySelector(" +
    Blockly.JavaScript.quote_(block.getFieldValue('SELECTOR')) + ")",
    Blockly.JavaScript.ORDER_ATOMIC
  ];
};

Blockly.Blocks['body_element'] = {
  init: function() {
    this.setOutput(true, 'Element');
    this.appendDummyInput().appendField('the <body> element');
  }
};

Blockly.JavaScript['body_element'] = function(block) {
  return [
    "document.body",
    Blockly.JavaScript.ORDER_ATOMIC
  ];
};

Blockly.Blocks['append_element'] = {
  init: function() {
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this
      .appendValueInput('CHILD').setCheck(['Element', 'TextNode'])
      .appendField('append');
    this
      .appendValueInput('PARENT').setCheck('Element')
      .appendField('to');
  }
};

Blockly.JavaScript['append_element'] = function(block) {
  var parent = Blockly.JavaScript.valueToCode(
    block, 'PARENT',
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var child = Blockly.JavaScript.valueToCode(
    block, 'CHILD',
    Blockly.JavaScript.ORDER_ATOMIC
  );
  return parent + '.appendChild(' + child + ');\n';
};

Blockly.Blocks['text_node'] = {
  init: function() {
    this.appendValueInput('TEXT').setCheck('String')
      .appendField('a new text node with');
    this.setOutput(true, 'TextNode');
  }
};

Blockly.JavaScript['text_node'] = function(block) {
  return [
    'document.createTextNode(' + Blockly.JavaScript.valueToCode(
      block, 'TEXT', Blockly.JavaScript.ORDER_ATOMIC
    ) + ')',
    Blockly.JavaScript.ORDER_ATOMIC
  ];
};

Blockly.Blocks['handle_event'] = {
  init: function() {
    this.appendValueInput('TARGET').setCheck('Element')
      .appendField('when');
    this.appendStatementInput('STACK').appendField('is clicked');
  }
};

Blockly.JavaScript['handle_event'] = function(block) {
  var target = Blockly.JavaScript.valueToCode(
    block, 'TARGET',
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var branch = Blockly.JavaScript.statementToCode(block, 'STACK');
  if (Blockly.JavaScript.STATEMENT_PREFIX) {
    branch = Blockly.JavaScript.prefixLines(
        Blockly.JavaScript.STATEMENT_PREFIX.replace(/%1/g,
        '\'' + block.id + '\''), Blockly.JavaScript.INDENT) + branch;
  }
  if (Blockly.JavaScript.INFINITE_LOOP_TRAP) {
    branch = Blockly.JavaScript.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + block.id + '\'') + branch;
  }
  return [
    target + '.addEventListener("click", function() {\n' +
    branch + '});\n'
  ];
};
