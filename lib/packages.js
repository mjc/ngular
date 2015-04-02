module.exports = {
  'container':                  {trees: null,  requirements: []},
  'ngular-metal':                {trees: null,  vendorRequirements: ['backburner']},
  'ngular-metal-views':          {trees: null,  vendorRequirements: ['dom-helper', 'morph-range', 'morph-attr']},
  'ngular-debug':                {trees: null,  requirements: ['ngular-metal'], testing: true},
  'ngular-runtime':              {trees: null,  vendorRequirements: ['rsvp'], requirements: ['container', 'ngular-metal']},
  'ngular-views':                {trees: null,  requirements: ['ngular-runtime', 'ngular-metal-views']},
  'ngular-extension-support':    {trees: null,  requirements: ['ngular-application']},
  'ngular-testing':              {trees: null,  requirements: ['ngular-application', 'ngular-routing'], testing: true},
  'ngular-template-compiler':    {trees: null,  templateCompilerVendor: ['simple-html-tokenizer', 'htmlbars-runtime', 'htmlbars-util', 'htmlbars-compiler', 'htmlbars-syntax', 'htmlbars-test-helpers']},
  'ngular-htmlbars':             {trees: null,  vendorRequirements: ['htmlbars-util'], requirements: ['ngular-metal-views'], testingVendorRequirements: [ 'htmlbars-test-helpers'], hasTemplates: true},
  'ngular-routing':              {trees: null,  vendorRequirements: ['router', 'route-recognizer'],
                                               requirements: ['ngular-runtime', 'ngular-views']},
  'ngular-routing-htmlbars':     {trees: null,  requirements: ['ngular-routing', 'ngular-htmlbars']},
  'ngular-routing-views':        {trees: null,  requirements: ['ngular-routing']},
  'ngular-application':          {trees: null,  vendorRequirements: ['dag-map'], requirements: ['ngular-routing']},
  'ngular':                      {trees: null,  requirements: ['ngular-application']}
};
