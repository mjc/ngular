import Ngular from "ngular-metal/core"; // Ngular.assert

export default function lookupPartial(view, templateName) {
  var nameParts = templateName.split("/");
  var lastPart = nameParts[nameParts.length - 1];

  nameParts[nameParts.length - 1] = "_" + lastPart;

  var underscoredName = nameParts.join('/');
  var template = view.templateForName(underscoredName);
  if (!template) {
    template = view.templateForName(templateName);
  }

  Ngular.assert(
    'Unable to find partial with name "' + templateName + '"',
    !!template
  );

  return template;
}
