(function() {
  // Workspace save/load functionality.

  var KEY_NAME = 'xml';
  var noRemoteReload = /[&?]noRemoteReload=on/.test(window.location.search);

  // This can be used by developers from the debug console.
  window.getWorkspaceXml = function() {
    var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    return Blockly.Xml.domToPrettyText(xml);    
  };

  function getWorkspaceCompressed() {
    var dom = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    return B64Gzip.compress(Blockly.Xml.domToText(dom));
  }

  function getCurrentWorkspaceXml() {
    var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    return Blockly.Xml.domToText(xml);
  }

  function loadSavedWorkspace() {
    var blocklySourceMatch = window.location.search
      .match(/[&?]blocklySource=([A-Za-z0-9._]+)/);

    if (blocklySourceMatch) {
      var blocklySource = null;
      try {
        blocklySource = B64Gzip.decompress(blocklySourceMatch[1]);
      } catch (e) {}
      if (blocklySource) {
        JSONStorage.set(KEY_NAME, blocklySource);
        window.location = noRemoteReload ? '?noRemoteReload=on' : '?';
      }
    }

    var lastXML = JSONStorage.get(KEY_NAME);
    if (lastXML) {
      try {
        var xml = Blockly.Xml.textToDom(lastXML);
        Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
      } catch (e) {
        Blockly.mainWorkspace.clear();
      }
    }
  }

  function saveCurrentWorkspace() {
    JSONStorage.set(KEY_NAME, getCurrentWorkspaceXml());
  }

  // Initialization.

  var lastStoredScript = null;

  function storeScript() {
    JSONStorage.set('editor_active', true);

    var currScript = Blockly.JavaScript.workspaceToCode();

    if (currScript !== lastStoredScript) {
      lastStoredScript = currScript;
      JSONStorage.set('script', currScript);
    }
  }

  var editor = null;

  function generateViewSourceCode() {
    var js = Blockly.JavaScript.workspaceToCode();

    if ($('#include-blockly-source')[0].checked) {
      js = 'if (!sessionStorage.USE_BLOCKLY_CODE) {\n' + js + '}\n' + [
        '// Below is information about the Blockly blocks that',
        '// made up your program. It is not required for your',
        '// webpage to work, and you can remove it if you',
        '// don\'t care about others remixing your work.'
      ].join('\n') + '\nvar BLOCKLY_SOURCE = "' +
                     getWorkspaceCompressed() + '";';
    }

    editor.setValue(js);
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
      $('#source').modal();
      if (!editor) {
        editor = CodeMirror($("#source-code-holder")[0], {
          mode: "javascript"
        });
        $('#source').on('shown.bs.modal', function() {
          editor.refresh();
          editor.focus();
        });
      }
      generateViewSourceCode();
    });

    $('#include-blockly-source').change(generateViewSourceCode);

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
