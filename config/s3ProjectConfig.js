function fileMap(revision,tag,date) {
  return {
    "ngular.js":                   fileObject("ngular",                   ".js",   "text/javascript",  revision, tag, date),
    "ngular.debug.js":             fileObject("ngular.debug",             ".js",   "text/javascript",  revision, tag, date),
    "ngular-testing.js":           fileObject("ngular-testing",           ".js",   "text/javascript",  revision, tag, date),
    "ngular-tests.js":             fileObject("ngular-tests",             ".js",   "text/javascript",  revision, tag, date),
    "ngular-runtime.js":           fileObject("ngular-runtime",           ".js",   "text/javascript",  revision, tag, date),
    "ngular-template-compiler.js": fileObject("ngular-template-compiler", ".js",   "text/javascript",  revision, tag, date),
    "ngular.min.js":               fileObject("ngular.min",               ".js",   "text/javascript",  revision, tag, date),
    "ngular.prod.js":              fileObject("ngular.prod",              ".js",   "text/javascript",  revision, tag, date),
    "../docs/data.json":          fileObject("ngular-docs",              ".json", "application/json", revision, tag, date),
    "ngular-tests/index.html":     fileObject("ngular-tests-index",       ".html", "text/html",        revision, tag, date)
  };
};

function fileObject(baseName, extension, contentType, currentRevision, tag, date){
  var fullName = "/" + baseName + extension;
  var obj =  {
    contentType: contentType,
      destinations: {
        canary: [
          "latest" + fullName,
          "canary" + fullName,
          "canary/daily/" + date + fullName,
          "canary/shas/" + currentRevision + fullName
        ],
        release: [
          "stable" + fullName,
          "release" + fullName,
          "release/daily/" + date + fullName,
          "release/shas/" + currentRevision + fullName
        ],
        beta: [
          "beta" + fullName,
          "beta/daily/" + date + fullName,
          "beta/shas/" + currentRevision + fullName
        ],
        wildcard: []
      }
   };

   if (tag) {
     for (var key in obj.destinations) {
       obj.destinations[key].push("tags/" + tag + fullName);
     }
   }

   return obj;
}

module.exports = fileMap;
