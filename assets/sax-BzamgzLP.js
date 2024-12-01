import{a as ct}from"./@babel-BgIvLCQ5.js";var ut={};const st={},lt=Object.freeze(Object.defineProperty({__proto__:null,default:st},Symbol.toStringTag,{value:"Module"})),q=ct(lt);(function(W){(function(u){u.parser=function(e,t){return new g(e,t)},u.SAXParser=g,u.SAXStream=N,u.createStream=k,u.MAX_BUFFER_LENGTH=64*1024;var D=["comment","sgmlDecl","textNode","tagName","doctype","procInstName","procInstBody","entity","attribName","attribValue","cdata","script"];u.EVENTS=["text","processinginstruction","sgmldeclaration","doctype","comment","opentagstart","attribute","opentag","closetag","opencdata","cdata","closecdata","error","end","ready","script","opennamespace","closenamespace"];function g(e,t){if(!(this instanceof g))return new g(e,t);var a=this;Q(a),a.q=a.c="",a.bufferCheckPosition=u.MAX_BUFFER_LENGTH,a.opt=t||{},a.opt.lowercase=a.opt.lowercase||a.opt.lowercasetags,a.looseCase=a.opt.lowercase?"toLowerCase":"toUpperCase",a.tags=[],a.closed=a.closedRoot=a.sawRoot=!1,a.tag=a.error=null,a.strict=!!e,a.noscript=!!(e||a.opt.noscript),a.state=n.BEGIN,a.strictEntities=a.opt.strictEntities,a.ENTITIES=a.strictEntities?Object.create(u.XML_ENTITIES):Object.create(u.ENTITIES),a.attribList=[],a.opt.xmlns&&(a.ns=Object.create(Z)),a.opt.unquotedAttributeValues===void 0&&(a.opt.unquotedAttributeValues=!e),a.trackPosition=a.opt.position!==!1,a.trackPosition&&(a.position=a.line=a.column=0),h(a,"onready")}Object.create||(Object.create=function(e){function t(){}t.prototype=e;var a=new t;return a}),Object.keys||(Object.keys=function(e){var t=[];for(var a in e)e.hasOwnProperty(a)&&t.push(a);return t});function j(e){for(var t=Math.max(u.MAX_BUFFER_LENGTH,10),a=0,i=0,o=D.length;i<o;i++){var l=e[D[i]].length;if(l>t)switch(D[i]){case"textNode":O(e);break;case"cdata":s(e,"oncdata",e.cdata),e.cdata="";break;case"script":s(e,"onscript",e.script),e.script="";break;default:v(e,"Max buffer length exceeded: "+D[i])}a=Math.max(a,l)}var r=u.MAX_BUFFER_LENGTH-a;e.bufferCheckPosition=r+e.position}function Q(e){for(var t=0,a=D.length;t<a;t++)e[D[t]]=""}function H(e){O(e),e.cdata!==""&&(s(e,"oncdata",e.cdata),e.cdata=""),e.script!==""&&(s(e,"onscript",e.script),e.script="")}g.prototype={end:function(){G(this)},write:at,resume:function(){return this.error=null,this},close:function(){return this.write(null)},flush:function(){H(this)}};var A;try{A=q.Stream}catch{A=function(){}}A||(A=function(){});var U=u.EVENTS.filter(function(e){return e!=="error"&&e!=="end"});function k(e,t){return new N(e,t)}function N(e,t){if(!(this instanceof N))return new N(e,t);A.apply(this),this._parser=new g(e,t),this.writable=!0,this.readable=!0;var a=this;this._parser.onend=function(){a.emit("end")},this._parser.onerror=function(i){a.emit("error",i),a._parser.error=null},this._decoder=null,U.forEach(function(i){Object.defineProperty(a,"on"+i,{get:function(){return a._parser["on"+i]},set:function(o){if(!o)return a.removeAllListeners(i),a._parser["on"+i]=o,o;a.on(i,o)},enumerable:!0,configurable:!1})})}N.prototype=Object.create(A.prototype,{constructor:{value:N}}),N.prototype.write=function(e){if(typeof Buffer=="function"&&typeof Buffer.isBuffer=="function"&&Buffer.isBuffer(e)){if(!this._decoder){var t=q.StringDecoder;this._decoder=new t("utf8")}e=this._decoder.write(e)}return this._parser.write(e.toString()),this.emit("data",e),!0},N.prototype.end=function(e){return e&&e.length&&this.write(e),this._parser.end(),!0},N.prototype.on=function(e,t){var a=this;return!a._parser["on"+e]&&U.indexOf(e)!==-1&&(a._parser["on"+e]=function(){var i=arguments.length===1?[arguments[0]]:Array.apply(null,arguments);i.splice(0,0,e),a.emit.apply(a,i)}),A.prototype.on.call(a,e,t)};var z="[CDATA[",K="DOCTYPE",F="http://www.w3.org/XML/1998/namespace",y="http://www.w3.org/2000/xmlns/",Z={xml:F,xmlns:y},C=/[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/,L=/[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/,$=/[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/,J=/[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;function T(e){return e===" "||e===`
`||e==="\r"||e==="	"}function S(e){return e==='"'||e==="'"}function tt(e){return e===">"||T(e)}function _(e,t){return e.test(t)}function et(e,t){return!_(e,t)}var n=0;u.STATE={BEGIN:n++,BEGIN_WHITESPACE:n++,TEXT:n++,TEXT_ENTITY:n++,OPEN_WAKA:n++,SGML_DECL:n++,SGML_DECL_QUOTED:n++,DOCTYPE:n++,DOCTYPE_QUOTED:n++,DOCTYPE_DTD:n++,DOCTYPE_DTD_QUOTED:n++,COMMENT_STARTING:n++,COMMENT:n++,COMMENT_ENDING:n++,COMMENT_ENDED:n++,CDATA:n++,CDATA_ENDING:n++,CDATA_ENDING_2:n++,PROC_INST:n++,PROC_INST_BODY:n++,PROC_INST_ENDING:n++,OPEN_TAG:n++,OPEN_TAG_SLASH:n++,ATTRIB:n++,ATTRIB_NAME:n++,ATTRIB_NAME_SAW_WHITE:n++,ATTRIB_VALUE:n++,ATTRIB_VALUE_QUOTED:n++,ATTRIB_VALUE_CLOSED:n++,ATTRIB_VALUE_UNQUOTED:n++,ATTRIB_VALUE_ENTITY_Q:n++,ATTRIB_VALUE_ENTITY_U:n++,CLOSE_TAG:n++,CLOSE_TAG_SAW_WHITE:n++,SCRIPT:n++,SCRIPT_ENDING:n++},u.XML_ENTITIES={amp:"&",gt:">",lt:"<",quot:'"',apos:"'"},u.ENTITIES={amp:"&",gt:">",lt:"<",quot:'"',apos:"'",AElig:198,Aacute:193,Acirc:194,Agrave:192,Aring:197,Atilde:195,Auml:196,Ccedil:199,ETH:208,Eacute:201,Ecirc:202,Egrave:200,Euml:203,Iacute:205,Icirc:206,Igrave:204,Iuml:207,Ntilde:209,Oacute:211,Ocirc:212,Ograve:210,Oslash:216,Otilde:213,Ouml:214,THORN:222,Uacute:218,Ucirc:219,Ugrave:217,Uuml:220,Yacute:221,aacute:225,acirc:226,aelig:230,agrave:224,aring:229,atilde:227,auml:228,ccedil:231,eacute:233,ecirc:234,egrave:232,eth:240,euml:235,iacute:237,icirc:238,igrave:236,iuml:239,ntilde:241,oacute:243,ocirc:244,ograve:242,oslash:248,otilde:245,ouml:246,szlig:223,thorn:254,uacute:250,ucirc:251,ugrave:249,uuml:252,yacute:253,yuml:255,copy:169,reg:174,nbsp:160,iexcl:161,cent:162,pound:163,curren:164,yen:165,brvbar:166,sect:167,uml:168,ordf:170,laquo:171,not:172,shy:173,macr:175,deg:176,plusmn:177,sup1:185,sup2:178,sup3:179,acute:180,micro:181,para:182,middot:183,cedil:184,ordm:186,raquo:187,frac14:188,frac12:189,frac34:190,iquest:191,times:215,divide:247,OElig:338,oelig:339,Scaron:352,scaron:353,Yuml:376,fnof:402,circ:710,tilde:732,Alpha:913,Beta:914,Gamma:915,Delta:916,Epsilon:917,Zeta:918,Eta:919,Theta:920,Iota:921,Kappa:922,Lambda:923,Mu:924,Nu:925,Xi:926,Omicron:927,Pi:928,Rho:929,Sigma:931,Tau:932,Upsilon:933,Phi:934,Chi:935,Psi:936,Omega:937,alpha:945,beta:946,gamma:947,delta:948,epsilon:949,zeta:950,eta:951,theta:952,iota:953,kappa:954,lambda:955,mu:956,nu:957,xi:958,omicron:959,pi:960,rho:961,sigmaf:962,sigma:963,tau:964,upsilon:965,phi:966,chi:967,psi:968,omega:969,thetasym:977,upsih:978,piv:982,ensp:8194,emsp:8195,thinsp:8201,zwnj:8204,zwj:8205,lrm:8206,rlm:8207,ndash:8211,mdash:8212,lsquo:8216,rsquo:8217,sbquo:8218,ldquo:8220,rdquo:8221,bdquo:8222,dagger:8224,Dagger:8225,bull:8226,hellip:8230,permil:8240,prime:8242,Prime:8243,lsaquo:8249,rsaquo:8250,oline:8254,frasl:8260,euro:8364,image:8465,weierp:8472,real:8476,trade:8482,alefsym:8501,larr:8592,uarr:8593,rarr:8594,darr:8595,harr:8596,crarr:8629,lArr:8656,uArr:8657,rArr:8658,dArr:8659,hArr:8660,forall:8704,part:8706,exist:8707,empty:8709,nabla:8711,isin:8712,notin:8713,ni:8715,prod:8719,sum:8721,minus:8722,lowast:8727,radic:8730,prop:8733,infin:8734,ang:8736,and:8743,or:8744,cap:8745,cup:8746,int:8747,there4:8756,sim:8764,cong:8773,asymp:8776,ne:8800,equiv:8801,le:8804,ge:8805,sub:8834,sup:8835,nsub:8836,sube:8838,supe:8839,oplus:8853,otimes:8855,perp:8869,sdot:8901,lceil:8968,rceil:8969,lfloor:8970,rfloor:8971,lang:9001,rang:9002,loz:9674,spades:9824,clubs:9827,hearts:9829,diams:9830},Object.keys(u.ENTITIES).forEach(function(e){var t=u.ENTITIES[e],a=typeof t=="number"?String.fromCharCode(t):t;u.ENTITIES[e]=a});for(var p in u.STATE)u.STATE[u.STATE[p]]=p;n=u.STATE;function h(e,t,a){e[t]&&e[t](a)}function s(e,t,a){e.textNode&&O(e),h(e,t,a)}function O(e){e.textNode=M(e.opt,e.textNode),e.textNode&&h(e,"ontext",e.textNode),e.textNode=""}function M(e,t){return e.trim&&(t=t.trim()),e.normalize&&(t=t.replace(/\s+/g," ")),t}function v(e,t){return O(e),e.trackPosition&&(t+=`
Line: `+e.line+`
Column: `+e.column+`
Char: `+e.c),t=new Error(t),e.error=t,h(e,"onerror",t),e}function G(e){return e.sawRoot&&!e.closedRoot&&c(e,"Unclosed root tag"),e.state!==n.BEGIN&&e.state!==n.BEGIN_WHITESPACE&&e.state!==n.TEXT&&v(e,"Unexpected end"),O(e),e.c="",e.closed=!0,h(e,"onend"),g.call(e,e.strict,e.opt),e}function c(e,t){if(typeof e!="object"||!(e instanceof g))throw new Error("bad call to strictFail");e.strict&&v(e,t)}function it(e){e.strict||(e.tagName=e.tagName[e.looseCase]());var t=e.tags[e.tags.length-1]||e,a=e.tag={name:e.tagName,attributes:{}};e.opt.xmlns&&(a.ns=t.ns),e.attribList.length=0,s(e,"onopentagstart",a)}function R(e,t){var a=e.indexOf(":"),i=a<0?["",e]:e.split(":"),o=i[0],l=i[1];return t&&e==="xmlns"&&(o="xmlns",l=""),{prefix:o,local:l}}function P(e){if(e.strict||(e.attribName=e.attribName[e.looseCase]()),e.attribList.indexOf(e.attribName)!==-1||e.tag.attributes.hasOwnProperty(e.attribName)){e.attribName=e.attribValue="";return}if(e.opt.xmlns){var t=R(e.attribName,!0),a=t.prefix,i=t.local;if(a==="xmlns")if(i==="xml"&&e.attribValue!==F)c(e,"xml: prefix must be bound to "+F+`
Actual: `+e.attribValue);else if(i==="xmlns"&&e.attribValue!==y)c(e,"xmlns: prefix must be bound to "+y+`
Actual: `+e.attribValue);else{var o=e.tag,l=e.tags[e.tags.length-1]||e;o.ns===l.ns&&(o.ns=Object.create(l.ns)),o.ns[i]=e.attribValue}e.attribList.push([e.attribName,e.attribValue])}else e.tag.attributes[e.attribName]=e.attribValue,s(e,"onattribute",{name:e.attribName,value:e.attribValue});e.attribName=e.attribValue=""}function I(e,t){if(e.opt.xmlns){var a=e.tag,i=R(e.tagName);a.prefix=i.prefix,a.local=i.local,a.uri=a.ns[i.prefix]||"",a.prefix&&!a.uri&&(c(e,"Unbound namespace prefix: "+JSON.stringify(e.tagName)),a.uri=i.prefix);var o=e.tags[e.tags.length-1]||e;a.ns&&o.ns!==a.ns&&Object.keys(a.ns).forEach(function(X){s(e,"onopennamespace",{prefix:X,uri:a.ns[X]})});for(var l=0,r=e.attribList.length;l<r;l++){var E=e.attribList[l],m=E[0],b=E[1],f=R(m,!0),d=f.prefix,ot=f.local,Y=d===""?"":a.ns[d]||"",B={name:m,value:b,prefix:d,local:ot,uri:Y};d&&d!=="xmlns"&&!Y&&(c(e,"Unbound namespace prefix: "+JSON.stringify(d)),B.uri=d),e.tag.attributes[m]=B,s(e,"onattribute",B)}e.attribList.length=0}e.tag.isSelfClosing=!!t,e.sawRoot=!0,e.tags.push(e.tag),s(e,"onopentag",e.tag),t||(!e.noscript&&e.tagName.toLowerCase()==="script"?e.state=n.SCRIPT:e.state=n.TEXT,e.tag=null,e.tagName=""),e.attribName=e.attribValue="",e.attribList.length=0}function w(e){if(!e.tagName){c(e,"Weird empty close tag."),e.textNode+="</>",e.state=n.TEXT;return}if(e.script){if(e.tagName!=="script"){e.script+="</"+e.tagName+">",e.tagName="",e.state=n.SCRIPT;return}s(e,"onscript",e.script),e.script=""}var t=e.tags.length,a=e.tagName;e.strict||(a=a[e.looseCase]());for(var i=a;t--;){var o=e.tags[t];if(o.name!==i)c(e,"Unexpected close tag");else break}if(t<0){c(e,"Unmatched closing tag: "+e.tagName),e.textNode+="</"+e.tagName+">",e.state=n.TEXT;return}e.tagName=a;for(var l=e.tags.length;l-- >t;){var r=e.tag=e.tags.pop();e.tagName=e.tag.name,s(e,"onclosetag",e.tagName);var E={};for(var m in r.ns)E[m]=r.ns[m];var b=e.tags[e.tags.length-1]||e;e.opt.xmlns&&r.ns!==b.ns&&Object.keys(r.ns).forEach(function(f){var d=r.ns[f];s(e,"onclosenamespace",{prefix:f,uri:d})})}t===0&&(e.closedRoot=!0),e.tagName=e.attribValue=e.attribName="",e.attribList.length=0,e.state=n.TEXT}function nt(e){var t=e.entity,a=t.toLowerCase(),i,o="";return e.ENTITIES[t]?e.ENTITIES[t]:e.ENTITIES[a]?e.ENTITIES[a]:(t=a,t.charAt(0)==="#"&&(t.charAt(1)==="x"?(t=t.slice(2),i=parseInt(t,16),o=i.toString(16)):(t=t.slice(1),i=parseInt(t,10),o=i.toString(10))),t=t.replace(/^0+/,""),isNaN(i)||o.toLowerCase()!==t?(c(e,"Invalid character entity"),"&"+e.entity+";"):String.fromCodePoint(i))}function V(e,t){t==="<"?(e.state=n.OPEN_WAKA,e.startTagPosition=e.position):T(t)||(c(e,"Non-whitespace before first tag."),e.textNode=t,e.state=n.TEXT)}function x(e,t){var a="";return t<e.length&&(a=e.charAt(t)),a}function at(e){var t=this;if(this.error)throw this.error;if(t.closed)return v(t,"Cannot write after close. Assign an onready handler.");if(e===null)return G(t);typeof e=="object"&&(e=e.toString());for(var a=0,i="";i=x(e,a++),t.c=i,!!i;)switch(t.trackPosition&&(t.position++,i===`
`?(t.line++,t.column=0):t.column++),t.state){case n.BEGIN:if(t.state=n.BEGIN_WHITESPACE,i==="\uFEFF")continue;V(t,i);continue;case n.BEGIN_WHITESPACE:V(t,i);continue;case n.TEXT:if(t.sawRoot&&!t.closedRoot){for(var o=a-1;i&&i!=="<"&&i!=="&";)i=x(e,a++),i&&t.trackPosition&&(t.position++,i===`
`?(t.line++,t.column=0):t.column++);t.textNode+=e.substring(o,a-1)}i==="<"&&!(t.sawRoot&&t.closedRoot&&!t.strict)?(t.state=n.OPEN_WAKA,t.startTagPosition=t.position):(!T(i)&&(!t.sawRoot||t.closedRoot)&&c(t,"Text data outside of root node."),i==="&"?t.state=n.TEXT_ENTITY:t.textNode+=i);continue;case n.SCRIPT:i==="<"?t.state=n.SCRIPT_ENDING:t.script+=i;continue;case n.SCRIPT_ENDING:i==="/"?t.state=n.CLOSE_TAG:(t.script+="<"+i,t.state=n.SCRIPT);continue;case n.OPEN_WAKA:if(i==="!")t.state=n.SGML_DECL,t.sgmlDecl="";else if(!T(i))if(_(C,i))t.state=n.OPEN_TAG,t.tagName=i;else if(i==="/")t.state=n.CLOSE_TAG,t.tagName="";else if(i==="?")t.state=n.PROC_INST,t.procInstName=t.procInstBody="";else{if(c(t,"Unencoded <"),t.startTagPosition+1<t.position){var l=t.position-t.startTagPosition;i=new Array(l).join(" ")+i}t.textNode+="<"+i,t.state=n.TEXT}continue;case n.SGML_DECL:if(t.sgmlDecl+i==="--"){t.state=n.COMMENT,t.comment="",t.sgmlDecl="";continue}t.doctype&&t.doctype!==!0&&t.sgmlDecl?(t.state=n.DOCTYPE_DTD,t.doctype+="<!"+t.sgmlDecl+i,t.sgmlDecl=""):(t.sgmlDecl+i).toUpperCase()===z?(s(t,"onopencdata"),t.state=n.CDATA,t.sgmlDecl="",t.cdata=""):(t.sgmlDecl+i).toUpperCase()===K?(t.state=n.DOCTYPE,(t.doctype||t.sawRoot)&&c(t,"Inappropriately located doctype declaration"),t.doctype="",t.sgmlDecl=""):i===">"?(s(t,"onsgmldeclaration",t.sgmlDecl),t.sgmlDecl="",t.state=n.TEXT):(S(i)&&(t.state=n.SGML_DECL_QUOTED),t.sgmlDecl+=i);continue;case n.SGML_DECL_QUOTED:i===t.q&&(t.state=n.SGML_DECL,t.q=""),t.sgmlDecl+=i;continue;case n.DOCTYPE:i===">"?(t.state=n.TEXT,s(t,"ondoctype",t.doctype),t.doctype=!0):(t.doctype+=i,i==="["?t.state=n.DOCTYPE_DTD:S(i)&&(t.state=n.DOCTYPE_QUOTED,t.q=i));continue;case n.DOCTYPE_QUOTED:t.doctype+=i,i===t.q&&(t.q="",t.state=n.DOCTYPE);continue;case n.DOCTYPE_DTD:i==="]"?(t.doctype+=i,t.state=n.DOCTYPE):i==="<"?(t.state=n.OPEN_WAKA,t.startTagPosition=t.position):S(i)?(t.doctype+=i,t.state=n.DOCTYPE_DTD_QUOTED,t.q=i):t.doctype+=i;continue;case n.DOCTYPE_DTD_QUOTED:t.doctype+=i,i===t.q&&(t.state=n.DOCTYPE_DTD,t.q="");continue;case n.COMMENT:i==="-"?t.state=n.COMMENT_ENDING:t.comment+=i;continue;case n.COMMENT_ENDING:i==="-"?(t.state=n.COMMENT_ENDED,t.comment=M(t.opt,t.comment),t.comment&&s(t,"oncomment",t.comment),t.comment=""):(t.comment+="-"+i,t.state=n.COMMENT);continue;case n.COMMENT_ENDED:i!==">"?(c(t,"Malformed comment"),t.comment+="--"+i,t.state=n.COMMENT):t.doctype&&t.doctype!==!0?t.state=n.DOCTYPE_DTD:t.state=n.TEXT;continue;case n.CDATA:i==="]"?t.state=n.CDATA_ENDING:t.cdata+=i;continue;case n.CDATA_ENDING:i==="]"?t.state=n.CDATA_ENDING_2:(t.cdata+="]"+i,t.state=n.CDATA);continue;case n.CDATA_ENDING_2:i===">"?(t.cdata&&s(t,"oncdata",t.cdata),s(t,"onclosecdata"),t.cdata="",t.state=n.TEXT):i==="]"?t.cdata+="]":(t.cdata+="]]"+i,t.state=n.CDATA);continue;case n.PROC_INST:i==="?"?t.state=n.PROC_INST_ENDING:T(i)?t.state=n.PROC_INST_BODY:t.procInstName+=i;continue;case n.PROC_INST_BODY:if(!t.procInstBody&&T(i))continue;i==="?"?t.state=n.PROC_INST_ENDING:t.procInstBody+=i;continue;case n.PROC_INST_ENDING:i===">"?(s(t,"onprocessinginstruction",{name:t.procInstName,body:t.procInstBody}),t.procInstName=t.procInstBody="",t.state=n.TEXT):(t.procInstBody+="?"+i,t.state=n.PROC_INST_BODY);continue;case n.OPEN_TAG:_(L,i)?t.tagName+=i:(it(t),i===">"?I(t):i==="/"?t.state=n.OPEN_TAG_SLASH:(T(i)||c(t,"Invalid character in tag name"),t.state=n.ATTRIB));continue;case n.OPEN_TAG_SLASH:i===">"?(I(t,!0),w(t)):(c(t,"Forward-slash in opening tag not followed by >"),t.state=n.ATTRIB);continue;case n.ATTRIB:if(T(i))continue;i===">"?I(t):i==="/"?t.state=n.OPEN_TAG_SLASH:_(C,i)?(t.attribName=i,t.attribValue="",t.state=n.ATTRIB_NAME):c(t,"Invalid attribute name");continue;case n.ATTRIB_NAME:i==="="?t.state=n.ATTRIB_VALUE:i===">"?(c(t,"Attribute without value"),t.attribValue=t.attribName,P(t),I(t)):T(i)?t.state=n.ATTRIB_NAME_SAW_WHITE:_(L,i)?t.attribName+=i:c(t,"Invalid attribute name");continue;case n.ATTRIB_NAME_SAW_WHITE:if(i==="=")t.state=n.ATTRIB_VALUE;else{if(T(i))continue;c(t,"Attribute without value"),t.tag.attributes[t.attribName]="",t.attribValue="",s(t,"onattribute",{name:t.attribName,value:""}),t.attribName="",i===">"?I(t):_(C,i)?(t.attribName=i,t.state=n.ATTRIB_NAME):(c(t,"Invalid attribute name"),t.state=n.ATTRIB)}continue;case n.ATTRIB_VALUE:if(T(i))continue;S(i)?(t.q=i,t.state=n.ATTRIB_VALUE_QUOTED):(t.opt.unquotedAttributeValues||v(t,"Unquoted attribute value"),t.state=n.ATTRIB_VALUE_UNQUOTED,t.attribValue=i);continue;case n.ATTRIB_VALUE_QUOTED:if(i!==t.q){i==="&"?t.state=n.ATTRIB_VALUE_ENTITY_Q:t.attribValue+=i;continue}P(t),t.q="",t.state=n.ATTRIB_VALUE_CLOSED;continue;case n.ATTRIB_VALUE_CLOSED:T(i)?t.state=n.ATTRIB:i===">"?I(t):i==="/"?t.state=n.OPEN_TAG_SLASH:_(C,i)?(c(t,"No whitespace between attributes"),t.attribName=i,t.attribValue="",t.state=n.ATTRIB_NAME):c(t,"Invalid attribute name");continue;case n.ATTRIB_VALUE_UNQUOTED:if(!tt(i)){i==="&"?t.state=n.ATTRIB_VALUE_ENTITY_U:t.attribValue+=i;continue}P(t),i===">"?I(t):t.state=n.ATTRIB;continue;case n.CLOSE_TAG:if(t.tagName)i===">"?w(t):_(L,i)?t.tagName+=i:t.script?(t.script+="</"+t.tagName,t.tagName="",t.state=n.SCRIPT):(T(i)||c(t,"Invalid tagname in closing tag"),t.state=n.CLOSE_TAG_SAW_WHITE);else{if(T(i))continue;et(C,i)?t.script?(t.script+="</"+i,t.state=n.SCRIPT):c(t,"Invalid tagname in closing tag."):t.tagName=i}continue;case n.CLOSE_TAG_SAW_WHITE:if(T(i))continue;i===">"?w(t):c(t,"Invalid characters in closing tag");continue;case n.TEXT_ENTITY:case n.ATTRIB_VALUE_ENTITY_Q:case n.ATTRIB_VALUE_ENTITY_U:var r,E;switch(t.state){case n.TEXT_ENTITY:r=n.TEXT,E="textNode";break;case n.ATTRIB_VALUE_ENTITY_Q:r=n.ATTRIB_VALUE_QUOTED,E="attribValue";break;case n.ATTRIB_VALUE_ENTITY_U:r=n.ATTRIB_VALUE_UNQUOTED,E="attribValue";break}if(i===";"){var m=nt(t);t.opt.unparsedEntities&&!Object.values(u.XML_ENTITIES).includes(m)?(t.entity="",t.state=r,t.write(m)):(t[E]+=m,t.entity="",t.state=r)}else _(t.entity.length?J:$,i)?t.entity+=i:(c(t,"Invalid character in entity name"),t[E]+="&"+t.entity+i,t.entity="",t.state=r);continue;default:throw new Error(t,"Unknown state: "+t.state)}return t.position>=t.bufferCheckPosition&&j(t),t}/*! http://mths.be/fromcodepoint v0.1.0 by @mathias */String.fromCodePoint||function(){var e=String.fromCharCode,t=Math.floor,a=function(){var i=16384,o=[],l,r,E=-1,m=arguments.length;if(!m)return"";for(var b="";++E<m;){var f=Number(arguments[E]);if(!isFinite(f)||f<0||f>1114111||t(f)!==f)throw RangeError("Invalid code point: "+f);f<=65535?o.push(f):(f-=65536,l=(f>>10)+55296,r=f%1024+56320,o.push(l,r)),(E+1===m||o.length>i)&&(b+=e.apply(null,o),o.length=0)}return b};Object.defineProperty?Object.defineProperty(String,"fromCodePoint",{value:a,configurable:!0,writable:!0}):String.fromCodePoint=a}()})(W)})(ut);export{ut as s};
