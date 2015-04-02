import Ngular from "ngular-metal/core";
import precompile from "ngular-template-compiler/compat/precompile";
import compile from "ngular-template-compiler/system/compile";
import template from "ngular-template-compiler/system/template";

var NgularHandlebars = Ngular.Handlebars = Ngular.Handlebars || {};

NgularHandlebars.precompile = precompile;
NgularHandlebars.compile = compile;
NgularHandlebars.template = template;
