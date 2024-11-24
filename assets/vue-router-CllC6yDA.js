import{b5 as ot,bi as W,b3 as st,af as q,as as ct,M as ze,aQ as it,q as N,a5 as Ge,aM as le,aS as at,bC as lt}from"./@vue-Cn0pJ44W.js";/*!
  * vue-router v4.4.5
  * (c) 2024 Eduardo San Martin Morote
  * @license MIT
  */const G=typeof document<"u";function Ke(e){return typeof e=="object"||"displayName"in e||"props"in e||"__vccOpts"in e}function ut(e){return e.__esModule||e[Symbol.toStringTag]==="Module"||e.default&&Ke(e.default)}const P=Object.assign;function ue(e,t){const n={};for(const r in t){const o=t[r];n[r]=L(o)?o.map(e):e(o)}return n}const F=()=>{},L=Array.isArray,Ve=/#/g,ft=/&/g,ht=/\//g,pt=/=/g,dt=/\?/g,Ue=/\+/g,mt=/%5B/g,gt=/%5D/g,De=/%5E/g,vt=/%60/g,Qe=/%7B/g,yt=/%7C/g,We=/%7D/g,Rt=/%20/g;function ge(e){return encodeURI(""+e).replace(yt,"|").replace(mt,"[").replace(gt,"]")}function Et(e){return ge(e).replace(Qe,"{").replace(We,"}").replace(De,"^")}function pe(e){return ge(e).replace(Ue,"%2B").replace(Rt,"+").replace(Ve,"%23").replace(ft,"%26").replace(vt,"`").replace(Qe,"{").replace(We,"}").replace(De,"^")}function wt(e){return pe(e).replace(pt,"%3D")}function Pt(e){return ge(e).replace(Ve,"%23").replace(dt,"%3F")}function St(e){return e==null?"":Pt(e).replace(ht,"%2F")}function X(e){try{return decodeURIComponent(""+e)}catch{}return""+e}const bt=/\/$/,Ct=e=>e.replace(bt,"");function fe(e,t,n="/"){let r,o={},a="",p="";const g=t.indexOf("#");let c=t.indexOf("?");return g<c&&g>=0&&(c=-1),c>-1&&(r=t.slice(0,c),a=t.slice(c+1,g>-1?g:t.length),o=e(a)),g>-1&&(r=r||t.slice(0,g),p=t.slice(g,t.length)),r=Ot(r??t,n),{fullPath:r+(a&&"?")+a+p,path:r,query:o,hash:X(p)}}function kt(e,t){const n=t.query?e(t.query):"";return t.path+(n&&"?")+n+(t.hash||"")}function be(e,t){return!t||!e.toLowerCase().startsWith(t.toLowerCase())?e:e.slice(t.length)||"/"}function At(e,t,n){const r=t.matched.length-1,o=n.matched.length-1;return r>-1&&r===o&&K(t.matched[r],n.matched[o])&&Fe(t.params,n.params)&&e(t.query)===e(n.query)&&t.hash===n.hash}function K(e,t){return(e.aliasOf||e)===(t.aliasOf||t)}function Fe(e,t){if(Object.keys(e).length!==Object.keys(t).length)return!1;for(const n in e)if(!_t(e[n],t[n]))return!1;return!0}function _t(e,t){return L(e)?Ce(e,t):L(t)?Ce(t,e):e===t}function Ce(e,t){return L(t)?e.length===t.length&&e.every((n,r)=>n===t[r]):e.length===1&&e[0]===t}function Ot(e,t){if(e.startsWith("/"))return e;if(!e)return t;const n=t.split("/"),r=e.split("/"),o=r[r.length-1];(o===".."||o===".")&&r.push("");let a=n.length-1,p,g;for(p=0;p<r.length;p++)if(g=r[p],g!==".")if(g==="..")a>1&&a--;else break;return n.slice(0,a).join("/")+"/"+r.slice(p).join("/")}const H={path:"/",name:void 0,params:{},query:{},hash:"",fullPath:"/",matched:[],meta:{},redirectedFrom:void 0};var Z;(function(e){e.pop="pop",e.push="push"})(Z||(Z={}));var Y;(function(e){e.back="back",e.forward="forward",e.unknown=""})(Y||(Y={}));function xt(e){if(!e)if(G){const t=document.querySelector("base");e=t&&t.getAttribute("href")||"/",e=e.replace(/^\w+:\/\/[^\/]+/,"")}else e="/";return e[0]!=="/"&&e[0]!=="#"&&(e="/"+e),Ct(e)}const Mt=/^[^#]+#/;function It(e,t){return e.replace(Mt,"#")+t}function Lt(e,t){const n=document.documentElement.getBoundingClientRect(),r=e.getBoundingClientRect();return{behavior:t.behavior,left:r.left-n.left-(t.left||0),top:r.top-n.top-(t.top||0)}}const te=()=>({left:window.scrollX,top:window.scrollY});function Nt(e){let t;if("el"in e){const n=e.el,r=typeof n=="string"&&n.startsWith("#"),o=typeof n=="string"?r?document.getElementById(n.slice(1)):document.querySelector(n):n;if(!o)return;t=Lt(o,e)}else t=e;"scrollBehavior"in document.documentElement.style?window.scrollTo(t):window.scrollTo(t.left!=null?t.left:window.scrollX,t.top!=null?t.top:window.scrollY)}function ke(e,t){return(history.state?history.state.position-t:-1)+e}const de=new Map;function Tt(e,t){de.set(e,t)}function $t(e){const t=de.get(e);return de.delete(e),t}let Ht=()=>location.protocol+"//"+location.host;function Ye(e,t){const{pathname:n,search:r,hash:o}=t,a=e.indexOf("#");if(a>-1){let g=o.includes(e.slice(a))?e.slice(a).length:1,c=o.slice(g);return c[0]!=="/"&&(c="/"+c),be(c,"")}return be(n,e)+r+o}function jt(e,t,n,r){let o=[],a=[],p=null;const g=({state:l})=>{const u=Ye(e,location),w=n.value,S=t.value;let k=0;if(l){if(n.value=u,t.value=l,p&&p===w){p=null;return}k=S?l.position-S.position:0}else r(u);o.forEach(A=>{A(n.value,w,{delta:k,type:Z.pop,direction:k?k>0?Y.forward:Y.back:Y.unknown})})};function c(){p=n.value}function f(l){o.push(l);const u=()=>{const w=o.indexOf(l);w>-1&&o.splice(w,1)};return a.push(u),u}function h(){const{history:l}=window;l.state&&l.replaceState(P({},l.state,{scroll:te()}),"")}function i(){for(const l of a)l();a=[],window.removeEventListener("popstate",g),window.removeEventListener("beforeunload",h)}return window.addEventListener("popstate",g),window.addEventListener("beforeunload",h,{passive:!0}),{pauseListeners:c,listen:f,destroy:i}}function Ae(e,t,n,r=!1,o=!1){return{back:e,current:t,forward:n,replaced:r,position:window.history.length,scroll:o?te():null}}function Bt(e){const{history:t,location:n}=window,r={value:Ye(e,n)},o={value:t.state};o.value||a(r.value,{back:null,current:r.value,forward:null,position:t.length-1,replaced:!0,scroll:null},!0);function a(c,f,h){const i=e.indexOf("#"),l=i>-1?(n.host&&document.querySelector("base")?e:e.slice(i))+c:Ht()+e+c;try{t[h?"replaceState":"pushState"](f,"",l),o.value=f}catch(u){console.error(u),n[h?"replace":"assign"](l)}}function p(c,f){const h=P({},t.state,Ae(o.value.back,c,o.value.forward,!0),f,{position:o.value.position});a(c,h,!0),r.value=c}function g(c,f){const h=P({},o.value,t.state,{forward:c,scroll:te()});a(h.current,h,!0);const i=P({},Ae(r.value,c,null),{position:h.position+1},f);a(c,i,!1),r.value=c}return{location:r,state:o,push:g,replace:p}}function qt(e){e=xt(e);const t=Bt(e),n=jt(e,t.state,t.location,t.replace);function r(a,p=!0){p||n.pauseListeners(),history.go(a)}const o=P({location:"",base:e,go:r,createHref:It.bind(null,e)},t,n);return Object.defineProperty(o,"location",{enumerable:!0,get:()=>t.location.value}),Object.defineProperty(o,"state",{enumerable:!0,get:()=>t.state.value}),o}function pn(e){return e=location.host?e||location.pathname+location.search:"",e.includes("#")||(e+="#"),qt(e)}function zt(e){return typeof e=="string"||e&&typeof e=="object"}function Xe(e){return typeof e=="string"||typeof e=="symbol"}const Ze=Symbol("");var _e;(function(e){e[e.aborted=4]="aborted",e[e.cancelled=8]="cancelled",e[e.duplicated=16]="duplicated"})(_e||(_e={}));function V(e,t){return P(new Error,{type:e,[Ze]:!0},t)}function T(e,t){return e instanceof Error&&Ze in e&&(t==null||!!(e.type&t))}const Oe="[^/]+?",Gt={sensitive:!1,strict:!1,start:!0,end:!0},Kt=/[.+*?^${}()[\]/\\]/g;function Vt(e,t){const n=P({},Gt,t),r=[];let o=n.start?"^":"";const a=[];for(const f of e){const h=f.length?[]:[90];n.strict&&!f.length&&(o+="/");for(let i=0;i<f.length;i++){const l=f[i];let u=40+(n.sensitive?.25:0);if(l.type===0)i||(o+="/"),o+=l.value.replace(Kt,"\\$&"),u+=40;else if(l.type===1){const{value:w,repeatable:S,optional:k,regexp:A}=l;a.push({name:w,repeatable:S,optional:k});const E=A||Oe;if(E!==Oe){u+=10;try{new RegExp(`(${E})`)}catch(I){throw new Error(`Invalid custom RegExp for param "${w}" (${E}): `+I.message)}}let b=S?`((?:${E})(?:/(?:${E}))*)`:`(${E})`;i||(b=k&&f.length<2?`(?:/${b})`:"/"+b),k&&(b+="?"),o+=b,u+=20,k&&(u+=-8),S&&(u+=-20),E===".*"&&(u+=-50)}h.push(u)}r.push(h)}if(n.strict&&n.end){const f=r.length-1;r[f][r[f].length-1]+=.7000000000000001}n.strict||(o+="/?"),n.end?o+="$":n.strict&&(o+="(?:/|$)");const p=new RegExp(o,n.sensitive?"":"i");function g(f){const h=f.match(p),i={};if(!h)return null;for(let l=1;l<h.length;l++){const u=h[l]||"",w=a[l-1];i[w.name]=u&&w.repeatable?u.split("/"):u}return i}function c(f){let h="",i=!1;for(const l of e){(!i||!h.endsWith("/"))&&(h+="/"),i=!1;for(const u of l)if(u.type===0)h+=u.value;else if(u.type===1){const{value:w,repeatable:S,optional:k}=u,A=w in f?f[w]:"";if(L(A)&&!S)throw new Error(`Provided param "${w}" is an array but it is not repeatable (* or + modifiers)`);const E=L(A)?A.join("/"):A;if(!E)if(k)l.length<2&&(h.endsWith("/")?h=h.slice(0,-1):i=!0);else throw new Error(`Missing required param "${w}"`);h+=E}}return h||"/"}return{re:p,score:r,keys:a,parse:g,stringify:c}}function Ut(e,t){let n=0;for(;n<e.length&&n<t.length;){const r=t[n]-e[n];if(r)return r;n++}return e.length<t.length?e.length===1&&e[0]===80?-1:1:e.length>t.length?t.length===1&&t[0]===80?1:-1:0}function Je(e,t){let n=0;const r=e.score,o=t.score;for(;n<r.length&&n<o.length;){const a=Ut(r[n],o[n]);if(a)return a;n++}if(Math.abs(o.length-r.length)===1){if(xe(r))return 1;if(xe(o))return-1}return o.length-r.length}function xe(e){const t=e[e.length-1];return e.length>0&&t[t.length-1]<0}const Dt={type:0,value:""},Qt=/[a-zA-Z0-9_]/;function Wt(e){if(!e)return[[]];if(e==="/")return[[Dt]];if(!e.startsWith("/"))throw new Error(`Invalid path "${e}"`);function t(u){throw new Error(`ERR (${n})/"${f}": ${u}`)}let n=0,r=n;const o=[];let a;function p(){a&&o.push(a),a=[]}let g=0,c,f="",h="";function i(){f&&(n===0?a.push({type:0,value:f}):n===1||n===2||n===3?(a.length>1&&(c==="*"||c==="+")&&t(`A repeatable param (${f}) must be alone in its segment. eg: '/:ids+.`),a.push({type:1,value:f,regexp:h,repeatable:c==="*"||c==="+",optional:c==="*"||c==="?"})):t("Invalid state to consume buffer"),f="")}function l(){f+=c}for(;g<e.length;){if(c=e[g++],c==="\\"&&n!==2){r=n,n=4;continue}switch(n){case 0:c==="/"?(f&&i(),p()):c===":"?(i(),n=1):l();break;case 4:l(),n=r;break;case 1:c==="("?n=2:Qt.test(c)?l():(i(),n=0,c!=="*"&&c!=="?"&&c!=="+"&&g--);break;case 2:c===")"?h[h.length-1]=="\\"?h=h.slice(0,-1)+c:n=3:h+=c;break;case 3:i(),n=0,c!=="*"&&c!=="?"&&c!=="+"&&g--,h="";break;default:t("Unknown state");break}}return n===2&&t(`Unfinished custom RegExp for param "${f}"`),i(),p(),o}function Ft(e,t,n){const r=Vt(Wt(e.path),n),o=P(r,{record:e,parent:t,children:[],alias:[]});return t&&!o.record.aliasOf==!t.record.aliasOf&&t.children.push(o),o}function Yt(e,t){const n=[],r=new Map;t=Ne({strict:!1,end:!0,sensitive:!1},t);function o(i){return r.get(i)}function a(i,l,u){const w=!u,S=Ie(i);S.aliasOf=u&&u.record;const k=Ne(t,i),A=[S];if("alias"in i){const I=typeof i.alias=="string"?[i.alias]:i.alias;for(const B of I)A.push(Ie(P({},S,{components:u?u.record.components:S.components,path:B,aliasOf:u?u.record:S})))}let E,b;for(const I of A){const{path:B}=I;if(l&&B[0]!=="/"){const $=l.record.path,M=$[$.length-1]==="/"?"":"/";I.path=l.record.path+(B&&M+B)}if(E=Ft(I,l,k),u?u.alias.push(E):(b=b||E,b!==E&&b.alias.push(E),w&&i.name&&!Le(E)&&p(i.name)),et(E)&&c(E),S.children){const $=S.children;for(let M=0;M<$.length;M++)a($[M],E,u&&u.children[M])}u=u||E}return b?()=>{p(b)}:F}function p(i){if(Xe(i)){const l=r.get(i);l&&(r.delete(i),n.splice(n.indexOf(l),1),l.children.forEach(p),l.alias.forEach(p))}else{const l=n.indexOf(i);l>-1&&(n.splice(l,1),i.record.name&&r.delete(i.record.name),i.children.forEach(p),i.alias.forEach(p))}}function g(){return n}function c(i){const l=Jt(i,n);n.splice(l,0,i),i.record.name&&!Le(i)&&r.set(i.record.name,i)}function f(i,l){let u,w={},S,k;if("name"in i&&i.name){if(u=r.get(i.name),!u)throw V(1,{location:i});k=u.record.name,w=P(Me(l.params,u.keys.filter(b=>!b.optional).concat(u.parent?u.parent.keys.filter(b=>b.optional):[]).map(b=>b.name)),i.params&&Me(i.params,u.keys.map(b=>b.name))),S=u.stringify(w)}else if(i.path!=null)S=i.path,u=n.find(b=>b.re.test(S)),u&&(w=u.parse(S),k=u.record.name);else{if(u=l.name?r.get(l.name):n.find(b=>b.re.test(l.path)),!u)throw V(1,{location:i,currentLocation:l});k=u.record.name,w=P({},l.params,i.params),S=u.stringify(w)}const A=[];let E=u;for(;E;)A.unshift(E.record),E=E.parent;return{name:k,path:S,params:w,matched:A,meta:Zt(A)}}e.forEach(i=>a(i));function h(){n.length=0,r.clear()}return{addRoute:a,resolve:f,removeRoute:p,clearRoutes:h,getRoutes:g,getRecordMatcher:o}}function Me(e,t){const n={};for(const r of t)r in e&&(n[r]=e[r]);return n}function Ie(e){const t={path:e.path,redirect:e.redirect,name:e.name,meta:e.meta||{},aliasOf:e.aliasOf,beforeEnter:e.beforeEnter,props:Xt(e),children:e.children||[],instances:{},leaveGuards:new Set,updateGuards:new Set,enterCallbacks:{},components:"components"in e?e.components||null:e.component&&{default:e.component}};return Object.defineProperty(t,"mods",{value:{}}),t}function Xt(e){const t={},n=e.props||!1;if("component"in e)t.default=n;else for(const r in e.components)t[r]=typeof n=="object"?n[r]:n;return t}function Le(e){for(;e;){if(e.record.aliasOf)return!0;e=e.parent}return!1}function Zt(e){return e.reduce((t,n)=>P(t,n.meta),{})}function Ne(e,t){const n={};for(const r in e)n[r]=r in t?t[r]:e[r];return n}function Jt(e,t){let n=0,r=t.length;for(;n!==r;){const a=n+r>>1;Je(e,t[a])<0?r=a:n=a+1}const o=en(e);return o&&(r=t.lastIndexOf(o,r-1)),r}function en(e){let t=e;for(;t=t.parent;)if(et(t)&&Je(e,t)===0)return t}function et({record:e}){return!!(e.name||e.components&&Object.keys(e.components).length||e.redirect)}function tn(e){const t={};if(e===""||e==="?")return t;const r=(e[0]==="?"?e.slice(1):e).split("&");for(let o=0;o<r.length;++o){const a=r[o].replace(Ue," "),p=a.indexOf("="),g=X(p<0?a:a.slice(0,p)),c=p<0?null:X(a.slice(p+1));if(g in t){let f=t[g];L(f)||(f=t[g]=[f]),f.push(c)}else t[g]=c}return t}function Te(e){let t="";for(let n in e){const r=e[n];if(n=wt(n),r==null){r!==void 0&&(t+=(t.length?"&":"")+n);continue}(L(r)?r.map(a=>a&&pe(a)):[r&&pe(r)]).forEach(a=>{a!==void 0&&(t+=(t.length?"&":"")+n,a!=null&&(t+="="+a))})}return t}function nn(e){const t={};for(const n in e){const r=e[n];r!==void 0&&(t[n]=L(r)?r.map(o=>o==null?null:""+o):r==null?r:""+r)}return t}const rn=Symbol(""),$e=Symbol(""),ne=Symbol(""),ve=Symbol(""),me=Symbol("");function Q(){let e=[];function t(r){return e.push(r),()=>{const o=e.indexOf(r);o>-1&&e.splice(o,1)}}function n(){e=[]}return{add:t,list:()=>e.slice(),reset:n}}function j(e,t,n,r,o,a=p=>p()){const p=r&&(r.enterCallbacks[o]=r.enterCallbacks[o]||[]);return()=>new Promise((g,c)=>{const f=l=>{l===!1?c(V(4,{from:n,to:t})):l instanceof Error?c(l):zt(l)?c(V(2,{from:t,to:l})):(p&&r.enterCallbacks[o]===p&&typeof l=="function"&&p.push(l),g())},h=a(()=>e.call(r&&r.instances[o],t,n,f));let i=Promise.resolve(h);e.length<3&&(i=i.then(f)),i.catch(l=>c(l))})}function he(e,t,n,r,o=a=>a()){const a=[];for(const p of e)for(const g in p.components){let c=p.components[g];if(!(t!=="beforeRouteEnter"&&!p.instances[g]))if(Ke(c)){const h=(c.__vccOpts||c)[t];h&&a.push(j(h,n,r,p,g,o))}else{let f=c();a.push(()=>f.then(h=>{if(!h)throw new Error(`Couldn't resolve component "${g}" at "${p.path}"`);const i=ut(h)?h.default:h;p.mods[g]=h,p.components[g]=i;const u=(i.__vccOpts||i)[t];return u&&j(u,n,r,p,g,o)()}))}}return a}function He(e){const t=q(ne),n=q(ve),r=N(()=>{const c=W(e.to);return t.resolve(c)}),o=N(()=>{const{matched:c}=r.value,{length:f}=c,h=c[f-1],i=n.matched;if(!h||!i.length)return-1;const l=i.findIndex(K.bind(null,h));if(l>-1)return l;const u=je(c[f-2]);return f>1&&je(h)===u&&i[i.length-1].path!==u?i.findIndex(K.bind(null,c[f-2])):l}),a=N(()=>o.value>-1&&an(n.params,r.value.params)),p=N(()=>o.value>-1&&o.value===n.matched.length-1&&Fe(n.params,r.value.params));function g(c={}){return cn(c)?t[W(e.replace)?"replace":"push"](W(e.to)).catch(F):Promise.resolve()}return{route:r,href:N(()=>r.value.href),isActive:a,isExactActive:p,navigate:g}}const on=ze({name:"RouterLink",compatConfig:{MODE:3},props:{to:{type:[String,Object],required:!0},replace:Boolean,activeClass:String,exactActiveClass:String,custom:Boolean,ariaCurrentValue:{type:String,default:"page"}},useLink:He,setup(e,{slots:t}){const n=it(He(e)),{options:r}=q(ne),o=N(()=>({[Be(e.activeClass,r.linkActiveClass,"router-link-active")]:n.isActive,[Be(e.exactActiveClass,r.linkExactActiveClass,"router-link-exact-active")]:n.isExactActive}));return()=>{const a=t.default&&t.default(n);return e.custom?a:Ge("a",{"aria-current":n.isExactActive?e.ariaCurrentValue:null,href:n.href,onClick:n.navigate,class:o.value},a)}}}),sn=on;function cn(e){if(!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)&&!e.defaultPrevented&&!(e.button!==void 0&&e.button!==0)){if(e.currentTarget&&e.currentTarget.getAttribute){const t=e.currentTarget.getAttribute("target");if(/\b_blank\b/i.test(t))return}return e.preventDefault&&e.preventDefault(),!0}}function an(e,t){for(const n in t){const r=t[n],o=e[n];if(typeof r=="string"){if(r!==o)return!1}else if(!L(o)||o.length!==r.length||r.some((a,p)=>a!==o[p]))return!1}return!0}function je(e){return e?e.aliasOf?e.aliasOf.path:e.path:""}const Be=(e,t,n)=>e??t??n,ln=ze({name:"RouterView",inheritAttrs:!1,props:{name:{type:String,default:"default"},route:Object},compatConfig:{MODE:3},setup(e,{attrs:t,slots:n}){const r=q(me),o=N(()=>e.route||r.value),a=q($e,0),p=N(()=>{let f=W(a);const{matched:h}=o.value;let i;for(;(i=h[f])&&!i.components;)f++;return f}),g=N(()=>o.value.matched[p.value]);le($e,N(()=>p.value+1)),le(rn,g),le(me,o);const c=at();return lt(()=>[c.value,g.value,e.name],([f,h,i],[l,u,w])=>{h&&(h.instances[i]=f,u&&u!==h&&f&&f===l&&(h.leaveGuards.size||(h.leaveGuards=u.leaveGuards),h.updateGuards.size||(h.updateGuards=u.updateGuards))),f&&h&&(!u||!K(h,u)||!l)&&(h.enterCallbacks[i]||[]).forEach(S=>S(f))},{flush:"post"}),()=>{const f=o.value,h=e.name,i=g.value,l=i&&i.components[h];if(!l)return qe(n.default,{Component:l,route:f});const u=i.props[h],w=u?u===!0?f.params:typeof u=="function"?u(f):u:null,k=Ge(l,P({},w,t,{onVnodeUnmounted:A=>{A.component.isUnmounted&&(i.instances[h]=null)},ref:c}));return qe(n.default,{Component:k,route:f})||k}}});function qe(e,t){if(!e)return null;const n=e(t);return n.length===1?n[0]:n}const un=ln;function dn(e){const t=Yt(e.routes,e),n=e.parseQuery||tn,r=e.stringifyQuery||Te,o=e.history,a=Q(),p=Q(),g=Q(),c=ot(H);let f=H;G&&e.scrollBehavior&&"scrollRestoration"in history&&(history.scrollRestoration="manual");const h=ue.bind(null,s=>""+s),i=ue.bind(null,St),l=ue.bind(null,X);function u(s,m){let d,v;return Xe(s)?(d=t.getRecordMatcher(s),v=m):v=s,t.addRoute(v,d)}function w(s){const m=t.getRecordMatcher(s);m&&t.removeRoute(m)}function S(){return t.getRoutes().map(s=>s.record)}function k(s){return!!t.getRecordMatcher(s)}function A(s,m){if(m=P({},m||c.value),typeof s=="string"){const y=fe(n,s,m.path),O=t.resolve({path:y.path},m),D=o.createHref(y.fullPath);return P(y,O,{params:l(O.params),hash:X(y.hash),redirectedFrom:void 0,href:D})}let d;if(s.path!=null)d=P({},s,{path:fe(n,s.path,m.path).path});else{const y=P({},s.params);for(const O in y)y[O]==null&&delete y[O];d=P({},s,{params:i(y)}),m.params=i(m.params)}const v=t.resolve(d,m),C=s.hash||"";v.params=h(l(v.params));const _=kt(r,P({},s,{hash:Et(C),path:v.path})),R=o.createHref(_);return P({fullPath:_,hash:C,query:r===Te?nn(s.query):s.query||{}},v,{redirectedFrom:void 0,href:R})}function E(s){return typeof s=="string"?fe(n,s,c.value.path):P({},s)}function b(s,m){if(f!==s)return V(8,{from:m,to:s})}function I(s){return M(s)}function B(s){return I(P(E(s),{replace:!0}))}function $(s){const m=s.matched[s.matched.length-1];if(m&&m.redirect){const{redirect:d}=m;let v=typeof d=="function"?d(s):d;return typeof v=="string"&&(v=v.includes("?")||v.includes("#")?v=E(v):{path:v},v.params={}),P({query:s.query,hash:s.hash,params:v.path!=null?{}:s.params},v)}}function M(s,m){const d=f=A(s),v=c.value,C=s.state,_=s.force,R=s.replace===!0,y=$(d);if(y)return M(P(E(y),{state:typeof y=="object"?P({},C,y.state):C,force:_,replace:R}),m||d);const O=d;O.redirectedFrom=m;let D;return!_&&At(r,v,d)&&(D=V(16,{to:O,from:v}),Pe(v,v,!0,!1)),(D?Promise.resolve(D):ye(O,v)).catch(x=>T(x)?T(x,2)?x:ce(x):se(x,O,v)).then(x=>{if(x){if(T(x,2))return M(P({replace:R},E(x.to),{state:typeof x.to=="object"?P({},C,x.to.state):C,force:_}),m||O)}else x=Ee(O,v,!0,R,C);return Re(O,v,x),x})}function tt(s,m){const d=b(s,m);return d?Promise.reject(d):Promise.resolve()}function re(s){const m=ee.values().next().value;return m&&typeof m.runWithContext=="function"?m.runWithContext(s):s()}function ye(s,m){let d;const[v,C,_]=fn(s,m);d=he(v.reverse(),"beforeRouteLeave",s,m);for(const y of v)y.leaveGuards.forEach(O=>{d.push(j(O,s,m))});const R=tt.bind(null,s,m);return d.push(R),z(d).then(()=>{d=[];for(const y of a.list())d.push(j(y,s,m));return d.push(R),z(d)}).then(()=>{d=he(C,"beforeRouteUpdate",s,m);for(const y of C)y.updateGuards.forEach(O=>{d.push(j(O,s,m))});return d.push(R),z(d)}).then(()=>{d=[];for(const y of _)if(y.beforeEnter)if(L(y.beforeEnter))for(const O of y.beforeEnter)d.push(j(O,s,m));else d.push(j(y.beforeEnter,s,m));return d.push(R),z(d)}).then(()=>(s.matched.forEach(y=>y.enterCallbacks={}),d=he(_,"beforeRouteEnter",s,m,re),d.push(R),z(d))).then(()=>{d=[];for(const y of p.list())d.push(j(y,s,m));return d.push(R),z(d)}).catch(y=>T(y,8)?y:Promise.reject(y))}function Re(s,m,d){g.list().forEach(v=>re(()=>v(s,m,d)))}function Ee(s,m,d,v,C){const _=b(s,m);if(_)return _;const R=m===H,y=G?history.state:{};d&&(v||R?o.replace(s.fullPath,P({scroll:R&&y&&y.scroll},C)):o.push(s.fullPath,C)),c.value=s,Pe(s,m,d,R),ce()}let U;function nt(){U||(U=o.listen((s,m,d)=>{if(!Se.listening)return;const v=A(s),C=$(v);if(C){M(P(C,{replace:!0}),v).catch(F);return}f=v;const _=c.value;G&&Tt(ke(_.fullPath,d.delta),te()),ye(v,_).catch(R=>T(R,12)?R:T(R,2)?(M(R.to,v).then(y=>{T(y,20)&&!d.delta&&d.type===Z.pop&&o.go(-1,!1)}).catch(F),Promise.reject()):(d.delta&&o.go(-d.delta,!1),se(R,v,_))).then(R=>{R=R||Ee(v,_,!1),R&&(d.delta&&!T(R,8)?o.go(-d.delta,!1):d.type===Z.pop&&T(R,20)&&o.go(-1,!1)),Re(v,_,R)}).catch(F)}))}let oe=Q(),we=Q(),J;function se(s,m,d){ce(s);const v=we.list();return v.length?v.forEach(C=>C(s,m,d)):console.error(s),Promise.reject(s)}function rt(){return J&&c.value!==H?Promise.resolve():new Promise((s,m)=>{oe.add([s,m])})}function ce(s){return J||(J=!s,nt(),oe.list().forEach(([m,d])=>s?d(s):m()),oe.reset()),s}function Pe(s,m,d,v){const{scrollBehavior:C}=e;if(!G||!C)return Promise.resolve();const _=!d&&$t(ke(s.fullPath,0))||(v||!d)&&history.state&&history.state.scroll||null;return ct().then(()=>C(s,m,_)).then(R=>R&&Nt(R)).catch(R=>se(R,s,m))}const ie=s=>o.go(s);let ae;const ee=new Set,Se={currentRoute:c,listening:!0,addRoute:u,removeRoute:w,clearRoutes:t.clearRoutes,hasRoute:k,getRoutes:S,resolve:A,options:e,push:I,replace:B,go:ie,back:()=>ie(-1),forward:()=>ie(1),beforeEach:a.add,beforeResolve:p.add,afterEach:g.add,onError:we.add,isReady:rt,install(s){const m=this;s.component("RouterLink",sn),s.component("RouterView",un),s.config.globalProperties.$router=m,Object.defineProperty(s.config.globalProperties,"$route",{enumerable:!0,get:()=>W(c)}),G&&!ae&&c.value===H&&(ae=!0,I(o.location).catch(C=>{}));const d={};for(const C in H)Object.defineProperty(d,C,{get:()=>c.value[C],enumerable:!0});s.provide(ne,m),s.provide(ve,st(d)),s.provide(me,c);const v=s.unmount;ee.add(s),s.unmount=function(){ee.delete(s),ee.size<1&&(f=H,U&&U(),U=null,c.value=H,ae=!1,J=!1),v()}}};function z(s){return s.reduce((m,d)=>m.then(()=>re(d)),Promise.resolve())}return Se}function fn(e,t){const n=[],r=[],o=[],a=Math.max(t.matched.length,e.matched.length);for(let p=0;p<a;p++){const g=t.matched[p];g&&(e.matched.find(f=>K(f,g))?r.push(g):n.push(g));const c=e.matched[p];c&&(t.matched.find(f=>K(f,c))||o.push(c))}return[n,r,o]}function mn(){return q(ne)}function gn(e){return q(ve)}export{gn as a,pn as b,dn as c,mn as u};
