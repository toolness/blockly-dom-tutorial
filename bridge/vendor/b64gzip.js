// https://github.com/toolness/coquette-blockly/blob/gh-pages/b64gzip.js

var B64Gzip = (function() {
  function compress(string) {
    var data = strToUTF8Arr(string);
    var compressed = pako.deflate(data);
    var base64 = base64EncArr(compressed)
        .split('\r\n').join('')
        .replace(/=/g, '')
    return urlFriend(base64);
  }

  function decompress(string) {
    var compressed = base64DecToArr(urlUnfriend(string));
    var data = pako.inflate(compressed);
    return UTF8ArrToStr(data);
  }

  function urlFriend(string) {
    return string.replace(/\+/g, '_').replace(/\//g, '.');
  }

  function urlUnfriend(string) {
    return string.replace(/\./g, '\/').replace(/_/g, '+');
  }

  function test() {
    if (urlFriend('a+b/c+d/e') != 'a_b.c_d.e')
      throw new Error('urlFriend failed');
    if (urlUnfriend('a_b.c_d.e') != 'a+b/c+d/e')
      throw new Error('urlUnfriend failed');
    if (compress('hello\u2026') != 'eJzLSM3JyX.UsAwAELcEHQ')
      throw new Error('compress failed');
    if (decompress('eJzLSM3JyX.UsAwAELcEHQ') != 'hello\u2026')
      throw new Error('decompress failed');
  }

  test();

  return {compress: compress, decompress: decompress};
})();
