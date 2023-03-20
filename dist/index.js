"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.load = void 0;
const typedoc_1 = require("typedoc");
const theme_1 = require("./theme");
function load(app) {
    app.renderer.defineTheme('docsify-docs', theme_1.PolymeshTheme);
    app.options.addDeclaration({
        help: 'README page title',
        name: 'readmeTitle',
        type: typedoc_1.ParameterType.String,
    });
    app.options.addDeclaration({
        help: 'Sidebar label for the readme document',
        name: 'readmeLabel',
        type: typedoc_1.ParameterType.String,
    });
    app.options.addDeclaration({
        help: 'Sidebar label for the index document',
        name: 'indexLabel',
        type: typedoc_1.ParameterType.String,
    });
}
exports.load = load;
