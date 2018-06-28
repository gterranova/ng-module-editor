import * as fs from 'fs';
import * as path from 'path';
const matcher = require('matcher');
import * as ts from 'typescript';

import {
    addSymbolToNgModuleMetadata,
} from '@schematics/angular/utility/ast-utils';
import {
    buildRelativePath,
} from '@schematics/angular/utility/find-module';
import { InsertChange } from '@schematics/angular/utility/change';


function findUp(names: string | string[], from: string): string[] {

    const root = path.parse(from).root;

    let currentDir = from;

    while (currentDir && currentDir !== root) {

        let files = fs.readdirSync(currentDir);

        let matches = matcher(files, names);
        if (matches.length) {
            return matches.map(name => path.join(currentDir, name));
        }
        currentDir = path.dirname(currentDir);
    }
    return [];
}

class NgModuleEditor {
    filePath: string;
    _content: string;

    constructor(filePath) {
        this.filePath = filePath;
        this._content = '';
    }

    get source() {
        return ts.createSourceFile(this.filePath, this.content, ts.ScriptTarget.Latest, true)
    }

    get content() {
        if (!this._content) {
            this._content = fs.readFileSync(this.filePath, 'utf8');
        }
        return this._content;
    }

    insertAfter(pos, text) {
        let content = this.content;
        let pre = content.slice(0, pos);
        let post = content.slice(pos);
        this._content = `${pre}${text}${post}`;
    }

    relativeTo(importPath: string) {
        return buildRelativePath(path.resolve(this.filePath), 
            importPath.replace(/.tns.ts$/,'')
            .replace(/.ts$/,''));
    }

    addMetadata(metadataField: string, symbolName: string, importPath: string) {
        const changes = addSymbolToNgModuleMetadata(
            this.source,
            this.filePath,
            metadataField,
            symbolName,
            this.relativeTo(importPath));
    
        for (const change of changes) {
            if (change instanceof InsertChange) {
                this.insertAfter(change.pos, change.toAdd);
            }
        }        
    }

    addImport(symbolName: string, importPath: string) {
        this.addMetadata('imports', symbolName, importPath);
    }
    
    addDeclaration(symbolName: string, importPath: string) {
        this.addMetadata('declarations', symbolName, importPath);
    }

    addProvider(symbolName: string, importPath: string) {
        this.addMetadata('providers', symbolName, importPath);
    }
    
    addExport(symbolName: string, importPath: string) {
        this.addMetadata('exports', symbolName, importPath);
    }

    addEntryComponent(symbolName: string, importPath: string) {
        this.addMetadata('entryComponent', symbolName, importPath);
    }

    save() {
        fs.writeFileSync(this.filePath, this.content);
    }
}

const addSymbolToNgModule = (
    modulePath: string,
    metadataField: string,
    symbolName: string,
    importPath: string) => {

    const tsModule = new NgModuleEditor(modulePath);
    tsModule.addMetadata(metadataField, symbolName, importPath);
    tsModule.save();
};

const addImportToNgModule = (
    modulePath: string,
    symbolName: string,
    importPath: string) => {
    addSymbolToNgModule(modulePath, 'imports', symbolName, importPath);
};

const addDeclarationToNgModule = (
    modulePath: string,
    symbolName: string,
    importPath: string) => {
    addSymbolToNgModule(modulePath, 'declarations', symbolName, importPath);
};

const addProviderToNgModule = (
    modulePath: string,
    symbolName: string,
    importPath: string) => {
    addSymbolToNgModule(modulePath, 'providers', symbolName, importPath);
};

const addExportToNgModule = (
    modulePath: string,
    symbolName: string,
    importPath: string) => {
    addSymbolToNgModule(modulePath, 'exports', symbolName, importPath);
};

const addEntryComponentToNgModule = (
    modulePath: string,
    symbolName: string,
    importPath: string) => {
    addSymbolToNgModule(modulePath, 'entryComponents', symbolName, importPath);
};

function findModules(from: string, moduleWildcards: string[] = ['*.module.ts', '*.module.tns.ts', '!*-routing.module.*']): string[] {
    return findUp(moduleWildcards, from);
}

export {NgModuleEditor, addSymbolToNgModule, addImportToNgModule, addDeclarationToNgModule, addProviderToNgModule, addExportToNgModule, addEntryComponentToNgModule, findModules};
