import * as ts from 'typescript';
declare class NgModuleEditor {
    filePath: string;
    _content: string;
    constructor(filePath: any);
    readonly source: ts.SourceFile;
    readonly content: string;
    insertAfter(pos: any, text: any): void;
    relativeTo(importPath: string): string;
    addMetadata(metadataField: string, symbolName: string, importPath: string): void;
    addImport(symbolName: string, importPath: string): void;
    addDeclaration(symbolName: string, importPath: string): void;
    addProvider(symbolName: string, importPath: string): void;
    addExport(symbolName: string, importPath: string): void;
    addEntryComponent(symbolName: string, importPath: string): void;
    save(): void;
}
declare const addSymbolToNgModule: (modulePath: string, metadataField: string, symbolName: string, importPath: string) => void;
declare const addImportToNgModule: (modulePath: string, symbolName: string, importPath: string) => void;
declare const addDeclarationToNgModule: (modulePath: string, symbolName: string, importPath: string) => void;
declare const addProviderToNgModule: (modulePath: string, symbolName: string, importPath: string) => void;
declare const addExportToNgModule: (modulePath: string, symbolName: string, importPath: string) => void;
declare const addEntryComponentToNgModule: (modulePath: string, symbolName: string, importPath: string) => void;
declare function findModules(from: string, moduleWildcards?: string[]): string[];
export { NgModuleEditor, addSymbolToNgModule, addImportToNgModule, addDeclarationToNgModule, addProviderToNgModule, addExportToNgModule, addEntryComponentToNgModule, findModules };
