import { Plugin } from 'vite';
interface BabelPluginPrismjsOptions {
    languages?: string[] | 'all';
    plugins?: string[];
    theme?: string;
    css?: boolean;
}
declare function prismjsPlugin(options?: BabelPluginPrismjsOptions): Plugin;
export { prismjsPlugin };
export default prismjsPlugin;
