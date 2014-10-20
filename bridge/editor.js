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

  $(function() {
    Blockly.inject($('#blockly')[0], {
      path: '../vendor/blockly/',
      toolbox: $('#toolbox')[0]
    });

    Blockly.addChangeListener(saveCurrentWorkspace);
    Blockly.addChangeListener(storeScript);
    loadSavedWorkspace();

    $('#view-source').click(function() {
      var js = Blockly.JavaScript.workspaceToCode();
      var dom = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
      var compressed = B64Gzip.compress(Blockly.Xml.domToText(dom));

      js += '\n' + [
        '// Below is information about the Blockly blocks that',
        '// made up your program. It is not required for your',
        '// webpage to work, and you can remove it if you',
        '// don\'t care about others remixing your work.'
      ].join('\n') + '\nvar BLOCKLY_SOURCE = "' + compressed + '";';

      $('#source').modal().find('textarea').val(js);
    });

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
  });
})();
