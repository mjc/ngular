import Ngular from 'ngular-metal/core';
import { runLoadHooks } from 'ngular-runtime/system/lazy_load';

/**
Ngular Application

@module ngular
@submodule ngular-application
@requires ngular-views, ngular-routing
*/

import DefaultResolver from 'ngular-application/system/resolver';
import {
  Resolver
} from 'ngular-application/system/resolver';
import Application from 'ngular-application/system/application';
import 'ngular-application/ext/controller'; // side effect of extending ControllerMixin

Ngular.Application = Application;
Ngular.Resolver = Resolver;
Ngular.DefaultResolver = DefaultResolver;

runLoadHooks('Ngular.Application', Application);
