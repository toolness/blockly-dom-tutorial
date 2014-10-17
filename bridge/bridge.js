(function() {
  var ME_REGEXP = /^(.+\/)bridge\.js$/;
  var DEFAULT_STYLE = "position: absolute; top: 0; left: 0; " +
                      "visibility: hidden; overflow: hidden";
  var baseURL;

  // On IE9, the latest entry in document.scripts isn't necessarily
  // our script, as inline scripts after our scripts can actually already
  // be part of document.scripts, so we'll just find the latest script
  // that matches what we think our script is called.
  [].slice.call(document.scripts).forEach(function(script) {
    var match = script.src.match(ME_REGEXP);
    if (match) baseURL = match[1];
  });

  window.addEventListener('DOMContentLoaded', function(event) {
    var iframe = document.createElement('iframe');

    if (!baseURL) throw new Error('baseURL not found');

    iframe.setAttribute('src', baseURL + 'bridge.html');
    window.addEventListener('message', function(event) {
      if (event.source !== iframe.contentWindow) return;

      // TODO: We should probably check the origin here.
      var msg = JSON.parse(event.data);

      if (msg.type == 'reload') {
        window.location.reload();
      } else if (msg.type == 'init') {
        var script = document.createElement('script');
        script.appendChild(document.createTextNode(msg.script));
        document.body.appendChild(script);
      }

      if (msg.style) {
        iframe.setAttribute('style', msg.style);
      }
    });

    document.body.appendChild(iframe);
    iframe.setAttribute('style', DEFAULT_STYLE);
  }, false);
})();
