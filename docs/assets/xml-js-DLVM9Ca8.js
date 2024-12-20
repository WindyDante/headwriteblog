import{s as I}from"./sax-BzamgzLP.js";var d={isArray:function(r){return Array.isArray?Array.isArray(r):Object.prototype.toString.call(r)==="[object Array]"}},S=d.isArray,h={copyOptions:function(r){var e,n={};for(e in r)r.hasOwnProperty(e)&&(n[e]=r[e]);return n},ensureFlagExists:function(r,e){(!(r in e)||typeof e[r]!="boolean")&&(e[r]=!1)},ensureSpacesExists:function(r){(!("spaces"in r)||typeof r.spaces!="number"&&typeof r.spaces!="string")&&(r.spaces=0)},ensureAlwaysArrayExists:function(r){(!("alwaysArray"in r)||typeof r.alwaysArray!="boolean"&&!S(r.alwaysArray))&&(r.alwaysArray=!1)},ensureKeyExists:function(r,e){(!(r+"Key"in e)||typeof e[r+"Key"]!="string")&&(e[r+"Key"]=e.compact?"_"+r:r)},checkFnExists:function(r,e){return r+"Fn"in e}},H=I,c=h,K=d.isArray,t,i;function V(r){return t=c.copyOptions(r),c.ensureFlagExists("ignoreDeclaration",t),c.ensureFlagExists("ignoreInstruction",t),c.ensureFlagExists("ignoreAttributes",t),c.ensureFlagExists("ignoreText",t),c.ensureFlagExists("ignoreComment",t),c.ensureFlagExists("ignoreCdata",t),c.ensureFlagExists("ignoreDoctype",t),c.ensureFlagExists("compact",t),c.ensureFlagExists("alwaysChildren",t),c.ensureFlagExists("addParent",t),c.ensureFlagExists("trim",t),c.ensureFlagExists("nativeType",t),c.ensureFlagExists("nativeTypeAttributes",t),c.ensureFlagExists("sanitize",t),c.ensureFlagExists("instructionHasAttributes",t),c.ensureFlagExists("captureSpacesBetweenElements",t),c.ensureAlwaysArrayExists(t),c.ensureKeyExists("declaration",t),c.ensureKeyExists("instruction",t),c.ensureKeyExists("attributes",t),c.ensureKeyExists("text",t),c.ensureKeyExists("comment",t),c.ensureKeyExists("cdata",t),c.ensureKeyExists("doctype",t),c.ensureKeyExists("type",t),c.ensureKeyExists("name",t),c.ensureKeyExists("elements",t),c.ensureKeyExists("parent",t),c.checkFnExists("doctype",t),c.checkFnExists("instruction",t),c.checkFnExists("cdata",t),c.checkFnExists("comment",t),c.checkFnExists("text",t),c.checkFnExists("instructionName",t),c.checkFnExists("elementName",t),c.checkFnExists("attributeName",t),c.checkFnExists("attributeValue",t),c.checkFnExists("attributes",t),t}function w(r){var e=Number(r);if(!isNaN(e))return e;var n=r.toLowerCase();return n==="true"?!0:n==="false"?!1:r}function F(r,e){var n;if(t.compact){if(!i[t[r+"Key"]]&&(K(t.alwaysArray)?t.alwaysArray.indexOf(t[r+"Key"])!==-1:t.alwaysArray)&&(i[t[r+"Key"]]=[]),i[t[r+"Key"]]&&!K(i[t[r+"Key"]])&&(i[t[r+"Key"]]=[i[t[r+"Key"]]]),r+"Fn"in t&&typeof e=="string"&&(e=t[r+"Fn"](e,i)),r==="instruction"&&("instructionFn"in t||"instructionNameFn"in t)){for(n in e)if(e.hasOwnProperty(n))if("instructionFn"in t)e[n]=t.instructionFn(e[n],n,i);else{var a=e[n];delete e[n],e[t.instructionNameFn(n,a,i)]=a}}K(i[t[r+"Key"]])?i[t[r+"Key"]].push(e):i[t[r+"Key"]]=e}else{i[t.elementsKey]||(i[t.elementsKey]=[]);var s={};if(s[t.typeKey]=r,r==="instruction"){for(n in e)if(e.hasOwnProperty(n))break;s[t.nameKey]="instructionNameFn"in t?t.instructionNameFn(n,e,i):n,t.instructionHasAttributes?(s[t.attributesKey]=e[n][t.attributesKey],"instructionFn"in t&&(s[t.attributesKey]=t.instructionFn(s[t.attributesKey],n,i))):("instructionFn"in t&&(e[n]=t.instructionFn(e[n],n,i)),s[t.instructionKey]=e[n])}else r+"Fn"in t&&(e=t[r+"Fn"](e,i)),s[t[r+"Key"]]=e;t.addParent&&(s[t.parentKey]=i),i[t.elementsKey].push(s)}}function v(r){if("attributesFn"in t&&r&&(r=t.attributesFn(r,i)),(t.trim||"attributeValueFn"in t||"attributeNameFn"in t||t.nativeTypeAttributes)&&r){var e;for(e in r)if(r.hasOwnProperty(e)&&(t.trim&&(r[e]=r[e].trim()),t.nativeTypeAttributes&&(r[e]=w(r[e])),"attributeValueFn"in t&&(r[e]=t.attributeValueFn(r[e],e,i)),"attributeNameFn"in t)){var n=r[e];delete r[e],r[t.attributeNameFn(e,r[e],i)]=n}}return r}function _(r){var e={};if(r.body&&(r.name.toLowerCase()==="xml"||t.instructionHasAttributes)){for(var n=/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|(\w+))\s*/g,a;(a=n.exec(r.body))!==null;)e[a[1]]=a[2]||a[3]||a[4];e=v(e)}if(r.name.toLowerCase()==="xml"){if(t.ignoreDeclaration)return;i[t.declarationKey]={},Object.keys(e).length&&(i[t.declarationKey][t.attributesKey]=e),t.addParent&&(i[t.declarationKey][t.parentKey]=i)}else{if(t.ignoreInstruction)return;t.trim&&(r.body=r.body.trim());var s={};t.instructionHasAttributes&&Object.keys(e).length?(s[r.name]={},s[r.name][t.attributesKey]=e):s[r.name]=r.body,F("instruction",s)}}function J(r,e){var n;if(typeof r=="object"&&(e=r.attributes,r=r.name),e=v(e),"elementNameFn"in t&&(r=t.elementNameFn(r,i)),t.compact){if(n={},!t.ignoreAttributes&&e&&Object.keys(e).length){n[t.attributesKey]={};var a;for(a in e)e.hasOwnProperty(a)&&(n[t.attributesKey][a]=e[a])}!(r in i)&&(K(t.alwaysArray)?t.alwaysArray.indexOf(r)!==-1:t.alwaysArray)&&(i[r]=[]),i[r]&&!K(i[r])&&(i[r]=[i[r]]),K(i[r])?i[r].push(n):i[r]=n}else i[t.elementsKey]||(i[t.elementsKey]=[]),n={},n[t.typeKey]="element",n[t.nameKey]=r,!t.ignoreAttributes&&e&&Object.keys(e).length&&(n[t.attributesKey]=e),t.alwaysChildren&&(n[t.elementsKey]=[]),i[t.elementsKey].push(n);n[t.parentKey]=i,i=n}function B(r){t.ignoreText||!r.trim()&&!t.captureSpacesBetweenElements||(t.trim&&(r=r.trim()),t.nativeType&&(r=w(r)),t.sanitize&&(r=r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")),F("text",r))}function q(r){t.ignoreComment||(t.trim&&(r=r.trim()),F("comment",r))}function z(r){var e=i[t.parentKey];t.addParent||delete i[t.parentKey],i=e}function Q(r){t.ignoreCdata||(t.trim&&(r=r.trim()),F("cdata",r))}function o(r){t.ignoreDoctype||(r=r.replace(/^ /,""),t.trim&&(r=r.trim()),F("doctype",r))}function Y(r){r.note=r}var N=function(r,e){var n=H.parser(!0,{}),a={};if(i=a,t=V(e),n.opt={strictEntities:!0},n.onopentag=J,n.ontext=B,n.oncomment=q,n.onclosetag=z,n.onerror=Y,n.oncdata=Q,n.ondoctype=o,n.onprocessinginstruction=_,n.write(r).close(),a[t.elementsKey]){var s=a[t.elementsKey];delete a[t.elementsKey],a[t.elementsKey]=s,delete a.text}return a},A=h,G=N;function M(r){var e=A.copyOptions(r);return A.ensureSpacesExists(e),e}var R=function(r,e){var n,a,s,u;return n=M(e),a=G(r,n),u="compact"in n&&n.compact?"_parent":"parent","addParent"in n&&n.addParent?s=JSON.stringify(a,function(f,l){return f===u?"_":l},n.spaces):s=JSON.stringify(a,null,n.spaces),s.replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029")},y=h,U=d.isArray,E,m;function W(r){var e=y.copyOptions(r);return y.ensureFlagExists("ignoreDeclaration",e),y.ensureFlagExists("ignoreInstruction",e),y.ensureFlagExists("ignoreAttributes",e),y.ensureFlagExists("ignoreText",e),y.ensureFlagExists("ignoreComment",e),y.ensureFlagExists("ignoreCdata",e),y.ensureFlagExists("ignoreDoctype",e),y.ensureFlagExists("compact",e),y.ensureFlagExists("indentText",e),y.ensureFlagExists("indentCdata",e),y.ensureFlagExists("indentAttributes",e),y.ensureFlagExists("indentInstruction",e),y.ensureFlagExists("fullTagEmptyElement",e),y.ensureFlagExists("noQuotesForNativeAttributes",e),y.ensureSpacesExists(e),typeof e.spaces=="number"&&(e.spaces=Array(e.spaces+1).join(" ")),y.ensureKeyExists("declaration",e),y.ensureKeyExists("instruction",e),y.ensureKeyExists("attributes",e),y.ensureKeyExists("text",e),y.ensureKeyExists("comment",e),y.ensureKeyExists("cdata",e),y.ensureKeyExists("doctype",e),y.ensureKeyExists("type",e),y.ensureKeyExists("name",e),y.ensureKeyExists("elements",e),y.checkFnExists("doctype",e),y.checkFnExists("instruction",e),y.checkFnExists("cdata",e),y.checkFnExists("comment",e),y.checkFnExists("text",e),y.checkFnExists("instructionName",e),y.checkFnExists("elementName",e),y.checkFnExists("attributeName",e),y.checkFnExists("attributeValue",e),y.checkFnExists("attributes",e),y.checkFnExists("fullTagEmptyElement",e),e}function x(r,e,n){return(!n&&r.spaces?`
`:"")+Array(e+1).join(r.spaces)}function g(r,e,n){if(e.ignoreAttributes)return"";"attributesFn"in e&&(r=e.attributesFn(r,m,E));var a,s,u,f,l=[];for(a in r)r.hasOwnProperty(a)&&r[a]!==null&&r[a]!==void 0&&(f=e.noQuotesForNativeAttributes&&typeof r[a]!="string"?"":'"',s=""+r[a],s=s.replace(/"/g,"&quot;"),u="attributeNameFn"in e?e.attributeNameFn(a,s,m,E):a,l.push(e.spaces&&e.indentAttributes?x(e,n+1,!1):" "),l.push(u+"="+f+("attributeValueFn"in e?e.attributeValueFn(s,a,m,E):s)+f));return r&&Object.keys(r).length&&e.spaces&&e.indentAttributes&&l.push(x(e,n,!1)),l.join("")}function k(r,e,n){return E=r,m="xml",e.ignoreDeclaration?"":"<?xml"+g(r[e.attributesKey],e,n)+"?>"}function T(r,e,n){if(e.ignoreInstruction)return"";var a;for(a in r)if(r.hasOwnProperty(a))break;var s="instructionNameFn"in e?e.instructionNameFn(a,r[a],m,E):a;if(typeof r[a]=="object")return E=r,m=s,"<?"+s+g(r[a][e.attributesKey],e,n)+"?>";var u=r[a]?r[a]:"";return"instructionFn"in e&&(u=e.instructionFn(u,a,m,E)),"<?"+s+(u?" "+u:"")+"?>"}function O(r,e){return e.ignoreComment?"":"<!--"+("commentFn"in e?e.commentFn(r,m,E):r)+"-->"}function j(r,e){return e.ignoreCdata?"":"<![CDATA["+("cdataFn"in e?e.cdataFn(r,m,E):r.replace("]]>","]]]]><![CDATA[>"))+"]]>"}function C(r,e){return e.ignoreDoctype?"":"<!DOCTYPE "+("doctypeFn"in e?e.doctypeFn(r,m,E):r)+">"}function b(r,e){return e.ignoreText?"":(r=""+r,r=r.replace(/&amp;/g,"&"),r=r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),"textFn"in e?e.textFn(r,m,E):r)}function X(r,e){var n;if(r.elements&&r.elements.length)for(n=0;n<r.elements.length;++n)switch(r.elements[n][e.typeKey]){case"text":if(e.indentText)return!0;break;case"cdata":if(e.indentCdata)return!0;break;case"instruction":if(e.indentInstruction)return!0;break;case"doctype":case"comment":case"element":return!0;default:return!0}return!1}function Z(r,e,n){E=r,m=r.name;var a=[],s="elementNameFn"in e?e.elementNameFn(r.name,r):r.name;a.push("<"+s),r[e.attributesKey]&&a.push(g(r[e.attributesKey],e,n));var u=r[e.elementsKey]&&r[e.elementsKey].length||r[e.attributesKey]&&r[e.attributesKey]["xml:space"]==="preserve";return u||("fullTagEmptyElementFn"in e?u=e.fullTagEmptyElementFn(r.name,r):u=e.fullTagEmptyElement),u?(a.push(">"),r[e.elementsKey]&&r[e.elementsKey].length&&(a.push(P(r[e.elementsKey],e,n+1)),E=r,m=r.name),a.push(e.spaces&&X(r,e)?`
`+Array(n+1).join(e.spaces):""),a.push("</"+s+">")):a.push("/>"),a.join("")}function P(r,e,n,a){return r.reduce(function(s,u){var f=x(e,n,a&&!s);switch(u.type){case"element":return s+f+Z(u,e,n);case"comment":return s+f+O(u[e.commentKey],e);case"doctype":return s+f+C(u[e.doctypeKey],e);case"cdata":return s+(e.indentCdata?f:"")+j(u[e.cdataKey],e);case"text":return s+(e.indentText?f:"")+b(u[e.textKey],e);case"instruction":var l={};return l[u[e.nameKey]]=u[e.attributesKey]?u:u[e.instructionKey],s+(e.indentInstruction?f:"")+T(l,e,n)}},"")}function p(r,e,n){var a;for(a in r)if(r.hasOwnProperty(a))switch(a){case e.parentKey:case e.attributesKey:break;case e.textKey:if(e.indentText||n)return!0;break;case e.cdataKey:if(e.indentCdata||n)return!0;break;case e.instructionKey:if(e.indentInstruction||n)return!0;break;case e.doctypeKey:case e.commentKey:return!0;default:return!0}return!1}function L(r,e,n,a,s){E=r,m=e;var u="elementNameFn"in n?n.elementNameFn(e,r):e;if(typeof r>"u"||r===null||r==="")return"fullTagEmptyElementFn"in n&&n.fullTagEmptyElementFn(e,r)||n.fullTagEmptyElement?"<"+u+"></"+u+">":"<"+u+"/>";var f=[];if(e){if(f.push("<"+u),typeof r!="object")return f.push(">"+b(r,n)+"</"+u+">"),f.join("");r[n.attributesKey]&&f.push(g(r[n.attributesKey],n,a));var l=p(r,n,!0)||r[n.attributesKey]&&r[n.attributesKey]["xml:space"]==="preserve";if(l||("fullTagEmptyElementFn"in n?l=n.fullTagEmptyElementFn(e,r):l=n.fullTagEmptyElement),l)f.push(">");else return f.push("/>"),f.join("")}return f.push(D(r,n,a+1,!1)),E=r,m=e,e&&f.push((s?x(n,a,!1):"")+"</"+u+">"),f.join("")}function D(r,e,n,a){var s,u,f,l=[];for(u in r)if(r.hasOwnProperty(u))for(f=U(r[u])?r[u]:[r[u]],s=0;s<f.length;++s){switch(u){case e.declarationKey:l.push(k(f[s],e,n));break;case e.instructionKey:l.push((e.indentInstruction?x(e,n,a):"")+T(f[s],e,n));break;case e.attributesKey:case e.parentKey:break;case e.textKey:l.push((e.indentText?x(e,n,a):"")+b(f[s],e));break;case e.cdataKey:l.push((e.indentCdata?x(e,n,a):"")+j(f[s],e));break;case e.doctypeKey:l.push(x(e,n,a)+C(f[s],e));break;case e.commentKey:l.push(x(e,n,a)+O(f[s],e));break;default:l.push(x(e,n,a)+L(f[s],u,e,n,p(f[s],e)))}a=a&&!l.length}return l.join("")}var $=function(r,e){e=W(e);var n=[];return E=r,m="_root_",e.compact?n.push(D(r,e,0,!0)):(r[e.declarationKey]&&n.push(k(r[e.declarationKey],e,0)),r[e.elementsKey]&&r[e.elementsKey].length&&n.push(P(r[e.elementsKey],e,0,!n.length))),n.join("")},ee=$,re=function(r,e){r instanceof Buffer&&(r=r.toString());var n=null;if(typeof r=="string")try{n=JSON.parse(r)}catch{throw new Error("The JSON structure is invalid")}else n=r;return ee(n,e)},te=N,ne=R,ae=$,se=re,ue={xml2js:te,xml2json:ne,js2xml:ae,json2xml:se};export{ue as l};
