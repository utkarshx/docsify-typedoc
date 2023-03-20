import { DeclarationReflection, PageEvent, Renderer, RendererEvent } from 'typedoc';
import { MarkdownTheme } from 'typedoc-plugin-markdown';
export declare type FrontMatter = Record<string, string | boolean | number | null> | undefined;
export declare class PolymeshTheme extends MarkdownTheme {
    readmeTitle: string;
    readmeLabel?: string;
    indexLabel?: string;
    constructor(renderer: Renderer);
    toUrl(mapping: any, reflection: DeclarationReflection): string;
    onPageEnd(page: PageEvent<DeclarationReflection>): void;
    onRendererEnd(renderer: RendererEvent): void;
    getYamlItems(page: PageEvent<DeclarationReflection>): FrontMatter;
    getSidebarLabel(page: PageEvent<DeclarationReflection>): string | undefined;
    getSidebarPosition(page: PageEvent<DeclarationReflection>): "0.5" | "0" | null;
    getId(page: PageEvent<DeclarationReflection>): string;
    getTitle(page: PageEvent<DeclarationReflection>): string;
    getPageTitle(page: PageEvent<DeclarationReflection>): string;
    getName(page: PageEvent<DeclarationReflection>): string;
}
