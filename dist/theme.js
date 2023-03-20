"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolymeshTheme = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const typedoc_1 = require("typedoc");
const typedoc_plugin_markdown_1 = require("typedoc-plugin-markdown");
const groups_1 = require("typedoc-plugin-markdown/dist/groups");
const front_matter_1 = require("typedoc-plugin-markdown/dist/utils/front-matter");
const utils_1 = require("./utils");
const CATEGORY_POSITION = {
    [typedoc_1.ReflectionKind.Module]: 1,
    [typedoc_1.ReflectionKind.Namespace]: 1,
    [typedoc_1.ReflectionKind.Enum]: 2,
    [typedoc_1.ReflectionKind.Class]: 3,
    [typedoc_1.ReflectionKind.Interface]: 4,
    [typedoc_1.ReflectionKind.TypeAlias]: 5,
    [typedoc_1.ReflectionKind.Variable]: 6,
    [typedoc_1.ReflectionKind.Function]: 7,
    [typedoc_1.ReflectionKind.ObjectLiteral]: 8,
};
class PolymeshTheme extends typedoc_plugin_markdown_1.MarkdownTheme {
    constructor(renderer) {
        super(renderer);
        this.readmeTitle = this.getOption('readmeTitle');
        this.readmeLabel = this.getOption('readmeLabel');
        this.indexLabel = this.getOption('indexLabel');
        this.hideInPageTOC = this.application.options.isSet('hideInPageTOC')
            ? this.getOption('hideInPageTOC')
            : true;
        this.hideBreadcrumbs = this.application.options.isSet('hideBreadcrumbs')
            ? this.getOption('hideBreadcrumbs')
            : true;
        this.hidePageTitle = this.application.options.isSet('hidePageTitle')
            ? this.getOption('hidePageTitle')
            : true;
        this.listenTo(this.application.renderer, {
            [typedoc_1.PageEvent.END]: this.onPageEnd,
            [typedoc_1.RendererEvent.END]: this.onRendererEnd,
        });
    }
    toUrl(mapping, reflection) {
        const reflectionFullName = reflection.getFullName();
        const fullName = (0, utils_1.capitalizePath)(reflectionFullName.replace(/\./g, '/'));
        const fileParts = fullName.split('/');
        const fileName = fileParts[fileParts.length - 1];
        if (reflection.kind === typedoc_1.ReflectionKind.Class) {
            return mapping.directory + '/' + fullName + '.md';
        }
        return mapping.directory + '/' + fullName + '/' + fileName + '.md';
    }
    onPageEnd(page) {
        if (page.contents) {
            page.contents = (0, front_matter_1.prependYAML)(page.contents, this.getYamlItems(page));
        }
    }
    onRendererEnd(renderer) {
        renderer.project.url &&
            processModuleList(renderer.outputDirectory + '/' + renderer.project.url);
        Object.keys(groupUrlsByKind(this.getUrls(renderer.project))).forEach(group => {
            const kind = parseInt(group);
            const categoryMapping = this.mappings.find(mapping => mapping.kind.includes(kind));
            if (categoryMapping) {
                writeCategoryYaml(renderer.outputDirectory + '/' + categoryMapping.directory, (0, groups_1.getKindPlural)(kind), CATEGORY_POSITION[kind], true, false);
            }
        });
    }
    getYamlItems(page) {
        const pageId = this.getId(page);
        const pageTitle = this.getTitle(page);
        const sidebarLabel = this.getSidebarLabel(page);
        const sidebarPosition = this.getSidebarPosition(page);
        let items = {
            id: pageId,
            title: pageTitle,
        };
        if (sidebarLabel && sidebarLabel !== pageTitle) {
            items = { ...items, sidebar_label: sidebarLabel };
        }
        if (sidebarPosition) {
            items = { ...items, sidebar_position: parseFloat(sidebarPosition) };
        }
        return {
            ...items,
        };
    }
    getSidebarLabel(page) {
        const indexLabel = this.indexLabel || 'Table of Contents';
        if (page.url === this.entryDocument) {
            return page.url === page.project.url ? indexLabel : this.readmeLabel;
        }
        if (page.url === this.globalsFile) {
            return indexLabel;
        }
        return path.basename(page.url, path.extname(page.url));
    }
    getSidebarPosition(page) {
        if (page.url === this.entryDocument) {
            return page.url === page.project.url ? '0.5' : '0';
        }
        if (page.url === this.globalsFile) {
            return '0.5';
        }
        return null;
    }
    getId(page) {
        return path.basename(page.url, path.extname(page.url));
    }
    getTitle(page) {
        const readmeTitle = this.readmeTitle || page.project.name;
        if (page.url === this.entryDocument && page.url !== page.project.url) {
            return readmeTitle;
        }
        return this.getPageTitle(page);
    }
    getPageTitle(page) {
        const title = [];
        if (page.model.kindString && page.url !== page.project.url) {
            title.push(`${page.model.kindString}: `);
        }
        if (page.url === page.project.url) {
            title.push(this.indexTitle || page.project.name);
        }
        else {
            title.push(this.getName(page));
            if (page.model.typeParameters) {
                const typeParameters = page.model.typeParameters
                    .map(typeParameter => typeParameter.name)
                    .join(', ');
                title.push(`<${typeParameters}>`);
            }
        }
        return title.join('');
    }
    getName(page) {
        if (page.model.kindString === 'Module') {
            const nameParts = page.model.name.split('/');
            if (nameParts[nameParts.length - 1] === 'types') {
                const moduleName = nameParts[nameParts.length - 2];
                return moduleName
                    ? `${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)} Types`
                    : 'Types';
            }
            return nameParts[nameParts.length - 1];
        }
        return page.model.name;
    }
}
exports.PolymeshTheme = PolymeshTheme;
const writeCategoryYaml = (categoryPath, label, position, collapsed, generatedIndex) => {
    const yaml = [`label: "${label}"`];
    if (position !== null) {
        yaml.push(`position: ${position}`);
    }
    if (!collapsed) {
        yaml.push('collapsed: false');
    }
    if (generatedIndex) {
        yaml.push('link:\n  type: generated-index');
    }
    if (fs.existsSync(categoryPath)) {
        fs.writeFileSync(categoryPath + '/_category_.yml', yaml.join('\n'));
    }
};
const groupUrlsByKind = (urls) => {
    return urls.reduce((r, v, i, a, k = v.model.kind) => ((r[k] || (r[k] = [])).push(v), r), {});
};
const processModuleList = (file) => {
    const fileContents = fs.readFileSync(file, 'utf8');
    const lines = fileContents.split('\n');
    const modulesHeaderLine = findModulesHeaderLine(lines);
    if (modulesHeaderLine === -1)
        return;
    const modulesList = extractModulesList(lines, modulesHeaderLine);
    const newContents = addModulesListToContents(lines, modulesHeaderLine, modulesList);
    fs.writeFileSync(file, newContents);
};
const findModulesHeaderLine = (lines) => {
    return lines.indexOf('## Modules') !== -1
        ? lines.indexOf('## Modules')
        : lines.indexOf('### Modules');
};
const extractModulesList = (lines, modulesHeaderLine) => {
    const linkRegex = /\[(.*?)\]\((.*?)\)/;
    const indentation = '  ';
    const modulesList = [];
    const currentLevel = [];
    for (let i = modulesHeaderLine + 1; i < lines.length; i++) {
        const line = lines[i];
        const match = line.match(linkRegex);
        if (!match)
            continue;
        const [, , url] = match;
        const parts = getUrlParts(url);
        parts.forEach((part, index) => {
            if (index === parts.length - 1) {
                modulesList.push(`${indentation.repeat(index)}- [${part}](${url})`);
                currentLevel[index] = part;
            }
            else if (part !== currentLevel[index]) {
                modulesList.push(`${indentation.repeat(index)}- ${part}`);
                currentLevel[index] = part;
            }
        });
    }
    return modulesList;
};
const getUrlParts = (url) => path.dirname(url).split('/').slice(1);
const addModulesListToContents = (lines, modulesHeaderLine, modulesList) => {
    let newContents = '';
    for (let i = 0; i < modulesHeaderLine + 1; i++) {
        newContents += lines[i] + '\n';
    }
    newContents += '\n';
    modulesList.forEach(item => {
        newContents += item + '\n';
    });
    return newContents;
};
