"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var matcher = require('matcher');
var ts = __importStar(require("typescript"));
var ast_utils_1 = require("@schematics/angular/utility/ast-utils");
var change_1 = require("@schematics/angular/utility/change");
function findUp(names, from) {
    var root = path.parse(from).root;
    var currentDir = from;
    while (currentDir && currentDir !== root) {
        var files = fs.readdirSync(currentDir);
        var matches = matcher(files, names);
        if (matches.length) {
            return matches.map(function (name) { return path.join(currentDir, name); });
        }
        currentDir = path.dirname(currentDir);
    }
    return [];
}
var NgModuleEditor = /** @class */ (function () {
    function NgModuleEditor(filePath) {
        this.filePath = filePath;
        this._content = '';
    }
    Object.defineProperty(NgModuleEditor.prototype, "source", {
        get: function () {
            return ts.createSourceFile(this.filePath, this.content, ts.ScriptTarget.Latest, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgModuleEditor.prototype, "content", {
        get: function () {
            if (!this._content) {
                this._content = fs.readFileSync(this.filePath, 'utf8');
            }
            return this._content;
        },
        enumerable: true,
        configurable: true
    });
    NgModuleEditor.prototype.insertAfter = function (pos, text) {
        var content = this.content;
        var pre = content.slice(0, pos);
        var post = content.slice(pos);
        this._content = "" + pre + text + post;
    };
    NgModuleEditor.prototype.relativeTo = function (targetPath) {
        var relativePath = path.relative(path.dirname(path.resolve(this.filePath)), path.resolve(targetPath)).replace('\\', '/')
            .replace(/.tns.ts$/, '.')
            .replace(/.ts$/, '');
        var pathPrefix = '';
        if (!relativePath) {
            pathPrefix = '.';
        }
        else if (!relativePath.startsWith('.')) {
            pathPrefix = "./";
        }
        if (pathPrefix && !pathPrefix.endsWith('/')) {
            pathPrefix += '/';
        }
        return pathPrefix + relativePath;
    };
    NgModuleEditor.prototype.addDeclaration = function (targetName, targetPath) {
        var declarationChanges = ast_utils_1.addDeclarationToModule(this.source, this.filePath, targetName, this.relativeTo(targetPath));
        for (var _i = 0, declarationChanges_1 = declarationChanges; _i < declarationChanges_1.length; _i++) {
            var change = declarationChanges_1[_i];
            if (change instanceof change_1.InsertChange) {
                this.insertAfter(change.pos, change.toAdd);
            }
        }
    };
    NgModuleEditor.prototype.addExport = function (targetName, targetPath) {
        var exportChanges = ast_utils_1.addExportToModule(this.source, this.filePath, targetName, this.relativeTo(targetPath));
        for (var _i = 0, exportChanges_1 = exportChanges; _i < exportChanges_1.length; _i++) {
            var change = exportChanges_1[_i];
            if (change instanceof change_1.InsertChange) {
                this.insertAfter(change.pos, change.toAdd);
            }
        }
    };
    NgModuleEditor.prototype.addEntryComponent = function (targetName, targetPath) {
        var entryComponentChanges = ast_utils_1.addEntryComponentToModule(this.source, this.filePath, targetName, this.relativeTo(targetPath));
        for (var _i = 0, entryComponentChanges_1 = entryComponentChanges; _i < entryComponentChanges_1.length; _i++) {
            var change = entryComponentChanges_1[_i];
            if (change instanceof change_1.InsertChange) {
                this.insertAfter(change.pos, change.toAdd);
            }
        }
    };
    NgModuleEditor.prototype.save = function () {
        fs.writeFileSync(this.filePath, this.content);
    };
    return NgModuleEditor;
}());
exports.NgModuleEditor = NgModuleEditor;
var addDeclarationToNgModule = function (modulePath, targetName, targetPath) {
    var tsModule = new NgModuleEditor(modulePath);
    tsModule.addDeclaration(targetName, targetPath);
    console.log(tsModule.content);
};
exports.addDeclarationToNgModule = addDeclarationToNgModule;
var addExportToNgModule = function (modulePath, targetName, targetPath) {
    var tsModule = new NgModuleEditor(modulePath);
    tsModule.addExport(targetName, targetPath);
};
exports.addExportToNgModule = addExportToNgModule;
var addEntryComponentToNgModule = function (modulePath, targetName, targetPath) {
    var tsModule = new NgModuleEditor(modulePath);
    tsModule.addEntryComponent(targetName, targetPath);
};
exports.addEntryComponentToNgModule = addEntryComponentToNgModule;
function findModules(from, moduleWildcards) {
    if (moduleWildcards === void 0) { moduleWildcards = ['*.module.ts', '*.module.tns.ts', '!*-routing.module.*']; }
    return findUp(moduleWildcards, from);
}
exports.findModules = findModules;
function process(componentName, componentPath) {
    var moduleFiles = findModules(path.dirname(componentPath));
    moduleFiles.map(function (moduleFile) {
        addDeclarationToNgModule(moduleFile, componentName, componentPath);
    });
}
