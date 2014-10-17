(function() {
  // Workspace save/load functionality.

  var KEY_NAME = 'xml';
  var noRemoteReload = /[&?]noRemoteReload=on/.test(window.location.search);

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

  function storeScript() {
    JSONStorage.set('script', Blockly.JavaScript.workspaceToCode());
  }

  function startup() {
    $('#view-source').click(function() {
      var js = Blockly.JavaScript.workspaceToCode();
      $('#source').modal().find('textarea').val(js);
    });

    Blockly.addChangeListener(storeScript);

    if (noRemoteReload) {
      storeScript();
      $('#play').hide();
    } else {
      $('#play').click(function() {
        if (noRemoteReload) return;
        storeScript();
        JSONStorage.set('reload', true);
      }).click();

      $(window).on('keydown', function(event) {
        if (event.which == 32 && event.ctrlKey)
          return $('#play').click();
      });
    }
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
