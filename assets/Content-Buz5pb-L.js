import{a as b}from"./vue-router-p3suwGEc.js";import{u as I}from"./vuex-DWRQm9L4.js";import{O as T}from"./@fancyapps-CriIut5O.js";import{_ as N}from"./index-cYLuHPxB.js";import{aS as u,aC as k,as as w,bC as F,u as m,F as O,aV as B,t as D,v as p,b9 as v,s as E,aX as q,aK as i,av as L}from"./@vue-Cn0pJ44W.js";import"./@kangc-BwDk5HIv.js";import"./@babel-BgIvLCQ5.js";import"./vue-tkVpdOni.js";import"./@vuepress-3yONQRlZ.js";import"./copy-to-clipboard-C0dvYkVd.js";import"./toggle-selection-DGa8lynz.js";import"./highlight.js-DsdEMM-1.js";const R={setup(){const l=b(),_=I(),a=u({title:l.params.title||"无标题",date:l.params.date||"未知日期",content:""}),n=u([]),d=u(null),f=u(!0),h=()=>{f.value=window.innerWidth>=1024};window.addEventListener("resize",h),k(h);const c=e=>{const t=sessionStorage.getItem(`article-${e}`);return t?JSON.parse(t):null},y=()=>{console.log("复制成功")},x=async e=>{const t=c(e);if(t)a.value=t;else{const o=_.state.markdownFiles.find(s=>s.title===e);o?(a.value={title:o.title,date:a.value.date,content:o.content},sessionStorage.setItem(`article-${e}`,JSON.stringify(a.value))):a.value.content="文章未找到"}},S=e=>{const t=d.value,{lineIndex:o}=e,s=t.$el.querySelector(`[data-v-md-line="${o}"]`);s&&t.scrollToTarget({target:s,scrollContainer:window,top:60})},g=()=>{const e=d.value;if(!e)return;const t=e.$el;if(!t)return;const o=t.querySelectorAll("h1, h2, h3, h4, h5, h6"),s=Array.from(o).filter(r=>r.innerText.trim());if(!s.length)return;const A=Array.from(new Set(s.map(r=>r.tagName))).sort();n.value=s.map(r=>({title:r.innerText,lineIndex:r.getAttribute("data-v-md-line"),indent:A.indexOf(r.tagName)}))},C=()=>{var t;const e=(t=d.value)==null?void 0:t.$el.querySelectorAll("img");e==null||e.forEach(o=>{o.setAttribute("data-fancybox","gallery")}),T.bind('[data-fancybox="gallery"]',{})};return k(()=>{l.params.title&&x(l.params.title).then(()=>{w(()=>{g(),C()})})}),F(()=>a.value.content,e=>{e&&w(()=>{g(),C()})}),{article:a,titles:n,handleCopyCodeSuccess:y,handleAnchorClick:S,previewRef:d,isDesktop:f}}},V={class:"content-wrapper"},$={key:0,class:"anchor-navigation"},z=["onClick"],J={style:{cursor:"pointer"}},K={class:"content-container"},M={class:"content-header"},W={class:"article-title"},X={class:"article-date"},j={key:1};function G(l,_,a,n,d,f){const h=q("v-md-preview");return i(),m("div",V,[n.isDesktop?(i(),m("nav",$,[(i(!0),m(O,null,B(n.titles,c=>(i(),m("div",{key:c.lineIndex,style:L({paddingLeft:`${c.indent*20}px`}),class:"anchor-item",onClick:y=>n.handleAnchorClick(c)},[p("a",J,v(c.title),1)],12,z))),128))])):D("",!0),p("div",K,[p("header",M,[p("h1",W,v(n.article.title),1),p("p",X,"发布日期："+v(n.article.date),1)]),n.article.content?(i(),E(h,{ref:"previewRef",onCopyCodeSuccess:n.handleCopyCodeSuccess,text:n.article.content,key:n.article.title},null,8,["onCopyCodeSuccess","text"])):(i(),m("p",j,"加载中..."))])])}const re=N(R,[["render",G],["__scopeId","data-v-d86a7231"]]);export{re as default};