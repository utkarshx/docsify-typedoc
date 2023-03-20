"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capitalizePath = void 0;
function capitalizePath(path) {
    const folders = path.split('/');
    return folders
        .map(folder => (folder === 'api' ? 'API' : folder.charAt(0).toUpperCase() + folder.slice(1)))
        .join('/');
}
exports.capitalizePath = capitalizePath;
