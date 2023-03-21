"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.load = void 0;
const typedoc_1 = require("typedoc");
const theme_1 = require("./theme");

//This function defines the theme in the renderer and also add options.
//This runs first and hence sets up the theme name in the renderer
//The theme is in theme.js file

function load(app) {
    app.renderer.defineTheme('docsify-docs', theme_1.DocsifyTheme);
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
