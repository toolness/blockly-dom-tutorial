(function() {
  // Workspace save/load functionality.

  var KEY_NAME = 'xml';

  // This can be used by developers from the debug console.
  window.getWorkspaceXml = function() {
    var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    return Blockly.Xml.domToPrettyText(xml);    
  };

  function getCurrentWorkspaceXml() {
    var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    return Blockly.Xml.domToText(xml);
  }

  function loadSavedWorkspace() {
    var lastXML = JSONStorage.get(KEY_NAME);
    if (lastXML) {
      var xml = Blockly.Xml.textToDom(lastXML);
      Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
    }
  }

  function saveCurrentWorkspace() {
    JSONStorage.set(KEY_NAME, getCurrentWorkspaceXml());
  }

  // Initialization.

  function startup() {
    $('#view-source').click(function() {
      var js = Blockly.JavaScript.workspaceToCode();
      $('#source').modal().find('textarea').val(js);
    });

    $('#play').click(function() {
      JSONStorage.set('script', Blockly.JavaScript.workspaceToCode());
      JSONStorage.set('reload', true);
    });

    $(window).on('keydown', function(event) {
      if (event.which == 32 && event.ctrlKey)
        return $('#play').click();
    });

    $('#play').click();
  }

  $(function() {
    Blockly.inject($('#blockly')[0], {
      path: '../vendor/blockly/',
      toolbox: $('#toolbox')[0]
    });

    Blockly.addChangeListener(saveCurrentWorkspace);
    loadSavedWorkspace();

    startup();
  });
})();
