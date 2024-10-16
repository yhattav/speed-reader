!function(){"use strict";function e(){}function t(e){return e()}function n(){return Object.create(null)}function r(e){e.forEach(t)}function o(e){return"function"==typeof e}function s(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function c(e,t,n,r){return e[1]&&r?function(e,t){for(const n in t)e[n]=t[n];return e}(n.ctx.slice(),e[1](r(t))):n.ctx}function i(e,t){e.appendChild(t)}function u(e,t,n){e.insertBefore(t,n||null)}function f(e){e.parentNode&&e.parentNode.removeChild(e)}function l(e){return document.createElement(e)}function a(e){return document.createTextNode(e)}function d(){return a(" ")}function $(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function p(e,t){t=""+t,e.data!==t&&(e.data=t)}function m(e,t,n,r){null==n?e.style.removeProperty(t):e.style.setProperty(t,n,r?"important":"")}let g;function h(e){g=e}function b(){if(!g)throw new Error("Function called outside component initialization");return g}function v(){const e=b();return(t,n,{cancelable:r=!1}={})=>{const o=e.$$.callbacks[t];if(o){const s=function(e,t,{bubbles:n=!1,cancelable:r=!1}={}){return new CustomEvent(e,{detail:t,bubbles:n,cancelable:r})}(t,n,{cancelable:r});return o.slice().forEach((t=>{t.call(e,s)})),!s.defaultPrevented}return!0}}const y=[],w=[];let x=[];const _=[],E=Promise.resolve();let k=!1;function M(e){x.push(e)}const P=new Set;let C=0;function R(){if(0!==C)return;const e=g;do{try{for(;C<y.length;){const e=y[C];C++,h(e),j(e.$$)}}catch(e){throw y.length=0,C=0,e}for(h(null),y.length=0,C=0;w.length;)w.pop()();for(let e=0;e<x.length;e+=1){const t=x[e];P.has(t)||(P.add(t),t())}x.length=0}while(y.length);for(;_.length;)_.pop()();k=!1,P.clear(),h(e)}function j(e){if(null!==e.fragment){e.update(),r(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(M)}}const L=new Set;let q;function A(e,t){e&&e.i&&(L.delete(e),e.i(t))}function N(e,t,n,r){if(e&&e.o){if(L.has(e))return;L.add(e),q.c.push((()=>{L.delete(e),r&&(n&&e.d(1),r())})),e.o(t)}else r&&r()}function O(e){e&&e.c()}function T(e,n,s){const{fragment:c,after_update:i}=e.$$;c&&c.m(n,s),M((()=>{const n=e.$$.on_mount.map(t).filter(o);e.$$.on_destroy?e.$$.on_destroy.push(...n):r(n),e.$$.on_mount=[]})),i.forEach(M)}function I(e,t){const n=e.$$;null!==n.fragment&&(!function(e){const t=[],n=[];x.forEach((r=>-1===e.indexOf(r)?t.push(r):n.push(r))),n.forEach((e=>e())),x=t}(n.after_update),r(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function S(e,t){-1===e.$$.dirty[0]&&(y.push(e),k||(k=!0,E.then(R)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function B(t,o,s,c,i,u,l=null,a=[-1]){const d=g;h(t);const $=t.$$={fragment:null,ctx:[],props:u,update:e,not_equal:i,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(o.context||(d?d.$$.context:[])),callbacks:n(),dirty:a,skip_bound:!1,root:o.target||d.$$.root};l&&l($.root);let p=!1;if($.ctx=s?s(t,o.props||{},((e,n,...r)=>{const o=r.length?r[0]:n;return $.ctx&&i($.ctx[e],$.ctx[e]=o)&&(!$.skip_bound&&$.bound[e]&&$.bound[e](o),p&&S(t,e)),n})):[],$.update(),p=!0,r($.before_update),$.fragment=!!c&&c($.ctx),o.target){if(o.hydrate){const e=function(e){return Array.from(e.childNodes)}(o.target);$.fragment&&$.fragment.l(e),e.forEach(f)}else $.fragment&&$.fragment.c();o.intro&&A(t.$$.fragment),T(t,o.target,o.anchor),R()}h(d)}class F{$$=void 0;$$set=void 0;$destroy(){I(this,1),this.$destroy=e}$on(t,n){if(!o(n))return e;const r=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return r.push(n),()=>{const e=r.indexOf(n);-1!==e&&r.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}function z(e){let t,n,r,o;const s=e[2].default,i=function(e,t,n,r){if(e){const o=c(e,t,n,r);return e[0](o)}}(s,e,e[1],null);return{c(){t=l("div"),i&&i.c(),$(t,"class","speed-reader-popup svelte-dlhtvu")},m(s,c){var f,l,a,d;u(s,t,c),i&&i.m(t,null),n=!0,r||(f=t,l="click",a=e[0],f.addEventListener(l,a,d),o=()=>f.removeEventListener(l,a,d),r=!0)},p(e,[t]){i&&i.p&&(!n||2&t)&&function(e,t,n,r,o,s){if(o){const i=c(t,n,r,s);e.p(i,o)}}(i,s,e,e[1],n?function(e,t,n,r){if(e[2]&&r){const o=e[2](r(n));if(void 0===t.dirty)return o;if("object"==typeof o){const e=[],n=Math.max(t.dirty.length,o.length);for(let r=0;r<n;r+=1)e[r]=t.dirty[r]|o[r];return e}return t.dirty|o}return t.dirty}(s,e[1],t,null):function(e){if(e.ctx.length>32){const t=[],n=e.ctx.length/32;for(let e=0;e<n;e++)t[e]=-1;return t}return-1}(e[1]),null)},i(e){n||(A(i,e),n=!0)},o(e){N(i,e),n=!1},d(e){e&&f(t),i&&i.d(e),r=!1,o()}}}function Y(e,t,n){let{$$slots:r={},$$scope:o}=t;const s=v();return e.$$set=e=>{"$$scope"in e&&n(1,o=e.$$scope)},[function(){s("click")},o,r]}"undefined"!=typeof window&&(window.__svelte||(window.__svelte={v:new Set})).v.add("4");class D extends F{constructor(e){super(),B(this,e,Y,z,s,{})}}function G(t){let n,r;return{c(){n=l("span"),r=a(t[0]),$(n,"class","speed-reader-before svelte-15ms0k2")},m(e,t){u(e,n,t),i(n,r)},p(e,[t]){1&t&&p(r,e[0])},i:e,o:e,d(e){e&&f(n)}}}function H(e,t,n){let{before:r=""}=t;return e.$$set=e=>{"before"in e&&n(0,r=e.before)},[r]}class J extends F{constructor(e){super(),B(this,e,H,G,s,{before:0})}}function K(t){let n,r;return{c(){n=l("span"),r=a(t[0]),$(n,"class","speed-reader-center svelte-44q5p0")},m(e,t){u(e,n,t),i(n,r)},p(e,[t]){1&t&&p(r,e[0])},i:e,o:e,d(e){e&&f(n)}}}function Q(e,t,n){let{center:r=""}=t;return e.$$set=e=>{"center"in e&&n(0,r=e.center)},[r]}class U extends F{constructor(e){super(),B(this,e,Q,K,s,{center:0})}}function V(t){let n,r;return{c(){n=l("span"),r=a(t[0]),$(n,"class","speed-reader-after svelte-jqlppn")},m(e,t){u(e,n,t),i(n,r)},p(e,[t]){1&t&&p(r,e[0])},i:e,o:e,d(e){e&&f(n)}}}function W(e,t,n){let{after:r=""}=t;return e.$$set=e=>{"after"in e&&n(0,r=e.after)},[r]}class X extends F{constructor(e){super(),B(this,e,W,V,s,{after:0})}}function Z(t){let n,r;return n=new U({props:{center:"Click to start"}}),{c(){O(n.$$.fragment)},m(e,t){T(n,e,t),r=!0},p:e,i(e){r||(A(n.$$.fragment,e),r=!0)},o(e){N(n.$$.fragment,e),r=!1},d(e){I(n,e)}}}function ee(e){let t,n,r,o,s,c;return t=new J({props:{before:e[0]}}),r=new U({props:{center:e[1]}}),s=new X({props:{after:e[2]}}),{c(){O(t.$$.fragment),n=d(),O(r.$$.fragment),o=d(),O(s.$$.fragment)},m(e,i){T(t,e,i),u(e,n,i),T(r,e,i),u(e,o,i),T(s,e,i),c=!0},p(e,n){const o={};1&n&&(o.before=e[0]),t.$set(o);const c={};2&n&&(c.center=e[1]),r.$set(c);const i={};4&n&&(i.after=e[2]),s.$set(i)},i(e){c||(A(t.$$.fragment,e),A(r.$$.fragment,e),A(s.$$.fragment,e),c=!0)},o(e){N(t.$$.fragment,e),N(r.$$.fragment,e),N(s.$$.fragment,e),c=!1},d(e){e&&(f(n),f(o)),I(t,e),I(r,e),I(s,e)}}}function te(e){let t,n,o,s,c,a;const p=[ee,Z],m=[];function g(e,t){return e[3]||e[1]&&"Click to start"!==e[1]?0:1}return s=g(e),c=m[s]=p[s](e),{c(){t=l("div"),n=l("div"),o=d(),c.c(),$(n,"class","speed-reader-line svelte-xsvelt"),$(t,"class","speed-reader-content svelte-xsvelt")},m(e,r){u(e,t,r),i(t,n),i(t,o),m[s].m(t,null),a=!0},p(e,[n]){let o=s;s=g(e),s===o?m[s].p(e,n):(q={r:0,c:[],p:q},N(m[o],1,1,(()=>{m[o]=null})),q.r||r(q.c),q=q.p,c=m[s],c?c.p(e,n):(c=m[s]=p[s](e),c.c()),A(c,1),c.m(t,null))},i(e){a||(A(c),a=!0)},o(e){N(c),a=!1},d(e){e&&f(t),m[s].d()}}}function ne(e,t,n){let{before:r=""}=t,{center:o=""}=t,{after:s=""}=t,{isReading:c=!1}=t;return e.$$set=e=>{"before"in e&&n(0,r=e.before),"center"in e&&n(1,o=e.center),"after"in e&&n(2,s=e.after),"isReading"in e&&n(3,c=e.isReading)},[r,o,s,c]}class re extends F{constructor(e){super(),B(this,e,ne,te,s,{before:0,center:1,after:2,isReading:3})}}function oe(t){let n;return{c(){n=l("div"),$(n,"class","speed-reader-progress svelte-1r2yrqc"),m(n,"width",t[0]+"%")},m(e,t){u(e,n,t)},p(e,[t]){1&t&&m(n,"width",e[0]+"%")},i:e,o:e,d(e){e&&f(n)}}}function se(e,t,n){let{progress:r=0}=t;return e.$$set=e=>{"progress"in e&&n(0,r=e.progress)},[r]}class ce extends F{constructor(e){super(),B(this,e,se,oe,s,{progress:0})}}function ie(e){let t,n,r,o;return t=new re({props:{before:e[0].before,center:e[0].center,after:e[0].after,isReading:e[2]}}),r=new ce({props:{progress:e[1]}}),{c(){O(t.$$.fragment),n=d(),O(r.$$.fragment)},m(e,s){T(t,e,s),u(e,n,s),T(r,e,s),o=!0},p(e,n){const o={};1&n&&(o.before=e[0].before),1&n&&(o.center=e[0].center),1&n&&(o.after=e[0].after),4&n&&(o.isReading=e[2]),t.$set(o);const s={};2&n&&(s.progress=e[1]),r.$set(s)},i(e){o||(A(t.$$.fragment,e),A(r.$$.fragment,e),o=!0)},o(e){N(t.$$.fragment,e),N(r.$$.fragment,e),o=!1},d(e){e&&f(n),I(t,e),I(r,e)}}}function ue(e){let t,n;return t=new D({props:{$$slots:{default:[ie]},$$scope:{ctx:e}}}),t.$on("click",e[3]),{c(){O(t.$$.fragment)},m(e,r){T(t,e,r),n=!0},p(e,[n]){const r={};1031&n&&(r.$$scope={dirty:n,ctx:e}),t.$set(r)},i(e){n||(A(t.$$.fragment,e),n=!0)},o(e){N(t.$$.fragment,e),n=!1},d(e){I(t,e)}}}function fe(e,t,n){let r,{words:o=[]}=t,{wordsPerMinute:s=400}=t,c={before:"",center:"",after:""},i=0,u=!1,f=0;function l(){n(2,u=!0),f=0,r=setInterval((()=>{f<o.length?(n(0,c=function(e){const t=e.length,n=Math.floor((t-1)/2);return{before:e.slice(0,n),center:e[n],after:e.slice(n+1)}}(o[f])),n(1,i=(f+1)/o.length*100),f++):(a(),n(0,c={before:"",center:"Finished",after:""}))}),6e4/s)}function a(){n(2,u=!1),clearInterval(r)}var d;return d=()=>{r&&clearInterval(r)},b().$$.on_destroy.push(d),e.$$set=e=>{"words"in e&&n(4,o=e.words),"wordsPerMinute"in e&&n(5,s=e.wordsPerMinute)},[c,i,u,function(){u?a():l()},o,s]}class le extends F{constructor(e){super(),B(this,e,fe,ue,s,{words:4,wordsPerMinute:5})}}let ae,de=null,$e=null;function pe(e){ae&&ae.$$.fragment&&ae.$$.fragment.contains(e.target)||(clearTimeout($e),$e=setTimeout((()=>{const t=e.target,n=t.innerText.split(/\s+/);n.length>=10&&t!==de?(de=t,function(e,t,n){ae&&ae.$destroy();const r=t.getBoundingClientRect(),o=r.left+r.width/2-150,s=e.clientY,c=document.createElement("div");document.body.appendChild(c),ae=new le({target:c,props:{words:n,wordsPerMinute:400}}),c.style.position="absolute",c.style.left=`${Math.max(0,o)}px`,c.style.top=`${s}px`}(e,t,n)):t===de||ae&&ae.$$.fragment.contains(t)||function(){ae&&(ae.$destroy(),ae=null);de=null}()}),300))}document.addEventListener("mousemove",pe),window.addEventListener("unload",(()=>{document.removeEventListener("mousemove",pe),ae&&ae.$destroy()}))}();
//# sourceMappingURL=content.js.map
