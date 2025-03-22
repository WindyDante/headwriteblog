"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismjsPlugin = void 0;
const core_1 = require("@babel/core");
const babel_plugin_prismjs_1 = __importDefault(require("babel-plugin-prismjs"));
function prismjsPlugin(options = {}) {
    let needSourceMap = true;
    function transform(id, code) {
        return core_1.transformSync(code, {
            babelrc: false,
            ast: true,
            plugins: [[babel_plugin_prismjs_1.default, options]],
            sourceMaps: needSourceMap,
            sourceFileName: id,
            configFile: false,
        });
    }
    return {
        name: 'prismjs',
        enforce: 'post',
        transform(code, id) {
            if (/\.(?:[jt]sx?|vue)$/.test(id) && !/node_modules/.test(id)) {
                const result = transform(id, code);
                if (result) {
                    return {
                        code: result.code,
                        map: result.map,
                    };
                }
            }
        },
    };
}
exports.prismjsPlugin = prismjsPlugin;
module.exports = prismjsPlugin;
module.exports['prismjsPlugin'] = prismjsPlugin;
module.exports['default'] = prismjsPlugin;
exports.default = prismjsPlugin;
//# sourceMappingURL=index.js.map