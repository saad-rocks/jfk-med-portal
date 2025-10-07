var e={};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const t=function(e){const t=[];let n=0;for(let r=0;r<e.length;r++){let s=e.charCodeAt(r);s<128?t[n++]=s:s<2048?(t[n++]=s>>6|192,t[n++]=63&s|128):55296==(64512&s)&&r+1<e.length&&56320==(64512&e.charCodeAt(r+1))?(s=65536+((1023&s)<<10)+(1023&e.charCodeAt(++r)),t[n++]=s>>18|240,t[n++]=s>>12&63|128,t[n++]=s>>6&63|128,t[n++]=63&s|128):(t[n++]=s>>12|224,t[n++]=s>>6&63|128,t[n++]=63&s|128)}return t},n={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:"function"==typeof atob,encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<e.length;s+=3){const t=e[s],i=s+1<e.length,o=i?e[s+1]:0,a=s+2<e.length,c=a?e[s+2]:0,u=t>>2,h=(3&t)<<4|o>>4;let l=(15&o)<<2|c>>6,d=63&c;a||(d=64,i||(l=64)),r.push(n[u],n[h],n[l],n[d])}return r.join("")},encodeString(e,n){return this.HAS_NATIVE_SUPPORT&&!n?btoa(e):this.encodeByteArray(t(e),n)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):function(e){const t=[];let n=0,r=0;for(;n<e.length;){const s=e[n++];if(s<128)t[r++]=String.fromCharCode(s);else if(s>191&&s<224){const i=e[n++];t[r++]=String.fromCharCode((31&s)<<6|63&i)}else if(s>239&&s<365){const i=((7&s)<<18|(63&e[n++])<<12|(63&e[n++])<<6|63&e[n++])-65536;t[r++]=String.fromCharCode(55296+(i>>10)),t[r++]=String.fromCharCode(56320+(1023&i))}else{const i=e[n++],o=e[n++];t[r++]=String.fromCharCode((15&s)<<12|(63&i)<<6|63&o)}}return t.join("")}(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();const n=t?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let i=0;i<e.length;){const t=n[e.charAt(i++)],o=i<e.length?n[e.charAt(i)]:0;++i;const a=i<e.length?n[e.charAt(i)]:64;++i;const c=i<e.length?n[e.charAt(i)]:64;if(++i,null==t||null==o||null==a||null==c)throw new r;const u=t<<2|o>>4;if(s.push(u),64!==a){const e=o<<4&240|a>>2;if(s.push(e),64!==c){const e=a<<6&192|c;s.push(e)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}};class r extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const s=function(e){return function(e){const r=t(e);return n.encodeByteArray(r,!0)}(e).replace(/\./g,"")},i=function(e){try{return n.decodeString(e,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function o(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if("undefined"!=typeof global)return global;throw new Error("Unable to locate global object.")}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const a=()=>{try{return o().__FIREBASE_DEFAULTS__||(()=>{if("undefined"==typeof process)return;const t=e.__FIREBASE_DEFAULTS__;return t?JSON.parse(t):void 0})()||(()=>{if("undefined"==typeof document)return;let e;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch(n){return}const t=e&&i(e[1]);return t&&JSON.parse(t)})()}catch(t){return void console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`)}},c=e=>a()?.emulatorHosts?.[e],u=e=>{const t=c(e);if(!t)return;const n=t.lastIndexOf(":");if(n<=0||n+1===t.length)throw new Error(`Invalid host ${t} with no separate hostname and port!`);const r=parseInt(t.substring(n+1),10);return"["===t[0]?[t.substring(1,n-1),r]:[t.substring(0,n),r]},h=()=>a()?.config,l=e=>a()?.[`_${e}`];
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class d{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,n)=>{t?this.reject(t):this.resolve(n),"function"==typeof e&&(this.promise.catch(()=>{}),1===e.length?e(t):e(t,n))}}}
/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function f(e){try{return(e.startsWith("http://")||e.startsWith("https://")?new URL(e).hostname:e).endsWith(".cloudworkstations.dev")}catch{return!1}}async function p(e){return(await fetch(e,{credentials:"include"})).ok}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function m(e,t){if(e.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n=t||"demo-project",r=e.iat||0,i=e.sub||e.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o={iss:`https://securetoken.google.com/${n}`,aud:n,iat:r,exp:r+3600,auth_time:r,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}},...e};return[s(JSON.stringify({alg:"none",type:"JWT"})),s(JSON.stringify(o)),""].join(".")}const g={};let y=!1;function w(e,t){if("undefined"==typeof window||"undefined"==typeof document||!f(window.location.host)||g[e]===t||g[e]||y)return;function n(e){return`__firebase__banner__${e}`}g[e]=t;const r="__firebase__banner",s=function(){const e={prod:[],emulator:[]};for(const t of Object.keys(g))g[t]?e.emulator.push(t):e.prod.push(t);return e}().prod.length>0;function i(){const e=document.createElement("span");return e.style.cursor="pointer",e.style.marginLeft="16px",e.style.fontSize="24px",e.innerHTML=" &times;",e.onclick=()=>{y=!0,function(){const e=document.getElementById(r);e&&e.remove()}()},e}function o(){const e=function(e){let t=document.getElementById(e),n=!1;return t||(t=document.createElement("div"),t.setAttribute("id",e),n=!0),{created:n,element:t}}(r),t=n("text"),o=document.getElementById(t)||document.createElement("span"),a=n("learnmore"),c=document.getElementById(a)||document.createElement("a"),u=n("preprendIcon"),h=document.getElementById(u)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(e.created){const t=e.element;!function(e){e.style.display="flex",e.style.background="#7faaf0",e.style.position="fixed",e.style.bottom="5px",e.style.left="5px",e.style.padding=".5em",e.style.borderRadius="5px",e.style.alignItems="center"}(t),function(e,t){e.setAttribute("id",t),e.innerText="Learn more",e.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",e.setAttribute("target","__blank"),e.style.paddingLeft="5px",e.style.textDecoration="underline"}(c,a);const n=i();!function(e,t){e.setAttribute("width","24"),e.setAttribute("id",t),e.setAttribute("height","24"),e.setAttribute("viewBox","0 0 24 24"),e.setAttribute("fill","none"),e.style.marginLeft="-6px"}(h,u),t.append(h,o,c,n),document.body.appendChild(t)}s?(o.innerText="Preview backend disconnected.",h.innerHTML='<g clip-path="url(#clip0_6013_33858)">\n<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>\n</g>\n<defs>\n<clipPath id="clip0_6013_33858">\n<rect width="24" height="24" fill="white"/>\n</clipPath>\n</defs>'):(h.innerHTML='<g clip-path="url(#clip0_6083_34804)">\n<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>\n</g>\n<defs>\n<clipPath id="clip0_6083_34804">\n<rect width="24" height="24" fill="white"/>\n</clipPath>\n</defs>',o.innerText="Preview backend running in this workspace."),o.setAttribute("id",t)}"loading"===document.readyState?window.addEventListener("DOMContentLoaded",o):o()}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function v(){return"undefined"!=typeof navigator&&"string"==typeof navigator.userAgent?navigator.userAgent:""}function _(){const e=a()?.forceEnvironment;if("node"===e)return!0;if("browser"===e)return!1;try{return"[object process]"===Object.prototype.toString.call(global.process)}catch(t){return!1}}function I(){return!_()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function b(){return!_()&&!!navigator.userAgent&&(navigator.userAgent.includes("Safari")||navigator.userAgent.includes("WebKit"))&&!navigator.userAgent.includes("Chrome")}function T(){try{return"object"==typeof indexedDB}catch(e){return!1}}class E extends Error{constructor(e,t,n){super(t),this.code=e,this.customData=n,this.name="FirebaseError",Object.setPrototypeOf(this,E.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,S.prototype.create)}}class S{constructor(e,t,n){this.service=e,this.serviceName=t,this.errors=n}create(e,...t){const n=t[0]||{},r=`${this.service}/${e}`,s=this.errors[e],i=s?function(e,t){return e.replace(C,(e,n)=>{const r=t[n];return null!=r?String(r):`<${n}?>`})}(s,n):"Error",o=`${this.serviceName}: ${i} (${r}).`;return new E(r,o,n)}}const C=/\{\$([^}]+)}/g;function k(e,t){if(e===t)return!0;const n=Object.keys(e),r=Object.keys(t);for(const s of n){if(!r.includes(s))return!1;const n=e[s],i=t[s];if(A(n)&&A(i)){if(!k(n,i))return!1}else if(n!==i)return!1}for(const s of r)if(!n.includes(s))return!1;return!0}function A(e){return null!==e&&"object"==typeof e}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function N(e){const t=[];for(const[n,r]of Object.entries(e))Array.isArray(r)?r.forEach(e=>{t.push(encodeURIComponent(n)+"="+encodeURIComponent(e))}):t.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return t.length?"&"+t.join("&"):""}function D(e){const t={};return e.replace(/^\?/,"").split("&").forEach(e=>{if(e){const[n,r]=e.split("=");t[decodeURIComponent(n)]=decodeURIComponent(r)}}),t}function R(e){const t=e.indexOf("?");if(!t)return"";const n=e.indexOf("#",t);return e.substring(t,n>0?n:void 0)}class x{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(e=>{this.error(e)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,n){let r;if(void 0===e&&void 0===t&&void 0===n)throw new Error("Missing Observer.");r=function(e,t){if("object"!=typeof e||null===e)return!1;for(const n of t)if(n in e&&"function"==typeof e[n])return!0;return!1}(e,["next","error","complete"])?e:{next:e,error:t,complete:n},void 0===r.next&&(r.next=O),void 0===r.error&&(r.error=O),void 0===r.complete&&(r.complete=O);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?r.error(this.finalError):r.complete()}catch(e){}}),this.observers.push(r),s}unsubscribeOne(e){void 0!==this.observers&&void 0!==this.observers[e]&&(delete this.observers[e],this.observerCount-=1,0===this.observerCount&&void 0!==this.onNoObservers&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(void 0!==this.observers&&void 0!==this.observers[e])try{t(this.observers[e])}catch(n){"undefined"!=typeof console&&console.error&&console.error(n)}})}close(e){this.finalized||(this.finalized=!0,void 0!==e&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function O(){}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function P(e){return e&&e._delegate?e._delegate:e}class L{constructor(e,t,n){this.name=e,this.instanceFactory=t,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const M="[DEFAULT]";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class U{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const e=new d;if(this.instancesDeferred.set(t,e),this.isInitialized(t)||this.shouldAutoInitialize())try{const n=this.getOrInitializeService({instanceIdentifier:t});n&&e.resolve(n)}catch(n){}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(e?.identifier),n=e?.optional??!1;if(!this.isInitialized(t)&&!this.shouldAutoInitialize()){if(n)return null;throw Error(`Service ${this.name} is not available`)}try{return this.getOrInitializeService({instanceIdentifier:t})}catch(r){if(n)return null;throw r}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,this.shouldAutoInitialize()){if(function(e){return"EAGER"===e.instantiationMode}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e))try{this.getOrInitializeService({instanceIdentifier:M})}catch(t){}for(const[e,n]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(e);try{const e=this.getOrInitializeService({instanceIdentifier:r});n.resolve(e)}catch(t){}}}}clearInstance(e=M){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(e=>"INTERNAL"in e).map(e=>e.INTERNAL.delete()),...e.filter(e=>"_delete"in e).map(e=>e._delete())])}isComponentSet(){return null!=this.component}isInitialized(e=M){return this.instances.has(e)}getOptions(e=M){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,n=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:n,options:t});for(const[s,i]of this.instancesDeferred.entries()){n===this.normalizeInstanceIdentifier(s)&&i.resolve(r)}return r}onInit(e,t){const n=this.normalizeInstanceIdentifier(t),r=this.onInitCallbacks.get(n)??new Set;r.add(e),this.onInitCallbacks.set(n,r);const s=this.instances.get(n);return s&&e(s,n),()=>{r.delete(e)}}invokeOnInitCallbacks(e,t){const n=this.onInitCallbacks.get(t);if(n)for(const r of n)try{r(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let n=this.instances.get(e);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:(r=e,r===M?void 0:r),options:t}),this.instances.set(e,n),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(n,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,n)}catch{}var r;return n||null}normalizeInstanceIdentifier(e=M){return this.component?this.component.multipleInstances?e:M:e}shouldAutoInitialize(){return!!this.component&&"EXPLICIT"!==this.component.instantiationMode}}class V{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new U(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var F,B;(B=F||(F={}))[B.DEBUG=0]="DEBUG",B[B.VERBOSE=1]="VERBOSE",B[B.INFO=2]="INFO",B[B.WARN=3]="WARN",B[B.ERROR=4]="ERROR",B[B.SILENT=5]="SILENT";const j={debug:F.DEBUG,verbose:F.VERBOSE,info:F.INFO,warn:F.WARN,error:F.ERROR,silent:F.SILENT},q=F.INFO,z={[F.DEBUG]:"log",[F.VERBOSE]:"log",[F.INFO]:"info",[F.WARN]:"warn",[F.ERROR]:"error"},$=(e,t,...n)=>{if(t<e.logLevel)return;const r=(new Date).toISOString(),s=z[t];if(!s)throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`);console[s](`[${r}]  ${e.name}:`,...n)};class K{constructor(e){this.name=e,this._logLevel=q,this._logHandler=$,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in F))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel="string"==typeof e?j[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if("function"!=typeof e)throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,F.DEBUG,...e),this._logHandler(this,F.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,F.VERBOSE,...e),this._logHandler(this,F.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,F.INFO,...e),this._logHandler(this,F.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,F.WARN,...e),this._logHandler(this,F.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,F.ERROR,...e),this._logHandler(this,F.ERROR,...e)}}let G,H;const W=new WeakMap,Q=new WeakMap,J=new WeakMap,X=new WeakMap,Y=new WeakMap;let Z={get(e,t,n){if(e instanceof IDBTransaction){if("done"===t)return Q.get(e);if("objectStoreNames"===t)return e.objectStoreNames||J.get(e);if("store"===t)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return ne(e[t])},set:(e,t,n)=>(e[t]=n,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function ee(e){return e!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?(H||(H=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(e)?function(...t){return e.apply(re(this),t),ne(W.get(this))}:function(...t){return ne(e.apply(re(this),t))}:function(t,...n){const r=e.call(re(this),t,...n);return J.set(r,t.sort?t.sort():[t]),ne(r)}}function te(e){return"function"==typeof e?ee(e):(e instanceof IDBTransaction&&function(e){if(Q.has(e))return;const t=new Promise((t,n)=>{const r=()=>{e.removeEventListener("complete",s),e.removeEventListener("error",i),e.removeEventListener("abort",i)},s=()=>{t(),r()},i=()=>{n(e.error||new DOMException("AbortError","AbortError")),r()};e.addEventListener("complete",s),e.addEventListener("error",i),e.addEventListener("abort",i)});Q.set(e,t)}(e),t=e,(G||(G=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])).some(e=>t instanceof e)?new Proxy(e,Z):e);var t}function ne(e){if(e instanceof IDBRequest)return function(e){const t=new Promise((t,n)=>{const r=()=>{e.removeEventListener("success",s),e.removeEventListener("error",i)},s=()=>{t(ne(e.result)),r()},i=()=>{n(e.error),r()};e.addEventListener("success",s),e.addEventListener("error",i)});return t.then(t=>{t instanceof IDBCursor&&W.set(t,e)}).catch(()=>{}),Y.set(t,e),t}(e);if(X.has(e))return X.get(e);const t=te(e);return t!==e&&(X.set(e,t),Y.set(t,e)),t}const re=e=>Y.get(e);const se=["get","getKey","getAll","getAllKeys","count"],ie=["put","add","delete","clear"],oe=new Map;function ae(e,t){if(!(e instanceof IDBDatabase)||t in e||"string"!=typeof t)return;if(oe.get(t))return oe.get(t);const n=t.replace(/FromIndex$/,""),r=t!==n,s=ie.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!s&&!se.includes(n))return;const i=async function(e,...t){const i=this.transaction(e,s?"readwrite":"readonly");let o=i.store;return r&&(o=o.index(t.shift())),(await Promise.all([o[n](...t),s&&i.done]))[0]};return oe.set(t,i),i}Z=(e=>({...e,get:(t,n,r)=>ae(t,n)||e.get(t,n,r),has:(t,n)=>!!ae(t,n)||e.has(t,n)}))(Z);
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ce{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(e=>{if(function(e){const t=e.getComponent();return"VERSION"===t?.type}(e)){const t=e.getImmediate();return`${t.library}/${t.version}`}return null}).filter(e=>e).join(" ")}}const ue="@firebase/app",he="0.14.1",le=new K("@firebase/app"),de="@firebase/app-compat",fe="@firebase/analytics-compat",pe="@firebase/analytics",me="@firebase/app-check-compat",ge="@firebase/app-check",ye="@firebase/auth",we="@firebase/auth-compat",ve="@firebase/database",_e="@firebase/data-connect",Ie="@firebase/database-compat",be="@firebase/functions",Te="@firebase/functions-compat",Ee="@firebase/installations",Se="@firebase/installations-compat",Ce="@firebase/messaging",ke="@firebase/messaging-compat",Ae="@firebase/performance",Ne="@firebase/performance-compat",De="@firebase/remote-config",Re="@firebase/remote-config-compat",xe="@firebase/storage",Oe="@firebase/storage-compat",Pe="@firebase/firestore",Le="@firebase/ai",Me="@firebase/firestore-compat",Ue="firebase",Ve="[DEFAULT]",Fe={[ue]:"fire-core",[de]:"fire-core-compat",[pe]:"fire-analytics",[fe]:"fire-analytics-compat",[ge]:"fire-app-check",[me]:"fire-app-check-compat",[ye]:"fire-auth",[we]:"fire-auth-compat",[ve]:"fire-rtdb",[_e]:"fire-data-connect",[Ie]:"fire-rtdb-compat",[be]:"fire-fn",[Te]:"fire-fn-compat",[Ee]:"fire-iid",[Se]:"fire-iid-compat",[Ce]:"fire-fcm",[ke]:"fire-fcm-compat",[Ae]:"fire-perf",[Ne]:"fire-perf-compat",[De]:"fire-rc",[Re]:"fire-rc-compat",[xe]:"fire-gcs",[Oe]:"fire-gcs-compat",[Pe]:"fire-fst",[Me]:"fire-fst-compat",[Le]:"fire-vertex","fire-js":"fire-js",[Ue]:"fire-js-all"},Be=new Map,je=new Map,qe=new Map;function ze(e,t){try{e.container.addComponent(t)}catch(n){le.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,n)}}function $e(e){const t=e.name;if(qe.has(t))return le.debug(`There were multiple attempts to register component ${t}.`),!1;qe.set(t,e);for(const n of Be.values())ze(n,e);for(const n of je.values())ze(n,e);return!0}function Ke(e,t){const n=e.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),e.container.getProvider(t)}function Ge(e){return null!=e&&void 0!==e.settings}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const He=new S("app","Firebase",{"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."});
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class We{constructor(e,t,n){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new L("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw He.create("app-deleted",{appName:this._name})}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qe="12.1.0";function Je(e,t={}){let n=e;if("object"!=typeof t){t={name:t}}const r={name:Ve,automaticDataCollectionEnabled:!0,...t},s=r.name;if("string"!=typeof s||!s)throw He.create("bad-app-name",{appName:String(s)});if(n||(n=h()),!n)throw He.create("no-options");const i=Be.get(s);if(i){if(k(n,i.options)&&k(r,i.config))return i;throw He.create("duplicate-app",{appName:s})}const o=new V(s);for(const c of qe.values())o.addComponent(c);const a=new We(n,r,o);return Be.set(s,a),a}function Xe(e=Ve){const t=Be.get(e);if(!t&&e===Ve&&h())return Je();if(!t)throw He.create("no-app",{appName:e});return t}function Ye(e,t,n){let r=Fe[e]??e;n&&(r+=`-${n}`);const s=r.match(/\s|\//),i=t.match(/\s|\//);if(s||i){const e=[`Unable to register library "${r}" with version "${t}":`];return s&&e.push(`library name "${r}" contains illegal characters (whitespace or "/")`),s&&i&&e.push("and"),i&&e.push(`version name "${t}" contains illegal characters (whitespace or "/")`),void le.warn(e.join(" "))}$e(new L(`${r}-version`,()=>({library:r,version:t}),"VERSION"))}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ze="firebase-heartbeat-store";let et=null;function tt(){return et||(et=function(e,t,{blocked:n,upgrade:r,blocking:s,terminated:i}={}){const o=indexedDB.open(e,t),a=ne(o);return r&&o.addEventListener("upgradeneeded",e=>{r(ne(o.result),e.oldVersion,e.newVersion,ne(o.transaction),e)}),n&&o.addEventListener("blocked",e=>n(e.oldVersion,e.newVersion,e)),a.then(e=>{i&&e.addEventListener("close",()=>i()),s&&e.addEventListener("versionchange",e=>s(e.oldVersion,e.newVersion,e))}).catch(()=>{}),a}("firebase-heartbeat-database",1,{upgrade:(e,t)=>{if(0===t)try{e.createObjectStore(Ze)}catch(n){console.warn(n)}}}).catch(e=>{throw He.create("idb-open",{originalErrorMessage:e.message})})),et}async function nt(e,t){try{const n=(await tt()).transaction(Ze,"readwrite"),r=n.objectStore(Ze);await r.put(t,rt(e)),await n.done}catch(n){if(n instanceof E)le.warn(n.message);else{const e=He.create("idb-set",{originalErrorMessage:n?.message});le.warn(e.message)}}}function rt(e){return`${e.name}!${e.options.appId}`}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class st{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new ot(t),this._heartbeatsCachePromise=this._storage.read().then(e=>(this._heartbeatsCache=e,e))}async triggerHeartbeat(){try{const e=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),t=it();if(null==this._heartbeatsCache?.heartbeats&&(this._heartbeatsCache=await this._heartbeatsCachePromise,null==this._heartbeatsCache?.heartbeats))return;if(this._heartbeatsCache.lastSentHeartbeatDate===t||this._heartbeatsCache.heartbeats.some(e=>e.date===t))return;if(this._heartbeatsCache.heartbeats.push({date:t,agent:e}),this._heartbeatsCache.heartbeats.length>30){const e=function(e){if(0===e.length)return-1;let t=0,n=e[0].date;for(let r=1;r<e.length;r++)e[r].date<n&&(n=e[r].date,t=r);return t}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(e,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(e){le.warn(e)}}async getHeartbeatsHeader(){try{if(null===this._heartbeatsCache&&await this._heartbeatsCachePromise,null==this._heartbeatsCache?.heartbeats||0===this._heartbeatsCache.heartbeats.length)return"";const e=it(),{heartbeatsToSend:t,unsentEntries:n}=function(e,t=1024){const n=[];let r=e.slice();for(const s of e){const e=n.find(e=>e.agent===s.agent);if(e){if(e.dates.push(s.date),at(n)>t){e.dates.pop();break}}else if(n.push({agent:s.agent,dates:[s.date]}),at(n)>t){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}(this._heartbeatsCache.heartbeats),r=s(JSON.stringify({version:2,heartbeats:t}));return this._heartbeatsCache.lastSentHeartbeatDate=e,n.length>0?(this._heartbeatsCache.heartbeats=n,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),r}catch(e){return le.warn(e),""}}}function it(){return(new Date).toISOString().substring(0,10)}class ot{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return!!T()&&new Promise((e,t)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),n||self.indexedDB.deleteDatabase(r),e(!0)},s.onupgradeneeded=()=>{n=!1},s.onerror=()=>{t(s.error?.message||"")}}catch(n){t(n)}}).then(()=>!0).catch(()=>!1)}async read(){if(await this._canUseIndexedDBPromise){const e=await async function(e){try{const t=(await tt()).transaction(Ze),n=await t.objectStore(Ze).get(rt(e));return await t.done,n}catch(t){if(t instanceof E)le.warn(t.message);else{const e=He.create("idb-get",{originalErrorMessage:t?.message});le.warn(e.message)}}}(this.app);return e?.heartbeats?e:{heartbeats:[]}}return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const t=await this.read();return nt(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??t.lastSentHeartbeatDate,heartbeats:e.heartbeats})}}async add(e){if(await this._canUseIndexedDBPromise){const t=await this.read();return nt(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??t.lastSentHeartbeatDate,heartbeats:[...t.heartbeats,...e.heartbeats]})}}}function at(e){return s(JSON.stringify({version:2,heartbeats:e})).length}var ct;function ut(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}ct="",$e(new L("platform-logger",e=>new ce(e),"PRIVATE")),$e(new L("heartbeat",e=>new st(e),"PRIVATE")),Ye(ue,he,ct),Ye(ue,he,"esm2020"),Ye("fire-js","");const ht=ut,lt=new S("auth","Firebase",{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}),dt=new K("@firebase/auth");function ft(e,...t){dt.logLevel<=F.ERROR&&dt.error(`Auth (${Qe}): ${e}`,...t)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pt(e,...t){throw wt(e,...t)}function mt(e,...t){return wt(e,...t)}function gt(e,t,n){const r={...ht(),[t]:n};return new S("auth","Firebase",r).create(t,{appName:e.name})}function yt(e){return gt(e,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function wt(e,...t){if("string"!=typeof e){const n=t[0],r=[...t.slice(1)];return r[0]&&(r[0].appName=e.name),e._errorFactory.create(n,...r)}return lt.create(e,...t)}function vt(e,t,...n){if(!e)throw wt(t,...n)}function _t(e){const t="INTERNAL ASSERTION FAILED: "+e;throw ft(t),new Error(t)}function It(e,t){e||_t(t)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bt(){return"undefined"!=typeof self&&self.location?.href||""}function Tt(){return"undefined"!=typeof self&&self.location?.protocol||null}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Et(){return"undefined"==typeof navigator||!navigator||!("onLine"in navigator)||"boolean"!=typeof navigator.onLine||"http:"!==Tt()&&"https:"!==Tt()&&!function(){const e="object"==typeof chrome?chrome.runtime:"object"==typeof browser?browser.runtime:void 0;return"object"==typeof e&&void 0!==e.id}()&&!("connection"in navigator)||navigator.onLine}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class St{constructor(e,t){this.shortDelay=e,this.longDelay=t,It(t>e,"Short delay should be less than long delay!"),this.isMobile="undefined"!=typeof window&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(v())||"object"==typeof navigator&&"ReactNative"===navigator.product}get(){return Et()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ct(e,t){It(e.emulator,"Emulator should always be set here");const{url:n}=e.emulator;return t?`${n}${t.startsWith("/")?t.slice(1):t}`:n}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kt{static initialize(e,t,n){this.fetchImpl=e,t&&(this.headersImpl=t),n&&(this.responseImpl=n)}static fetch(){return this.fetchImpl?this.fetchImpl:"undefined"!=typeof self&&"fetch"in self?self.fetch:"undefined"!=typeof globalThis&&globalThis.fetch?globalThis.fetch:"undefined"!=typeof fetch?fetch:void _t("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){return this.headersImpl?this.headersImpl:"undefined"!=typeof self&&"Headers"in self?self.Headers:"undefined"!=typeof globalThis&&globalThis.Headers?globalThis.Headers:"undefined"!=typeof Headers?Headers:void _t("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){return this.responseImpl?this.responseImpl:"undefined"!=typeof self&&"Response"in self?self.Response:"undefined"!=typeof globalThis&&globalThis.Response?globalThis.Response:"undefined"!=typeof Response?Response:void _t("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const At={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"},Nt=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],Dt=new St(3e4,6e4);
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rt(e,t){return e.tenantId&&!t.tenantId?{...t,tenantId:e.tenantId}:t}async function xt(e,t,n,r,s={}){return Ot(e,s,async()=>{let s={},i={};r&&("GET"===t?i=r:s={body:JSON.stringify(r)});const o=N({key:e.config.apiKey,...i}).slice(1),a=await e._getAdditionalHeaders();a["Content-Type"]="application/json",e.languageCode&&(a["X-Firebase-Locale"]=e.languageCode);const c={method:t,headers:a,...s};return"undefined"!=typeof navigator&&"Cloudflare-Workers"===navigator.userAgent||(c.referrerPolicy="no-referrer"),e.emulatorConfig&&f(e.emulatorConfig.host)&&(c.credentials="include"),kt.fetch()(await Lt(e,e.config.apiHost,n,o),c)})}async function Ot(e,t,n){e._canInitEmulator=!1;const r={...At,...t};try{const t=new Ut(e),s=await Promise.race([n(),t.promise]);t.clearNetworkTimeout();const i=await s.json();if("needConfirmation"in i)throw Vt(e,"account-exists-with-different-credential",i);if(s.ok&&!("errorMessage"in i))return i;{const t=s.ok?i.errorMessage:i.error.message,[n,o]=t.split(" : ");if("FEDERATED_USER_ID_ALREADY_LINKED"===n)throw Vt(e,"credential-already-in-use",i);if("EMAIL_EXISTS"===n)throw Vt(e,"email-already-in-use",i);if("USER_DISABLED"===n)throw Vt(e,"user-disabled",i);const a=r[n]||n.toLowerCase().replace(/[_\s]+/g,"-");if(o)throw gt(e,a,o);pt(e,a)}}catch(s){if(s instanceof E)throw s;pt(e,"network-request-failed",{message:String(s)})}}async function Pt(e,t,n,r,s={}){const i=await xt(e,t,n,r,s);return"mfaPendingCredential"in i&&pt(e,"multi-factor-auth-required",{_serverResponse:i}),i}async function Lt(e,t,n,r){const s=`${t}${n}?${r}`,i=e,o=i.config.emulator?Ct(e.config,s):`${e.config.apiScheme}://${s}`;if(Nt.includes(n)&&(await i._persistenceManagerAvailable,"COOKIE"===i._getPersistenceType())){return i._getPersistence()._getFinalTarget(o).toString()}return o}function Mt(e){switch(e){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class Ut{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((e,t)=>{this.timer=setTimeout(()=>t(mt(this.auth,"network-request-failed")),Dt.get())})}}function Vt(e,t,n){const r={appName:e.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const s=mt(e,t,r);return s.customData._tokenResponse=n,s}function Ft(e){return void 0!==e&&void 0!==e.enterprise}class Bt{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],void 0===e.recaptchaKey)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||0===this.recaptchaEnforcementState.length)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return Mt(t.enforcementState);return null}isProviderEnabled(e){return"ENFORCE"===this.getProviderEnforcementState(e)||"AUDIT"===this.getProviderEnforcementState(e)}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function jt(e,t){return xt(e,"POST","/v1/accounts:lookup",t)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qt(e){if(e)try{const t=new Date(Number(e));if(!isNaN(t.getTime()))return t.toUTCString()}catch(t){}}function zt(e){return 1e3*Number(e)}function $t(e){const[t,n,r]=e.split(".");if(void 0===t||void 0===n||void 0===r)return ft("JWT malformed, contained fewer than 3 sections"),null;try{const e=i(n);return e?JSON.parse(e):(ft("Failed to decode base64 JWT payload"),null)}catch(s){return ft("Caught error parsing JWT payload as JSON",s?.toString()),null}}function Kt(e){const t=$t(e);return vt(t,"internal-error"),vt(void 0!==t.exp,"internal-error"),vt(void 0!==t.iat,"internal-error"),Number(t.exp)-Number(t.iat)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Gt(e,t,n=!1){if(n)return t;try{return await t}catch(r){throw r instanceof E&&function({code:e}){return"auth/user-disabled"===e||"auth/user-token-expired"===e}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(r)&&e.auth.currentUser===e&&await e.auth.signOut(),r}}class Ht{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,null!==this.timerId&&clearTimeout(this.timerId))}getInterval(e){if(e){const e=this.errorBackoff;return this.errorBackoff=Math.min(2*this.errorBackoff,96e4),e}{this.errorBackoff=3e4;const e=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,e)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){return void("auth/network-request-failed"===e?.code&&this.schedule(!0))}this.schedule()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wt{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=qt(this.lastLoginAt),this.creationTime=qt(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Qt(e){const t=e.auth,n=await e.getIdToken(),r=await Gt(e,jt(t,{idToken:n}));vt(r?.users.length,t,"internal-error");const s=r.users[0];e._notifyReloadListener(s);const i=s.providerUserInfo?.length?Jt(s.providerUserInfo):[],o=(a=e.providerData,c=i,[...a.filter(e=>!c.some(t=>t.providerId===e.providerId)),...c]);var a,c;const u=e.isAnonymous,h=!(e.email&&s.passwordHash||o?.length),l=!!u&&h,d={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:o,metadata:new Wt(s.createdAt,s.lastLoginAt),isAnonymous:l};Object.assign(e,d)}function Jt(e){return e.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Xt{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){vt(e.idToken,"internal-error"),vt(void 0!==e.idToken,"internal-error"),vt(void 0!==e.refreshToken,"internal-error");const t="expiresIn"in e&&void 0!==e.expiresIn?Number(e.expiresIn):Kt(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){vt(0!==e.length,"internal-error");const t=Kt(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return t||!this.accessToken||this.isExpired?(vt(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null):this.accessToken}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:n,refreshToken:r,expiresIn:s}=await async function(e,t){const n=await Ot(e,{},async()=>{const n=N({grant_type:"refresh_token",refresh_token:t}).slice(1),{tokenApiHost:r,apiKey:s}=e.config,i=await Lt(e,r,"/v1/token",`key=${s}`),o=await e._getAdditionalHeaders();o["Content-Type"]="application/x-www-form-urlencoded";const a={method:"POST",headers:o,body:n};return e.emulatorConfig&&f(e.emulatorConfig.host)&&(a.credentials="include"),kt.fetch()(i,a)});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}(e,t);this.updateTokensAndExpiration(n,r,Number(s))}updateTokensAndExpiration(e,t,n){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+1e3*n}static fromJSON(e,t){const{refreshToken:n,accessToken:r,expirationTime:s}=t,i=new Xt;return n&&(vt("string"==typeof n,"internal-error",{appName:e}),i.refreshToken=n),r&&(vt("string"==typeof r,"internal-error",{appName:e}),i.accessToken=r),s&&(vt("number"==typeof s,"internal-error",{appName:e}),i.expirationTime=s),i}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Xt,this.toJSON())}_performRefresh(){return _t("not implemented")}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yt(e,t){vt("string"==typeof e||void 0===e,"internal-error",{appName:t})}class Zt{constructor({uid:e,auth:t,stsTokenManager:n,...r}){this.providerId="firebase",this.proactiveRefresh=new Ht(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=n,this.accessToken=n.accessToken,this.displayName=r.displayName||null,this.email=r.email||null,this.emailVerified=r.emailVerified||!1,this.phoneNumber=r.phoneNumber||null,this.photoURL=r.photoURL||null,this.isAnonymous=r.isAnonymous||!1,this.tenantId=r.tenantId||null,this.providerData=r.providerData?[...r.providerData]:[],this.metadata=new Wt(r.createdAt||void 0,r.lastLoginAt||void 0)}async getIdToken(e){const t=await Gt(this,this.stsTokenManager.getToken(this.auth,e));return vt(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return async function(e,t=!1){const n=P(e),r=await n.getIdToken(t),s=$t(r);vt(s&&s.exp&&s.auth_time&&s.iat,n.auth,"internal-error");const i="object"==typeof s.firebase?s.firebase:void 0,o=i?.sign_in_provider;return{claims:s,token:r,authTime:qt(zt(s.auth_time)),issuedAtTime:qt(zt(s.iat)),expirationTime:qt(zt(s.exp)),signInProvider:o||null,signInSecondFactor:i?.sign_in_second_factor||null}}(this,e)}reload(){return async function(e){const t=P(e);await Qt(t),await t.auth._persistUserIfCurrent(t),t.auth._notifyListenersIfCurrent(t)}(this)}_assign(e){this!==e&&(vt(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(e=>({...e})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Zt({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){vt(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let n=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),n=!0),t&&await Qt(this),await this.auth._persistUserIfCurrent(this),n&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Ge(this.auth.app))return Promise.reject(yt(this.auth));const e=await this.getIdToken();return await Gt(this,
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function(e,t){return xt(e,"POST","/v1/accounts:delete",t)}(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){const n=t.displayName??void 0,r=t.email??void 0,s=t.phoneNumber??void 0,i=t.photoURL??void 0,o=t.tenantId??void 0,a=t._redirectEventId??void 0,c=t.createdAt??void 0,u=t.lastLoginAt??void 0,{uid:h,emailVerified:l,isAnonymous:d,providerData:f,stsTokenManager:p}=t;vt(h&&p,e,"internal-error");const m=Xt.fromJSON(this.name,p);vt("string"==typeof h,e,"internal-error"),Yt(n,e.name),Yt(r,e.name),vt("boolean"==typeof l,e,"internal-error"),vt("boolean"==typeof d,e,"internal-error"),Yt(s,e.name),Yt(i,e.name),Yt(o,e.name),Yt(a,e.name),Yt(c,e.name),Yt(u,e.name);const g=new Zt({uid:h,auth:e,email:r,emailVerified:l,displayName:n,isAnonymous:d,photoURL:i,phoneNumber:s,tenantId:o,stsTokenManager:m,createdAt:c,lastLoginAt:u});return f&&Array.isArray(f)&&(g.providerData=f.map(e=>({...e}))),a&&(g._redirectEventId=a),g}static async _fromIdTokenResponse(e,t,n=!1){const r=new Xt;r.updateFromServerResponse(t);const s=new Zt({uid:t.localId,auth:e,stsTokenManager:r,isAnonymous:n});return await Qt(s),s}static async _fromGetAccountInfoResponse(e,t,n){const r=t.users[0];vt(void 0!==r.localId,"internal-error");const s=void 0!==r.providerUserInfo?Jt(r.providerUserInfo):[],i=!(r.email&&r.passwordHash||s?.length),o=new Xt;o.updateFromIdToken(n);const a=new Zt({uid:r.localId,auth:e,stsTokenManager:o,isAnonymous:i}),c={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:s,metadata:new Wt(r.createdAt,r.lastLoginAt),isAnonymous:!(r.email&&r.passwordHash||s?.length)};return Object.assign(a,c),a}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const en=new Map;function tn(e){It(e instanceof Function,"Expected a class definition");let t=en.get(e);return t?(It(t instanceof e,"Instance stored in cache mismatched with class"),t):(t=new e,en.set(e,t),t)}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nn{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return void 0===t?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}nn.type="NONE";const rn=nn;
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sn(e,t,n){return`firebase:${e}:${t}:${n}`}class on{constructor(e,t,n){this.persistence=e,this.auth=t,this.userKey=n;const{config:r,name:s}=this.auth;this.fullUserKey=sn(this.userKey,r.apiKey,s),this.fullPersistenceKey=sn("persistence",r.apiKey,s),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if("string"==typeof e){const t=await jt(this.auth,{idToken:e}).catch(()=>{});return t?Zt._fromGetAccountInfoResponse(this.auth,t,e):null}return Zt._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();return await this.removeCurrentUser(),this.persistence=e,t?this.setCurrentUser(t):void 0}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,n="authUser"){if(!t.length)return new on(tn(rn),e,n);const r=(await Promise.all(t.map(async e=>{if(await e._isAvailable())return e}))).filter(e=>e);let s=r[0]||tn(rn);const i=sn(n,e.config.apiKey,e.name);let o=null;for(const c of t)try{const t=await c._get(i);if(t){let n;if("string"==typeof t){const r=await jt(e,{idToken:t}).catch(()=>{});if(!r)break;n=await Zt._fromGetAccountInfoResponse(e,r,t)}else n=Zt._fromJSON(e,t);c!==s&&(o=n),s=c;break}}catch{}const a=r.filter(e=>e._shouldAllowMigration);return s._shouldAllowMigration&&a.length?(s=a[0],o&&await s._set(i,o.toJSON()),await Promise.all(t.map(async e=>{if(e!==s)try{await e._remove(i)}catch{}})),new on(s,e,n)):new on(s,e,n)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function an(e){const t=e.toLowerCase();if(t.includes("opera/")||t.includes("opr/")||t.includes("opios/"))return"Opera";if(ln(t))return"IEMobile";if(t.includes("msie")||t.includes("trident/"))return"IE";if(t.includes("edge/"))return"Edge";if(cn(t))return"Firefox";if(t.includes("silk/"))return"Silk";if(fn(t))return"Blackberry";if(pn(t))return"Webos";if(un(t))return"Safari";if((t.includes("chrome/")||hn(t))&&!t.includes("edge/"))return"Chrome";if(dn(t))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,n=e.match(t);if(2===n?.length)return n[1]}return"Other"}function cn(e=v()){return/firefox\//i.test(e)}function un(e=v()){const t=e.toLowerCase();return t.includes("safari/")&&!t.includes("chrome/")&&!t.includes("crios/")&&!t.includes("android")}function hn(e=v()){return/crios\//i.test(e)}function ln(e=v()){return/iemobile/i.test(e)}function dn(e=v()){return/android/i.test(e)}function fn(e=v()){return/blackberry/i.test(e)}function pn(e=v()){return/webos/i.test(e)}function mn(e=v()){return/iphone|ipad|ipod/i.test(e)||/macintosh/i.test(e)&&/mobile/i.test(e)}function gn(){return function(){const e=v();return e.indexOf("MSIE ")>=0||e.indexOf("Trident/")>=0}()&&10===document.documentMode}function yn(e=v()){return mn(e)||dn(e)||pn(e)||fn(e)||/windows phone/i.test(e)||ln(e)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wn(e,t=[]){let n;switch(e){case"Browser":n=an(v());break;case"Worker":n=`${an(v())}-${e}`;break;default:n=e}const r=t.length?t.join(","):"FirebaseCore-web";return`${n}/JsCore/${Qe}/${r}`}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vn{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const n=t=>new Promise((n,r)=>{try{n(e(t))}catch(s){r(s)}});n.onAbort=t,this.queue.push(n);const r=this.queue.length-1;return()=>{this.queue[r]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const n of this.queue)await n(e),n.onAbort&&t.push(n.onAbort)}catch(n){t.reverse();for(const e of t)try{e()}catch(r){}throw this.auth._errorFactory.create("login-blocked",{originalMessage:n?.message})}}}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _n{constructor(e){const t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??6,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),void 0!==t.containsLowercaseCharacter&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),void 0!==t.containsUppercaseCharacter&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),void 0!==t.containsNumericCharacter&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),void 0!==t.containsNonAlphanumericCharacter&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,"ENFORCEMENT_STATE_UNSPECIFIED"===this.enforcementState&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=e.allowedNonAlphanumericCharacters?.join("")??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){const n=this.customStrengthOptions.minPasswordLength,r=this.customStrengthOptions.maxPasswordLength;n&&(t.meetsMinPasswordLength=e.length>=n),r&&(t.meetsMaxPasswordLength=e.length<=r)}validatePasswordCharacterOptions(e,t){let n;this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);for(let r=0;r<e.length;r++)n=e.charAt(r),this.updatePasswordCharacterOptionsStatuses(t,n>="a"&&n<="z",n>="A"&&n<="Z",n>="0"&&n<="9",this.allowedNonAlphanumericCharacters.includes(n))}updatePasswordCharacterOptionsStatuses(e,t,n,r,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=n)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=r)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class In{constructor(e,t,n,r){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=n,this.config=r,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Tn(this),this.idTokenSubscription=new Tn(this),this.beforeStateQueue=new vn(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=lt,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=r.sdkClientVersion,this._persistenceManagerAvailable=new Promise(e=>this._resolvePersistenceManagerAvailable=e)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=tn(t)),this._initializationPromise=this.queue(async()=>{if(!this._deleted&&(this.persistenceManager=await on.create(this,e),this._resolvePersistenceManagerAvailable?.(),!this._deleted)){if(this._popupRedirectResolver?._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch(n){}await this.initializeCurrentUser(t),this.lastNotifiedUid=this.currentUser?.uid||null,this._deleted||(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();return this.currentUser||e?this.currentUser&&e&&this.currentUser.uid===e.uid?(this._currentUser._assign(e),void(await this.currentUser.getIdToken())):void(await this._updateCurrentUser(e,!0)):void 0}async initializeCurrentUserFromIdToken(e){try{const t=await jt(this,{idToken:e}),n=await Zt._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(n)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){if(Ge(this.app)){const e=this.app.settings.authIdToken;return e?new Promise(t=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(e).then(t,t))}):this.directlySetCurrentUser(null)}const t=await this.assertedPersistence.getCurrentUser();let n=t,r=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const t=this.redirectUser?._redirectEventId,s=n?._redirectEventId,i=await this.tryRedirectSignIn(e);t&&t!==s||!i?.user||(n=i.user,r=!0)}if(!n)return this.directlySetCurrentUser(null);if(!n._redirectEventId){if(r)try{await this.beforeStateQueue.runMiddleware(n)}catch(s){n=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(s))}return n?this.reloadAndSetCurrentUserOrClear(n):this.directlySetCurrentUser(null)}return vt(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===n._redirectEventId?this.directlySetCurrentUser(n):this.reloadAndSetCurrentUserOrClear(n)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch(n){await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Qt(e)}catch(t){if("auth/network-request-failed"!==t?.code)return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=function(){if("undefined"==typeof navigator)return null;const e=navigator;return e.languages&&e.languages[0]||e.language||null}()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Ge(this.app))return Promise.reject(yt(this));const t=e?P(e):null;return t&&vt(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&vt(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Ge(this.app)?Promise.reject(yt(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Ge(this.app)?Promise.reject(yt(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(tn(e))})}_getRecaptchaConfig(){return null==this.tenantId?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return null===this.tenantId?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await async function(e,t={}){return xt(e,"GET","/v2/passwordPolicy",Rt(e,t))}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(this),t=new _n(e);null===this.tenantId?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new S("auth","Firebase",e())}onAuthStateChanged(e,t,n){return this.registerStateListener(this.authStateSubscription,e,t,n)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,n){return this.registerStateListener(this.idTokenSubscription,e,t,n)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const n=this.onAuthStateChanged(()=>{n(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:await this.currentUser.getIdToken()};null!=this.tenantId&&(t.tenantId=this.tenantId),await async function(e,t){return xt(e,"POST","/v2/accounts:revokeToken",Rt(e,t))}(this,t)}}toJSON(){return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:this._currentUser?.toJSON()}}async _setRedirectUser(e,t){const n=await this.getOrInitRedirectPersistenceManager(t);return null===e?n.removeCurrentUser():n.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&tn(e)||this._popupRedirectResolver;vt(t,this,"argument-error"),this.redirectPersistenceManager=await on.create(this,[tn(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){return this._isInitialized&&await this.queue(async()=>{}),this._currentUser?._redirectEventId===e?this._currentUser:this.redirectUser?._redirectEventId===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=this.currentUser?.uid??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,n,r){if(this._deleted)return()=>{};const s="function"==typeof t?t:t.next.bind(t);let i=!1;const o=this._isInitialized?Promise.resolve():this._initializationPromise;if(vt(o,this,"internal-error"),o.then(()=>{i||s(this.currentUser)}),"function"==typeof t){const s=e.addObserver(t,n,r);return()=>{i=!0,s()}}{const n=e.addObserver(t);return()=>{i=!0,n()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return vt(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){e&&!this.frameworks.includes(e)&&(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=wn(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const t=await(this.heartbeatServiceProvider.getImmediate({optional:!0})?.getHeartbeatsHeader());t&&(e["X-Firebase-Client"]=t);const n=await this._getAppCheckToken();return n&&(e["X-Firebase-AppCheck"]=n),e}async _getAppCheckToken(){if(Ge(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await(this.appCheckServiceProvider.getImmediate({optional:!0})?.getToken());return e?.error&&function(e,...t){dt.logLevel<=F.WARN&&dt.warn(`Auth (${Qe}): ${e}`,...t)}(`Error while retrieving App Check token: ${e.error}`),e?.token}}function bn(e){return P(e)}class Tn{constructor(e){this.auth=e,this.observer=null,this.addObserver=function(e,t){const n=new x(e,t);return n.subscribe.bind(n)}(e=>this.observer=e)}get next(){return vt(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let En={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Sn(e){return En.loadJS(e)}class Cn{constructor(){this.enterprise=new kn}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class kn{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}const An="NO_RECAPTCHA";class Nn{constructor(e){this.type="recaptcha-enterprise",this.auth=bn(e)}async verify(e="verify",t=!1){async function n(e){if(!t){if(null==e.tenantId&&null!=e._agentRecaptchaConfig)return e._agentRecaptchaConfig.siteKey;if(null!=e.tenantId&&void 0!==e._tenantRecaptchaConfigs[e.tenantId])return e._tenantRecaptchaConfigs[e.tenantId].siteKey}return new Promise(async(t,n)=>{(async function(e,t){return xt(e,"GET","/v2/recaptchaConfig",Rt(e,t))})(e,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(r=>{if(void 0!==r.recaptchaKey){const n=new Bt(r);return null==e.tenantId?e._agentRecaptchaConfig=n:e._tenantRecaptchaConfigs[e.tenantId]=n,t(n.siteKey)}n(new Error("recaptcha Enterprise site key undefined"))}).catch(e=>{n(e)})})}function r(t,n,r){const s=window.grecaptcha;Ft(s)?s.enterprise.ready(()=>{s.enterprise.execute(t,{action:e}).then(e=>{n(e)}).catch(()=>{n(An)})}):r(Error("No reCAPTCHA enterprise script loaded."))}if(this.auth.settings.appVerificationDisabledForTesting){return(new Cn).execute("siteKey",{action:"verify"})}return new Promise((e,s)=>{n(this.auth).then(n=>{if(!t&&Ft(window.grecaptcha))r(n,e,s);else{if("undefined"==typeof window)return void s(new Error("RecaptchaVerifier is only supported in browser"));let t=En.recaptchaEnterpriseScript;0!==t.length&&(t+=n),Sn(t).then(()=>{r(n,e,s)}).catch(e=>{s(e)})}}).catch(e=>{s(e)})})}}async function Dn(e,t,n,r=!1,s=!1){const i=new Nn(e);let o;if(s)o=An;else try{o=await i.verify(n)}catch(c){o=await i.verify(n,!0)}const a={...t};if("mfaSmsEnrollment"===n||"mfaSmsSignIn"===n){if("phoneEnrollmentInfo"in a){const e=a.phoneEnrollmentInfo.phoneNumber,t=a.phoneEnrollmentInfo.recaptchaToken;Object.assign(a,{phoneEnrollmentInfo:{phoneNumber:e,recaptchaToken:t,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in a){const e=a.phoneSignInInfo.recaptchaToken;Object.assign(a,{phoneSignInInfo:{recaptchaToken:e,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return a}return r?Object.assign(a,{captchaResp:o}):Object.assign(a,{captchaResponse:o}),Object.assign(a,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(a,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),a}async function Rn(e,t,n,r,s){if(e._getRecaptchaConfig()?.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const s=await Dn(e,t,n,"getOobCode"===n);return r(e,s)}return r(e,t).catch(async s=>{if("auth/missing-recaptcha-token"===s.code){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const s=await Dn(e,t,n,"getOobCode"===n);return r(e,s)}return Promise.reject(s)})}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xn(e,t,n){const r=bn(e);vt(/^https?:\/\//.test(t),r,"invalid-emulator-scheme");const s=On(t),{host:i,port:o}=function(e){const t=On(e),n=/(\/\/)?([^?#/]+)/.exec(e.substr(t.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(r);if(s){const e=s[1];return{host:e,port:Pn(r.substr(e.length+1))}}{const[e,t]=r.split(":");return{host:e,port:Pn(t)}}}(t),a=null===o?"":`:${o}`,c={url:`${s}//${i}${a}/`},u=Object.freeze({host:i,port:o,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:!1})});if(!r._canInitEmulator)return vt(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),void vt(k(c,r.config.emulator)&&k(u,r.emulatorConfig),r,"emulator-config-failed");r.config.emulator=c,r.emulatorConfig=u,r.settings.appVerificationDisabledForTesting=!0,f(i)?(p(`${s}//${i}${a}`),w("Auth",!0)):function(){function e(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}"undefined"!=typeof console&&"function"==typeof console.info&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials.");"undefined"!=typeof window&&"undefined"!=typeof document&&("loading"===document.readyState?window.addEventListener("DOMContentLoaded",e):e())}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */()}function On(e){const t=e.indexOf(":");return t<0?"":e.substr(0,t+1)}function Pn(e){if(!e)return null;const t=Number(e);return isNaN(t)?null:t}class Ln{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return _t("not implemented")}_getIdTokenResponse(e){return _t("not implemented")}_linkToIdToken(e,t){return _t("not implemented")}_getReauthenticationResolver(e){return _t("not implemented")}}async function Mn(e,t){return xt(e,"POST","/v1/accounts:signUp",t)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Un(e,t){return Pt(e,"POST","/v1/accounts:signInWithPassword",Rt(e,t))}async function Vn(e,t){return async function(e,t){return xt(e,"POST","/v1/accounts:sendOobCode",Rt(e,t))}(e,t)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Fn extends Ln{constructor(e,t,n,r=null){super("password",n),this._email=e,this._password=t,this._tenantId=r}static _fromEmailAndPassword(e,t){return new Fn(e,t,"password")}static _fromEmailAndCode(e,t,n=null){return new Fn(e,t,"emailLink",n)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t="string"==typeof e?JSON.parse(e):e;if(t?.email&&t?.password){if("password"===t.signInMethod)return this._fromEmailAndPassword(t.email,t.password);if("emailLink"===t.signInMethod)return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":return Rn(e,{returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"},"signInWithPassword",Un);case"emailLink":return async function(e,t){return Pt(e,"POST","/v1/accounts:signInWithEmailLink",Rt(e,t))}(e,{email:this._email,oobCode:this._password});default:pt(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":return Rn(e,{idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",Mn);case"emailLink":return async function(e,t){return Pt(e,"POST","/v1/accounts:signInWithEmailLink",Rt(e,t))}(e,{idToken:t,email:this._email,oobCode:this._password});default:pt(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Bn(e,t){return Pt(e,"POST","/v1/accounts:signInWithIdp",Rt(e,t))}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jn extends Ln{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new jn(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):pt("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t="string"==typeof e?JSON.parse(e):e,{providerId:n,signInMethod:r,...s}=t;if(!n||!r)return null;const i=new jn(n,r);return i.idToken=s.idToken||void 0,i.accessToken=s.accessToken||void 0,i.secret=s.secret,i.nonce=s.nonce,i.pendingToken=s.pendingToken||null,i}_getIdTokenResponse(e){return Bn(e,this.buildRequest())}_linkToIdToken(e,t){const n=this.buildRequest();return n.idToken=t,Bn(e,n)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,Bn(e,t)}buildRequest(){const e={requestUri:"http://localhost",returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=N(t)}return e}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qn{constructor(e){const t=D(R(e)),n=t.apiKey??null,r=t.oobCode??null,s=function(e){switch(e){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}(t.mode??null);vt(n&&r&&s,"argument-error"),this.apiKey=n,this.operation=s,this.code=r,this.continueUrl=t.continueUrl??null,this.languageCode=t.lang??null,this.tenantId=t.tenantId??null}static parseLink(e){const t=function(e){const t=D(R(e)).link,n=t?D(R(t)).deep_link_id:null,r=D(R(e)).deep_link_id;return(r?D(R(r)).link:null)||r||n||t||e}(e);try{return new qn(t)}catch{return null}}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zn{constructor(){this.providerId=zn.PROVIDER_ID}static credential(e,t){return Fn._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const n=qn.parseLink(t);return vt(n,"argument-error"),Fn._fromEmailAndCode(e,n.code,n.tenantId)}}zn.PROVIDER_ID="password",zn.EMAIL_PASSWORD_SIGN_IN_METHOD="password",zn.EMAIL_LINK_SIGN_IN_METHOD="emailLink";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class $n{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kn extends $n{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gn extends Kn{constructor(){super("facebook.com")}static credential(e){return jn._fromParams({providerId:Gn.PROVIDER_ID,signInMethod:Gn.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Gn.credentialFromTaggedObject(e)}static credentialFromError(e){return Gn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e))return null;if(!e.oauthAccessToken)return null;try{return Gn.credential(e.oauthAccessToken)}catch{return null}}}Gn.FACEBOOK_SIGN_IN_METHOD="facebook.com",Gn.PROVIDER_ID="facebook.com";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Hn extends Kn{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return jn._fromParams({providerId:Hn.PROVIDER_ID,signInMethod:Hn.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Hn.credentialFromTaggedObject(e)}static credentialFromError(e){return Hn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:n}=e;if(!t&&!n)return null;try{return Hn.credential(t,n)}catch{return null}}}Hn.GOOGLE_SIGN_IN_METHOD="google.com",Hn.PROVIDER_ID="google.com";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Wn extends Kn{constructor(){super("github.com")}static credential(e){return jn._fromParams({providerId:Wn.PROVIDER_ID,signInMethod:Wn.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Wn.credentialFromTaggedObject(e)}static credentialFromError(e){return Wn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e))return null;if(!e.oauthAccessToken)return null;try{return Wn.credential(e.oauthAccessToken)}catch{return null}}}Wn.GITHUB_SIGN_IN_METHOD="github.com",Wn.PROVIDER_ID="github.com";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Qn extends Kn{constructor(){super("twitter.com")}static credential(e,t){return jn._fromParams({providerId:Qn.PROVIDER_ID,signInMethod:Qn.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return Qn.credentialFromTaggedObject(e)}static credentialFromError(e){return Qn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:n}=e;if(!t||!n)return null;try{return Qn.credential(t,n)}catch{return null}}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Jn(e,t){return Pt(e,"POST","/v1/accounts:signUp",Rt(e,t))}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Qn.TWITTER_SIGN_IN_METHOD="twitter.com",Qn.PROVIDER_ID="twitter.com";class Xn{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,n,r=!1){const s=await Zt._fromIdTokenResponse(e,n,r),i=Yn(n);return new Xn({user:s,providerId:i,_tokenResponse:n,operationType:t})}static async _forOperation(e,t,n){await e._updateTokensIfNecessary(n,!0);const r=Yn(n);return new Xn({user:e,providerId:r,_tokenResponse:n,operationType:t})}}function Yn(e){return e.providerId?e.providerId:"phoneNumber"in e?"phone":null}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zn extends E{constructor(e,t,n,r){super(t.code,t.message),this.operationType=n,this.user=r,Object.setPrototypeOf(this,Zn.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:n}}static _fromErrorAndOperation(e,t,n,r){return new Zn(e,t,n,r)}}function er(e,t,n,r){return("reauthenticate"===t?n._getReauthenticationResolver(e):n._getIdTokenResponse(e)).catch(n=>{if("auth/multi-factor-auth-required"===n.code)throw Zn._fromErrorAndOperation(e,n,t,r);throw n})}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function tr(e,t,n=!1){if(Ge(e.app))return Promise.reject(yt(e));const r="signIn",s=await er(e,r,t),i=await Xn._fromIdTokenResponse(e,r,s);return n||await e._updateCurrentUser(i.user),i}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function nr(e){const t=bn(e);t._getPasswordPolicyInternal()&&await t._updatePasswordPolicy()}async function rr(e,t,n){const r=bn(e),s={requestType:"PASSWORD_RESET",email:t,clientType:"CLIENT_TYPE_WEB"};await Rn(r,s,"getOobCode",Vn)}async function sr(e,t,n){if(Ge(e.app))return Promise.reject(yt(e));const r=bn(e),s=Rn(r,{returnSecureToken:!0,email:t,password:n,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",Jn),i=await s.catch(t=>{throw"auth/password-does-not-meet-requirements"===t.code&&nr(e),t}),o=await Xn._fromIdTokenResponse(r,"signIn",i);return await r._updateCurrentUser(o.user),o}function ir(e,t,n){return Ge(e.app)?Promise.reject(yt(e)):async function(e,t){return tr(bn(e),t)}(P(e),zn.credential(t,n)).catch(async t=>{throw"auth/password-does-not-meet-requirements"===t.code&&nr(e),t})}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function or(e,{displayName:t,photoURL:n}){if(void 0===t&&void 0===n)return;const r=P(e),s={idToken:await r.getIdToken(),displayName:t,photoUrl:n,returnSecureToken:!0},i=await Gt(r,async function(e,t){return xt(e,"POST","/v1/accounts:update",t)}(r.auth,s));r.displayName=i.displayName||null,r.photoURL=i.photoUrl||null;const o=r.providerData.find(({providerId:e})=>"password"===e);o&&(o.displayName=r.displayName,o.photoURL=r.photoURL),await r._updateTokensIfNecessary(i)}function ar(e,t,n,r){return P(e).onAuthStateChanged(t,n,r)}function cr(e){return P(e).signOut()}const ur="__sak";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hr{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(ur,"1"),this.storage.removeItem(ur),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lr extends hr{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=yn(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const n=this.storage.getItem(t),r=this.localCache[t];n!==r&&e(t,r,n)}}onStorageEvent(e,t=!1){if(!e.key)return void this.forAllChangedKeys((e,t,n)=>{this.notifyListeners(e,n)});const n=e.key;t?this.detachListener():this.stopPolling();const r=()=>{const e=this.storage.getItem(n);(t||this.localCache[n]!==e)&&this.notifyListeners(n,e)},s=this.storage.getItem(n);gn()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(r,10):r()}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const r of Array.from(n))r(t?JSON.parse(t):t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,n)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:n}),!0)})},1e3)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){0===Object.keys(this.listeners).length&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),0===this.listeners[e].size&&delete this.listeners[e]),0===Object.keys(this.listeners).length&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}lr.type="LOCAL";const dr=lr;
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fr extends hr{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}fr.type="SESSION";const pr=fr;
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class mr{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(t=>t.isListeningto(e));if(t)return t;const n=new mr(e);return this.receivers.push(n),n}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:n,eventType:r,data:s}=t.data,i=this.handlersMap[r];if(!i?.size)return;t.ports[0].postMessage({status:"ack",eventId:n,eventType:r});const o=Array.from(i).map(async e=>e(t.origin,s)),a=await function(e){return Promise.all(e.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}(o);t.ports[0].postMessage({status:"done",eventId:n,eventType:r,response:a})}_subscribe(e,t){0===Object.keys(this.handlersMap).length&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),t&&0!==this.handlersMap[e].size||delete this.handlersMap[e],0===Object.keys(this.handlersMap).length&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function gr(e="",t=10){let n="";for(let r=0;r<t;r++)n+=Math.floor(10*Math.random());return e+n}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */mr.receivers=[];class yr{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,n=50){const r="undefined"!=typeof MessageChannel?new MessageChannel:null;if(!r)throw new Error("connection_unavailable");let s,i;return new Promise((o,a)=>{const c=gr("",20);r.port1.start();const u=setTimeout(()=>{a(new Error("unsupported_event"))},n);i={messageChannel:r,onMessage(e){const t=e;if(t.data.eventId===c)switch(t.data.status){case"ack":clearTimeout(u),s=setTimeout(()=>{a(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),o(t.data.response);break;default:clearTimeout(u),clearTimeout(s),a(new Error("invalid_response"))}}},this.handlers.add(i),r.port1.addEventListener("message",i.onMessage),this.target.postMessage({eventType:e,eventId:c,data:t},[r.port2])}).finally(()=>{i&&this.removeMessageHandler(i)})}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wr(){return window}
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function vr(){return void 0!==wr().WorkerGlobalScope&&"function"==typeof wr().importScripts}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const _r="firebaseLocalStorageDb",Ir="firebaseLocalStorage",br="fbase_key";class Tr{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function Er(e,t){return e.transaction([Ir],t?"readwrite":"readonly").objectStore(Ir)}function Sr(){const e=indexedDB.open(_r,1);return new Promise((t,n)=>{e.addEventListener("error",()=>{n(e.error)}),e.addEventListener("upgradeneeded",()=>{const t=e.result;try{t.createObjectStore(Ir,{keyPath:br})}catch(r){n(r)}}),e.addEventListener("success",async()=>{const n=e.result;n.objectStoreNames.contains(Ir)?t(n):(n.close(),await function(){const e=indexedDB.deleteDatabase(_r);return new Tr(e).toPromise()}(),t(await Sr()))})})}async function Cr(e,t,n){const r=Er(e,!0).put({[br]:t,value:n});return new Tr(r).toPromise()}function kr(e,t){const n=Er(e,!0).delete(t);return new Tr(n).toPromise()}class Ar{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db||(this.db=await Sr()),this.db}async _withRetries(e){let t=0;for(;;)try{const t=await this._openDb();return await e(t)}catch(n){if(t++>3)throw n;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return vr()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=mr._getInstance(vr()?self:null),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){if(this.activeServiceWorker=await async function(){if(!navigator?.serviceWorker)return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}(),!this.activeServiceWorker)return;this.sender=new yr(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&e[0]?.fulfilled&&e[0]?.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(this.sender&&this.activeServiceWorker&&(navigator?.serviceWorker?.controller||null)===this.activeServiceWorker)try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Sr();return await Cr(e,ur,"1"),await kr(e,ur),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(n=>Cr(n,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(t=>async function(e,t){const n=Er(e,!1).get(t),r=await new Tr(n).toPromise();return void 0===r?null:r.value}(t,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>kr(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(e=>{const t=Er(e,!1).getAll();return new Tr(t).toPromise()});if(!e)return[];if(0!==this.pendingWrites)return[];const t=[],n=new Set;if(0!==e.length)for(const{fbase_key:r,value:s}of e)n.add(r),JSON.stringify(this.localCache[r])!==JSON.stringify(s)&&(this.notifyListeners(r,s),t.push(r));for(const r of Object.keys(this.localCache))this.localCache[r]&&!n.has(r)&&(this.notifyListeners(r,null),t.push(r));return t}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const r of Array.from(n))r(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),800)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){0===Object.keys(this.listeners).length&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),0===this.listeners[e].size&&delete this.listeners[e]),0===Object.keys(this.listeners).length&&this.stopPolling()}}Ar.type="LOCAL";const Nr=Ar;new St(3e4,6e4);
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Dr extends Ln{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Bn(e,this._buildIdpRequest())}_linkToIdToken(e,t){return Bn(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return Bn(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function Rr(e){return tr(e.auth,new Dr(e),e.bypassAuthState)}function xr(e){const{auth:t,user:n}=e;return vt(n,t,"internal-error"),
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function(e,t,n=!1){const{auth:r}=e;if(Ge(r.app))return Promise.reject(yt(r));const s="reauthenticate";try{const i=await Gt(e,er(r,s,t,e),n);vt(i.idToken,r,"internal-error");const o=$t(i.idToken);vt(o,r,"internal-error");const{sub:a}=o;return vt(e.uid===a,r,"user-mismatch"),Xn._forOperation(e,s,i)}catch(i){throw"auth/user-not-found"===i?.code&&pt(r,"user-mismatch"),i}}(n,new Dr(e),e.bypassAuthState)}async function Or(e){const{auth:t,user:n}=e;return vt(n,t,"internal-error"),async function(e,t,n=!1){const r=await Gt(e,t._linkToIdToken(e.auth,await e.getIdToken()),n);return Xn._forOperation(e,"link",r)}(n,new Dr(e),e.bypassAuthState)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pr{constructor(e,t,n,r,s=!1){this.auth=e,this.resolver=n,this.user=r,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(n){this.reject(n)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:n,postBody:r,tenantId:s,error:i,type:o}=e;if(i)return void this.reject(i);const a={auth:this.auth,requestUri:t,sessionId:n,tenantId:s||void 0,postBody:r||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(o)(a))}catch(c){this.reject(c)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Rr;case"linkViaPopup":case"linkViaRedirect":return Or;case"reauthViaPopup":case"reauthViaRedirect":return xr;default:pt(this.auth,"internal-error")}}resolve(e){It(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){It(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lr=new St(2e3,1e4);class Mr extends Pr{constructor(e,t,n,r,s){super(e,t,r,s),this.provider=n,this.authWindow=null,this.pollId=null,Mr.currentPopupAction&&Mr.currentPopupAction.cancel(),Mr.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return vt(e,this.auth,"internal-error"),e}async onExecution(){It(1===this.filter.length,"Popup operations only handle one event");const e=gr();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(e=>{this.reject(e)}),this.resolver._isIframeWebStorageSupported(this.auth,e=>{e||this.reject(mt(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){return this.authWindow?.associatedEvent||null}cancel(){this.reject(mt(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Mr.currentPopupAction=null}pollUserCancellation(){const e=()=>{this.authWindow?.window?.closed?this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(mt(this.auth,"popup-closed-by-user"))},8e3):this.pollId=window.setTimeout(e,Lr.get())};e()}}Mr.currentPopupAction=null;
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Ur="pendingRedirect",Vr=new Map;class Fr extends Pr{constructor(e,t,n=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,n),this.eventId=null}async execute(){let e=Vr.get(this.auth._key());if(!e){try{const t=await async function(e,t){const n=function(e){return sn(Ur,e.config.apiKey,e.name)}(t),r=function(e){return tn(e._redirectPersistence)}(e);if(!(await r._isAvailable()))return!1;const s="true"===await r._get(n);return await r._remove(n),s}(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(t)}catch(t){e=()=>Promise.reject(t)}Vr.set(this.auth._key(),e)}return this.bypassAuthState||Vr.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if("signInViaRedirect"===e.type)return super.onAuthEvent(e);if("unknown"!==e.type){if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}else this.resolve(null)}async onExecution(){}cleanUp(){}}function Br(e,t){Vr.set(e._key(),t)}async function jr(e,t,n=!1){if(Ge(e.app))return Promise.reject(yt(e));const r=bn(e),s=
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(e,t){return t?tn(t):(vt(e._popupRedirectResolver,e,"argument-error"),e._popupRedirectResolver)}(r,t),i=new Fr(r,s,n),o=await i.execute();return o&&!n&&(delete o.user._redirectEventId,await r._persistUserIfCurrent(o.user),await r._setRedirectUser(null,t)),o}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qr{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(n=>{this.isEventForConsumer(e,n)&&(t=!0,this.sendToConsumer(e,n),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!function(e){switch(e.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return $r(e);default:return!1}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){if(e.error&&!$r(e)){const n=e.error.code?.split("auth/")[1]||"internal-error";t.onError(mt(this.auth,n))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const n=null===t.eventId||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&n}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=6e5&&this.cachedEventUids.clear(),this.cachedEventUids.has(zr(e))}saveEventToCache(e){this.cachedEventUids.add(zr(e)),this.lastProcessedEventTime=Date.now()}}function zr(e){return[e.type,e.eventId,e.sessionId,e.tenantId].filter(e=>e).join("-")}function $r({type:e,error:t}){return"unknown"===e&&"auth/no-auth-event"===t?.code}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Kr=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Gr=/^https?/;async function Hr(e){if(e.config.emulator)return;const{authorizedDomains:t}=await async function(e,t={}){return xt(e,"GET","/v1/projects",t)}(e);for(const n of t)try{if(Wr(n))return}catch{}pt(e,"unauthorized-domain")}function Wr(e){const t=bt(),{protocol:n,hostname:r}=new URL(t);if(e.startsWith("chrome-extension://")){const s=new URL(e);return""===s.hostname&&""===r?"chrome-extension:"===n&&e.replace("chrome-extension://","")===t.replace("chrome-extension://",""):"chrome-extension:"===n&&s.hostname===r}if(!Gr.test(n))return!1;if(Kr.test(e))return r===e;const s=e.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(r)}
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qr=new St(3e4,6e4);function Jr(){const e=wr().___jsl;if(e?.H)for(const t of Object.keys(e.H))if(e.H[t].r=e.H[t].r||[],e.H[t].L=e.H[t].L||[],e.H[t].r=[...e.H[t].L],e.CP)for(let n=0;n<e.CP.length;n++)e.CP[n]=null}function Xr(e){return new Promise((t,n)=>{function r(){Jr(),gapi.load("gapi.iframes",{callback:()=>{t(gapi.iframes.getContext())},ontimeout:()=>{Jr(),n(mt(e,"network-request-failed"))},timeout:Qr.get()})}if(wr().gapi?.iframes?.Iframe)t(gapi.iframes.getContext());else{if(!wr().gapi?.load){const t=`__${"iframefcb"}${Math.floor(1e6*Math.random())}`;return wr()[t]=()=>{gapi.load?r():n(mt(e,"network-request-failed"))},Sn(`${En.gapiScript}?onload=${t}`).catch(e=>n(e))}r()}}).catch(e=>{throw Yr=null,e})}let Yr=null;
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Zr=new St(5e3,15e3),es={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},ts=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function ns(e){const t=e.config;vt(t.authDomain,e,"auth-domain-config-required");const n=t.emulator?Ct(t,"emulator/auth/iframe"):`https://${e.config.authDomain}/__/auth/iframe`,r={apiKey:t.apiKey,appName:e.name,v:Qe},s=ts.get(e.config.apiHost);s&&(r.eid=s);const i=e._getFrameworks();return i.length&&(r.fw=i.join(",")),`${n}?${N(r).slice(1)}`}async function rs(e){const t=await function(e){return Yr=Yr||Xr(e),Yr}(e),n=wr().gapi;return vt(n,e,"internal-error"),t.open({where:document.body,url:ns(e),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:es,dontclear:!0},t=>new Promise(async(n,r)=>{await t.restyle({setHideOnLeave:!1});const s=mt(e,"network-request-failed"),i=wr().setTimeout(()=>{r(s)},Zr.get());function o(){wr().clearTimeout(i),n(t)}t.ping(o).then(o,()=>{r(s)})}))}
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ss={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"};class is{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch(e){}}}function os(e,t,n,r=500,s=600){const i=Math.max((window.screen.availHeight-s)/2,0).toString(),o=Math.max((window.screen.availWidth-r)/2,0).toString();let a="";const c={...ss,width:r.toString(),height:s.toString(),top:i,left:o},u=v().toLowerCase();n&&(a=hn(u)?"_blank":n),cn(u)&&(t=t||"http://localhost",c.scrollbars="yes");const h=Object.entries(c).reduce((e,[t,n])=>`${e}${t}=${n},`,"");if(function(e=v()){return mn(e)&&!!window.navigator?.standalone}(u)&&"_self"!==a)return function(e,t){const n=document.createElement("a");n.href=e,n.target=t;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(t||"",a),new is(null);const l=window.open(t||"",a,h);vt(l,e,"popup-blocked");try{l.focus()}catch(d){}return new is(l)}const as="__/auth/handler",cs="emulator/auth/handler",us=encodeURIComponent("fac");async function hs(e,t,n,r,s,i){vt(e.config.authDomain,e,"auth-domain-config-required"),vt(e.config.apiKey,e,"invalid-api-key");const o={apiKey:e.config.apiKey,appName:e.name,authType:n,redirectUrl:r,v:Qe,eventId:s};if(t instanceof $n){t.setDefaultLanguage(e.languageCode),o.providerId=t.providerId||"",function(e){for(const t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}(t.getCustomParameters())||(o.customParameters=JSON.stringify(t.getCustomParameters()));for(const[e,t]of Object.entries({}))o[e]=t}if(t instanceof Kn){const e=t.getScopes().filter(e=>""!==e);e.length>0&&(o.scopes=e.join(","))}e.tenantId&&(o.tid=e.tenantId);const a=o;for(const h of Object.keys(a))void 0===a[h]&&delete a[h];const c=await e._getAppCheckToken(),u=c?`#${us}=${encodeURIComponent(c)}`:"";return`${function({config:e}){if(!e.emulator)return`https://${e.authDomain}/${as}`;return Ct(e,cs)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e)}?${N(a).slice(1)}${u}`}const ls="webStorageSupport";const ds=class{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=pr,this._completeRedirectFn=jr,this._overrideRedirectResult=Br}async _openPopup(e,t,n,r){It(this.eventManagers[e._key()]?.manager,"_initialize() not called before _openPopup()");return os(e,await hs(e,t,n,bt(),r),gr())}async _openRedirect(e,t,n,r){await this._originValidation(e);return function(e){wr().location.href=e}(await hs(e,t,n,bt(),r)),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:e,promise:n}=this.eventManagers[t];return e?Promise.resolve(e):(It(n,"If manager is not set, promise should be"),n)}const n=this.initAndGetManager(e);return this.eventManagers[t]={promise:n},n.catch(()=>{delete this.eventManagers[t]}),n}async initAndGetManager(e){const t=await rs(e),n=new qr(e);return t.register("authEvent",t=>{vt(t?.authEvent,e,"invalid-auth-event");return{status:n.onEvent(t.authEvent)?"ACK":"ERROR"}},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:n},this.iframes[e._key()]=t,n}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(ls,{type:ls},n=>{const r=n?.[0]?.[ls];void 0!==r&&t(!!r),pt(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=Hr(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return yn()||un()||mn()}};var fs="@firebase/auth",ps="1.11.0";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ms{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){return this.assertAuthConfigured(),this.auth.currentUser?.uid||null}async getToken(e){if(this.assertAuthConfigured(),await this.auth._initializationPromise,!this.auth.currentUser)return null;return{accessToken:await this.auth.currentUser.getIdToken(e)}}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(t=>{e(t?.stsTokenManager.accessToken||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){vt(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const gs=l("authIdTokenMaxAge")||300;let ys=null;function ws(e=Xe()){const t=Ke(e,"auth");if(t.isInitialized())return t.getImmediate();const n=function(e,t){const n=Ke(e,"auth");if(n.isInitialized()){const e=n.getImmediate();if(k(n.getOptions(),t??{}))return e;pt(e,"already-initialized")}return n.initialize({options:t})}(e,{popupRedirectResolver:ds,persistence:[Nr,dr,pr]}),r=l("authTokenSyncURL");if(r&&"boolean"==typeof isSecureContext&&isSecureContext){const e=new URL(r,location.origin);if(location.origin===e.origin){const t=(s=e.toString(),async e=>{const t=e&&await e.getIdTokenResult(),n=t&&((new Date).getTime()-Date.parse(t.issuedAtTime))/1e3;if(n&&n>gs)return;const r=t?.token;ys!==r&&(ys=r,await fetch(s,{method:r?"POST":"DELETE",headers:r?{Authorization:`Bearer ${r}`}:{}}))});!function(e,t,n){P(e).beforeAuthStateChanged(t,n)}(n,t,()=>t(n.currentUser)),function(e,t,n,r){P(e).onIdTokenChanged(t,n,r)}(n,e=>t(e))}}var s;const i=c("auth");return i&&xn(n,`http://${i}`),n}var vs;En={loadJS:e=>new Promise((t,n)=>{const r=document.createElement("script");r.setAttribute("src",e),r.onload=t,r.onerror=e=>{const t=mt("internal-error");t.customData=e,n(t)},r.type="text/javascript",r.charset="UTF-8",(document.getElementsByTagName("head")?.[0]??document).appendChild(r)}),gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="},vs="Browser",$e(new L("auth",(e,{options:t})=>{const n=e.getProvider("app").getImmediate(),r=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:i,authDomain:o}=n.options;vt(i&&!i.includes(":"),"invalid-api-key",{appName:n.name});const a={apiKey:i,authDomain:o,clientPlatform:vs,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:wn(vs)},c=new In(n,r,s,a);return function(e,t){const n=t?.persistence||[],r=(Array.isArray(n)?n:[n]).map(tn);t?.errorMap&&e._updateErrorMap(t.errorMap),e._initializeWithPersistence(r,t?.popupRedirectResolver)}(c,t),c},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,n)=>{e.getProvider("auth-internal").initialize()})),$e(new L("auth-internal",e=>{const t=bn(e.getProvider("auth").getImmediate());return new ms(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),Ye(fs,ps,function(e){switch(e){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}(vs)),Ye(fs,ps,"esm2020");
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Ye("firebase","12.1.0","app");var _s,Is,bs="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};
/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/(function(){var e;
/** @license
  
   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  */function t(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}function n(e,t,n){n||(n=0);var r=Array(16);if("string"==typeof t)for(var s=0;16>s;++s)r[s]=t.charCodeAt(n++)|t.charCodeAt(n++)<<8|t.charCodeAt(n++)<<16|t.charCodeAt(n++)<<24;else for(s=0;16>s;++s)r[s]=t[n++]|t[n++]<<8|t[n++]<<16|t[n++]<<24;t=e.g[0],n=e.g[1],s=e.g[2];var i=e.g[3],o=t+(i^n&(s^i))+r[0]+3614090360&4294967295;o=(n=(s=(i=(t=(n=(s=(i=(t=(n=(s=(i=(t=(n=(s=(i=(t=(n=(s=(i=(t=(n=(s=(i=(t=(n=(s=(i=(t=(n=(s=(i=(t=(n=(s=(i=(t=(n=(s=(i=(t=(n=(s=(i=(t=(n=(s=(i=(t=(n=(s=(i=(t=(n=(s=(i=(t=(n=(s=(i=(t=n+(o<<7&4294967295|o>>>25))+((o=i+(s^t&(n^s))+r[1]+3905402710&4294967295)<<12&4294967295|o>>>20))+((o=s+(n^i&(t^n))+r[2]+606105819&4294967295)<<17&4294967295|o>>>15))+((o=n+(t^s&(i^t))+r[3]+3250441966&4294967295)<<22&4294967295|o>>>10))+((o=t+(i^n&(s^i))+r[4]+4118548399&4294967295)<<7&4294967295|o>>>25))+((o=i+(s^t&(n^s))+r[5]+1200080426&4294967295)<<12&4294967295|o>>>20))+((o=s+(n^i&(t^n))+r[6]+2821735955&4294967295)<<17&4294967295|o>>>15))+((o=n+(t^s&(i^t))+r[7]+4249261313&4294967295)<<22&4294967295|o>>>10))+((o=t+(i^n&(s^i))+r[8]+1770035416&4294967295)<<7&4294967295|o>>>25))+((o=i+(s^t&(n^s))+r[9]+2336552879&4294967295)<<12&4294967295|o>>>20))+((o=s+(n^i&(t^n))+r[10]+4294925233&4294967295)<<17&4294967295|o>>>15))+((o=n+(t^s&(i^t))+r[11]+2304563134&4294967295)<<22&4294967295|o>>>10))+((o=t+(i^n&(s^i))+r[12]+1804603682&4294967295)<<7&4294967295|o>>>25))+((o=i+(s^t&(n^s))+r[13]+4254626195&4294967295)<<12&4294967295|o>>>20))+((o=s+(n^i&(t^n))+r[14]+2792965006&4294967295)<<17&4294967295|o>>>15))+((o=n+(t^s&(i^t))+r[15]+1236535329&4294967295)<<22&4294967295|o>>>10))+((o=t+(s^i&(n^s))+r[1]+4129170786&4294967295)<<5&4294967295|o>>>27))+((o=i+(n^s&(t^n))+r[6]+3225465664&4294967295)<<9&4294967295|o>>>23))+((o=s+(t^n&(i^t))+r[11]+643717713&4294967295)<<14&4294967295|o>>>18))+((o=n+(i^t&(s^i))+r[0]+3921069994&4294967295)<<20&4294967295|o>>>12))+((o=t+(s^i&(n^s))+r[5]+3593408605&4294967295)<<5&4294967295|o>>>27))+((o=i+(n^s&(t^n))+r[10]+38016083&4294967295)<<9&4294967295|o>>>23))+((o=s+(t^n&(i^t))+r[15]+3634488961&4294967295)<<14&4294967295|o>>>18))+((o=n+(i^t&(s^i))+r[4]+3889429448&4294967295)<<20&4294967295|o>>>12))+((o=t+(s^i&(n^s))+r[9]+568446438&4294967295)<<5&4294967295|o>>>27))+((o=i+(n^s&(t^n))+r[14]+3275163606&4294967295)<<9&4294967295|o>>>23))+((o=s+(t^n&(i^t))+r[3]+4107603335&4294967295)<<14&4294967295|o>>>18))+((o=n+(i^t&(s^i))+r[8]+1163531501&4294967295)<<20&4294967295|o>>>12))+((o=t+(s^i&(n^s))+r[13]+2850285829&4294967295)<<5&4294967295|o>>>27))+((o=i+(n^s&(t^n))+r[2]+4243563512&4294967295)<<9&4294967295|o>>>23))+((o=s+(t^n&(i^t))+r[7]+1735328473&4294967295)<<14&4294967295|o>>>18))+((o=n+(i^t&(s^i))+r[12]+2368359562&4294967295)<<20&4294967295|o>>>12))+((o=t+(n^s^i)+r[5]+4294588738&4294967295)<<4&4294967295|o>>>28))+((o=i+(t^n^s)+r[8]+2272392833&4294967295)<<11&4294967295|o>>>21))+((o=s+(i^t^n)+r[11]+1839030562&4294967295)<<16&4294967295|o>>>16))+((o=n+(s^i^t)+r[14]+4259657740&4294967295)<<23&4294967295|o>>>9))+((o=t+(n^s^i)+r[1]+2763975236&4294967295)<<4&4294967295|o>>>28))+((o=i+(t^n^s)+r[4]+1272893353&4294967295)<<11&4294967295|o>>>21))+((o=s+(i^t^n)+r[7]+4139469664&4294967295)<<16&4294967295|o>>>16))+((o=n+(s^i^t)+r[10]+3200236656&4294967295)<<23&4294967295|o>>>9))+((o=t+(n^s^i)+r[13]+681279174&4294967295)<<4&4294967295|o>>>28))+((o=i+(t^n^s)+r[0]+3936430074&4294967295)<<11&4294967295|o>>>21))+((o=s+(i^t^n)+r[3]+3572445317&4294967295)<<16&4294967295|o>>>16))+((o=n+(s^i^t)+r[6]+76029189&4294967295)<<23&4294967295|o>>>9))+((o=t+(n^s^i)+r[9]+3654602809&4294967295)<<4&4294967295|o>>>28))+((o=i+(t^n^s)+r[12]+3873151461&4294967295)<<11&4294967295|o>>>21))+((o=s+(i^t^n)+r[15]+530742520&4294967295)<<16&4294967295|o>>>16))+((o=n+(s^i^t)+r[2]+3299628645&4294967295)<<23&4294967295|o>>>9))+((o=t+(s^(n|~i))+r[0]+4096336452&4294967295)<<6&4294967295|o>>>26))+((o=i+(n^(t|~s))+r[7]+1126891415&4294967295)<<10&4294967295|o>>>22))+((o=s+(t^(i|~n))+r[14]+2878612391&4294967295)<<15&4294967295|o>>>17))+((o=n+(i^(s|~t))+r[5]+4237533241&4294967295)<<21&4294967295|o>>>11))+((o=t+(s^(n|~i))+r[12]+1700485571&4294967295)<<6&4294967295|o>>>26))+((o=i+(n^(t|~s))+r[3]+2399980690&4294967295)<<10&4294967295|o>>>22))+((o=s+(t^(i|~n))+r[10]+4293915773&4294967295)<<15&4294967295|o>>>17))+((o=n+(i^(s|~t))+r[1]+2240044497&4294967295)<<21&4294967295|o>>>11))+((o=t+(s^(n|~i))+r[8]+1873313359&4294967295)<<6&4294967295|o>>>26))+((o=i+(n^(t|~s))+r[15]+4264355552&4294967295)<<10&4294967295|o>>>22))+((o=s+(t^(i|~n))+r[6]+2734768916&4294967295)<<15&4294967295|o>>>17))+((o=n+(i^(s|~t))+r[13]+1309151649&4294967295)<<21&4294967295|o>>>11))+((i=(t=n+((o=t+(s^(n|~i))+r[4]+4149444226&4294967295)<<6&4294967295|o>>>26))+((o=i+(n^(t|~s))+r[11]+3174756917&4294967295)<<10&4294967295|o>>>22))^((s=i+((o=s+(t^(i|~n))+r[2]+718787259&4294967295)<<15&4294967295|o>>>17))|~t))+r[9]+3951481745&4294967295,e.g[0]=e.g[0]+t&4294967295,e.g[1]=e.g[1]+(s+(o<<21&4294967295|o>>>11))&4294967295,e.g[2]=e.g[2]+s&4294967295,e.g[3]=e.g[3]+i&4294967295}function r(e,t){this.h=t;for(var n=[],r=!0,s=e.length-1;0<=s;s--){var i=0|e[s];r&&i==t||(n[s]=i,r=!1)}this.g=n}!function(e,t){function n(){}n.prototype=t.prototype,e.D=t.prototype,e.prototype=new n,e.prototype.constructor=e,e.C=function(e,n,r){for(var s=Array(arguments.length-2),i=2;i<arguments.length;i++)s[i-2]=arguments[i];return t.prototype[n].apply(e,s)}}(t,function(){this.blockSize=-1}),t.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0},t.prototype.u=function(e,t){void 0===t&&(t=e.length);for(var r=t-this.blockSize,s=this.B,i=this.h,o=0;o<t;){if(0==i)for(;o<=r;)n(this,e,o),o+=this.blockSize;if("string"==typeof e){for(;o<t;)if(s[i++]=e.charCodeAt(o++),i==this.blockSize){n(this,s),i=0;break}}else for(;o<t;)if(s[i++]=e[o++],i==this.blockSize){n(this,s),i=0;break}}this.h=i,this.o+=t},t.prototype.v=function(){var e=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);e[0]=128;for(var t=1;t<e.length-8;++t)e[t]=0;var n=8*this.o;for(t=e.length-8;t<e.length;++t)e[t]=255&n,n/=256;for(this.u(e),e=Array(16),t=n=0;4>t;++t)for(var r=0;32>r;r+=8)e[n++]=this.g[t]>>>r&255;return e};var s={};function i(e){return-128<=e&&128>e?function(e,t){var n=s;return Object.prototype.hasOwnProperty.call(n,e)?n[e]:n[e]=t(e)}(e,function(e){return new r([0|e],0>e?-1:0)}):new r([0|e],0>e?-1:0)}function o(e){if(isNaN(e)||!isFinite(e))return a;if(0>e)return d(o(-e));for(var t=[],n=1,s=0;e>=n;s++)t[s]=e/n|0,n*=4294967296;return new r(t,0)}var a=i(0),c=i(1),u=i(16777216);function h(e){if(0!=e.h)return!1;for(var t=0;t<e.g.length;t++)if(0!=e.g[t])return!1;return!0}function l(e){return-1==e.h}function d(e){for(var t=e.g.length,n=[],s=0;s<t;s++)n[s]=~e.g[s];return new r(n,~e.h).add(c)}function f(e,t){return e.add(d(t))}function p(e,t){for(;(65535&e[t])!=e[t];)e[t+1]+=e[t]>>>16,e[t]&=65535,t++}function m(e,t){this.g=e,this.h=t}function g(e,t){if(h(t))throw Error("division by zero");if(h(e))return new m(a,a);if(l(e))return t=g(d(e),t),new m(d(t.g),d(t.h));if(l(t))return t=g(e,d(t)),new m(d(t.g),t.h);if(30<e.g.length){if(l(e)||l(t))throw Error("slowDivide_ only works with positive integers.");for(var n=c,r=t;0>=r.l(e);)n=y(n),r=y(r);var s=w(n,1),i=w(r,1);for(r=w(r,2),n=w(n,2);!h(r);){var u=i.add(r);0>=u.l(e)&&(s=s.add(n),i=u),r=w(r,1),n=w(n,1)}return t=f(e,s.j(t)),new m(s,t)}for(s=a;0<=e.l(t);){for(n=Math.max(1,Math.floor(e.m()/t.m())),r=48>=(r=Math.ceil(Math.log(n)/Math.LN2))?1:Math.pow(2,r-48),u=(i=o(n)).j(t);l(u)||0<u.l(e);)u=(i=o(n-=r)).j(t);h(i)&&(i=c),s=s.add(i),e=f(e,u)}return new m(s,e)}function y(e){for(var t=e.g.length+1,n=[],s=0;s<t;s++)n[s]=e.i(s)<<1|e.i(s-1)>>>31;return new r(n,e.h)}function w(e,t){var n=t>>5;t%=32;for(var s=e.g.length-n,i=[],o=0;o<s;o++)i[o]=0<t?e.i(o+n)>>>t|e.i(o+n+1)<<32-t:e.i(o+n);return new r(i,e.h)}(e=r.prototype).m=function(){if(l(this))return-d(this).m();for(var e=0,t=1,n=0;n<this.g.length;n++){var r=this.i(n);e+=(0<=r?r:4294967296+r)*t,t*=4294967296}return e},e.toString=function(e){if(2>(e=e||10)||36<e)throw Error("radix out of range: "+e);if(h(this))return"0";if(l(this))return"-"+d(this).toString(e);for(var t=o(Math.pow(e,6)),n=this,r="";;){var s=g(n,t).g,i=((0<(n=f(n,s.j(t))).g.length?n.g[0]:n.h)>>>0).toString(e);if(h(n=s))return i+r;for(;6>i.length;)i="0"+i;r=i+r}},e.i=function(e){return 0>e?0:e<this.g.length?this.g[e]:this.h},e.l=function(e){return l(e=f(this,e))?-1:h(e)?0:1},e.abs=function(){return l(this)?d(this):this},e.add=function(e){for(var t=Math.max(this.g.length,e.g.length),n=[],s=0,i=0;i<=t;i++){var o=s+(65535&this.i(i))+(65535&e.i(i)),a=(o>>>16)+(this.i(i)>>>16)+(e.i(i)>>>16);s=a>>>16,o&=65535,a&=65535,n[i]=a<<16|o}return new r(n,-2147483648&n[n.length-1]?-1:0)},e.j=function(e){if(h(this)||h(e))return a;if(l(this))return l(e)?d(this).j(d(e)):d(d(this).j(e));if(l(e))return d(this.j(d(e)));if(0>this.l(u)&&0>e.l(u))return o(this.m()*e.m());for(var t=this.g.length+e.g.length,n=[],s=0;s<2*t;s++)n[s]=0;for(s=0;s<this.g.length;s++)for(var i=0;i<e.g.length;i++){var c=this.i(s)>>>16,f=65535&this.i(s),m=e.i(i)>>>16,g=65535&e.i(i);n[2*s+2*i]+=f*g,p(n,2*s+2*i),n[2*s+2*i+1]+=c*g,p(n,2*s+2*i+1),n[2*s+2*i+1]+=f*m,p(n,2*s+2*i+1),n[2*s+2*i+2]+=c*m,p(n,2*s+2*i+2)}for(s=0;s<t;s++)n[s]=n[2*s+1]<<16|n[2*s];for(s=t;s<2*t;s++)n[s]=0;return new r(n,0)},e.A=function(e){return g(this,e).h},e.and=function(e){for(var t=Math.max(this.g.length,e.g.length),n=[],s=0;s<t;s++)n[s]=this.i(s)&e.i(s);return new r(n,this.h&e.h)},e.or=function(e){for(var t=Math.max(this.g.length,e.g.length),n=[],s=0;s<t;s++)n[s]=this.i(s)|e.i(s);return new r(n,this.h|e.h)},e.xor=function(e){for(var t=Math.max(this.g.length,e.g.length),n=[],s=0;s<t;s++)n[s]=this.i(s)^e.i(s);return new r(n,this.h^e.h)},t.prototype.digest=t.prototype.v,t.prototype.reset=t.prototype.s,t.prototype.update=t.prototype.u,Is=t,r.prototype.add=r.prototype.add,r.prototype.multiply=r.prototype.j,r.prototype.modulo=r.prototype.A,r.prototype.compare=r.prototype.l,r.prototype.toNumber=r.prototype.m,r.prototype.toString=r.prototype.toString,r.prototype.getBits=r.prototype.i,r.fromNumber=o,r.fromString=function e(t,n){if(0==t.length)throw Error("number format error: empty string");if(2>(n=n||10)||36<n)throw Error("radix out of range: "+n);if("-"==t.charAt(0))return d(e(t.substring(1),n));if(0<=t.indexOf("-"))throw Error('number format error: interior "-" character');for(var r=o(Math.pow(n,8)),s=a,i=0;i<t.length;i+=8){var c=Math.min(8,t.length-i),u=parseInt(t.substring(i,i+c),n);8>c?(c=o(Math.pow(n,c)),s=s.j(c).add(o(u))):s=(s=s.j(r)).add(o(u))}return s},_s=r}).apply(void 0!==bs?bs:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});var Ts,Es,Ss,Cs,ks,As,Ns,Ds,Rs="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};
/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/(function(){var e,t="function"==typeof Object.defineProperties?Object.defineProperty:function(e,t,n){return e==Array.prototype||e==Object.prototype||(e[t]=n.value),e};var n=function(e){e=["object"==typeof globalThis&&globalThis,e,"object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof Rs&&Rs];for(var t=0;t<e.length;++t){var n=e[t];if(n&&n.Math==Math)return n}throw Error("Cannot find global object")}(this);!function(e,r){if(r)e:{var s=n;e=e.split(".");for(var i=0;i<e.length-1;i++){var o=e[i];if(!(o in s))break e;s=s[o]}(r=r(i=s[e=e[e.length-1]]))!=i&&null!=r&&t(s,e,{configurable:!0,writable:!0,value:r})}}("Array.prototype.values",function(e){return e||function(){return function(e,t){e instanceof String&&(e+="");var n=0,r=!1,s={next:function(){if(!r&&n<e.length){var s=n++;return{value:t(s,e[s]),done:!1}}return r=!0,{done:!0,value:void 0}}};return s[Symbol.iterator]=function(){return s},s}(this,function(e,t){return t})}});
/** @license
  
   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  */
var r=r||{},s=this||self;function i(e){var t=typeof e;return"array"==(t="object"!=t?t:e?Array.isArray(e)?"array":t:"null")||"object"==t&&"number"==typeof e.length}function o(e){var t=typeof e;return"object"==t&&null!=e||"function"==t}function a(e,t,n){return e.call.apply(e.bind,arguments)}function c(e,t,n){if(!e)throw Error();if(2<arguments.length){var r=Array.prototype.slice.call(arguments,2);return function(){var n=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(n,r),e.apply(t,n)}}return function(){return e.apply(t,arguments)}}function u(e,t,n){return(u=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?a:c).apply(null,arguments)}function h(e,t){var n=Array.prototype.slice.call(arguments,1);return function(){var t=n.slice();return t.push.apply(t,arguments),e.apply(this,t)}}function l(e,t){function n(){}n.prototype=t.prototype,e.aa=t.prototype,e.prototype=new n,e.prototype.constructor=e,e.Qb=function(e,n,r){for(var s=Array(arguments.length-2),i=2;i<arguments.length;i++)s[i-2]=arguments[i];return t.prototype[n].apply(e,s)}}function d(e){const t=e.length;if(0<t){const n=Array(t);for(let r=0;r<t;r++)n[r]=e[r];return n}return[]}function f(e,t){for(let n=1;n<arguments.length;n++){const t=arguments[n];if(i(t)){const n=e.length||0,r=t.length||0;e.length=n+r;for(let s=0;s<r;s++)e[n+s]=t[s]}else e.push(t)}}function p(e){return/^[\s\xa0]*$/.test(e)}function m(){var e=s.navigator;return e&&(e=e.userAgent)?e:""}function g(e){return g[" "](e),e}g[" "]=function(){};var y=!(-1==m().indexOf("Gecko")||-1!=m().toLowerCase().indexOf("webkit")&&-1==m().indexOf("Edge")||-1!=m().indexOf("Trident")||-1!=m().indexOf("MSIE")||-1!=m().indexOf("Edge"));function w(e,t,n){for(const r in e)t.call(n,e[r],r,e)}function v(e){const t={};for(const n in e)t[n]=e[n];return t}const _="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function I(e,t){let n,r;for(let s=1;s<arguments.length;s++){for(n in r=arguments[s],r)e[n]=r[n];for(let t=0;t<_.length;t++)n=_[t],Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}}function b(e){var t=1;e=e.split(":");const n=[];for(;0<t&&e.length;)n.push(e.shift()),t--;return e.length&&n.push(e.join(":")),n}function T(e){s.setTimeout(()=>{throw e},0)}function E(){var e=N;let t=null;return e.g&&(t=e.g,e.g=e.g.next,e.g||(e.h=null),t.next=null),t}var S=new class{constructor(e,t){this.i=e,this.j=t,this.h=0,this.g=null}get(){let e;return 0<this.h?(this.h--,e=this.g,this.g=e.next,e.next=null):e=this.i(),e}}(()=>new C,e=>e.reset());class C{constructor(){this.next=this.g=this.h=null}set(e,t){this.h=e,this.g=t,this.next=null}reset(){this.next=this.g=this.h=null}}let k,A=!1,N=new class{constructor(){this.h=this.g=null}add(e,t){const n=S.get();n.set(e,t),this.h?this.h.next=n:this.g=n,this.h=n}},D=()=>{const e=s.Promise.resolve(void 0);k=()=>{e.then(R)}};var R=()=>{for(var e;e=E();){try{e.h.call(e.g)}catch(n){T(n)}var t=S;t.j(e),100>t.h&&(t.h++,e.next=t.g,t.g=e)}A=!1};function x(){this.s=this.s,this.C=this.C}function O(e,t){this.type=e,this.g=this.target=t,this.defaultPrevented=!1}x.prototype.s=!1,x.prototype.ma=function(){this.s||(this.s=!0,this.N())},x.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()},O.prototype.h=function(){this.defaultPrevented=!0};var P=function(){if(!s.addEventListener||!Object.defineProperty)return!1;var e=!1,t=Object.defineProperty({},"passive",{get:function(){e=!0}});try{const e=()=>{};s.addEventListener("test",e,t),s.removeEventListener("test",e,t)}catch(n){}return e}();function L(e,t){if(O.call(this,e?e.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,e){var n=this.type=e.type,r=e.changedTouches&&e.changedTouches.length?e.changedTouches[0]:null;if(this.target=e.target||e.srcElement,this.g=t,t=e.relatedTarget){if(y){e:{try{g(t.nodeName);var s=!0;break e}catch(i){}s=!1}s||(t=null)}}else"mouseover"==n?t=e.fromElement:"mouseout"==n&&(t=e.toElement);this.relatedTarget=t,r?(this.clientX=void 0!==r.clientX?r.clientX:r.pageX,this.clientY=void 0!==r.clientY?r.clientY:r.pageY,this.screenX=r.screenX||0,this.screenY=r.screenY||0):(this.clientX=void 0!==e.clientX?e.clientX:e.pageX,this.clientY=void 0!==e.clientY?e.clientY:e.pageY,this.screenX=e.screenX||0,this.screenY=e.screenY||0),this.button=e.button,this.key=e.key||"",this.ctrlKey=e.ctrlKey,this.altKey=e.altKey,this.shiftKey=e.shiftKey,this.metaKey=e.metaKey,this.pointerId=e.pointerId||0,this.pointerType="string"==typeof e.pointerType?e.pointerType:M[e.pointerType]||"",this.state=e.state,this.i=e,e.defaultPrevented&&L.aa.h.call(this)}}l(L,O);var M={2:"touch",3:"pen",4:"mouse"};L.prototype.h=function(){L.aa.h.call(this);var e=this.i;e.preventDefault?e.preventDefault():e.returnValue=!1};var U="closure_listenable_"+(1e6*Math.random()|0),V=0;function F(e,t,n,r,s){this.listener=e,this.proxy=null,this.src=t,this.type=n,this.capture=!!r,this.ha=s,this.key=++V,this.da=this.fa=!1}function B(e){e.da=!0,e.listener=null,e.proxy=null,e.src=null,e.ha=null}function j(e){this.src=e,this.g={},this.h=0}function q(e,t){var n=t.type;if(n in e.g){var r,s=e.g[n],i=Array.prototype.indexOf.call(s,t,void 0);(r=0<=i)&&Array.prototype.splice.call(s,i,1),r&&(B(t),0==e.g[n].length&&(delete e.g[n],e.h--))}}function z(e,t,n,r){for(var s=0;s<e.length;++s){var i=e[s];if(!i.da&&i.listener==t&&i.capture==!!n&&i.ha==r)return s}return-1}j.prototype.add=function(e,t,n,r,s){var i=e.toString();(e=this.g[i])||(e=this.g[i]=[],this.h++);var o=z(e,t,r,s);return-1<o?(t=e[o],n||(t.fa=!1)):((t=new F(t,this.src,i,!!r,s)).fa=n,e.push(t)),t};var $="closure_lm_"+(1e6*Math.random()|0),K={};function G(e,t,n,r,s){if(Array.isArray(t)){for(var i=0;i<t.length;i++)G(e,t[i],n,r,s);return null}return n=Z(n),e&&e[U]?e.K(t,n,!!o(r)&&!!r.capture,s):function(e,t,n,r,s,i){if(!t)throw Error("Invalid event type");var a=o(s)?!!s.capture:!!s,c=X(e);if(c||(e[$]=c=new j(e)),n=c.add(t,n,r,a,i),n.proxy)return n;if(r=function(){function e(n){return t.call(e.src,e.listener,n)}const t=J;return e}(),n.proxy=r,r.src=e,r.listener=n,e.addEventListener)P||(s=a),void 0===s&&(s=!1),e.addEventListener(t.toString(),r,s);else if(e.attachEvent)e.attachEvent(Q(t.toString()),r);else{if(!e.addListener||!e.removeListener)throw Error("addEventListener and attachEvent are unavailable.");e.addListener(r)}return n}(e,t,n,!1,r,s)}function H(e,t,n,r,s){if(Array.isArray(t))for(var i=0;i<t.length;i++)H(e,t[i],n,r,s);else r=o(r)?!!r.capture:!!r,n=Z(n),e&&e[U]?(e=e.i,(t=String(t).toString())in e.g&&(-1<(n=z(i=e.g[t],n,r,s))&&(B(i[n]),Array.prototype.splice.call(i,n,1),0==i.length&&(delete e.g[t],e.h--)))):e&&(e=X(e))&&(t=e.g[t.toString()],e=-1,t&&(e=z(t,n,r,s)),(n=-1<e?t[e]:null)&&W(n))}function W(e){if("number"!=typeof e&&e&&!e.da){var t=e.src;if(t&&t[U])q(t.i,e);else{var n=e.type,r=e.proxy;t.removeEventListener?t.removeEventListener(n,r,e.capture):t.detachEvent?t.detachEvent(Q(n),r):t.addListener&&t.removeListener&&t.removeListener(r),(n=X(t))?(q(n,e),0==n.h&&(n.src=null,t[$]=null)):B(e)}}}function Q(e){return e in K?K[e]:K[e]="on"+e}function J(e,t){if(e.da)e=!0;else{t=new L(t,this);var n=e.listener,r=e.ha||e.src;e.fa&&W(e),e=n.call(r,t)}return e}function X(e){return(e=e[$])instanceof j?e:null}var Y="__closure_events_fn_"+(1e9*Math.random()>>>0);function Z(e){return"function"==typeof e?e:(e[Y]||(e[Y]=function(t){return e.handleEvent(t)}),e[Y])}function ee(){x.call(this),this.i=new j(this),this.M=this,this.F=null}function te(e,t){var n,r=e.F;if(r)for(n=[];r;r=r.F)n.push(r);if(e=e.M,r=t.type||t,"string"==typeof t)t=new O(t,e);else if(t instanceof O)t.target=t.target||e;else{var s=t;I(t=new O(r,e),s)}if(s=!0,n)for(var i=n.length-1;0<=i;i--){var o=t.g=n[i];s=ne(o,r,!0,t)&&s}if(s=ne(o=t.g=e,r,!0,t)&&s,s=ne(o,r,!1,t)&&s,n)for(i=0;i<n.length;i++)s=ne(o=t.g=n[i],r,!1,t)&&s}function ne(e,t,n,r){if(!(t=e.i.g[String(t)]))return!0;t=t.concat();for(var s=!0,i=0;i<t.length;++i){var o=t[i];if(o&&!o.da&&o.capture==n){var a=o.listener,c=o.ha||o.src;o.fa&&q(e.i,o),s=!1!==a.call(c,r)&&s}}return s&&!r.defaultPrevented}function re(e,t,n){if("function"==typeof e)n&&(e=u(e,n));else{if(!e||"function"!=typeof e.handleEvent)throw Error("Invalid listener argument");e=u(e.handleEvent,e)}return 2147483647<Number(t)?-1:s.setTimeout(e,t||0)}function se(e){e.g=re(()=>{e.g=null,e.i&&(e.i=!1,se(e))},e.l);const t=e.h;e.h=null,e.m.apply(null,t)}l(ee,x),ee.prototype[U]=!0,ee.prototype.removeEventListener=function(e,t,n,r){H(this,e,t,n,r)},ee.prototype.N=function(){if(ee.aa.N.call(this),this.i){var e,t=this.i;for(e in t.g){for(var n=t.g[e],r=0;r<n.length;r++)B(n[r]);delete t.g[e],t.h--}}this.F=null},ee.prototype.K=function(e,t,n,r){return this.i.add(String(e),t,!1,n,r)},ee.prototype.L=function(e,t,n,r){return this.i.add(String(e),t,!0,n,r)};class ie extends x{constructor(e,t){super(),this.m=e,this.l=t,this.h=null,this.i=!1,this.g=null}j(e){this.h=arguments,this.g?this.i=!0:se(this)}N(){super.N(),this.g&&(s.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function oe(e){x.call(this),this.h=e,this.g={}}l(oe,x);var ae=[];function ce(e){w(e.g,function(e,t){this.g.hasOwnProperty(t)&&W(e)},e),e.g={}}oe.prototype.N=function(){oe.aa.N.call(this),ce(this)},oe.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var ue=s.JSON.stringify,he=s.JSON.parse,le=class{stringify(e){return s.JSON.stringify(e,void 0)}parse(e){return s.JSON.parse(e,void 0)}};function de(){}function fe(e){return e.h||(e.h=e.i())}function pe(){}de.prototype.h=null;var me={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function ge(){O.call(this,"d")}function ye(){O.call(this,"c")}l(ge,O),l(ye,O);var we={},ve=null;function _e(){return ve=ve||new ee}function Ie(e){O.call(this,we.La,e)}function be(e){const t=_e();te(t,new Ie(t))}function Te(e,t){O.call(this,we.STAT_EVENT,e),this.stat=t}function Ee(e){const t=_e();te(t,new Te(t,e))}function Se(e,t){O.call(this,we.Ma,e),this.size=t}function Ce(e,t){if("function"!=typeof e)throw Error("Fn must not be null and must be a function");return s.setTimeout(function(){e()},t)}function ke(){this.g=!0}function Ae(e,t,n,r){e.info(function(){return"XMLHTTP TEXT ("+t+"): "+function(e,t){if(!e.g)return t;if(!t)return null;try{var n=JSON.parse(t);if(n)for(e=0;e<n.length;e++)if(Array.isArray(n[e])){var r=n[e];if(!(2>r.length)){var s=r[1];if(Array.isArray(s)&&!(1>s.length)){var i=s[0];if("noop"!=i&&"stop"!=i&&"close"!=i)for(var o=1;o<s.length;o++)s[o]=""}}}return ue(n)}catch(a){return t}}(e,n)+(r?" "+r:"")})}we.La="serverreachability",l(Ie,O),we.STAT_EVENT="statevent",l(Te,O),we.Ma="timingevent",l(Se,O),ke.prototype.xa=function(){this.g=!1},ke.prototype.info=function(){};var Ne,De={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},Re={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"};function xe(){}function Oe(e,t,n,r){this.j=e,this.i=t,this.l=n,this.R=r||1,this.U=new oe(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Pe}function Pe(){this.i=null,this.g="",this.h=!1}l(xe,de),xe.prototype.g=function(){return new XMLHttpRequest},xe.prototype.i=function(){return{}},Ne=new xe;var Le={},Me={};function Ue(e,t,n){e.L=1,e.v=ut(st(t)),e.m=n,e.P=!0,Ve(e,null)}function Ve(e,t){e.F=Date.now(),je(e),e.A=st(e.v);var n=e.A,r=e.R;Array.isArray(r)||(r=[String(r)]),bt(n.i,"t",r),e.C=0,n=e.j.J,e.h=new Pe,e.g=hn(e.j,n?t:null,!e.m),0<e.O&&(e.M=new ie(u(e.Y,e,e.g),e.O)),t=e.U,n=e.g,r=e.ca;var s="readystatechange";Array.isArray(s)||(s&&(ae[0]=s.toString()),s=ae);for(var i=0;i<s.length;i++){var o=G(n,s[i],r||t.handleEvent,!1,t.h||t);if(!o)break;t.g[o.key]=o}t=e.H?v(e.H):{},e.m?(e.u||(e.u="POST"),t["Content-Type"]="application/x-www-form-urlencoded",e.g.ea(e.A,e.u,e.m,t)):(e.u="GET",e.g.ea(e.A,e.u,null,t)),be(),function(e,t,n,r,s,i){e.info(function(){if(e.g)if(i)for(var o="",a=i.split("&"),c=0;c<a.length;c++){var u=a[c].split("=");if(1<u.length){var h=u[0];u=u[1];var l=h.split("_");o=2<=l.length&&"type"==l[1]?o+(h+"=")+u+"&":o+(h+"=redacted&")}}else o=null;else o=i;return"XMLHTTP REQ ("+r+") [attempt "+s+"]: "+t+"\n"+n+"\n"+o})}(e.i,e.u,e.A,e.l,e.R,e.m)}function Fe(e){return!!e.g&&("GET"==e.u&&2!=e.L&&e.j.Ca)}function Be(e,t){var n=e.C,r=t.indexOf("\n",n);return-1==r?Me:(n=Number(t.substring(n,r)),isNaN(n)?Le:(r+=1)+n>t.length?Me:(t=t.slice(r,r+n),e.C=r+n,t))}function je(e){e.S=Date.now()+e.I,qe(e,e.I)}function qe(e,t){if(null!=e.B)throw Error("WatchDog timer not null");e.B=Ce(u(e.ba,e),t)}function ze(e){e.B&&(s.clearTimeout(e.B),e.B=null)}function $e(e){0==e.j.G||e.J||sn(e.j,e)}function Ke(e){ze(e);var t=e.M;t&&"function"==typeof t.ma&&t.ma(),e.M=null,ce(e.U),e.g&&(t=e.g,e.g=null,t.abort(),t.ma())}function Ge(e,t){try{var n=e.j;if(0!=n.G&&(n.g==e||Xe(n.h,e)))if(!e.K&&Xe(n.h,e)&&3==n.G){try{var r=n.Da.g.parse(t)}catch(h){r=null}if(Array.isArray(r)&&3==r.length){var s=r;if(0==s[0]){e:if(!n.u){if(n.g){if(!(n.g.F+3e3<e.F))break e;rn(n),Ht(n)}en(n),Ee(18)}}else n.za=s[1],0<n.za-n.T&&37500>s[2]&&n.F&&0==n.v&&!n.C&&(n.C=Ce(u(n.Za,n),6e3));if(1>=Je(n.h)&&n.ca){try{n.ca()}catch(h){}n.ca=void 0}}else an(n,11)}else if((e.K||n.g==e)&&rn(n),!p(t))for(s=n.Da.g.parse(t),t=0;t<s.length;t++){let u=s[t];if(n.T=u[0],u=u[1],2==n.G)if("c"==u[0]){n.K=u[1],n.ia=u[2];const t=u[3];null!=t&&(n.la=t,n.j.info("VER="+n.la));const s=u[4];null!=s&&(n.Aa=s,n.j.info("SVER="+n.Aa));const h=u[5];null!=h&&"number"==typeof h&&0<h&&(r=1.5*h,n.L=r,n.j.info("backChannelRequestTimeoutMs_="+r)),r=n;const l=e.g;if(l){const e=l.g?l.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(e){var i=r.h;i.g||-1==e.indexOf("spdy")&&-1==e.indexOf("quic")&&-1==e.indexOf("h2")||(i.j=i.l,i.g=new Set,i.h&&(Ye(i,i.h),i.h=null))}if(r.D){const e=l.g?l.g.getResponseHeader("X-HTTP-Session-Id"):null;e&&(r.ya=e,ct(r.I,r.D,e))}}n.G=3,n.l&&n.l.ua(),n.ba&&(n.R=Date.now()-e.F,n.j.info("Handshake RTT: "+n.R+"ms"));var o=e;if((r=n).qa=un(r,r.J?r.ia:null,r.W),o.K){Ze(r.h,o);var a=o,c=r.L;c&&(a.I=c),a.B&&(ze(a),je(a)),r.g=o}else Zt(r);0<n.i.length&&Qt(n)}else"stop"!=u[0]&&"close"!=u[0]||an(n,7);else 3==n.G&&("stop"==u[0]||"close"==u[0]?"stop"==u[0]?an(n,7):Gt(n):"noop"!=u[0]&&n.l&&n.l.ta(u),n.v=0)}be()}catch(h){}}Oe.prototype.ca=function(e){e=e.target;const t=this.M;t&&3==qt(e)?t.j():this.Y(e)},Oe.prototype.Y=function(e){try{if(e==this.g)e:{const d=qt(this.g);var t=this.g.Ba();this.g.Z();if(!(3>d)&&(3!=d||this.g&&(this.h.h||this.g.oa()||zt(this.g)))){this.J||4!=d||7==t||be(),ze(this);var n=this.g.Z();this.X=n;t:if(Fe(this)){var r=zt(this.g);e="";var i=r.length,o=4==qt(this.g);if(!this.h.i){if("undefined"==typeof TextDecoder){Ke(this),$e(this);var a="";break t}this.h.i=new s.TextDecoder}for(t=0;t<i;t++)this.h.h=!0,e+=this.h.i.decode(r[t],{stream:!(o&&t==i-1)});r.length=0,this.h.g+=e,this.C=0,a=this.h.g}else a=this.g.oa();if(this.o=200==n,function(e,t,n,r,s,i,o){e.info(function(){return"XMLHTTP RESP ("+r+") [ attempt "+s+"]: "+t+"\n"+n+"\n"+i+" "+o})}(this.i,this.u,this.A,this.l,this.R,d,n),this.o){if(this.T&&!this.K){t:{if(this.g){var c,u=this.g;if((c=u.g?u.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!p(c)){var h=c;break t}}h=null}if(!(n=h)){this.o=!1,this.s=3,Ee(12),Ke(this),$e(this);break e}Ae(this.i,this.l,n,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Ge(this,n)}if(this.P){let e;for(n=!0;!this.J&&this.C<a.length;){if(e=Be(this,a),e==Me){4==d&&(this.s=4,Ee(14),n=!1),Ae(this.i,this.l,null,"[Incomplete Response]");break}if(e==Le){this.s=4,Ee(15),Ae(this.i,this.l,a,"[Invalid Chunk]"),n=!1;break}Ae(this.i,this.l,e,null),Ge(this,e)}if(Fe(this)&&0!=this.C&&(this.h.g=this.h.g.slice(this.C),this.C=0),4!=d||0!=a.length||this.h.h||(this.s=1,Ee(16),n=!1),this.o=this.o&&n,n){if(0<a.length&&!this.W){this.W=!0;var l=this.j;l.g==this&&l.ba&&!l.M&&(l.j.info("Great, no buffering proxy detected. Bytes received: "+a.length),tn(l),l.M=!0,Ee(11))}}else Ae(this.i,this.l,a,"[Invalid Chunked Response]"),Ke(this),$e(this)}else Ae(this.i,this.l,a,null),Ge(this,a);4==d&&Ke(this),this.o&&!this.J&&(4==d?sn(this.j,this):(this.o=!1,je(this)))}else(function(e){const t={};e=(e.g&&2<=qt(e)&&e.g.getAllResponseHeaders()||"").split("\r\n");for(let r=0;r<e.length;r++){if(p(e[r]))continue;var n=b(e[r]);const s=n[0];if("string"!=typeof(n=n[1]))continue;n=n.trim();const i=t[s]||[];t[s]=i,i.push(n)}!function(e,t){for(const n in e)t.call(void 0,e[n],n,e)}(t,function(e){return e.join(", ")})})(this.g),400==n&&0<a.indexOf("Unknown SID")?(this.s=3,Ee(12)):(this.s=0,Ee(13)),Ke(this),$e(this)}}}catch(d){}},Oe.prototype.cancel=function(){this.J=!0,Ke(this)},Oe.prototype.ba=function(){this.B=null;const e=Date.now();0<=e-this.S?(function(e,t){e.info(function(){return"TIMEOUT: "+t})}(this.i,this.A),2!=this.L&&(be(),Ee(17)),Ke(this),this.s=2,$e(this)):qe(this,this.S-e)};var He=class{constructor(e,t){this.g=e,this.map=t}};function We(e){this.l=e||10,s.PerformanceNavigationTiming?e=0<(e=s.performance.getEntriesByType("navigation")).length&&("hq"==e[0].nextHopProtocol||"h2"==e[0].nextHopProtocol):e=!!(s.chrome&&s.chrome.loadTimes&&s.chrome.loadTimes()&&s.chrome.loadTimes().wasFetchedViaSpdy),this.j=e?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Qe(e){return!!e.h||!!e.g&&e.g.size>=e.j}function Je(e){return e.h?1:e.g?e.g.size:0}function Xe(e,t){return e.h?e.h==t:!!e.g&&e.g.has(t)}function Ye(e,t){e.g?e.g.add(t):e.h=t}function Ze(e,t){e.h&&e.h==t?e.h=null:e.g&&e.g.has(t)&&e.g.delete(t)}function et(e){if(null!=e.h)return e.i.concat(e.h.D);if(null!=e.g&&0!==e.g.size){let t=e.i;for(const n of e.g.values())t=t.concat(n.D);return t}return d(e.i)}function tt(e,t){if(e.forEach&&"function"==typeof e.forEach)e.forEach(t,void 0);else if(i(e)||"string"==typeof e)Array.prototype.forEach.call(e,t,void 0);else for(var n=function(e){if(e.na&&"function"==typeof e.na)return e.na();if(!e.V||"function"!=typeof e.V){if("undefined"!=typeof Map&&e instanceof Map)return Array.from(e.keys());if(!("undefined"!=typeof Set&&e instanceof Set)){if(i(e)||"string"==typeof e){var t=[];e=e.length;for(var n=0;n<e;n++)t.push(n);return t}t=[],n=0;for(const r in e)t[n++]=r;return t}}}(e),r=function(e){if(e.V&&"function"==typeof e.V)return e.V();if("undefined"!=typeof Map&&e instanceof Map||"undefined"!=typeof Set&&e instanceof Set)return Array.from(e.values());if("string"==typeof e)return e.split("");if(i(e)){for(var t=[],n=e.length,r=0;r<n;r++)t.push(e[r]);return t}for(r in t=[],n=0,e)t[n++]=e[r];return t}(e),s=r.length,o=0;o<s;o++)t.call(void 0,r[o],n&&n[o],e)}We.prototype.cancel=function(){if(this.i=et(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&0!==this.g.size){for(const e of this.g.values())e.cancel();this.g.clear()}};var nt=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function rt(e){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,e instanceof rt){this.h=e.h,it(this,e.j),this.o=e.o,this.g=e.g,ot(this,e.s),this.l=e.l;var t=e.i,n=new wt;n.i=t.i,t.g&&(n.g=new Map(t.g),n.h=t.h),at(this,n),this.m=e.m}else e&&(t=String(e).match(nt))?(this.h=!1,it(this,t[1]||"",!0),this.o=ht(t[2]||""),this.g=ht(t[3]||"",!0),ot(this,t[4]),this.l=ht(t[5]||"",!0),at(this,t[6]||"",!0),this.m=ht(t[7]||"")):(this.h=!1,this.i=new wt(null,this.h))}function st(e){return new rt(e)}function it(e,t,n){e.j=n?ht(t,!0):t,e.j&&(e.j=e.j.replace(/:$/,""))}function ot(e,t){if(t){if(t=Number(t),isNaN(t)||0>t)throw Error("Bad port number "+t);e.s=t}else e.s=null}function at(e,t,n){t instanceof wt?(e.i=t,function(e,t){t&&!e.j&&(vt(e),e.i=null,e.g.forEach(function(e,t){var n=t.toLowerCase();t!=n&&(_t(this,t),bt(this,n,e))},e)),e.j=t}(e.i,e.h)):(n||(t=lt(t,gt)),e.i=new wt(t,e.h))}function ct(e,t,n){e.i.set(t,n)}function ut(e){return ct(e,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),e}function ht(e,t){return e?t?decodeURI(e.replace(/%25/g,"%2525")):decodeURIComponent(e):""}function lt(e,t,n){return"string"==typeof e?(e=encodeURI(e).replace(t,dt),n&&(e=e.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),e):null}function dt(e){return"%"+((e=e.charCodeAt(0))>>4&15).toString(16)+(15&e).toString(16)}rt.prototype.toString=function(){var e=[],t=this.j;t&&e.push(lt(t,ft,!0),":");var n=this.g;return(n||"file"==t)&&(e.push("//"),(t=this.o)&&e.push(lt(t,ft,!0),"@"),e.push(encodeURIComponent(String(n)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),null!=(n=this.s)&&e.push(":",String(n))),(n=this.l)&&(this.g&&"/"!=n.charAt(0)&&e.push("/"),e.push(lt(n,"/"==n.charAt(0)?mt:pt,!0))),(n=this.i.toString())&&e.push("?",n),(n=this.m)&&e.push("#",lt(n,yt)),e.join("")};var ft=/[#\/\?@]/g,pt=/[#\?:]/g,mt=/[#\?]/g,gt=/[#\?@]/g,yt=/#/g;function wt(e,t){this.h=this.g=null,this.i=e||null,this.j=!!t}function vt(e){e.g||(e.g=new Map,e.h=0,e.i&&function(e,t){if(e){e=e.split("&");for(var n=0;n<e.length;n++){var r=e[n].indexOf("="),s=null;if(0<=r){var i=e[n].substring(0,r);s=e[n].substring(r+1)}else i=e[n];t(i,s?decodeURIComponent(s.replace(/\+/g," ")):"")}}}(e.i,function(t,n){e.add(decodeURIComponent(t.replace(/\+/g," ")),n)}))}function _t(e,t){vt(e),t=Tt(e,t),e.g.has(t)&&(e.i=null,e.h-=e.g.get(t).length,e.g.delete(t))}function It(e,t){return vt(e),t=Tt(e,t),e.g.has(t)}function bt(e,t,n){_t(e,t),0<n.length&&(e.i=null,e.g.set(Tt(e,t),d(n)),e.h+=n.length)}function Tt(e,t){return t=String(t),e.j&&(t=t.toLowerCase()),t}function Et(e,t,n,r,s){try{s&&(s.onload=null,s.onerror=null,s.onabort=null,s.ontimeout=null),r(n)}catch(i){}}function St(){this.g=new le}function Ct(e,t,n){const r=n||"";try{tt(e,function(e,n){let s=e;o(e)&&(s=ue(e)),t.push(r+n+"="+encodeURIComponent(s))})}catch(s){throw t.push(r+"type="+encodeURIComponent("_badmap")),s}}function kt(e){this.l=e.Ub||null,this.j=e.eb||!1}function At(e,t){ee.call(this),this.D=e,this.o=t,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}function Nt(e){e.j.read().then(e.Pa.bind(e)).catch(e.ga.bind(e))}function Dt(e){e.readyState=4,e.l=null,e.j=null,e.v=null,Rt(e)}function Rt(e){e.onreadystatechange&&e.onreadystatechange.call(e)}function xt(e){let t="";return w(e,function(e,n){t+=n,t+=":",t+=e,t+="\r\n"}),t}function Ot(e,t,n){e:{for(r in n){var r=!1;break e}r=!0}r||(n=xt(n),"string"==typeof e?null!=n&&encodeURIComponent(String(n)):ct(e,t,n))}function Pt(e){ee.call(this),this.headers=new Map,this.o=e||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}(e=wt.prototype).add=function(e,t){vt(this),this.i=null,e=Tt(this,e);var n=this.g.get(e);return n||this.g.set(e,n=[]),n.push(t),this.h+=1,this},e.forEach=function(e,t){vt(this),this.g.forEach(function(n,r){n.forEach(function(n){e.call(t,n,r,this)},this)},this)},e.na=function(){vt(this);const e=Array.from(this.g.values()),t=Array.from(this.g.keys()),n=[];for(let r=0;r<t.length;r++){const s=e[r];for(let e=0;e<s.length;e++)n.push(t[r])}return n},e.V=function(e){vt(this);let t=[];if("string"==typeof e)It(this,e)&&(t=t.concat(this.g.get(Tt(this,e))));else{e=Array.from(this.g.values());for(let n=0;n<e.length;n++)t=t.concat(e[n])}return t},e.set=function(e,t){return vt(this),this.i=null,It(this,e=Tt(this,e))&&(this.h-=this.g.get(e).length),this.g.set(e,[t]),this.h+=1,this},e.get=function(e,t){return e&&0<(e=this.V(e)).length?String(e[0]):t},e.toString=function(){if(this.i)return this.i;if(!this.g)return"";const e=[],t=Array.from(this.g.keys());for(var n=0;n<t.length;n++){var r=t[n];const i=encodeURIComponent(String(r)),o=this.V(r);for(r=0;r<o.length;r++){var s=i;""!==o[r]&&(s+="="+encodeURIComponent(String(o[r]))),e.push(s)}}return this.i=e.join("&")},l(kt,de),kt.prototype.g=function(){return new At(this.l,this.j)},kt.prototype.i=function(e){return function(){return e}}({}),l(At,ee),(e=At.prototype).open=function(e,t){if(0!=this.readyState)throw this.abort(),Error("Error reopening a connection");this.B=e,this.A=t,this.readyState=1,Rt(this)},e.send=function(e){if(1!=this.readyState)throw this.abort(),Error("need to call open() first. ");this.g=!0;const t={headers:this.u,method:this.B,credentials:this.m,cache:void 0};e&&(t.body=e),(this.D||s).fetch(new Request(this.A,t)).then(this.Sa.bind(this),this.ga.bind(this))},e.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&4!=this.readyState&&(this.g=!1,Dt(this)),this.readyState=0},e.Sa=function(e){if(this.g&&(this.l=e,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=e.headers,this.readyState=2,Rt(this)),this.g&&(this.readyState=3,Rt(this),this.g)))if("arraybuffer"===this.responseType)e.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(void 0!==s.ReadableStream&&"body"in e){if(this.j=e.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Nt(this)}else e.text().then(this.Ra.bind(this),this.ga.bind(this))},e.Pa=function(e){if(this.g){if(this.o&&e.value)this.response.push(e.value);else if(!this.o){var t=e.value?e.value:new Uint8Array(0);(t=this.v.decode(t,{stream:!e.done}))&&(this.response=this.responseText+=t)}e.done?Dt(this):Rt(this),3==this.readyState&&Nt(this)}},e.Ra=function(e){this.g&&(this.response=this.responseText=e,Dt(this))},e.Qa=function(e){this.g&&(this.response=e,Dt(this))},e.ga=function(){this.g&&Dt(this)},e.setRequestHeader=function(e,t){this.u.append(e,t)},e.getResponseHeader=function(e){return this.h&&this.h.get(e.toLowerCase())||""},e.getAllResponseHeaders=function(){if(!this.h)return"";const e=[],t=this.h.entries();for(var n=t.next();!n.done;)n=n.value,e.push(n[0]+": "+n[1]),n=t.next();return e.join("\r\n")},Object.defineProperty(At.prototype,"withCredentials",{get:function(){return"include"===this.m},set:function(e){this.m=e?"include":"same-origin"}}),l(Pt,ee);var Lt=/^https?$/i,Mt=["POST","PUT"];function Ut(e,t){e.h=!1,e.g&&(e.j=!0,e.g.abort(),e.j=!1),e.l=t,e.m=5,Vt(e),Bt(e)}function Vt(e){e.A||(e.A=!0,te(e,"complete"),te(e,"error"))}function Ft(e){if(e.h&&void 0!==r&&(!e.v[1]||4!=qt(e)||2!=e.Z()))if(e.u&&4==qt(e))re(e.Ea,0,e);else if(te(e,"readystatechange"),4==qt(e)){e.h=!1;try{const r=e.Z();e:switch(r){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var t=!0;break e;default:t=!1}var n;if(!(n=t)){var i;if(i=0===r){var o=String(e.D).match(nt)[1]||null;!o&&s.self&&s.self.location&&(o=s.self.location.protocol.slice(0,-1)),i=!Lt.test(o?o.toLowerCase():"")}n=i}if(n)te(e,"complete"),te(e,"success");else{e.m=6;try{var a=2<qt(e)?e.g.statusText:""}catch(c){a=""}e.l=a+" ["+e.Z()+"]",Vt(e)}}finally{Bt(e)}}}function Bt(e,t){if(e.g){jt(e);const r=e.g,s=e.v[0]?()=>{}:null;e.g=null,e.v=null,t||te(e,"ready");try{r.onreadystatechange=s}catch(n){}}}function jt(e){e.I&&(s.clearTimeout(e.I),e.I=null)}function qt(e){return e.g?e.g.readyState:0}function zt(e){try{if(!e.g)return null;if("response"in e.g)return e.g.response;switch(e.H){case"":case"text":return e.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in e.g)return e.g.mozResponseArrayBuffer}return null}catch(t){return null}}function $t(e,t,n){return n&&n.internalChannelParams&&n.internalChannelParams[e]||t}function Kt(e){this.Aa=0,this.i=[],this.j=new ke,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=$t("failFast",!1,e),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=$t("baseRetryDelayMs",5e3,e),this.cb=$t("retryDelaySeedMs",1e4,e),this.Wa=$t("forwardChannelMaxRetries",2,e),this.wa=$t("forwardChannelRequestTimeoutMs",2e4,e),this.pa=e&&e.xmlHttpFactory||void 0,this.Xa=e&&e.Tb||void 0,this.Ca=e&&e.useFetchStreams||!1,this.L=void 0,this.J=e&&e.supportsCrossDomainXhr||!1,this.K="",this.h=new We(e&&e.concurrentRequestLimit),this.Da=new St,this.P=e&&e.fastHandshake||!1,this.O=e&&e.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=e&&e.Rb||!1,e&&e.xa&&this.j.xa(),e&&e.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&e&&e.detectBufferingProxy||!1,this.ja=void 0,e&&e.longPollingTimeout&&0<e.longPollingTimeout&&(this.ja=e.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}function Gt(e){if(Wt(e),3==e.G){var t=e.U++,n=st(e.I);if(ct(n,"SID",e.K),ct(n,"RID",t),ct(n,"TYPE","terminate"),Xt(e,n),(t=new Oe(e,e.j,t)).L=2,t.v=ut(st(n)),n=!1,s.navigator&&s.navigator.sendBeacon)try{n=s.navigator.sendBeacon(t.v.toString(),"")}catch(r){}!n&&s.Image&&((new Image).src=t.v,n=!0),n||(t.g=hn(t.j,null),t.g.ea(t.v)),t.F=Date.now(),je(t)}cn(e)}function Ht(e){e.g&&(tn(e),e.g.cancel(),e.g=null)}function Wt(e){Ht(e),e.u&&(s.clearTimeout(e.u),e.u=null),rn(e),e.h.cancel(),e.s&&("number"==typeof e.s&&s.clearTimeout(e.s),e.s=null)}function Qt(e){if(!Qe(e.h)&&!e.s){e.s=!0;var t=e.Ga;k||D(),A||(k(),A=!0),N.add(t,e),e.B=0}}function Jt(e,t){var n;n=t?t.l:e.U++;const r=st(e.I);ct(r,"SID",e.K),ct(r,"RID",n),ct(r,"AID",e.T),Xt(e,r),e.m&&e.o&&Ot(r,e.m,e.o),n=new Oe(e,e.j,n,e.B+1),null===e.m&&(n.H=e.o),t&&(e.i=t.D.concat(e.i)),t=Yt(e,n,1e3),n.I=Math.round(.5*e.wa)+Math.round(.5*e.wa*Math.random()),Ye(e.h,n),Ue(n,r,t)}function Xt(e,t){e.H&&w(e.H,function(e,n){ct(t,n,e)}),e.l&&tt({},function(e,n){ct(t,n,e)})}function Yt(e,t,n){n=Math.min(e.i.length,n);var r=e.l?u(e.l.Na,e.l,e):null;e:{var s=e.i;let t=-1;for(;;){const e=["count="+n];-1==t?0<n?(t=s[0].g,e.push("ofs="+t)):t=0:e.push("ofs="+t);let o=!0;for(let a=0;a<n;a++){let n=s[a].g;const c=s[a].map;if(n-=t,0>n)t=Math.max(0,s[a].g-100),o=!1;else try{Ct(c,e,"req"+n+"_")}catch(i){r&&r(c)}}if(o){r=e.join("&");break e}}}return e=e.i.splice(0,n),t.D=e,r}function Zt(e){if(!e.g&&!e.u){e.Y=1;var t=e.Fa;k||D(),A||(k(),A=!0),N.add(t,e),e.v=0}}function en(e){return!(e.g||e.u||3<=e.v)&&(e.Y++,e.u=Ce(u(e.Fa,e),on(e,e.v)),e.v++,!0)}function tn(e){null!=e.A&&(s.clearTimeout(e.A),e.A=null)}function nn(e){e.g=new Oe(e,e.j,"rpc",e.Y),null===e.m&&(e.g.H=e.o),e.g.O=0;var t=st(e.qa);ct(t,"RID","rpc"),ct(t,"SID",e.K),ct(t,"AID",e.T),ct(t,"CI",e.F?"0":"1"),!e.F&&e.ja&&ct(t,"TO",e.ja),ct(t,"TYPE","xmlhttp"),Xt(e,t),e.m&&e.o&&Ot(t,e.m,e.o),e.L&&(e.g.I=e.L);var n=e.g;e=e.ia,n.L=1,n.v=ut(st(t)),n.m=null,n.P=!0,Ve(n,e)}function rn(e){null!=e.C&&(s.clearTimeout(e.C),e.C=null)}function sn(e,t){var n=null;if(e.g==t){rn(e),tn(e),e.g=null;var r=2}else{if(!Xe(e.h,t))return;n=t.D,Ze(e.h,t),r=1}if(0!=e.G)if(t.o)if(1==r){n=t.m?t.m.length:0,t=Date.now()-t.F;var s=e.B;te(r=_e(),new Se(r,n)),Qt(e)}else Zt(e);else if(3==(s=t.s)||0==s&&0<t.X||!(1==r&&function(e,t){return!(Je(e.h)>=e.h.j-(e.s?1:0)||(e.s?(e.i=t.D.concat(e.i),0):1==e.G||2==e.G||e.B>=(e.Va?0:e.Wa)||(e.s=Ce(u(e.Ga,e,t),on(e,e.B)),e.B++,0)))}(e,t)||2==r&&en(e)))switch(n&&0<n.length&&(t=e.h,t.i=t.i.concat(n)),s){case 1:an(e,5);break;case 4:an(e,10);break;case 3:an(e,6);break;default:an(e,2)}}function on(e,t){let n=e.Ta+Math.floor(Math.random()*e.cb);return e.isActive()||(n*=2),n*t}function an(e,t){if(e.j.info("Error code "+t),2==t){var n=u(e.fb,e),r=e.Xa;const t=!r;r=new rt(r||"//www.google.com/images/cleardot.gif"),s.location&&"http"==s.location.protocol||it(r,"https"),ut(r),t?function(e,t){const n=new ke;if(s.Image){const r=new Image;r.onload=h(Et,n,"TestLoadImage: loaded",!0,t,r),r.onerror=h(Et,n,"TestLoadImage: error",!1,t,r),r.onabort=h(Et,n,"TestLoadImage: abort",!1,t,r),r.ontimeout=h(Et,n,"TestLoadImage: timeout",!1,t,r),s.setTimeout(function(){r.ontimeout&&r.ontimeout()},1e4),r.src=e}else t(!1)}(r.toString(),n):function(e,t){new ke;const n=new AbortController,r=setTimeout(()=>{n.abort(),Et(0,0,!1,t)},1e4);fetch(e,{signal:n.signal}).then(e=>{clearTimeout(r),e.ok?Et(0,0,!0,t):Et(0,0,!1,t)}).catch(()=>{clearTimeout(r),Et(0,0,!1,t)})}(r.toString(),n)}else Ee(2);e.G=0,e.l&&e.l.sa(t),cn(e),Wt(e)}function cn(e){if(e.G=0,e.ka=[],e.l){const t=et(e.h);0==t.length&&0==e.i.length||(f(e.ka,t),f(e.ka,e.i),e.h.i.length=0,d(e.i),e.i.length=0),e.l.ra()}}function un(e,t,n){var r=n instanceof rt?st(n):new rt(n);if(""!=r.g)t&&(r.g=t+"."+r.g),ot(r,r.s);else{var i=s.location;r=i.protocol,t=t?t+"."+i.hostname:i.hostname,i=+i.port;var o=new rt(null);r&&it(o,r),t&&(o.g=t),i&&ot(o,i),n&&(o.l=n),r=o}return n=e.D,t=e.ya,n&&t&&ct(r,n,t),ct(r,"VER",e.la),Xt(e,r),r}function hn(e,t,n){if(t&&!e.J)throw Error("Can't create secondary domain capable XhrIo object.");return(t=e.Ca&&!e.pa?new Pt(new kt({eb:n})):new Pt(e.pa)).Ha(e.J),t}function ln(){}function dn(){}function fn(e,t){ee.call(this),this.g=new Kt(t),this.l=e,this.h=t&&t.messageUrlParams||null,e=t&&t.messageHeaders||null,t&&t.clientProtocolHeaderRequired&&(e?e["X-Client-Protocol"]="webchannel":e={"X-Client-Protocol":"webchannel"}),this.g.o=e,e=t&&t.initMessageHeaders||null,t&&t.messageContentType&&(e?e["X-WebChannel-Content-Type"]=t.messageContentType:e={"X-WebChannel-Content-Type":t.messageContentType}),t&&t.va&&(e?e["X-WebChannel-Client-Profile"]=t.va:e={"X-WebChannel-Client-Profile":t.va}),this.g.S=e,(e=t&&t.Sb)&&!p(e)&&(this.g.m=e),this.v=t&&t.supportsCrossDomainXhr||!1,this.u=t&&t.sendRawJson||!1,(t=t&&t.httpSessionIdParam)&&!p(t)&&(this.g.D=t,null!==(e=this.h)&&t in e&&(t in(e=this.h)&&delete e[t])),this.j=new gn(this)}function pn(e){ge.call(this),e.__headers__&&(this.headers=e.__headers__,this.statusCode=e.__status__,delete e.__headers__,delete e.__status__);var t=e.__sm__;if(t){e:{for(const n in t){e=n;break e}e=void 0}(this.i=e)&&(e=this.i,t=null!==t&&e in t?t[e]:void 0),this.data=t}else this.data=e}function mn(){ye.call(this),this.status=1}function gn(e){this.g=e}(e=Pt.prototype).Ha=function(e){this.J=e},e.ea=function(e,t,n,r){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+e);t=t?t.toUpperCase():"GET",this.D=e,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Ne.g(),this.v=this.o?fe(this.o):fe(Ne),this.g.onreadystatechange=u(this.Ea,this);try{this.B=!0,this.g.open(t,String(e),!0),this.B=!1}catch(o){return void Ut(this,o)}if(e=n||"",n=new Map(this.headers),r)if(Object.getPrototypeOf(r)===Object.prototype)for(var i in r)n.set(i,r[i]);else{if("function"!=typeof r.keys||"function"!=typeof r.get)throw Error("Unknown input type for opt_headers: "+String(r));for(const e of r.keys())n.set(e,r.get(e))}r=Array.from(n.keys()).find(e=>"content-type"==e.toLowerCase()),i=s.FormData&&e instanceof s.FormData,!(0<=Array.prototype.indexOf.call(Mt,t,void 0))||r||i||n.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[s,a]of n)this.g.setRequestHeader(s,a);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{jt(this),this.u=!0,this.g.send(e),this.u=!1}catch(o){Ut(this,o)}},e.abort=function(e){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=e||7,te(this,"complete"),te(this,"abort"),Bt(this))},e.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Bt(this,!0)),Pt.aa.N.call(this)},e.Ea=function(){this.s||(this.B||this.u||this.j?Ft(this):this.bb())},e.bb=function(){Ft(this)},e.isActive=function(){return!!this.g},e.Z=function(){try{return 2<qt(this)?this.g.status:-1}catch(e){return-1}},e.oa=function(){try{return this.g?this.g.responseText:""}catch(e){return""}},e.Oa=function(e){if(this.g){var t=this.g.responseText;return e&&0==t.indexOf(e)&&(t=t.substring(e.length)),he(t)}},e.Ba=function(){return this.m},e.Ka=function(){return"string"==typeof this.l?this.l:String(this.l)},(e=Kt.prototype).la=8,e.G=1,e.connect=function(e,t,n,r){Ee(0),this.W=e,this.H=t||{},n&&void 0!==r&&(this.H.OSID=n,this.H.OAID=r),this.F=this.X,this.I=un(this,null,this.W),Qt(this)},e.Ga=function(e){if(this.s)if(this.s=null,1==this.G){if(!e){this.U=Math.floor(1e5*Math.random()),e=this.U++;const s=new Oe(this,this.j,e);let i=this.o;if(this.S&&(i?(i=v(i),I(i,this.S)):i=this.S),null!==this.m||this.O||(s.H=i,i=null),this.P)e:{for(var t=0,n=0;n<this.i.length;n++){var r=this.i[n];if(void 0===(r="__data__"in r.map&&"string"==typeof(r=r.map.__data__)?r.length:void 0))break;if(4096<(t+=r)){t=n;break e}if(4096===t||n===this.i.length-1){t=n+1;break e}}t=1e3}else t=1e3;t=Yt(this,s,t),ct(n=st(this.I),"RID",e),ct(n,"CVER",22),this.D&&ct(n,"X-HTTP-Session-Id",this.D),Xt(this,n),i&&(this.O?t="headers="+encodeURIComponent(String(xt(i)))+"&"+t:this.m&&Ot(n,this.m,i)),Ye(this.h,s),this.Ua&&ct(n,"TYPE","init"),this.P?(ct(n,"$req",t),ct(n,"SID","null"),s.T=!0,Ue(s,n,null)):Ue(s,n,t),this.G=2}}else 3==this.G&&(e?Jt(this,e):0==this.i.length||Qe(this.h)||Jt(this))},e.Fa=function(){if(this.u=null,nn(this),this.ba&&!(this.M||null==this.g||0>=this.R)){var e=2*this.R;this.j.info("BP detection timer enabled: "+e),this.A=Ce(u(this.ab,this),e)}},e.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,Ee(10),Ht(this),nn(this))},e.Za=function(){null!=this.C&&(this.C=null,Ht(this),en(this),Ee(19))},e.fb=function(e){e?(this.j.info("Successfully pinged google.com"),Ee(2)):(this.j.info("Failed to ping google.com"),Ee(1))},e.isActive=function(){return!!this.l&&this.l.isActive(this)},(e=ln.prototype).ua=function(){},e.ta=function(){},e.sa=function(){},e.ra=function(){},e.isActive=function(){return!0},e.Na=function(){},dn.prototype.g=function(e,t){return new fn(e,t)},l(fn,ee),fn.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},fn.prototype.close=function(){Gt(this.g)},fn.prototype.o=function(e){var t=this.g;if("string"==typeof e){var n={};n.__data__=e,e=n}else this.u&&((n={}).__data__=ue(e),e=n);t.i.push(new He(t.Ya++,e)),3==t.G&&Qt(t)},fn.prototype.N=function(){this.g.l=null,delete this.j,Gt(this.g),delete this.g,fn.aa.N.call(this)},l(pn,ge),l(mn,ye),l(gn,ln),gn.prototype.ua=function(){te(this.g,"a")},gn.prototype.ta=function(e){te(this.g,new pn(e))},gn.prototype.sa=function(e){te(this.g,new mn)},gn.prototype.ra=function(){te(this.g,"b")},dn.prototype.createWebChannel=dn.prototype.g,fn.prototype.send=fn.prototype.o,fn.prototype.open=fn.prototype.m,fn.prototype.close=fn.prototype.close,Ds=function(){return new dn},Ns=function(){return _e()},As=we,ks={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},De.NO_ERROR=0,De.TIMEOUT=8,De.HTTP_ERROR=6,Cs=De,Re.COMPLETE="complete",Ss=Re,pe.EventType=me,me.OPEN="a",me.CLOSE="b",me.ERROR="c",me.MESSAGE="d",ee.prototype.listen=ee.prototype.K,Es=pe,Pt.prototype.listenOnce=Pt.prototype.L,Pt.prototype.getLastError=Pt.prototype.Ka,Pt.prototype.getLastErrorCode=Pt.prototype.Ba,Pt.prototype.getStatus=Pt.prototype.Z,Pt.prototype.getResponseJson=Pt.prototype.Oa,Pt.prototype.getResponseText=Pt.prototype.oa,Pt.prototype.send=Pt.prototype.ea,Pt.prototype.setWithCredentials=Pt.prototype.Ha,Ts=Pt}).apply(void 0!==Rs?Rs:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});const xs="@firebase/firestore",Os="4.9.0";
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ps{constructor(e){this.uid=e}isAuthenticated(){return null!=this.uid}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Ps.UNAUTHENTICATED=new Ps(null),Ps.GOOGLE_CREDENTIALS=new Ps("google-credentials-uid"),Ps.FIRST_PARTY=new Ps("first-party-uid"),Ps.MOCK_USER=new Ps("mock-user");
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
let Ls="12.0.0";
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ms=new K("@firebase/firestore");function Us(){return Ms.logLevel}function Vs(e,...t){if(Ms.logLevel<=F.DEBUG){const n=t.map(js);Ms.debug(`Firestore (${Ls}): ${e}`,...n)}}function Fs(e,...t){if(Ms.logLevel<=F.ERROR){const n=t.map(js);Ms.error(`Firestore (${Ls}): ${e}`,...n)}}function Bs(e,...t){if(Ms.logLevel<=F.WARN){const n=t.map(js);Ms.warn(`Firestore (${Ls}): ${e}`,...n)}}function js(e){if("string"==typeof e)return e;try{
/**
    * @license
    * Copyright 2020 Google LLC
    *
    * Licensed under the Apache License, Version 2.0 (the "License");
    * you may not use this file except in compliance with the License.
    * You may obtain a copy of the License at
    *
    *   http://www.apache.org/licenses/LICENSE-2.0
    *
    * Unless required by applicable law or agreed to in writing, software
    * distributed under the License is distributed on an "AS IS" BASIS,
    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    * See the License for the specific language governing permissions and
    * limitations under the License.
    */
return t=e,JSON.stringify(t)}catch(n){return e}var t}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qs(e,t,n){let r="Unexpected state";"string"==typeof t?r=t:n=t,zs(e,r,n)}function zs(e,t,n){let r=`FIRESTORE (${Ls}) INTERNAL ASSERTION FAILED: ${t} (ID: ${e.toString(16)})`;if(void 0!==n)try{r+=" CONTEXT: "+JSON.stringify(n)}catch(s){r+=" CONTEXT: "+n}throw Fs(r),new Error(r)}function $s(e,t,n,r){let s="Unexpected state";"string"==typeof n?s=n:r=n,e||zs(t,s,r)}function Ks(e,t){return e}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gs={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class Hs extends E{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ws{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qs{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class Js{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(Ps.UNAUTHENTICATED))}shutdown(){}}class Xs{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class Ys{constructor(e){this.t=e,this.currentUser=Ps.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){$s(void 0===this.o,42304);let n=this.i;const r=e=>this.i!==n?(n=this.i,t(e)):Promise.resolve();let s=new Ws;this.o=()=>{this.i++,this.currentUser=this.u(),s.resolve(),s=new Ws,e.enqueueRetryable(()=>r(this.currentUser))};const i=()=>{const t=s;e.enqueueRetryable(async()=>{await t.promise,await r(this.currentUser)})},o=e=>{Vs("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=e,this.o&&(this.auth.addAuthTokenListener(this.o),i())};this.t.onInit(e=>o(e)),setTimeout(()=>{if(!this.auth){const e=this.t.getImmediate({optional:!0});e?o(e):(Vs("FirebaseAuthCredentialsProvider","Auth not yet detected"),s.resolve(),s=new Ws)}},0),i()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(t=>this.i!==e?(Vs("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):t?($s("string"==typeof t.accessToken,31837,{l:t}),new Qs(t.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return $s(null===e||"string"==typeof e,2055,{h:e}),new Ps(e)}}class Zs{constructor(e,t,n){this.P=e,this.T=t,this.I=n,this.type="FirstParty",this.user=Ps.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class ei{constructor(e,t,n){this.P=e,this.T=t,this.I=n}getToken(){return Promise.resolve(new Zs(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable(()=>t(Ps.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class ti{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class ni{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Ge(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){$s(void 0===this.o,3512);const n=e=>{null!=e.error&&Vs("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${e.error.message}`);const n=e.token!==this.m;return this.m=e.token,Vs("FirebaseAppCheckTokenProvider",`Received ${n?"new":"existing"} token.`),n?t(e.token):Promise.resolve()};this.o=t=>{e.enqueueRetryable(()=>n(t))};const r=e=>{Vs("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=e,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit(e=>r(e)),setTimeout(()=>{if(!this.appCheck){const e=this.V.getImmediate({optional:!0});e?r(e):Vs("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.p)return Promise.resolve(new ti(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(e=>e?($s("string"==typeof e.token,44558,{tokenResult:e}),this.m=e.token,new ti(e.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ri(e){const t="undefined"!=typeof self&&(self.crypto||self.msCrypto),n=new Uint8Array(e);if(t&&"function"==typeof t.getRandomValues)t.getRandomValues(n);else for(let r=0;r<e;r++)n[r]=Math.floor(256*Math.random());return n}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class si{static newId(){const e=62*Math.floor(256/62);let t="";for(;t.length<20;){const n=ri(40);for(let r=0;r<n.length;++r)t.length<20&&n[r]<e&&(t+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(n[r]%62))}return t}}function ii(e,t){return e<t?-1:e>t?1:0}function oi(e,t){const n=Math.min(e.length,t.length);for(let r=0;r<n;r++){const n=e.charAt(r),s=t.charAt(r);if(n!==s)return ui(n)===ui(s)?ii(n,s):ui(n)?1:-1}return ii(e.length,t.length)}const ai=55296,ci=57343;function ui(e){const t=e.charCodeAt(0);return t>=ai&&t<=ci}function hi(e,t,n){return e.length===t.length&&e.every((e,r)=>n(e,t[r]))}function li(e){return e+"\0"}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const di="__name__";class fi{constructor(e,t,n){void 0===t?t=0:t>e.length&&qs(637,{offset:t,range:e.length}),void 0===n?n=e.length-t:n>e.length-t&&qs(1746,{length:n,range:e.length-t}),this.segments=e,this.offset=t,this.len=n}get length(){return this.len}isEqual(e){return 0===fi.comparator(this,e)}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof fi?e.forEach(e=>{t.push(e)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=void 0===e?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return 0===this.length}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,n=this.limit();t<n;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const n=Math.min(e.length,t.length);for(let r=0;r<n;r++){const n=fi.compareSegments(e.get(r),t.get(r));if(0!==n)return n}return ii(e.length,t.length)}static compareSegments(e,t){const n=fi.isNumericId(e),r=fi.isNumericId(t);return n&&!r?-1:!n&&r?1:n&&r?fi.extractNumericId(e).compare(fi.extractNumericId(t)):oi(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return _s.fromString(e.substring(4,e.length-2))}}class pi extends fi{construct(e,t,n){return new pi(e,t,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const n of e){if(n.indexOf("//")>=0)throw new Hs(Gs.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);t.push(...n.split("/").filter(e=>e.length>0))}return new pi(t)}static emptyPath(){return new pi([])}}const mi=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class gi extends fi{construct(e,t,n){return new gi(e,t,n)}static isValidIdentifier(e){return mi.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),gi.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return 1===this.length&&this.get(0)===di}static keyField(){return new gi([di])}static fromServerFormat(e){const t=[];let n="",r=0;const s=()=>{if(0===n.length)throw new Hs(Gs.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(n),n=""};let i=!1;for(;r<e.length;){const t=e[r];if("\\"===t){if(r+1===e.length)throw new Hs(Gs.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const t=e[r+1];if("\\"!==t&&"."!==t&&"`"!==t)throw new Hs(Gs.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);n+=t,r+=2}else"`"===t?(i=!i,r++):"."!==t||i?(n+=t,r++):(s(),r++)}if(s(),i)throw new Hs(Gs.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new gi(t)}static emptyPath(){return new gi([])}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yi{constructor(e){this.path=e}static fromPath(e){return new yi(pi.fromString(e))}static fromName(e){return new yi(pi.fromString(e).popFirst(5))}static empty(){return new yi(pi.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return null!==e&&0===pi.comparator(this.path,e.path)}toString(){return this.path.toString()}static comparator(e,t){return pi.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new yi(new pi(e.slice()))}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wi(e,t,n){if(!n)throw new Hs(Gs.INVALID_ARGUMENT,`Function ${e}() cannot be called with an empty ${t}.`)}function vi(e,t,n,r){if(!0===t&&!0===r)throw new Hs(Gs.INVALID_ARGUMENT,`${e} and ${n} cannot be used together.`)}function _i(e){if(!yi.isDocumentKey(e))throw new Hs(Gs.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${e} has ${e.length}.`)}function Ii(e){if(yi.isDocumentKey(e))throw new Hs(Gs.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${e} has ${e.length}.`)}function bi(e){return"object"==typeof e&&null!==e&&(Object.getPrototypeOf(e)===Object.prototype||null===Object.getPrototypeOf(e))}function Ti(e){if(void 0===e)return"undefined";if(null===e)return"null";if("string"==typeof e)return e.length>20&&(e=`${e.substring(0,20)}...`),JSON.stringify(e);if("number"==typeof e||"boolean"==typeof e)return""+e;if("object"==typeof e){if(e instanceof Array)return"an array";{const n=(t=e).constructor?t.constructor.name:null;return n?`a custom ${n} object`:"an object"}}var t;return"function"==typeof e?"a function":qs(12329,{type:typeof e})}function Ei(e,t){if("_delegate"in e&&(e=e._delegate),!(e instanceof t)){if(t.name===e.constructor.name)throw new Hs(Gs.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=Ti(e);throw new Hs(Gs.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${n}`)}}return e}
/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Si(e,t){const n={typeString:e};return t&&(n.value=t),n}function Ci(e,t){if(!bi(e))throw new Hs(Gs.INVALID_ARGUMENT,"JSON must be an object");let n;for(const r in t)if(t[r]){const s=t[r].typeString,i="value"in t[r]?{value:t[r].value}:void 0;if(!(r in e)){n=`JSON missing required field: '${r}'`;break}const o=e[r];if(s&&typeof o!==s){n=`JSON field '${r}' must be a ${s}.`;break}if(void 0!==i&&o!==i.value){n=`Expected '${r}' field to equal '${i.value}'`;break}}if(n)throw new Hs(Gs.INVALID_ARGUMENT,n);return!0}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ki=-62135596800,Ai=1e6;class Ni{static now(){return Ni.fromMillis(Date.now())}static fromDate(e){return Ni.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),n=Math.floor((e-1e3*t)*Ai);return new Ni(t,n)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new Hs(Gs.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new Hs(Gs.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<ki)throw new Hs(Gs.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new Hs(Gs.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Ai}_compareTo(e){return this.seconds===e.seconds?ii(this.nanoseconds,e.nanoseconds):ii(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:Ni._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(Ci(e,Ni._jsonSchema))return new Ni(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-ki;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}Ni._jsonSchemaVersion="firestore/timestamp/1.0",Ni._jsonSchema={type:Si("string",Ni._jsonSchemaVersion),seconds:Si("number"),nanoseconds:Si("number")};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Di{static fromTimestamp(e){return new Di(e)}static min(){return new Di(new Ni(0,0))}static max(){return new Di(new Ni(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ri{constructor(e,t,n,r){this.indexId=e,this.collectionGroup=t,this.fields=n,this.indexState=r}}function xi(e){return e.fields.find(e=>2===e.kind)}function Oi(e){return e.fields.filter(e=>2!==e.kind)}Ri.UNKNOWN_ID=-1;class Pi{constructor(e,t){this.fieldPath=e,this.kind=t}}class Li{constructor(e,t){this.sequenceNumber=e,this.offset=t}static empty(){return new Li(0,Ui.min())}}function Mi(e){return new Ui(e.readTime,e.key,-1)}class Ui{constructor(e,t,n){this.readTime=e,this.documentKey=t,this.largestBatchId=n}static min(){return new Ui(Di.min(),yi.empty(),-1)}static max(){return new Ui(Di.max(),yi.empty(),-1)}}function Vi(e,t){let n=e.readTime.compareTo(t.readTime);return 0!==n?n:(n=yi.comparator(e.documentKey,t.documentKey),0!==n?n:ii(e.largestBatchId,t.largestBatchId)
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */)}const Fi="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class Bi{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ji(e){if(e.code!==Gs.FAILED_PRECONDITION||e.message!==Fi)throw e;Vs("LocalStore","Unexpectedly lost primary lease")}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qi{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(e=>{this.isDone=!0,this.result=e,this.nextCallback&&this.nextCallback(e)},e=>{this.isDone=!0,this.error=e,this.catchCallback&&this.catchCallback(e)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&qs(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new qi((n,r)=>{this.nextCallback=t=>{this.wrapSuccess(e,t).next(n,r)},this.catchCallback=e=>{this.wrapFailure(t,e).next(n,r)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof qi?t:qi.resolve(t)}catch(t){return qi.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):qi.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):qi.reject(t)}static resolve(e){return new qi((t,n)=>{t(e)})}static reject(e){return new qi((t,n)=>{n(e)})}static waitFor(e){return new qi((t,n)=>{let r=0,s=0,i=!1;e.forEach(e=>{++r,e.next(()=>{++s,i&&s===r&&t()},e=>n(e))}),i=!0,s===r&&t()})}static or(e){let t=qi.resolve(!1);for(const n of e)t=t.next(e=>e?qi.resolve(e):n());return t}static forEach(e,t){const n=[];return e.forEach((e,r)=>{n.push(t.call(this,e,r))}),this.waitFor(n)}static mapArray(e,t){return new qi((n,r)=>{const s=e.length,i=new Array(s);let o=0;for(let a=0;a<s;a++){const c=a;t(e[c]).next(e=>{i[c]=e,++o,o===s&&n(i)},e=>r(e))}})}static doWhile(e,t){return new qi((n,r)=>{const s=()=>{!0===e()?t().next(()=>{s()},r):n()};s()})}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zi="SimpleDb";class $i{static open(e,t,n,r){try{return new $i(t,e.transaction(r,n))}catch(s){throw new Wi(t,s)}}constructor(e,t){this.action=e,this.transaction=t,this.aborted=!1,this.S=new Ws,this.transaction.oncomplete=()=>{this.S.resolve()},this.transaction.onabort=()=>{t.error?this.S.reject(new Wi(e,t.error)):this.S.resolve()},this.transaction.onerror=t=>{const n=Zi(t.target.error);this.S.reject(new Wi(e,n))}}get D(){return this.S.promise}abort(e){e&&this.S.reject(e),this.aborted||(Vs(zi,"Aborting transaction:",e?e.message:"Client-initiated abort"),this.aborted=!0,this.transaction.abort())}C(){const e=this.transaction;this.aborted||"function"!=typeof e.commit||e.commit()}store(e){const t=this.transaction.objectStore(e);return new Ji(t)}}class Ki{static delete(e){return Vs(zi,"Removing database:",e),Xi(o().indexedDB.deleteDatabase(e)).toPromise()}static v(){if(!T())return!1;if(Ki.F())return!0;const e=v(),t=Ki.M(e),n=0<t&&t<10,r=Gi(e),s=0<r&&r<4.5;return!(e.indexOf("MSIE ")>0||e.indexOf("Trident/")>0||e.indexOf("Edge/")>0||n||s)}static F(){return"undefined"!=typeof process&&"YES"===process.__PRIVATE_env?.__PRIVATE_USE_MOCK_PERSISTENCE}static O(e,t){return e.store(t)}static M(e){const t=e.match(/i(?:phone|pad|pod) os ([\d_]+)/i),n=t?t[1].split("_").slice(0,2).join("."):"-1";return Number(n)}constructor(e,t,n){this.name=e,this.version=t,this.N=n,this.B=null,12.2===Ki.M(v())&&Fs("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.")}async L(e){return this.db||(Vs(zi,"Opening database:",this.name),this.db=await new Promise((t,n)=>{const r=indexedDB.open(this.name,this.version);r.onsuccess=e=>{const n=e.target.result;t(n)},r.onblocked=()=>{n(new Wi(e,"Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."))},r.onerror=t=>{const r=t.target.error;"VersionError"===r.name?n(new Hs(Gs.FAILED_PRECONDITION,"A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")):"InvalidStateError"===r.name?n(new Hs(Gs.FAILED_PRECONDITION,"Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: "+r)):n(new Wi(e,r))},r.onupgradeneeded=e=>{Vs(zi,'Database "'+this.name+'" requires upgrade from version:',e.oldVersion);const t=e.target.result;this.N.k(t,r.transaction,e.oldVersion,this.version).next(()=>{Vs(zi,"Database upgrade to version "+this.version+" complete")})}})),this.q&&(this.db.onversionchange=e=>this.q(e)),this.db}$(e){this.q=e,this.db&&(this.db.onversionchange=t=>e(t))}async runTransaction(e,t,n,r){const s="readonly"===t;let i=0;for(;;){++i;try{this.db=await this.L(e);const t=$i.open(this.db,e,s?"readonly":"readwrite",n),i=r(t).next(e=>(t.C(),e)).catch(e=>(t.abort(e),qi.reject(e))).toPromise();return i.catch(()=>{}),await t.D,i}catch(o){const e=o,t="FirebaseError"!==e.name&&i<3;if(Vs(zi,"Transaction failed with error:",e.message,"Retrying:",t),this.close(),!t)return Promise.reject(e)}}}close(){this.db&&this.db.close(),this.db=void 0}}function Gi(e){const t=e.match(/Android ([\d.]+)/i),n=t?t[1].split(".").slice(0,2).join("."):"-1";return Number(n)}class Hi{constructor(e){this.U=e,this.K=!1,this.W=null}get isDone(){return this.K}get G(){return this.W}set cursor(e){this.U=e}done(){this.K=!0}j(e){this.W=e}delete(){return Xi(this.U.delete())}}class Wi extends Hs{constructor(e,t){super(Gs.UNAVAILABLE,`IndexedDB transaction '${e}' failed: ${t}`),this.name="IndexedDbTransactionError"}}function Qi(e){return"IndexedDbTransactionError"===e.name}class Ji{constructor(e){this.store=e}put(e,t){let n;return void 0!==t?(Vs(zi,"PUT",this.store.name,e,t),n=this.store.put(t,e)):(Vs(zi,"PUT",this.store.name,"<auto-key>",e),n=this.store.put(e)),Xi(n)}add(e){return Vs(zi,"ADD",this.store.name,e,e),Xi(this.store.add(e))}get(e){return Xi(this.store.get(e)).next(t=>(void 0===t&&(t=null),Vs(zi,"GET",this.store.name,e,t),t))}delete(e){return Vs(zi,"DELETE",this.store.name,e),Xi(this.store.delete(e))}count(){return Vs(zi,"COUNT",this.store.name),Xi(this.store.count())}J(e,t){const n=this.options(e,t),r=n.index?this.store.index(n.index):this.store;if("function"==typeof r.getAll){const e=r.getAll(n.range);return new qi((t,n)=>{e.onerror=e=>{n(e.target.error)},e.onsuccess=e=>{t(e.target.result)}})}{const e=this.cursor(n),t=[];return this.H(e,(e,n)=>{t.push(n)}).next(()=>t)}}Y(e,t){const n=this.store.getAll(e,null===t?void 0:t);return new qi((e,t)=>{n.onerror=e=>{t(e.target.error)},n.onsuccess=t=>{e(t.target.result)}})}Z(e,t){Vs(zi,"DELETE ALL",this.store.name);const n=this.options(e,t);n.X=!1;const r=this.cursor(n);return this.H(r,(e,t,n)=>n.delete())}ee(e,t){let n;t?n=e:(n={},t=e);const r=this.cursor(n);return this.H(r,t)}te(e){const t=this.cursor({});return new qi((n,r)=>{t.onerror=e=>{const t=Zi(e.target.error);r(t)},t.onsuccess=t=>{const r=t.target.result;r?e(r.primaryKey,r.value).next(e=>{e?r.continue():n()}):n()}})}H(e,t){const n=[];return new qi((r,s)=>{e.onerror=e=>{s(e.target.error)},e.onsuccess=e=>{const s=e.target.result;if(!s)return void r();const i=new Hi(s),o=t(s.primaryKey,s.value,i);if(o instanceof qi){const e=o.catch(e=>(i.done(),qi.reject(e)));n.push(e)}i.isDone?r():null===i.G?s.continue():s.continue(i.G)}}).next(()=>qi.waitFor(n))}options(e,t){let n;return void 0!==e&&("string"==typeof e?n=e:t=e),{index:n,range:t}}cursor(e){let t="next";if(e.reverse&&(t="prev"),e.index){const n=this.store.index(e.index);return e.X?n.openKeyCursor(e.range,t):n.openCursor(e.range,t)}return this.store.openCursor(e.range,t)}}function Xi(e){return new qi((t,n)=>{e.onsuccess=e=>{const n=e.target.result;t(n)},e.onerror=e=>{const t=Zi(e.target.error);n(t)}})}let Yi=!1;function Zi(e){const t=Ki.M(v());if(t>=12.2&&t<13){const t="An internal error was encountered in the Indexed Database server";if(e.message.indexOf(t)>=0){const e=new Hs("internal",`IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${t}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);return Yi||(Yi=!0,setTimeout(()=>{throw e},0)),e}}return e}const eo="IndexBackfiller";class to{constructor(e,t){this.asyncQueue=e,this.ne=t,this.task=null}start(){this.re(15e3)}stop(){this.task&&(this.task.cancel(),this.task=null)}get started(){return null!==this.task}re(e){Vs(eo,`Scheduled in ${e}ms`),this.task=this.asyncQueue.enqueueAfterDelay("index_backfill",e,async()=>{this.task=null;try{const e=await this.ne.ie();Vs(eo,`Documents written: ${e}`)}catch(e){Qi(e)?Vs(eo,"Ignoring IndexedDB error during index backfill: ",e):await ji(e)}await this.re(6e4)})}}class no{constructor(e,t){this.localStore=e,this.persistence=t}async ie(e=50){return this.persistence.runTransaction("Backfill Indexes","readwrite-primary",t=>this.se(t,e))}se(e,t){const n=new Set;let r=t,s=!0;return qi.doWhile(()=>!0===s&&r>0,()=>this.localStore.indexManager.getNextCollectionGroupToUpdate(e).next(t=>{if(null!==t&&!n.has(t))return Vs(eo,`Processing collection: ${t}`),this.oe(e,t,r).next(e=>{r-=e,n.add(t)});s=!1})).next(()=>t-r)}oe(e,t,n){return this.localStore.indexManager.getMinOffsetFromCollectionGroup(e,t).next(r=>this.localStore.localDocuments.getNextDocuments(e,t,r,n).next(n=>{const s=n.changes;return this.localStore.indexManager.updateIndexEntries(e,s).next(()=>this._e(r,n)).next(n=>(Vs(eo,`Updating offset: ${n}`),this.localStore.indexManager.updateCollectionGroup(e,t,n))).next(()=>s.size)}))}_e(e,t){let n=e;return t.changes.forEach((e,t)=>{const r=Mi(t);Vi(r,n)>0&&(n=r)}),new Ui(n.readTime,n.documentKey,Math.max(t.batchId,e.largestBatchId))}}
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ro{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=e=>this.ae(e),this.ue=e=>t.writeSequenceNumber(e))}ae(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ue&&this.ue(e),e}}ro.ce=-1;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const so=-1;function io(e){return null==e}function oo(e){return 0===e&&1/e==-1/0}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ao="";function co(e){let t="";for(let n=0;n<e.length;n++)t.length>0&&(t=ho(t)),t=uo(e.get(n),t);return ho(t)}function uo(e,t){let n=t;const r=e.length;for(let s=0;s<r;s++){const t=e.charAt(s);switch(t){case"\0":n+="";break;case ao:n+="";break;default:n+=t}}return n}function ho(e){return e+ao+""}function lo(e){const t=e.length;if($s(t>=2,64408,{path:e}),2===t)return $s(e.charAt(0)===ao&&""===e.charAt(1),56145,{path:e}),pi.emptyPath();const n=t-2,r=[];let s="";for(let i=0;i<t;){const t=e.indexOf(ao,i);switch((t<0||t>n)&&qs(50515,{path:e}),e.charAt(t+1)){case"":const n=e.substring(i,t);let o;0===s.length?o=n:(s+=n,o=s,s=""),r.push(o);break;case"":s+=e.substring(i,t),s+="\0";break;case"":s+=e.substring(i,t+1);break;default:qs(61167,{path:e})}i=t+2}return new pi(r)}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fo="remoteDocuments",po="owner",mo="owner",go="mutationQueues",yo="mutations",wo="batchId",vo="userMutationsIndex",_o=["userId","batchId"];
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Io(e,t){return[e,co(t)]}function bo(e,t,n){return[e,co(t),n]}const To={},Eo="documentMutations",So="remoteDocumentsV14",Co=["prefixPath","collectionGroup","readTime","documentId"],ko="documentKeyIndex",Ao=["prefixPath","collectionGroup","documentId"],No="collectionGroupIndex",Do=["collectionGroup","readTime","prefixPath","documentId"],Ro="remoteDocumentGlobal",xo="remoteDocumentGlobalKey",Oo="targets",Po="queryTargetsIndex",Lo=["canonicalId","targetId"],Mo="targetDocuments",Uo=["targetId","path"],Vo="documentTargetsIndex",Fo=["path","targetId"],Bo="targetGlobalKey",jo="targetGlobal",qo="collectionParents",zo=["collectionId","parent"],$o="clientMetadata",Ko="bundles",Go="namedQueries",Ho="indexConfiguration",Wo="collectionGroupIndex",Qo="indexState",Jo=["indexId","uid"],Xo="sequenceNumberIndex",Yo=["uid","sequenceNumber"],Zo="indexEntries",ea=["indexId","uid","arrayValue","directionalValue","orderedDocumentKey","documentKey"],ta="documentKeyIndex",na=["indexId","uid","orderedDocumentKey"],ra="documentOverlays",sa=["userId","collectionPath","documentId"],ia="collectionPathOverlayIndex",oa=["userId","collectionPath","largestBatchId"],aa="collectionGroupOverlayIndex",ca=["userId","collectionGroup","largestBatchId"],ua="globals",ha=[go,yo,Eo,fo,Oo,po,jo,Mo,$o,Ro,qo,Ko,Go],la=[...ha,ra],da=[go,yo,Eo,So,Oo,po,jo,Mo,$o,Ro,qo,Ko,Go,ra],fa=da,pa=[...fa,Ho,Qo,Zo],ma=pa,ga=[...pa,ua],ya=ga;
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wa extends Bi{constructor(e,t){super(),this.le=e,this.currentSequenceNumber=t}}function va(e,t){const n=Ks(e);return Ki.O(n.le,t)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _a(e){let t=0;for(const n in e)Object.prototype.hasOwnProperty.call(e,n)&&t++;return t}function Ia(e,t){for(const n in e)Object.prototype.hasOwnProperty.call(e,n)&&t(n,e[n])}function ba(e){for(const t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ta{constructor(e,t){this.comparator=e,this.root=t||Sa.EMPTY}insert(e,t){return new Ta(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Sa.BLACK,null,null))}remove(e){return new Ta(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Sa.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const n=this.comparator(e,t.key);if(0===n)return t.value;n<0?t=t.left:n>0&&(t=t.right)}return null}indexOf(e){let t=0,n=this.root;for(;!n.isEmpty();){const r=this.comparator(e,n.key);if(0===r)return t+n.left.size;r<0?n=n.left:(t+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,n)=>(e(t,n),!1))}toString(){const e=[];return this.inorderTraversal((t,n)=>(e.push(`${t}:${n}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Ea(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Ea(this.root,e,this.comparator,!1)}getReverseIterator(){return new Ea(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Ea(this.root,e,this.comparator,!0)}}class Ea{constructor(e,t,n,r){this.isReverse=r,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=t?n(e.key,t):1,t&&r&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(0===s){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(0===this.nodeStack.length)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Sa{constructor(e,t,n,r,s){this.key=e,this.value=t,this.color=null!=n?n:Sa.RED,this.left=null!=r?r:Sa.EMPTY,this.right=null!=s?s:Sa.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,n,r,s){return new Sa(null!=e?e:this.key,null!=t?t:this.value,null!=n?n:this.color,null!=r?r:this.left,null!=s?s:this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let r=this;const s=n(e,r.key);return r=s<0?r.copy(null,null,null,r.left.insert(e,t,n),null):0===s?r.copy(null,t,null,null,null):r.copy(null,null,null,null,r.right.insert(e,t,n)),r.fixUp()}removeMin(){if(this.left.isEmpty())return Sa.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let n,r=this;if(t(e,r.key)<0)r.left.isEmpty()||r.left.isRed()||r.left.left.isRed()||(r=r.moveRedLeft()),r=r.copy(null,null,null,r.left.remove(e,t),null);else{if(r.left.isRed()&&(r=r.rotateRight()),r.right.isEmpty()||r.right.isRed()||r.right.left.isRed()||(r=r.moveRedRight()),0===t(e,r.key)){if(r.right.isEmpty())return Sa.EMPTY;n=r.right.min(),r=r.copy(n.key,n.value,null,null,r.right.removeMin())}r=r.copy(null,null,null,null,r.right.remove(e,t))}return r.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Sa.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Sa.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw qs(43730,{key:this.key,value:this.value});if(this.right.isRed())throw qs(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw qs(27949);return e+(this.isRed()?0:1)}}Sa.EMPTY=null,Sa.RED=!0,Sa.BLACK=!1,Sa.EMPTY=new class{constructor(){this.size=0}get key(){throw qs(57766)}get value(){throw qs(16141)}get color(){throw qs(16727)}get left(){throw qs(29726)}get right(){throw qs(36894)}copy(e,t,n,r,s){return this}insert(e,t,n){return new Sa(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ca{constructor(e){this.comparator=e,this.data=new Ta(this.comparator)}has(e){return null!==this.data.get(e)}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,n)=>(e(t),!1))}forEachInRange(e,t){const n=this.data.getIteratorFrom(e[0]);for(;n.hasNext();){const r=n.getNext();if(this.comparator(r.key,e[1])>=0)return;t(r.key)}}forEachWhile(e,t){let n;for(n=void 0!==t?this.data.getIteratorFrom(t):this.data.getIterator();n.hasNext();)if(!e(n.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new ka(this.data.getIterator())}getIteratorFrom(e){return new ka(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(e=>{t=t.add(e)}),t}isEqual(e){if(!(e instanceof Ca))return!1;if(this.size!==e.size)return!1;const t=this.data.getIterator(),n=e.data.getIterator();for(;t.hasNext();){const e=t.getNext().key,r=n.getNext().key;if(0!==this.comparator(e,r))return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new Ca(this.comparator);return t.data=e,t}}class ka{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}function Aa(e){return e.hasNext()?e.getNext():void 0}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Na{constructor(e){this.fields=e,e.sort(gi.comparator)}static empty(){return new Na([])}unionWith(e){let t=new Ca(gi.comparator);for(const n of this.fields)t=t.add(n);for(const n of e)t=t.add(n);return new Na(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return hi(this.fields,e.fields,(e,t)=>e.isEqual(t))}}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Da extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ra{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(e){try{return atob(e)}catch(t){throw"undefined"!=typeof DOMException&&t instanceof DOMException?new Da("Invalid base64 string: "+t):t}}(e);return new Ra(t)}static fromUint8Array(e){const t=function(e){let t="";for(let n=0;n<e.length;++n)t+=String.fromCharCode(e[n]);return t}(e);return new Ra(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return e=this.binaryString,btoa(e);var e}toUint8Array(){return function(e){const t=new Uint8Array(e.length);for(let n=0;n<e.length;n++)t[n]=e.charCodeAt(n);return t}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return ii(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Ra.EMPTY_BYTE_STRING=new Ra("");const xa=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Oa(e){if($s(!!e,39018),"string"==typeof e){let t=0;const n=xa.exec(e);if($s(!!n,46558,{timestamp:e}),n[1]){let e=n[1];e=(e+"000000000").substr(0,9),t=Number(e)}const r=new Date(e);return{seconds:Math.floor(r.getTime()/1e3),nanos:t}}return{seconds:Pa(e.seconds),nanos:Pa(e.nanos)}}function Pa(e){return"number"==typeof e?e:"string"==typeof e?Number(e):0}function La(e){return"string"==typeof e?Ra.fromBase64String(e):Ra.fromUint8Array(e)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ma="server_timestamp",Ua="__type__",Va="__previous_value__",Fa="__local_write_time__";function Ba(e){const t=(e?.mapValue?.fields||{})[Ua]?.stringValue;return t===Ma}function ja(e){const t=e.mapValue.fields[Va];return Ba(t)?ja(t):t}function qa(e){const t=Oa(e.mapValue.fields[Fa].timestampValue);return new Ni(t.seconds,t.nanos)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class za{constructor(e,t,n,r,s,i,o,a,c,u){this.databaseId=e,this.appId=t,this.persistenceKey=n,this.host=r,this.ssl=s,this.forceLongPolling=i,this.autoDetectLongPolling=o,this.longPollingOptions=a,this.useFetchStreams=c,this.isUsingEmulator=u}}const $a="(default)";class Ka{constructor(e,t){this.projectId=e,this.database=t||$a}static empty(){return new Ka("","")}get isDefaultDatabase(){return this.database===$a}isEqual(e){return e instanceof Ka&&e.projectId===this.projectId&&e.database===this.database}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ga="__type__",Ha="__max__",Wa={mapValue:{fields:{__type__:{stringValue:Ha}}}},Qa="__vector__",Ja="value",Xa={nullValue:"NULL_VALUE"};function Ya(e){return"nullValue"in e?0:"booleanValue"in e?1:"integerValue"in e||"doubleValue"in e?2:"timestampValue"in e?3:"stringValue"in e?5:"bytesValue"in e?6:"referenceValue"in e?7:"geoPointValue"in e?8:"arrayValue"in e?9:"mapValue"in e?Ba(e)?4:mc(e)?9007199254740991:fc(e)?10:11:qs(28295,{value:e})}function Za(e,t){if(e===t)return!0;const n=Ya(e);if(n!==Ya(t))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return e.booleanValue===t.booleanValue;case 4:return qa(e).isEqual(qa(t));case 3:return function(e,t){if("string"==typeof e.timestampValue&&"string"==typeof t.timestampValue&&e.timestampValue.length===t.timestampValue.length)return e.timestampValue===t.timestampValue;const n=Oa(e.timestampValue),r=Oa(t.timestampValue);return n.seconds===r.seconds&&n.nanos===r.nanos}(e,t);case 5:return e.stringValue===t.stringValue;case 6:return r=t,La(e.bytesValue).isEqual(La(r.bytesValue));case 7:return e.referenceValue===t.referenceValue;case 8:return function(e,t){return Pa(e.geoPointValue.latitude)===Pa(t.geoPointValue.latitude)&&Pa(e.geoPointValue.longitude)===Pa(t.geoPointValue.longitude)}(e,t);case 2:return function(e,t){if("integerValue"in e&&"integerValue"in t)return Pa(e.integerValue)===Pa(t.integerValue);if("doubleValue"in e&&"doubleValue"in t){const n=Pa(e.doubleValue),r=Pa(t.doubleValue);return n===r?oo(n)===oo(r):isNaN(n)&&isNaN(r)}return!1}(e,t);case 9:return hi(e.arrayValue.values||[],t.arrayValue.values||[],Za);case 10:case 11:return function(e,t){const n=e.mapValue.fields||{},r=t.mapValue.fields||{};if(_a(n)!==_a(r))return!1;for(const s in n)if(n.hasOwnProperty(s)&&(void 0===r[s]||!Za(n[s],r[s])))return!1;return!0}(e,t);default:return qs(52216,{left:e})}var r}function ec(e,t){return void 0!==(e.values||[]).find(e=>Za(e,t))}function tc(e,t){if(e===t)return 0;const n=Ya(e),r=Ya(t);if(n!==r)return ii(n,r);switch(n){case 0:case 9007199254740991:return 0;case 1:return ii(e.booleanValue,t.booleanValue);case 2:return function(e,t){const n=Pa(e.integerValue||e.doubleValue),r=Pa(t.integerValue||t.doubleValue);return n<r?-1:n>r?1:n===r?0:isNaN(n)?isNaN(r)?0:-1:1}(e,t);case 3:return nc(e.timestampValue,t.timestampValue);case 4:return nc(qa(e),qa(t));case 5:return oi(e.stringValue,t.stringValue);case 6:return function(e,t){const n=La(e),r=La(t);return n.compareTo(r)}(e.bytesValue,t.bytesValue);case 7:return function(e,t){const n=e.split("/"),r=t.split("/");for(let s=0;s<n.length&&s<r.length;s++){const e=ii(n[s],r[s]);if(0!==e)return e}return ii(n.length,r.length)}(e.referenceValue,t.referenceValue);case 8:return function(e,t){const n=ii(Pa(e.latitude),Pa(t.latitude));return 0!==n?n:ii(Pa(e.longitude),Pa(t.longitude))}(e.geoPointValue,t.geoPointValue);case 9:return rc(e.arrayValue,t.arrayValue);case 10:return function(e,t){const n=e.fields||{},r=t.fields||{},s=n[Ja]?.arrayValue,i=r[Ja]?.arrayValue,o=ii(s?.values?.length||0,i?.values?.length||0);return 0!==o?o:rc(s,i)}(e.mapValue,t.mapValue);case 11:return function(e,t){if(e===Wa.mapValue&&t===Wa.mapValue)return 0;if(e===Wa.mapValue)return 1;if(t===Wa.mapValue)return-1;const n=e.fields||{},r=Object.keys(n),s=t.fields||{},i=Object.keys(s);r.sort(),i.sort();for(let o=0;o<r.length&&o<i.length;++o){const e=oi(r[o],i[o]);if(0!==e)return e;const t=tc(n[r[o]],s[i[o]]);if(0!==t)return t}return ii(r.length,i.length)}(e.mapValue,t.mapValue);default:throw qs(23264,{he:n})}}function nc(e,t){if("string"==typeof e&&"string"==typeof t&&e.length===t.length)return ii(e,t);const n=Oa(e),r=Oa(t),s=ii(n.seconds,r.seconds);return 0!==s?s:ii(n.nanos,r.nanos)}function rc(e,t){const n=e.values||[],r=t.values||[];for(let s=0;s<n.length&&s<r.length;++s){const e=tc(n[s],r[s]);if(e)return e}return ii(n.length,r.length)}function sc(e){return ic(e)}function ic(e){return"nullValue"in e?"null":"booleanValue"in e?""+e.booleanValue:"integerValue"in e?""+e.integerValue:"doubleValue"in e?""+e.doubleValue:"timestampValue"in e?function(e){const t=Oa(e);return`time(${t.seconds},${t.nanos})`}(e.timestampValue):"stringValue"in e?e.stringValue:"bytesValue"in e?La(e.bytesValue).toBase64():"referenceValue"in e?function(e){return yi.fromName(e).toString()}(e.referenceValue):"geoPointValue"in e?function(e){return`geo(${e.latitude},${e.longitude})`}(e.geoPointValue):"arrayValue"in e?function(e){let t="[",n=!0;for(const r of e.values||[])n?n=!1:t+=",",t+=ic(r);return t+"]"}(e.arrayValue):"mapValue"in e?function(e){const t=Object.keys(e.fields||{}).sort();let n="{",r=!0;for(const s of t)r?r=!1:n+=",",n+=`${s}:${ic(e.fields[s])}`;return n+"}"}(e.mapValue):qs(61005,{value:e})}function oc(e){switch(Ya(e)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const t=ja(e);return t?16+oc(t):16;case 5:return 2*e.stringValue.length;case 6:return La(e.bytesValue).approximateByteSize();case 7:return e.referenceValue.length;case 9:return(e.arrayValue.values||[]).reduce((e,t)=>e+oc(t),0);case 10:case 11:return function(e){let t=0;return Ia(e.fields,(e,n)=>{t+=e.length+oc(n)}),t}(e.mapValue);default:throw qs(13486,{value:e})}}function ac(e,t){return{referenceValue:`projects/${e.projectId}/databases/${e.database}/documents/${t.path.canonicalString()}`}}function cc(e){return!!e&&"integerValue"in e}function uc(e){return!!e&&"arrayValue"in e}function hc(e){return!!e&&"nullValue"in e}function lc(e){return!!e&&"doubleValue"in e&&isNaN(Number(e.doubleValue))}function dc(e){return!!e&&"mapValue"in e}function fc(e){const t=(e?.mapValue?.fields||{})[Ga]?.stringValue;return t===Qa}function pc(e){if(e.geoPointValue)return{geoPointValue:{...e.geoPointValue}};if(e.timestampValue&&"object"==typeof e.timestampValue)return{timestampValue:{...e.timestampValue}};if(e.mapValue){const t={mapValue:{fields:{}}};return Ia(e.mapValue.fields,(e,n)=>t.mapValue.fields[e]=pc(n)),t}if(e.arrayValue){const t={arrayValue:{values:[]}};for(let n=0;n<(e.arrayValue.values||[]).length;++n)t.arrayValue.values[n]=pc(e.arrayValue.values[n]);return t}return{...e}}function mc(e){return(((e.mapValue||{}).fields||{}).__type__||{}).stringValue===Ha}const gc={mapValue:{fields:{[Ga]:{stringValue:Qa},[Ja]:{arrayValue:{}}}}};function yc(e){return"nullValue"in e?Xa:"booleanValue"in e?{booleanValue:!1}:"integerValue"in e||"doubleValue"in e?{doubleValue:NaN}:"timestampValue"in e?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"stringValue"in e?{stringValue:""}:"bytesValue"in e?{bytesValue:""}:"referenceValue"in e?ac(Ka.empty(),yi.empty()):"geoPointValue"in e?{geoPointValue:{latitude:-90,longitude:-180}}:"arrayValue"in e?{arrayValue:{}}:"mapValue"in e?fc(e)?gc:{mapValue:{}}:qs(35942,{value:e})}function wc(e){return"nullValue"in e?{booleanValue:!1}:"booleanValue"in e?{doubleValue:NaN}:"integerValue"in e||"doubleValue"in e?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"timestampValue"in e?{stringValue:""}:"stringValue"in e?{bytesValue:""}:"bytesValue"in e?ac(Ka.empty(),yi.empty()):"referenceValue"in e?{geoPointValue:{latitude:-90,longitude:-180}}:"geoPointValue"in e?{arrayValue:{}}:"arrayValue"in e?gc:"mapValue"in e?fc(e)?{mapValue:{}}:Wa:qs(61959,{value:e})}function vc(e,t){const n=tc(e.value,t.value);return 0!==n?n:e.inclusive&&!t.inclusive?-1:!e.inclusive&&t.inclusive?1:0}function _c(e,t){const n=tc(e.value,t.value);return 0!==n?n:e.inclusive&&!t.inclusive?1:!e.inclusive&&t.inclusive?-1:0}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ic{constructor(e){this.value=e}static empty(){return new Ic({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let n=0;n<e.length-1;++n)if(t=(t.mapValue.fields||{})[e.get(n)],!dc(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=pc(t)}setAll(e){let t=gi.emptyPath(),n={},r=[];e.forEach((e,s)=>{if(!t.isImmediateParentOf(s)){const e=this.getFieldsMap(t);this.applyChanges(e,n,r),n={},r=[],t=s.popLast()}e?n[s.lastSegment()]=pc(e):r.push(s.lastSegment())});const s=this.getFieldsMap(t);this.applyChanges(s,n,r)}delete(e){const t=this.field(e.popLast());dc(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return Za(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let n=0;n<e.length;++n){let r=t.mapValue.fields[e.get(n)];dc(r)&&r.mapValue.fields||(r={mapValue:{fields:{}}},t.mapValue.fields[e.get(n)]=r),t=r}return t.mapValue.fields}applyChanges(e,t,n){Ia(t,(t,n)=>e[t]=n);for(const r of n)delete e[r]}clone(){return new Ic(pc(this.value))}}function bc(e){const t=[];return Ia(e.fields,(e,n)=>{const r=new gi([e]);if(dc(n)){const e=bc(n.mapValue).fields;if(0===e.length)t.push(r);else for(const n of e)t.push(r.child(n))}else t.push(r)}),new Na(t)
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}class Tc{constructor(e,t,n,r,s,i,o){this.key=e,this.documentType=t,this.version=n,this.readTime=r,this.createTime=s,this.data=i,this.documentState=o}static newInvalidDocument(e){return new Tc(e,0,Di.min(),Di.min(),Di.min(),Ic.empty(),0)}static newFoundDocument(e,t,n,r){return new Tc(e,1,t,Di.min(),n,r,0)}static newNoDocument(e,t){return new Tc(e,2,t,Di.min(),Di.min(),Ic.empty(),0)}static newUnknownDocument(e,t){return new Tc(e,3,t,Di.min(),Di.min(),Ic.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(Di.min())||2!==this.documentType&&0!==this.documentType||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Ic.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Ic.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=Di.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return 1===this.documentState}get hasCommittedMutations(){return 2===this.documentState}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return 0!==this.documentType}isFoundDocument(){return 1===this.documentType}isNoDocument(){return 2===this.documentType}isUnknownDocument(){return 3===this.documentType}isEqual(e){return e instanceof Tc&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Tc(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ec{constructor(e,t){this.position=e,this.inclusive=t}}function Sc(e,t,n){let r=0;for(let s=0;s<e.position.length;s++){const i=t[s],o=e.position[s];if(r=i.field.isKeyField()?yi.comparator(yi.fromName(o.referenceValue),n.key):tc(o,n.data.field(i.field)),"desc"===i.dir&&(r*=-1),0!==r)break}return r}function Cc(e,t){if(null===e)return null===t;if(null===t)return!1;if(e.inclusive!==t.inclusive||e.position.length!==t.position.length)return!1;for(let n=0;n<e.position.length;n++)if(!Za(e.position[n],t.position[n]))return!1;return!0}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kc{constructor(e,t="asc"){this.field=e,this.dir=t}}function Ac(e,t){return e.dir===t.dir&&e.field.isEqual(t.field)}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nc{}class Dc extends Nc{constructor(e,t,n){super(),this.field=e,this.op=t,this.value=n}static create(e,t,n){return e.isKeyField()?"in"===t||"not-in"===t?this.createKeyFieldInFilter(e,t,n):new Bc(e,t,n):"array-contains"===t?new $c(e,n):"in"===t?new Kc(e,n):"not-in"===t?new Gc(e,n):"array-contains-any"===t?new Hc(e,n):new Dc(e,t,n)}static createKeyFieldInFilter(e,t,n){return"in"===t?new jc(e,n):new qc(e,n)}matches(e){const t=e.data.field(this.field);return"!="===this.op?null!==t&&void 0===t.nullValue&&this.matchesComparison(tc(t,this.value)):null!==t&&Ya(this.value)===Ya(t)&&this.matchesComparison(tc(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return 0===e;case"!=":return 0!==e;case">":return e>0;case">=":return e>=0;default:return qs(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Rc extends Nc{constructor(e,t){super(),this.filters=e,this.op=t,this.Pe=null}static create(e,t){return new Rc(e,t)}matches(e){return xc(this)?void 0===this.filters.find(t=>!t.matches(e)):void 0!==this.filters.find(t=>t.matches(e))}getFlattenedFilters(){return null!==this.Pe||(this.Pe=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}}function xc(e){return"and"===e.op}function Oc(e){return"or"===e.op}function Pc(e){return Lc(e)&&xc(e)}function Lc(e){for(const t of e.filters)if(t instanceof Rc)return!1;return!0}function Mc(e){if(e instanceof Dc)return e.field.canonicalString()+e.op.toString()+sc(e.value);if(Pc(e))return e.filters.map(e=>Mc(e)).join(",");{const t=e.filters.map(e=>Mc(e)).join(",");return`${e.op}(${t})`}}function Uc(e,t){return e instanceof Dc?(n=e,(r=t)instanceof Dc&&n.op===r.op&&n.field.isEqual(r.field)&&Za(n.value,r.value)):e instanceof Rc?function(e,t){return t instanceof Rc&&e.op===t.op&&e.filters.length===t.filters.length&&e.filters.reduce((e,n,r)=>e&&Uc(n,t.filters[r]),!0)}(e,t):void qs(19439);var n,r}function Vc(e,t){const n=e.filters.concat(t);return Rc.create(n,e.op)}function Fc(e){return e instanceof Dc?`${(t=e).field.canonicalString()} ${t.op} ${sc(t.value)}`:e instanceof Rc?function(e){return e.op.toString()+" {"+e.getFilters().map(Fc).join(" ,")+"}"}(e):"Filter";var t}class Bc extends Dc{constructor(e,t,n){super(e,t,n),this.key=yi.fromName(n.referenceValue)}matches(e){const t=yi.comparator(e.key,this.key);return this.matchesComparison(t)}}class jc extends Dc{constructor(e,t){super(e,"in",t),this.keys=zc("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class qc extends Dc{constructor(e,t){super(e,"not-in",t),this.keys=zc("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function zc(e,t){return(t.arrayValue?.values||[]).map(e=>yi.fromName(e.referenceValue))}class $c extends Dc{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return uc(t)&&ec(t.arrayValue,this.value)}}class Kc extends Dc{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return null!==t&&ec(this.value.arrayValue,t)}}class Gc extends Dc{constructor(e,t){super(e,"not-in",t)}matches(e){if(ec(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return null!==t&&void 0===t.nullValue&&!ec(this.value.arrayValue,t)}}class Hc extends Dc{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!uc(t)||!t.arrayValue.values)&&t.arrayValue.values.some(e=>ec(this.value.arrayValue,e))}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wc{constructor(e,t=null,n=[],r=[],s=null,i=null,o=null){this.path=e,this.collectionGroup=t,this.orderBy=n,this.filters=r,this.limit=s,this.startAt=i,this.endAt=o,this.Te=null}}function Qc(e,t=null,n=[],r=[],s=null,i=null,o=null){return new Wc(e,t,n,r,s,i,o)}function Jc(e){const t=Ks(e);if(null===t.Te){let e=t.path.canonicalString();null!==t.collectionGroup&&(e+="|cg:"+t.collectionGroup),e+="|f:",e+=t.filters.map(e=>Mc(e)).join(","),e+="|ob:",e+=t.orderBy.map(e=>{return(t=e).field.canonicalString()+t.dir;var t}).join(","),io(t.limit)||(e+="|l:",e+=t.limit),t.startAt&&(e+="|lb:",e+=t.startAt.inclusive?"b:":"a:",e+=t.startAt.position.map(e=>sc(e)).join(",")),t.endAt&&(e+="|ub:",e+=t.endAt.inclusive?"a:":"b:",e+=t.endAt.position.map(e=>sc(e)).join(",")),t.Te=e}return t.Te}function Xc(e,t){if(e.limit!==t.limit)return!1;if(e.orderBy.length!==t.orderBy.length)return!1;for(let n=0;n<e.orderBy.length;n++)if(!Ac(e.orderBy[n],t.orderBy[n]))return!1;if(e.filters.length!==t.filters.length)return!1;for(let n=0;n<e.filters.length;n++)if(!Uc(e.filters[n],t.filters[n]))return!1;return e.collectionGroup===t.collectionGroup&&!!e.path.isEqual(t.path)&&!!Cc(e.startAt,t.startAt)&&Cc(e.endAt,t.endAt)}function Yc(e){return yi.isDocumentKey(e.path)&&null===e.collectionGroup&&0===e.filters.length}function Zc(e,t){return e.filters.filter(e=>e instanceof Dc&&e.field.isEqual(t))}function eu(e,t,n){let r=Xa,s=!0;for(const i of Zc(e,t)){let e=Xa,t=!0;switch(i.op){case"<":case"<=":e=yc(i.value);break;case"==":case"in":case">=":e=i.value;break;case">":e=i.value,t=!1;break;case"!=":case"not-in":e=Xa}vc({value:r,inclusive:s},{value:e,inclusive:t})<0&&(r=e,s=t)}if(null!==n)for(let i=0;i<e.orderBy.length;++i)if(e.orderBy[i].field.isEqual(t)){const e=n.position[i];vc({value:r,inclusive:s},{value:e,inclusive:n.inclusive})<0&&(r=e,s=n.inclusive);break}return{value:r,inclusive:s}}function tu(e,t,n){let r=Wa,s=!0;for(const i of Zc(e,t)){let e=Wa,t=!0;switch(i.op){case">=":case">":e=wc(i.value),t=!1;break;case"==":case"in":case"<=":e=i.value;break;case"<":e=i.value,t=!1;break;case"!=":case"not-in":e=Wa}_c({value:r,inclusive:s},{value:e,inclusive:t})>0&&(r=e,s=t)}if(null!==n)for(let i=0;i<e.orderBy.length;++i)if(e.orderBy[i].field.isEqual(t)){const e=n.position[i];_c({value:r,inclusive:s},{value:e,inclusive:n.inclusive})>0&&(r=e,s=n.inclusive);break}return{value:r,inclusive:s}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nu{constructor(e,t=null,n=[],r=[],s=null,i="F",o=null,a=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=n,this.filters=r,this.limit=s,this.limitType=i,this.startAt=o,this.endAt=a,this.Ie=null,this.Ee=null,this.de=null,this.startAt,this.endAt}}function ru(e){return new nu(e)}function su(e){return 0===e.filters.length&&null===e.limit&&null==e.startAt&&null==e.endAt&&(0===e.explicitOrderBy.length||1===e.explicitOrderBy.length&&e.explicitOrderBy[0].field.isKeyField())}function iu(e){return null!==e.collectionGroup}function ou(e){const t=Ks(e);if(null===t.Ie){t.Ie=[];const e=new Set;for(const r of t.explicitOrderBy)t.Ie.push(r),e.add(r.field.canonicalString());const n=t.explicitOrderBy.length>0?t.explicitOrderBy[t.explicitOrderBy.length-1].dir:"asc";(function(e){let t=new Ca(gi.comparator);return e.filters.forEach(e=>{e.getFlattenedFilters().forEach(e=>{e.isInequality()&&(t=t.add(e.field))})}),t})(t).forEach(r=>{e.has(r.canonicalString())||r.isKeyField()||t.Ie.push(new kc(r,n))}),e.has(gi.keyField().canonicalString())||t.Ie.push(new kc(gi.keyField(),n))}return t.Ie}function au(e){const t=Ks(e);return t.Ee||(t.Ee=function(e,t){if("F"===e.limitType)return Qc(e.path,e.collectionGroup,t,e.filters,e.limit,e.startAt,e.endAt);{t=t.map(e=>{const t="desc"===e.dir?"asc":"desc";return new kc(e.field,t)});const n=e.endAt?new Ec(e.endAt.position,e.endAt.inclusive):null,r=e.startAt?new Ec(e.startAt.position,e.startAt.inclusive):null;return Qc(e.path,e.collectionGroup,t,e.filters,e.limit,n,r)}}(t,ou(e))),t.Ee}function cu(e,t){const n=e.filters.concat([t]);return new nu(e.path,e.collectionGroup,e.explicitOrderBy.slice(),n,e.limit,e.limitType,e.startAt,e.endAt)}function uu(e,t,n){return new nu(e.path,e.collectionGroup,e.explicitOrderBy.slice(),e.filters.slice(),t,n,e.startAt,e.endAt)}function hu(e,t){return Xc(au(e),au(t))&&e.limitType===t.limitType}function lu(e){return`${Jc(au(e))}|lt:${e.limitType}`}function du(e){return`Query(target=${function(e){let t=e.path.canonicalString();return null!==e.collectionGroup&&(t+=" collectionGroup="+e.collectionGroup),e.filters.length>0&&(t+=`, filters: [${e.filters.map(e=>Fc(e)).join(", ")}]`),io(e.limit)||(t+=", limit: "+e.limit),e.orderBy.length>0&&(t+=`, orderBy: [${e.orderBy.map(e=>{return`${(t=e).field.canonicalString()} (${t.dir})`;var t}).join(", ")}]`),e.startAt&&(t+=", startAt: ",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(e=>sc(e)).join(",")),e.endAt&&(t+=", endAt: ",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(e=>sc(e)).join(",")),`Target(${t})`}(au(e))}; limitType=${e.limitType})`}function fu(e,t){return t.isFoundDocument()&&function(e,t){const n=t.key.path;return null!==e.collectionGroup?t.key.hasCollectionId(e.collectionGroup)&&e.path.isPrefixOf(n):yi.isDocumentKey(e.path)?e.path.isEqual(n):e.path.isImmediateParentOf(n)}(e,t)&&function(e,t){for(const n of ou(e))if(!n.field.isKeyField()&&null===t.data.field(n.field))return!1;return!0}(e,t)&&function(e,t){for(const n of e.filters)if(!n.matches(t))return!1;return!0}(e,t)&&(r=t,!((n=e).startAt&&!function(e,t,n){const r=Sc(e,t,n);return e.inclusive?r<=0:r<0}(n.startAt,ou(n),r)||n.endAt&&!function(e,t,n){const r=Sc(e,t,n);return e.inclusive?r>=0:r>0}(n.endAt,ou(n),r)));var n,r}function pu(e){return(t,n)=>{let r=!1;for(const s of ou(e)){const e=mu(s,t,n);if(0!==e)return e;r=r||s.field.isKeyField()}return 0}}function mu(e,t,n){const r=e.field.isKeyField()?yi.comparator(t.key,n.key):function(e,t,n){const r=t.data.field(e),s=n.data.field(e);return null!==r&&null!==s?tc(r,s):qs(42886)}(e.field,t,n);switch(e.dir){case"asc":return r;case"desc":return-1*r;default:return qs(19790,{direction:e.dir})}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gu{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),n=this.inner[t];if(void 0!==n)for(const[r,s]of n)if(this.equalsFn(r,e))return s}has(e){return void 0!==this.get(e)}set(e,t){const n=this.mapKeyFn(e),r=this.inner[n];if(void 0===r)return this.inner[n]=[[e,t]],void this.innerSize++;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],e))return void(r[s]=[e,t]);r.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),n=this.inner[t];if(void 0===n)return!1;for(let r=0;r<n.length;r++)if(this.equalsFn(n[r][0],e))return 1===n.length?delete this.inner[t]:n.splice(r,1),this.innerSize--,!0;return!1}forEach(e){Ia(this.inner,(t,n)=>{for(const[r,s]of n)e(r,s)})}isEmpty(){return ba(this.inner)}size(){return this.innerSize}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yu=new Ta(yi.comparator);function wu(){return yu}const vu=new Ta(yi.comparator);function _u(...e){let t=vu;for(const n of e)t=t.insert(n.key,n);return t}function Iu(e){let t=vu;return e.forEach((e,n)=>t=t.insert(e,n.overlayedDocument)),t}function bu(){return Eu()}function Tu(){return Eu()}function Eu(){return new gu(e=>e.toString(),(e,t)=>e.isEqual(t))}const Su=new Ta(yi.comparator),Cu=new Ca(yi.comparator);function ku(...e){let t=Cu;for(const n of e)t=t.add(n);return t}const Au=new Ca(ii);
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Nu(e,t){if(e.useProto3Json){if(isNaN(t))return{doubleValue:"NaN"};if(t===1/0)return{doubleValue:"Infinity"};if(t===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:oo(t)?"-0":t}}function Du(e){return{integerValue:""+e}}function Ru(e,t){return function(e){return"number"==typeof e&&Number.isInteger(e)&&!oo(e)&&e<=Number.MAX_SAFE_INTEGER&&e>=Number.MIN_SAFE_INTEGER}(t)?Du(t):Nu(e,t)}
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xu{constructor(){this._=void 0}}function Ou(e,t,n){return e instanceof Mu?function(e,t){const n={fields:{[Ua]:{stringValue:Ma},[Fa]:{timestampValue:{seconds:e.seconds,nanos:e.nanoseconds}}}};return t&&Ba(t)&&(t=ja(t)),t&&(n.fields[Va]=t),{mapValue:n}}(n,t):e instanceof Uu?Vu(e,t):e instanceof Fu?Bu(e,t):function(e,t){const n=Lu(e,t),r=qu(n)+qu(e.Ae);return cc(n)&&cc(e.Ae)?Du(r):Nu(e.serializer,r)}(e,t)}function Pu(e,t,n){return e instanceof Uu?Vu(e,t):e instanceof Fu?Bu(e,t):n}function Lu(e,t){return e instanceof ju?cc(n=t)||(r=n)&&"doubleValue"in r?t:{integerValue:0}:null;var n,r}class Mu extends xu{}class Uu extends xu{constructor(e){super(),this.elements=e}}function Vu(e,t){const n=zu(t);for(const r of e.elements)n.some(e=>Za(e,r))||n.push(r);return{arrayValue:{values:n}}}class Fu extends xu{constructor(e){super(),this.elements=e}}function Bu(e,t){let n=zu(t);for(const r of e.elements)n=n.filter(e=>!Za(e,r));return{arrayValue:{values:n}}}class ju extends xu{constructor(e,t){super(),this.serializer=e,this.Ae=t}}function qu(e){return Pa(e.integerValue||e.doubleValue)}function zu(e){return uc(e)&&e.arrayValue.values?e.arrayValue.values.slice():[]}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $u{constructor(e,t){this.field=e,this.transform=t}}class Ku{constructor(e,t){this.version=e,this.transformResults=t}}class Gu{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new Gu}static exists(e){return new Gu(void 0,e)}static updateTime(e){return new Gu(e)}get isNone(){return void 0===this.updateTime&&void 0===this.exists}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Hu(e,t){return void 0!==e.updateTime?t.isFoundDocument()&&t.version.isEqual(e.updateTime):void 0===e.exists||e.exists===t.isFoundDocument()}class Wu{}function Qu(e,t){if(!e.hasLocalMutations||t&&0===t.fields.length)return null;if(null===t)return e.isNoDocument()?new ih(e.key,Gu.none()):new eh(e.key,e.data,Gu.none());{const n=e.data,r=Ic.empty();let s=new Ca(gi.comparator);for(let e of t.fields)if(!s.has(e)){let t=n.field(e);null===t&&e.length>1&&(e=e.popLast(),t=n.field(e)),null===t?r.delete(e):r.set(e,t),s=s.add(e)}return new th(e.key,r,new Na(s.toArray()),Gu.none())}}function Ju(e,t,n){var r;e instanceof eh?function(e,t,n){const r=e.value.clone(),s=rh(e.fieldTransforms,t,n.transformResults);r.setAll(s),t.convertToFoundDocument(n.version,r).setHasCommittedMutations()}(e,t,n):e instanceof th?function(e,t,n){if(!Hu(e.precondition,t))return void t.convertToUnknownDocument(n.version);const r=rh(e.fieldTransforms,t,n.transformResults),s=t.data;s.setAll(nh(e)),s.setAll(r),t.convertToFoundDocument(n.version,s).setHasCommittedMutations()}(e,t,n):(r=n,t.convertToNoDocument(r.version).setHasCommittedMutations())}function Xu(e,t,n,r){return e instanceof eh?function(e,t,n,r){if(!Hu(e.precondition,t))return n;const s=e.value.clone(),i=sh(e.fieldTransforms,r,t);return s.setAll(i),t.convertToFoundDocument(t.version,s).setHasLocalMutations(),null}(e,t,n,r):e instanceof th?function(e,t,n,r){if(!Hu(e.precondition,t))return n;const s=sh(e.fieldTransforms,r,t),i=t.data;return i.setAll(nh(e)),i.setAll(s),t.convertToFoundDocument(t.version,i).setHasLocalMutations(),null===n?null:n.unionWith(e.fieldMask.fields).unionWith(e.fieldTransforms.map(e=>e.field))}(e,t,n,r):(s=t,i=n,Hu(e.precondition,s)?(s.convertToNoDocument(s.version).setHasLocalMutations(),null):i);var s,i}function Yu(e,t){let n=null;for(const r of e.fieldTransforms){const e=t.data.field(r.field),s=Lu(r.transform,e||null);null!=s&&(null===n&&(n=Ic.empty()),n.set(r.field,s))}return n||null}function Zu(e,t){return e.type===t.type&&!!e.key.isEqual(t.key)&&!!e.precondition.isEqual(t.precondition)&&(n=e.fieldTransforms,r=t.fieldTransforms,!!(void 0===n&&void 0===r||n&&r&&hi(n,r,(e,t)=>function(e,t){return e.field.isEqual(t.field)&&(n=e.transform,r=t.transform,n instanceof Uu&&r instanceof Uu||n instanceof Fu&&r instanceof Fu?hi(n.elements,r.elements,Za):n instanceof ju&&r instanceof ju?Za(n.Ae,r.Ae):n instanceof Mu&&r instanceof Mu);var n,r}(e,t)))&&(0===e.type?e.value.isEqual(t.value):1!==e.type||e.data.isEqual(t.data)&&e.fieldMask.isEqual(t.fieldMask)));var n,r}class eh extends Wu{constructor(e,t,n,r=[]){super(),this.key=e,this.value=t,this.precondition=n,this.fieldTransforms=r,this.type=0}getFieldMask(){return null}}class th extends Wu{constructor(e,t,n,r,s=[]){super(),this.key=e,this.data=t,this.fieldMask=n,this.precondition=r,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}}function nh(e){const t=new Map;return e.fieldMask.fields.forEach(n=>{if(!n.isEmpty()){const r=e.data.field(n);t.set(n,r)}}),t}function rh(e,t,n){const r=new Map;$s(e.length===n.length,32656,{Re:n.length,Ve:e.length});for(let s=0;s<n.length;s++){const i=e[s],o=i.transform,a=t.data.field(i.field);r.set(i.field,Pu(o,a,n[s]))}return r}function sh(e,t,n){const r=new Map;for(const s of e){const e=s.transform,i=n.data.field(s.field);r.set(s.field,Ou(e,i,t))}return r}class ih extends Wu{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class oh extends Wu{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ah{constructor(e,t,n,r){this.batchId=e,this.localWriteTime=t,this.baseMutations=n,this.mutations=r}applyToRemoteDocument(e,t){const n=t.mutationResults;for(let r=0;r<this.mutations.length;r++){const t=this.mutations[r];t.key.isEqual(e.key)&&Ju(t,e,n[r])}}applyToLocalView(e,t){for(const n of this.baseMutations)n.key.isEqual(e.key)&&(t=Xu(n,e,t,this.localWriteTime));for(const n of this.mutations)n.key.isEqual(e.key)&&(t=Xu(n,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const n=Tu();return this.mutations.forEach(r=>{const s=e.get(r.key),i=s.overlayedDocument;let o=this.applyToLocalView(i,s.mutatedFields);o=t.has(r.key)?null:o;const a=Qu(i,o);null!==a&&n.set(r.key,a),i.isValidDocument()||i.convertToNoDocument(Di.min())}),n}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),ku())}isEqual(e){return this.batchId===e.batchId&&hi(this.mutations,e.mutations,(e,t)=>Zu(e,t))&&hi(this.baseMutations,e.baseMutations,(e,t)=>Zu(e,t))}}class ch{constructor(e,t,n,r){this.batch=e,this.commitVersion=t,this.mutationResults=n,this.docVersions=r}static from(e,t,n){$s(e.mutations.length===n.length,58842,{me:e.mutations.length,fe:n.length});let r=function(){return Su}();const s=e.mutations;for(let i=0;i<s.length;i++)r=r.insert(s[i].key,n[i].version);return new ch(e,t,n,r)}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uh{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return null!==e&&this.mutation===e.mutation}toString(){return`Overlay{\n      largestBatchId: ${this.largestBatchId},\n      mutation: ${this.mutation.toString()}\n    }`}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hh{constructor(e,t){this.count=e,this.unchangedNames=t}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var lh,dh;function fh(e){if(void 0===e)return Fs("GRPC error has no .code"),Gs.UNKNOWN;switch(e){case lh.OK:return Gs.OK;case lh.CANCELLED:return Gs.CANCELLED;case lh.UNKNOWN:return Gs.UNKNOWN;case lh.DEADLINE_EXCEEDED:return Gs.DEADLINE_EXCEEDED;case lh.RESOURCE_EXHAUSTED:return Gs.RESOURCE_EXHAUSTED;case lh.INTERNAL:return Gs.INTERNAL;case lh.UNAVAILABLE:return Gs.UNAVAILABLE;case lh.UNAUTHENTICATED:return Gs.UNAUTHENTICATED;case lh.INVALID_ARGUMENT:return Gs.INVALID_ARGUMENT;case lh.NOT_FOUND:return Gs.NOT_FOUND;case lh.ALREADY_EXISTS:return Gs.ALREADY_EXISTS;case lh.PERMISSION_DENIED:return Gs.PERMISSION_DENIED;case lh.FAILED_PRECONDITION:return Gs.FAILED_PRECONDITION;case lh.ABORTED:return Gs.ABORTED;case lh.OUT_OF_RANGE:return Gs.OUT_OF_RANGE;case lh.UNIMPLEMENTED:return Gs.UNIMPLEMENTED;case lh.DATA_LOSS:return Gs.DATA_LOSS;default:return qs(39323,{code:e})}}(dh=lh||(lh={}))[dh.OK=0]="OK",dh[dh.CANCELLED=1]="CANCELLED",dh[dh.UNKNOWN=2]="UNKNOWN",dh[dh.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",dh[dh.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",dh[dh.NOT_FOUND=5]="NOT_FOUND",dh[dh.ALREADY_EXISTS=6]="ALREADY_EXISTS",dh[dh.PERMISSION_DENIED=7]="PERMISSION_DENIED",dh[dh.UNAUTHENTICATED=16]="UNAUTHENTICATED",dh[dh.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",dh[dh.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",dh[dh.ABORTED=10]="ABORTED",dh[dh.OUT_OF_RANGE=11]="OUT_OF_RANGE",dh[dh.UNIMPLEMENTED=12]="UNIMPLEMENTED",dh[dh.INTERNAL=13]="INTERNAL",dh[dh.UNAVAILABLE=14]="UNAVAILABLE",dh[dh.DATA_LOSS=15]="DATA_LOSS";
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ph=new _s([4294967295,4294967295],0);function mh(e){const t=(new TextEncoder).encode(e),n=new Is;return n.update(t),new Uint8Array(n.digest())}function gh(e){const t=new DataView(e.buffer),n=t.getUint32(0,!0),r=t.getUint32(4,!0),s=t.getUint32(8,!0),i=t.getUint32(12,!0);return[new _s([n,r],0),new _s([s,i],0)]}class yh{constructor(e,t,n){if(this.bitmap=e,this.padding=t,this.hashCount=n,t<0||t>=8)throw new wh(`Invalid padding: ${t}`);if(n<0)throw new wh(`Invalid hash count: ${n}`);if(e.length>0&&0===this.hashCount)throw new wh(`Invalid hash count: ${n}`);if(0===e.length&&0!==t)throw new wh(`Invalid padding when bitmap length is 0: ${t}`);this.ge=8*e.length-t,this.pe=_s.fromNumber(this.ge)}ye(e,t,n){let r=e.add(t.multiply(_s.fromNumber(n)));return 1===r.compare(ph)&&(r=new _s([r.getBits(0),r.getBits(1)],0)),r.modulo(this.pe).toNumber()}we(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(0===this.ge)return!1;const t=mh(e),[n,r]=gh(t);for(let s=0;s<this.hashCount;s++){const e=this.ye(n,r,s);if(!this.we(e))return!1}return!0}static create(e,t,n){const r=e%8==0?0:8-e%8,s=new Uint8Array(Math.ceil(e/8)),i=new yh(s,r,t);return n.forEach(e=>i.insert(e)),i}insert(e){if(0===this.ge)return;const t=mh(e),[n,r]=gh(t);for(let s=0;s<this.hashCount;s++){const e=this.ye(n,r,s);this.Se(e)}}Se(e){const t=Math.floor(e/8),n=e%8;this.bitmap[t]|=1<<n}}class wh extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vh{constructor(e,t,n,r,s){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=n,this.documentUpdates=r,this.resolvedLimboDocuments=s}static createSynthesizedRemoteEventForCurrentChange(e,t,n){const r=new Map;return r.set(e,_h.createSynthesizedTargetChangeForCurrentChange(e,t,n)),new vh(Di.min(),r,new Ta(ii),wu(),ku())}}class _h{constructor(e,t,n,r,s){this.resumeToken=e,this.current=t,this.addedDocuments=n,this.modifiedDocuments=r,this.removedDocuments=s}static createSynthesizedTargetChangeForCurrentChange(e,t,n){return new _h(n,t,ku(),ku(),ku())}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ih{constructor(e,t,n,r){this.be=e,this.removedTargetIds=t,this.key=n,this.De=r}}class bh{constructor(e,t){this.targetId=e,this.Ce=t}}class Th{constructor(e,t,n=Ra.EMPTY_BYTE_STRING,r=null){this.state=e,this.targetIds=t,this.resumeToken=n,this.cause=r}}class Eh{constructor(){this.ve=0,this.Fe=kh(),this.Me=Ra.EMPTY_BYTE_STRING,this.xe=!1,this.Oe=!0}get current(){return this.xe}get resumeToken(){return this.Me}get Ne(){return 0!==this.ve}get Be(){return this.Oe}Le(e){e.approximateByteSize()>0&&(this.Oe=!0,this.Me=e)}ke(){let e=ku(),t=ku(),n=ku();return this.Fe.forEach((r,s)=>{switch(s){case 0:e=e.add(r);break;case 2:t=t.add(r);break;case 1:n=n.add(r);break;default:qs(38017,{changeType:s})}}),new _h(this.Me,this.xe,e,t,n)}qe(){this.Oe=!1,this.Fe=kh()}Qe(e,t){this.Oe=!0,this.Fe=this.Fe.insert(e,t)}$e(e){this.Oe=!0,this.Fe=this.Fe.remove(e)}Ue(){this.ve+=1}Ke(){this.ve-=1,$s(this.ve>=0,3241,{ve:this.ve})}We(){this.Oe=!0,this.xe=!0}}class Sh{constructor(e){this.Ge=e,this.ze=new Map,this.je=wu(),this.Je=Ch(),this.He=Ch(),this.Ye=new Ta(ii)}Ze(e){for(const t of e.be)e.De&&e.De.isFoundDocument()?this.Xe(t,e.De):this.et(t,e.key,e.De);for(const t of e.removedTargetIds)this.et(t,e.key,e.De)}tt(e){this.forEachTarget(e,t=>{const n=this.nt(t);switch(e.state){case 0:this.rt(t)&&n.Le(e.resumeToken);break;case 1:n.Ke(),n.Ne||n.qe(),n.Le(e.resumeToken);break;case 2:n.Ke(),n.Ne||this.removeTarget(t);break;case 3:this.rt(t)&&(n.We(),n.Le(e.resumeToken));break;case 4:this.rt(t)&&(this.it(t),n.Le(e.resumeToken));break;default:qs(56790,{state:e.state})}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.ze.forEach((e,n)=>{this.rt(n)&&t(n)})}st(e){const t=e.targetId,n=e.Ce.count,r=this.ot(t);if(r){const s=r.target;if(Yc(s))if(0===n){const e=new yi(s.path);this.et(t,e,Tc.newNoDocument(e,Di.min()))}else $s(1===n,20013,{expectedCount:n});else{const r=this._t(t);if(r!==n){const n=this.ut(e),s=n?this.ct(n,e,r):1;if(0!==s){this.it(t);const e=2===s?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ye=this.Ye.insert(t,e)}}}}}ut(e){const t=e.Ce.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:n="",padding:r=0},hashCount:s=0}=t;let i,o;try{i=La(n).toUint8Array()}catch(a){if(a instanceof Da)return Bs("Decoding the base64 bloom filter in existence filter failed ("+a.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw a}try{o=new yh(i,r,s)}catch(a){return Bs(a instanceof wh?"BloomFilter error: ":"Applying bloom filter failed: ",a),null}return 0===o.ge?null:o}ct(e,t,n){return t.Ce.count===n-this.Pt(e,t.targetId)?0:2}Pt(e,t){const n=this.Ge.getRemoteKeysForTarget(t);let r=0;return n.forEach(n=>{const s=this.Ge.ht(),i=`projects/${s.projectId}/databases/${s.database}/documents/${n.path.canonicalString()}`;e.mightContain(i)||(this.et(t,n,null),r++)}),r}Tt(e){const t=new Map;this.ze.forEach((n,r)=>{const s=this.ot(r);if(s){if(n.current&&Yc(s.target)){const t=new yi(s.target.path);this.It(t).has(r)||this.Et(r,t)||this.et(r,t,Tc.newNoDocument(t,e))}n.Be&&(t.set(r,n.ke()),n.qe())}});let n=ku();this.He.forEach((e,t)=>{let r=!0;t.forEachWhile(e=>{const t=this.ot(e);return!t||"TargetPurposeLimboResolution"===t.purpose||(r=!1,!1)}),r&&(n=n.add(e))}),this.je.forEach((t,n)=>n.setReadTime(e));const r=new vh(e,t,this.Ye,this.je,n);return this.je=wu(),this.Je=Ch(),this.He=Ch(),this.Ye=new Ta(ii),r}Xe(e,t){if(!this.rt(e))return;const n=this.Et(e,t.key)?2:0;this.nt(e).Qe(t.key,n),this.je=this.je.insert(t.key,t),this.Je=this.Je.insert(t.key,this.It(t.key).add(e)),this.He=this.He.insert(t.key,this.dt(t.key).add(e))}et(e,t,n){if(!this.rt(e))return;const r=this.nt(e);this.Et(e,t)?r.Qe(t,1):r.$e(t),this.He=this.He.insert(t,this.dt(t).delete(e)),this.He=this.He.insert(t,this.dt(t).add(e)),n&&(this.je=this.je.insert(t,n))}removeTarget(e){this.ze.delete(e)}_t(e){const t=this.nt(e).ke();return this.Ge.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}Ue(e){this.nt(e).Ue()}nt(e){let t=this.ze.get(e);return t||(t=new Eh,this.ze.set(e,t)),t}dt(e){let t=this.He.get(e);return t||(t=new Ca(ii),this.He=this.He.insert(e,t)),t}It(e){let t=this.Je.get(e);return t||(t=new Ca(ii),this.Je=this.Je.insert(e,t)),t}rt(e){const t=null!==this.ot(e);return t||Vs("WatchChangeAggregator","Detected inactive target",e),t}ot(e){const t=this.ze.get(e);return t&&t.Ne?null:this.Ge.At(e)}it(e){this.ze.set(e,new Eh),this.Ge.getRemoteKeysForTarget(e).forEach(t=>{this.et(e,t,null)})}Et(e,t){return this.Ge.getRemoteKeysForTarget(e).has(t)}}function Ch(){return new Ta(yi.comparator)}function kh(){return new Ta(yi.comparator)}const Ah=(()=>({asc:"ASCENDING",desc:"DESCENDING"}))(),Nh=(()=>({"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"}))(),Dh=(()=>({and:"AND",or:"OR"}))();class Rh{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function xh(e,t){return e.useProto3Json||io(t)?t:{value:t}}function Oh(e,t){return e.useProto3Json?`${new Date(1e3*t.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+t.nanoseconds).slice(-9)}Z`:{seconds:""+t.seconds,nanos:t.nanoseconds}}function Ph(e,t){return e.useProto3Json?t.toBase64():t.toUint8Array()}function Lh(e,t){return Oh(e,t.toTimestamp())}function Mh(e){return $s(!!e,49232),Di.fromTimestamp(function(e){const t=Oa(e);return new Ni(t.seconds,t.nanos)}(e))}function Uh(e,t){return Vh(e,t).canonicalString()}function Vh(e,t){const n=(r=e,new pi(["projects",r.projectId,"databases",r.database])).child("documents");var r;return void 0===t?n:n.child(t)}function Fh(e){const t=pi.fromString(e);return $s(ol(t),10190,{key:t.toString()}),t}function Bh(e,t){return Uh(e.databaseId,t.path)}function jh(e,t){const n=Fh(t);if(n.get(1)!==e.databaseId.projectId)throw new Hs(Gs.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+e.databaseId.projectId);if(n.get(3)!==e.databaseId.database)throw new Hs(Gs.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+e.databaseId.database);return new yi(Kh(n))}function qh(e,t){return Uh(e.databaseId,t)}function zh(e){const t=Fh(e);return 4===t.length?pi.emptyPath():Kh(t)}function $h(e){return new pi(["projects",e.databaseId.projectId,"databases",e.databaseId.database]).canonicalString()}function Kh(e){return $s(e.length>4&&"documents"===e.get(4),29091,{key:e.toString()}),e.popFirst(5)}function Gh(e,t,n){return{name:Bh(e,t),fields:n.value.mapValue.fields}}function Hh(e,t){let n;if(t instanceof eh)n={update:Gh(e,t.key,t.value)};else if(t instanceof ih)n={delete:Bh(e,t.key)};else if(t instanceof th)n={update:Gh(e,t.key,t.data),updateMask:il(t.fieldMask)};else{if(!(t instanceof oh))return qs(16599,{Vt:t.type});n={verify:Bh(e,t.key)}}return t.fieldTransforms.length>0&&(n.updateTransforms=t.fieldTransforms.map(e=>function(e,t){const n=t.transform;if(n instanceof Mu)return{fieldPath:t.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(n instanceof Uu)return{fieldPath:t.field.canonicalString(),appendMissingElements:{values:n.elements}};if(n instanceof Fu)return{fieldPath:t.field.canonicalString(),removeAllFromArray:{values:n.elements}};if(n instanceof ju)return{fieldPath:t.field.canonicalString(),increment:n.Ae};throw qs(20930,{transform:t.transform})}(0,e))),t.precondition.isNone||(n.currentDocument=(r=e,void 0!==(s=t.precondition).updateTime?{updateTime:Lh(r,s.updateTime)}:void 0!==s.exists?{exists:s.exists}:qs(27497))),n;var r,s}function Wh(e,t){const n=t.currentDocument?void 0!==(s=t.currentDocument).updateTime?Gu.updateTime(Mh(s.updateTime)):void 0!==s.exists?Gu.exists(s.exists):Gu.none():Gu.none(),r=t.updateTransforms?t.updateTransforms.map(t=>function(e,t){let n=null;if("setToServerValue"in t)$s("REQUEST_TIME"===t.setToServerValue,16630,{proto:t}),n=new Mu;else if("appendMissingElements"in t){const e=t.appendMissingElements.values||[];n=new Uu(e)}else if("removeAllFromArray"in t){const e=t.removeAllFromArray.values||[];n=new Fu(e)}else"increment"in t?n=new ju(e,t.increment):qs(16584,{proto:t});const r=gi.fromServerFormat(t.fieldPath);return new $u(r,n)}(e,t)):[];var s;if(t.update){t.update.name;const s=jh(e,t.update.name),i=new Ic({mapValue:{fields:t.update.fields}});if(t.updateMask){const e=function(e){const t=e.fieldPaths||[];return new Na(t.map(e=>gi.fromServerFormat(e)))}(t.updateMask);return new th(s,i,e,n,r)}return new eh(s,i,n,r)}if(t.delete){const r=jh(e,t.delete);return new ih(r,n)}if(t.verify){const r=jh(e,t.verify);return new oh(r,n)}return qs(1463,{proto:t})}function Qh(e,t){return{documents:[qh(e,t.path)]}}function Jh(e,t){const n={structuredQuery:{}},r=t.path;let s;null!==t.collectionGroup?(s=r,n.structuredQuery.from=[{collectionId:t.collectionGroup,allDescendants:!0}]):(s=r.popLast(),n.structuredQuery.from=[{collectionId:r.lastSegment()}]),n.parent=qh(e,s);const i=function(e){if(0!==e.length)return sl(Rc.create(e,"and"))}(t.filters);i&&(n.structuredQuery.where=i);const o=function(e){if(0!==e.length)return e.map(e=>{return{field:nl((t=e).field),direction:Zh(t.dir)};var t})}(t.orderBy);o&&(n.structuredQuery.orderBy=o);const a=xh(e,t.limit);return null!==a&&(n.structuredQuery.limit=a),t.startAt&&(n.structuredQuery.startAt={before:(c=t.startAt).inclusive,values:c.position}),t.endAt&&(n.structuredQuery.endAt=function(e){return{before:!e.inclusive,values:e.position}}(t.endAt)),{ft:n,parent:s};var c}function Xh(e){let t=zh(e.parent);const n=e.structuredQuery,r=n.from?n.from.length:0;let s=null;if(r>0){$s(1===r,65062);const e=n.from[0];e.allDescendants?s=e.collectionId:t=t.child(e.collectionId)}let i=[];n.where&&(i=function(e){const t=Yh(e);return t instanceof Rc&&Pc(t)?t.getFilters():[t]}(n.where));let o=[];n.orderBy&&(o=n.orderBy.map(e=>{return new kc(rl((t=e).field),function(e){switch(e){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(t.direction));var t}));let a=null;n.limit&&(a=function(e){let t;return t="object"==typeof e?e.value:e,io(t)?null:t}(n.limit));let c=null;n.startAt&&(c=function(e){const t=!!e.before,n=e.values||[];return new Ec(n,t)}(n.startAt));let u=null;return n.endAt&&(u=function(e){const t=!e.before,n=e.values||[];return new Ec(n,t)}(n.endAt)),function(e,t,n,r,s,i,o,a){return new nu(e,t,n,r,s,i,o,a)}(t,s,o,i,a,"F",c,u)}function Yh(e){return void 0!==e.unaryFilter?function(e){switch(e.unaryFilter.op){case"IS_NAN":const t=rl(e.unaryFilter.field);return Dc.create(t,"==",{doubleValue:NaN});case"IS_NULL":const n=rl(e.unaryFilter.field);return Dc.create(n,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const r=rl(e.unaryFilter.field);return Dc.create(r,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const s=rl(e.unaryFilter.field);return Dc.create(s,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return qs(61313);default:return qs(60726)}}(e):void 0!==e.fieldFilter?(t=e,Dc.create(rl(t.fieldFilter.field),function(e){switch(e){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return qs(58110);default:return qs(50506)}}(t.fieldFilter.op),t.fieldFilter.value)):void 0!==e.compositeFilter?function(e){return Rc.create(e.compositeFilter.filters.map(e=>Yh(e)),function(e){switch(e){case"AND":return"and";case"OR":return"or";default:return qs(1026)}}(e.compositeFilter.op))}(e):qs(30097,{filter:e});var t}function Zh(e){return Ah[e]}function el(e){return Nh[e]}function tl(e){return Dh[e]}function nl(e){return{fieldPath:e.canonicalString()}}function rl(e){return gi.fromServerFormat(e.fieldPath)}function sl(e){return e instanceof Dc?function(e){if("=="===e.op){if(lc(e.value))return{unaryFilter:{field:nl(e.field),op:"IS_NAN"}};if(hc(e.value))return{unaryFilter:{field:nl(e.field),op:"IS_NULL"}}}else if("!="===e.op){if(lc(e.value))return{unaryFilter:{field:nl(e.field),op:"IS_NOT_NAN"}};if(hc(e.value))return{unaryFilter:{field:nl(e.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:nl(e.field),op:el(e.op),value:e.value}}}(e):e instanceof Rc?function(e){const t=e.getFilters().map(e=>sl(e));return 1===t.length?t[0]:{compositeFilter:{op:tl(e.op),filters:t}}}(e):qs(54877,{filter:e})}function il(e){const t=[];return e.fields.forEach(e=>t.push(e.canonicalString())),{fieldPaths:t}}function ol(e){return e.length>=4&&"projects"===e.get(0)&&"databases"===e.get(2)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class al{constructor(e,t,n,r,s=Di.min(),i=Di.min(),o=Ra.EMPTY_BYTE_STRING,a=null){this.target=e,this.targetId=t,this.purpose=n,this.sequenceNumber=r,this.snapshotVersion=s,this.lastLimboFreeSnapshotVersion=i,this.resumeToken=o,this.expectedCount=a}withSequenceNumber(e){return new al(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new al(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new al(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new al(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cl{constructor(e){this.yt=e}}function ul(e,t){let n;if(t.document)n=function(e,t,n){const r=jh(e,t.name),s=Mh(t.updateTime),i=t.createTime?Mh(t.createTime):Di.min(),o=new Ic({mapValue:{fields:t.fields}}),a=Tc.newFoundDocument(r,s,i,o);return n&&a.setHasCommittedMutations(),n?a.setHasCommittedMutations():a}(e.yt,t.document,!!t.hasCommittedMutations);else if(t.noDocument){const e=yi.fromSegments(t.noDocument.path),r=fl(t.noDocument.readTime);n=Tc.newNoDocument(e,r),t.hasCommittedMutations&&n.setHasCommittedMutations()}else{if(!t.unknownDocument)return qs(56709);{const e=yi.fromSegments(t.unknownDocument.path),r=fl(t.unknownDocument.version);n=Tc.newUnknownDocument(e,r)}}return t.readTime&&n.setReadTime(function(e){const t=new Ni(e[0],e[1]);return Di.fromTimestamp(t)}(t.readTime)),n}function hl(e,t){const n=t.key,r={prefixPath:n.getCollectionPath().popLast().toArray(),collectionGroup:n.collectionGroup,documentId:n.path.lastSegment(),readTime:ll(t.readTime),hasCommittedMutations:t.hasCommittedMutations};if(t.isFoundDocument())r.document={name:Bh(s=e.yt,(i=t).key),fields:i.data.value.mapValue.fields,updateTime:Oh(s,i.version.toTimestamp()),createTime:Oh(s,i.createTime.toTimestamp())};else if(t.isNoDocument())r.noDocument={path:n.path.toArray(),readTime:dl(t.version)};else{if(!t.isUnknownDocument())return qs(57904,{document:t});r.unknownDocument={path:n.path.toArray(),version:dl(t.version)}}var s,i;return r}function ll(e){const t=e.toTimestamp();return[t.seconds,t.nanoseconds]}function dl(e){const t=e.toTimestamp();return{seconds:t.seconds,nanoseconds:t.nanoseconds}}function fl(e){const t=new Ni(e.seconds,e.nanoseconds);return Di.fromTimestamp(t)}function pl(e,t){const n=(t.baseMutations||[]).map(t=>Wh(e.yt,t));for(let i=0;i<t.mutations.length-1;++i){const e=t.mutations[i];if(i+1<t.mutations.length&&void 0!==t.mutations[i+1].transform){const n=t.mutations[i+1];e.updateTransforms=n.transform.fieldTransforms,t.mutations.splice(i+1,1),++i}}const r=t.mutations.map(t=>Wh(e.yt,t)),s=Ni.fromMillis(t.localWriteTimeMs);return new ah(t.batchId,s,n,r)}function ml(e){const t=fl(e.readTime),n=void 0!==e.lastLimboFreeSnapshotVersion?fl(e.lastLimboFreeSnapshotVersion):Di.min();let r;return r=void 0!==e.query.documents?function(e){const t=e.documents.length;return $s(1===t,1966,{count:t}),au(ru(zh(e.documents[0])))}(e.query):function(e){return au(Xh(e))}(e.query),new al(r,e.targetId,"TargetPurposeListen",e.lastListenSequenceNumber,t,n,Ra.fromBase64String(e.resumeToken))}function gl(e,t){const n=dl(t.snapshotVersion),r=dl(t.lastLimboFreeSnapshotVersion);let s;s=Yc(t.target)?Qh(e.yt,t.target):Jh(e.yt,t.target).ft;const i=t.resumeToken.toBase64();return{targetId:t.targetId,canonicalId:Jc(t.target),readTime:n,resumeToken:i,lastListenSequenceNumber:t.sequenceNumber,lastLimboFreeSnapshotVersion:r,query:s}}function yl(e){const t=Xh({parent:e.parent,structuredQuery:e.structuredQuery});return"LAST"===e.limitType?uu(t,t.limit,"L"):t}function wl(e,t){return new uh(t.largestBatchId,Wh(e.yt,t.overlayMutation))}function vl(e,t){const n=t.path.lastSegment();return[e,co(t.path.popLast()),n]}function _l(e,t,n,r){return{indexId:e,uid:t,sequenceNumber:n,readTime:dl(r.readTime),documentKey:co(r.documentKey.path),largestBatchId:r.largestBatchId}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Il{getBundleMetadata(e,t){return bl(e).get(t).next(e=>{if(e)return{id:(t=e).bundleId,createTime:fl(t.createTime),version:t.version};var t})}saveBundleMetadata(e,t){return bl(e).put({bundleId:(n=t).id,createTime:dl(Mh(n.createTime)),version:n.version});var n}getNamedQuery(e,t){return Tl(e).get(t).next(e=>{if(e)return{name:(t=e).name,query:yl(t.bundledQuery),readTime:fl(t.readTime)};var t})}saveNamedQuery(e,t){return Tl(e).put({name:(n=t).name,readTime:dl(Mh(n.readTime)),bundledQuery:n.bundledQuery});var n}}function bl(e){return va(e,Ko)}function Tl(e){return va(e,Go)}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class El{constructor(e,t){this.serializer=e,this.userId=t}static wt(e,t){const n=t.uid||"";return new El(e,n)}getOverlay(e,t){return Sl(e).get(vl(this.userId,t)).next(e=>e?wl(this.serializer,e):null)}getOverlays(e,t){const n=bu();return qi.forEach(t,t=>this.getOverlay(e,t).next(e=>{null!==e&&n.set(t,e)})).next(()=>n)}saveOverlays(e,t,n){const r=[];return n.forEach((n,s)=>{const i=new uh(t,s);r.push(this.St(e,i))}),qi.waitFor(r)}removeOverlaysForBatchId(e,t,n){const r=new Set;t.forEach(e=>r.add(co(e.getCollectionPath())));const s=[];return r.forEach(t=>{const r=IDBKeyRange.bound([this.userId,t,n],[this.userId,t,n+1],!1,!0);s.push(Sl(e).Z(ia,r))}),qi.waitFor(s)}getOverlaysForCollection(e,t,n){const r=bu(),s=co(t),i=IDBKeyRange.bound([this.userId,s,n],[this.userId,s,Number.POSITIVE_INFINITY],!0);return Sl(e).J(ia,i).next(e=>{for(const t of e){const e=wl(this.serializer,t);r.set(e.getKey(),e)}return r})}getOverlaysForCollectionGroup(e,t,n,r){const s=bu();let i;const o=IDBKeyRange.bound([this.userId,t,n],[this.userId,t,Number.POSITIVE_INFINITY],!0);return Sl(e).ee({index:aa,range:o},(e,t,n)=>{const o=wl(this.serializer,t);s.size()<r||o.largestBatchId===i?(s.set(o.getKey(),o),i=o.largestBatchId):n.done()}).next(()=>s)}St(e,t){return Sl(e).put(function(e,t,n){const[r,s,i]=vl(t,n.mutation.key);return{userId:t,collectionPath:s,documentId:i,collectionGroup:n.mutation.key.getCollectionGroup(),largestBatchId:n.largestBatchId,overlayMutation:Hh(e.yt,n.mutation)}}(this.serializer,this.userId,t))}}function Sl(e){return va(e,ra)}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cl{bt(e){return va(e,ua)}getSessionToken(e){return this.bt(e).get("sessionToken").next(e=>{const t=e?.value;return t?Ra.fromUint8Array(t):Ra.EMPTY_BYTE_STRING})}setSessionToken(e,t){return this.bt(e).put({name:"sessionToken",value:t.toUint8Array()})}}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kl{constructor(){}Dt(e,t){this.Ct(e,t),t.vt()}Ct(e,t){if("nullValue"in e)this.Ft(t,5);else if("booleanValue"in e)this.Ft(t,10),t.Mt(e.booleanValue?1:0);else if("integerValue"in e)this.Ft(t,15),t.Mt(Pa(e.integerValue));else if("doubleValue"in e){const n=Pa(e.doubleValue);isNaN(n)?this.Ft(t,13):(this.Ft(t,15),oo(n)?t.Mt(0):t.Mt(n))}else if("timestampValue"in e){let n=e.timestampValue;this.Ft(t,20),"string"==typeof n&&(n=Oa(n)),t.xt(`${n.seconds||""}`),t.Mt(n.nanos||0)}else if("stringValue"in e)this.Ot(e.stringValue,t),this.Nt(t);else if("bytesValue"in e)this.Ft(t,30),t.Bt(La(e.bytesValue)),this.Nt(t);else if("referenceValue"in e)this.Lt(e.referenceValue,t);else if("geoPointValue"in e){const n=e.geoPointValue;this.Ft(t,45),t.Mt(n.latitude||0),t.Mt(n.longitude||0)}else"mapValue"in e?mc(e)?this.Ft(t,Number.MAX_SAFE_INTEGER):fc(e)?this.kt(e.mapValue,t):(this.qt(e.mapValue,t),this.Nt(t)):"arrayValue"in e?(this.Qt(e.arrayValue,t),this.Nt(t)):qs(19022,{$t:e})}Ot(e,t){this.Ft(t,25),this.Ut(e,t)}Ut(e,t){t.xt(e)}qt(e,t){const n=e.fields||{};this.Ft(t,55);for(const r of Object.keys(n))this.Ot(r,t),this.Ct(n[r],t)}kt(e,t){const n=e.fields||{};this.Ft(t,53);const r=Ja,s=n[r].arrayValue?.values?.length||0;this.Ft(t,15),t.Mt(Pa(s)),this.Ot(r,t),this.Ct(n[r],t)}Qt(e,t){const n=e.values||[];this.Ft(t,50);for(const r of n)this.Ct(r,t)}Lt(e,t){this.Ft(t,37),yi.fromName(e).path.forEach(e=>{this.Ft(t,60),this.Ut(e,t)})}Ft(e,t){e.Mt(t)}Nt(e){e.Mt(2)}}kl.Kt=new kl;
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law | agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES | CONDITIONS OF ANY KIND, either express | implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Al=255;function Nl(e){if(0===e)return 8;let t=0;return e>>4||(t+=4,e<<=4),e>>6||(t+=2,e<<=2),e>>7||(t+=1),t}function Dl(e){const t=64-function(e){let t=0;for(let n=0;n<8;++n){const r=Nl(255&e[n]);if(t+=r,8!==r)break}return t}(e);return Math.ceil(t/8)}class Rl{constructor(){this.buffer=new Uint8Array(1024),this.position=0}Wt(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.Gt(n.value),n=t.next();this.zt()}jt(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.Jt(n.value),n=t.next();this.Ht()}Yt(e){for(const t of e){const e=t.charCodeAt(0);if(e<128)this.Gt(e);else if(e<2048)this.Gt(960|e>>>6),this.Gt(128|63&e);else if(t<"\ud800"||"\udbff"<t)this.Gt(480|e>>>12),this.Gt(128|63&e>>>6),this.Gt(128|63&e);else{const e=t.codePointAt(0);this.Gt(240|e>>>18),this.Gt(128|63&e>>>12),this.Gt(128|63&e>>>6),this.Gt(128|63&e)}}this.zt()}Zt(e){for(const t of e){const e=t.charCodeAt(0);if(e<128)this.Jt(e);else if(e<2048)this.Jt(960|e>>>6),this.Jt(128|63&e);else if(t<"\ud800"||"\udbff"<t)this.Jt(480|e>>>12),this.Jt(128|63&e>>>6),this.Jt(128|63&e);else{const e=t.codePointAt(0);this.Jt(240|e>>>18),this.Jt(128|63&e>>>12),this.Jt(128|63&e>>>6),this.Jt(128|63&e)}}this.Ht()}Xt(e){const t=this.en(e),n=Dl(t);this.tn(1+n),this.buffer[this.position++]=255&n;for(let r=t.length-n;r<t.length;++r)this.buffer[this.position++]=255&t[r]}nn(e){const t=this.en(e),n=Dl(t);this.tn(1+n),this.buffer[this.position++]=~(255&n);for(let r=t.length-n;r<t.length;++r)this.buffer[this.position++]=~(255&t[r])}rn(){this.sn(Al),this.sn(255)}_n(){this.an(Al),this.an(255)}reset(){this.position=0}seed(e){this.tn(e.length),this.buffer.set(e,this.position),this.position+=e.length}un(){return this.buffer.slice(0,this.position)}en(e){const t=function(e){const t=new DataView(new ArrayBuffer(8));return t.setFloat64(0,e,!1),new Uint8Array(t.buffer)}(e),n=!!(128&t[0]);t[0]^=n?255:128;for(let r=1;r<t.length;++r)t[r]^=n?255:0;return t}Gt(e){const t=255&e;0===t?(this.sn(0),this.sn(255)):t===Al?(this.sn(Al),this.sn(0)):this.sn(t)}Jt(e){const t=255&e;0===t?(this.an(0),this.an(255)):t===Al?(this.an(Al),this.an(0)):this.an(e)}zt(){this.sn(0),this.sn(1)}Ht(){this.an(0),this.an(1)}sn(e){this.tn(1),this.buffer[this.position++]=e}an(e){this.tn(1),this.buffer[this.position++]=~e}tn(e){const t=e+this.position;if(t<=this.buffer.length)return;let n=2*this.buffer.length;n<t&&(n=t);const r=new Uint8Array(n);r.set(this.buffer),this.buffer=r}}class xl{constructor(e){this.cn=e}Bt(e){this.cn.Wt(e)}xt(e){this.cn.Yt(e)}Mt(e){this.cn.Xt(e)}vt(){this.cn.rn()}}class Ol{constructor(e){this.cn=e}Bt(e){this.cn.jt(e)}xt(e){this.cn.Zt(e)}Mt(e){this.cn.nn(e)}vt(){this.cn._n()}}class Pl{constructor(){this.cn=new Rl,this.ln=new xl(this.cn),this.hn=new Ol(this.cn)}seed(e){this.cn.seed(e)}Pn(e){return 0===e?this.ln:this.hn}un(){return this.cn.un()}reset(){this.cn.reset()}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ll{constructor(e,t,n,r){this.Tn=e,this.In=t,this.En=n,this.dn=r}An(){const e=this.dn.length,t=0===e||255===this.dn[e-1]?e+1:e,n=new Uint8Array(t);return n.set(this.dn,0),t!==e?n.set([0],this.dn.length):++n[n.length-1],new Ll(this.Tn,this.In,this.En,n)}Rn(e,t,n){return{indexId:this.Tn,uid:e,arrayValue:Vl(this.En),directionalValue:Vl(this.dn),orderedDocumentKey:Vl(t),documentKey:n.path.toArray()}}Vn(e,t,n){const r=this.Rn(e,t,n);return[r.indexId,r.uid,r.arrayValue,r.directionalValue,r.orderedDocumentKey,r.documentKey]}}function Ml(e,t){let n=e.Tn-t.Tn;return 0!==n?n:(n=Ul(e.En,t.En),0!==n?n:(n=Ul(e.dn,t.dn),0!==n?n:yi.comparator(e.In,t.In)))}function Ul(e,t){for(let n=0;n<e.length&&n<t.length;++n){const r=e[n]-t[n];if(0!==r)return r}return e.length-t.length}function Vl(e){return b()?function(e){let t="";for(let n=0;n<e.length;n++)t+=String.fromCharCode(e[n]);return t}(e):e}function Fl(e){return"string"!=typeof e?e:function(e){const t=new Uint8Array(e.length);for(let n=0;n<e.length;n++)t[n]=e.charCodeAt(n);return t}(e)}class Bl{constructor(e){this.mn=new Ca((e,t)=>gi.comparator(e.field,t.field)),this.collectionId=null!=e.collectionGroup?e.collectionGroup:e.path.lastSegment(),this.fn=e.orderBy,this.gn=[];for(const t of e.filters){const e=t;e.isInequality()?this.mn=this.mn.add(e):this.gn.push(e)}}get pn(){return this.mn.size>1}yn(e){if($s(e.collectionGroup===this.collectionId,49279),this.pn)return!1;const t=xi(e);if(void 0!==t&&!this.wn(t))return!1;const n=Oi(e);let r=new Set,s=0,i=0;for(;s<n.length&&this.wn(n[s]);++s)r=r.add(n[s].fieldPath.canonicalString());if(s===n.length)return!0;if(this.mn.size>0){const e=this.mn.getIterator().getNext();if(!r.has(e.field.canonicalString())){const t=n[s];if(!this.Sn(e,t)||!this.bn(this.fn[i++],t))return!1}++s}for(;s<n.length;++s){const e=n[s];if(i>=this.fn.length||!this.bn(this.fn[i++],e))return!1}return!0}Dn(){if(this.pn)return null;let e=new Ca(gi.comparator);const t=[];for(const n of this.gn)if(!n.field.isKeyField())if("array-contains"===n.op||"array-contains-any"===n.op)t.push(new Pi(n.field,2));else{if(e.has(n.field))continue;e=e.add(n.field),t.push(new Pi(n.field,0))}for(const n of this.fn)n.field.isKeyField()||e.has(n.field)||(e=e.add(n.field),t.push(new Pi(n.field,"asc"===n.dir?0:1)));return new Ri(Ri.UNKNOWN_ID,this.collectionId,t,Li.empty())}wn(e){for(const t of this.gn)if(this.Sn(t,e))return!0;return!1}Sn(e,t){if(void 0===e||!e.field.isEqual(t.fieldPath))return!1;const n="array-contains"===e.op||"array-contains-any"===e.op;return 2===t.kind===n}bn(e,t){return!!e.field.isEqual(t.fieldPath)&&(0===t.kind&&"asc"===e.dir||1===t.kind&&"desc"===e.dir)}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jl(e){if($s(e instanceof Dc||e instanceof Rc,20012),e instanceof Dc){if(e instanceof Kc){const t=e.value.arrayValue?.values?.map(t=>Dc.create(e.field,"==",t))||[];return Rc.create(t,"or")}return e}const t=e.filters.map(e=>jl(e));return Rc.create(t,e.op)}function ql(e){if(0===e.getFilters().length)return[];const t=Gl(jl(e));return $s(Kl(t),7391),zl(t)||$l(t)?[t]:t.getFilters()}function zl(e){return e instanceof Dc}function $l(e){return e instanceof Rc&&Pc(e)}function Kl(e){return zl(e)||$l(e)||function(e){if(e instanceof Rc&&Oc(e)){for(const t of e.getFilters())if(!zl(t)&&!$l(t))return!1;return!0}return!1}(e)}function Gl(e){if($s(e instanceof Dc||e instanceof Rc,34018),e instanceof Dc)return e;if(1===e.filters.length)return Gl(e.filters[0]);const t=e.filters.map(e=>Gl(e));let n=Rc.create(t,e.op);return n=Ql(n),Kl(n)?n:($s(n instanceof Rc,64498),$s(xc(n),40251),$s(n.filters.length>1,57927),n.filters.reduce((e,t)=>Hl(e,t)))}function Hl(e,t){let n;return $s(e instanceof Dc||e instanceof Rc,38388),$s(t instanceof Dc||t instanceof Rc,25473),n=e instanceof Dc?t instanceof Dc?(r=e,s=t,Rc.create([r,s],"and")):Wl(e,t):t instanceof Dc?Wl(t,e):function(e,t){if($s(e.filters.length>0&&t.filters.length>0,48005),xc(e)&&xc(t))return Vc(e,t.getFilters());const n=Oc(e)?e:t,r=Oc(e)?t:e,s=n.filters.map(e=>Hl(e,r));return Rc.create(s,"or")}(e,t),Ql(n);var r,s}function Wl(e,t){if(xc(t))return Vc(t,e.getFilters());{const n=t.filters.map(t=>Hl(e,t));return Rc.create(n,"or")}}function Ql(e){if($s(e instanceof Dc||e instanceof Rc,11850),e instanceof Dc)return e;const t=e.getFilters();if(1===t.length)return Ql(t[0]);if(Lc(e))return e;const n=t.map(e=>Ql(e)),r=[];return n.forEach(t=>{t instanceof Dc?r.push(t):t instanceof Rc&&(t.op===e.op?r.push(...t.filters):r.push(t))}),1===r.length?r[0]:Rc.create(r,e.op)
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}class Jl{constructor(){this.Cn=new Xl}addToCollectionParentIndex(e,t){return this.Cn.add(t),qi.resolve()}getCollectionParents(e,t){return qi.resolve(this.Cn.getEntries(t))}addFieldIndex(e,t){return qi.resolve()}deleteFieldIndex(e,t){return qi.resolve()}deleteAllFieldIndexes(e){return qi.resolve()}createTargetIndexes(e,t){return qi.resolve()}getDocumentsMatchingTarget(e,t){return qi.resolve(null)}getIndexType(e,t){return qi.resolve(0)}getFieldIndexes(e,t){return qi.resolve([])}getNextCollectionGroupToUpdate(e){return qi.resolve(null)}getMinOffset(e,t){return qi.resolve(Ui.min())}getMinOffsetFromCollectionGroup(e,t){return qi.resolve(Ui.min())}updateCollectionGroup(e,t,n){return qi.resolve()}updateIndexEntries(e,t){return qi.resolve()}}class Xl{constructor(){this.index={}}add(e){const t=e.lastSegment(),n=e.popLast(),r=this.index[t]||new Ca(pi.comparator),s=!r.has(n);return this.index[t]=r.add(n),s}has(e){const t=e.lastSegment(),n=e.popLast(),r=this.index[t];return r&&r.has(n)}getEntries(e){return(this.index[e]||new Ca(pi.comparator)).toArray()}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yl="IndexedDbIndexManager",Zl=new Uint8Array(0);class ed{constructor(e,t){this.databaseId=t,this.vn=new Xl,this.Fn=new gu(e=>Jc(e),(e,t)=>Xc(e,t)),this.uid=e.uid||""}addToCollectionParentIndex(e,t){if(!this.vn.has(t)){const n=t.lastSegment(),r=t.popLast();e.addOnCommittedListener(()=>{this.vn.add(t)});const s={collectionId:n,parent:co(r)};return td(e).put(s)}return qi.resolve()}getCollectionParents(e,t){const n=[],r=IDBKeyRange.bound([t,""],[li(t),""],!1,!0);return td(e).J(r).next(e=>{for(const r of e){if(r.collectionId!==t)break;n.push(lo(r.parent))}return n})}addFieldIndex(e,t){const n=rd(e),r={indexId:(s=t).indexId,collectionGroup:s.collectionGroup,fields:s.fields.map(e=>[e.fieldPath.canonicalString(),e.kind])};var s;delete r.indexId;const i=n.add(r);if(t.indexState){const n=sd(e);return i.next(e=>{n.put(_l(e,this.uid,t.indexState.sequenceNumber,t.indexState.offset))})}return i.next()}deleteFieldIndex(e,t){const n=rd(e),r=sd(e),s=nd(e);return n.delete(t.indexId).next(()=>r.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0))).next(()=>s.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0)))}deleteAllFieldIndexes(e){const t=rd(e),n=nd(e),r=sd(e);return t.Z().next(()=>n.Z()).next(()=>r.Z())}createTargetIndexes(e,t){return qi.forEach(this.Mn(t),t=>this.getIndexType(e,t).next(n=>{if(0===n||1===n){const n=new Bl(t).Dn();if(null!=n)return this.addFieldIndex(e,n)}}))}getDocumentsMatchingTarget(e,t){const n=nd(e);let r=!0;const s=new Map;return qi.forEach(this.Mn(t),t=>this.xn(e,t).next(e=>{r&&(r=!!e),s.set(t,e)})).next(()=>{if(r){let e=ku();const r=[];return qi.forEach(s,(s,i)=>{var o;Vs(Yl,`Using index ${o=s,`id=${o.indexId}|cg=${o.collectionGroup}|f=${o.fields.map(e=>`${e.fieldPath}:${e.kind}`).join(",")}`} to execute ${Jc(t)}`);const a=function(e,t){const n=xi(t);if(void 0===n)return null;for(const r of Zc(e,n.fieldPath))switch(r.op){case"array-contains-any":return r.value.arrayValue.values||[];case"array-contains":return[r.value]}return null}(i,s),c=function(e,t){const n=new Map;for(const r of Oi(t))for(const t of Zc(e,r.fieldPath))switch(t.op){case"==":case"in":n.set(r.fieldPath.canonicalString(),t.value);break;case"not-in":case"!=":return n.set(r.fieldPath.canonicalString(),t.value),Array.from(n.values())}return null}(i,s),u=function(e,t){const n=[];let r=!0;for(const s of Oi(t)){const t=0===s.kind?eu(e,s.fieldPath,e.startAt):tu(e,s.fieldPath,e.startAt);n.push(t.value),r&&(r=t.inclusive)}return new Ec(n,r)}(i,s),h=function(e,t){const n=[];let r=!0;for(const s of Oi(t)){const t=0===s.kind?tu(e,s.fieldPath,e.endAt):eu(e,s.fieldPath,e.endAt);n.push(t.value),r&&(r=t.inclusive)}return new Ec(n,r)}(i,s),l=this.On(s,i,u),d=this.On(s,i,h),f=this.Nn(s,i,c),p=this.Bn(s.indexId,a,l,u.inclusive,d,h.inclusive,f);return qi.forEach(p,s=>n.Y(s,t.limit).next(t=>{t.forEach(t=>{const n=yi.fromSegments(t.documentKey);e.has(n)||(e=e.add(n),r.push(n))})}))}).next(()=>r)}return qi.resolve(null)})}Mn(e){let t=this.Fn.get(e);return t||(t=0===e.filters.length?[e]:ql(Rc.create(e.filters,"and")).map(t=>Qc(e.path,e.collectionGroup,e.orderBy,t.getFilters(),e.limit,e.startAt,e.endAt)),this.Fn.set(e,t),t)}Bn(e,t,n,r,s,i,o){const a=(null!=t?t.length:1)*Math.max(n.length,s.length),c=a/(null!=t?t.length:1),u=[];for(let h=0;h<a;++h){const a=t?this.Ln(t[h/c]):Zl,l=this.kn(e,a,n[h%c],r),d=this.qn(e,a,s[h%c],i),f=o.map(t=>this.kn(e,a,t,!0));u.push(...this.createRange(l,d,f))}return u}kn(e,t,n,r){const s=new Ll(e,yi.empty(),t,n);return r?s:s.An()}qn(e,t,n,r){const s=new Ll(e,yi.empty(),t,n);return r?s.An():s}xn(e,t){const n=new Bl(t),r=null!=t.collectionGroup?t.collectionGroup:t.path.lastSegment();return this.getFieldIndexes(e,r).next(e=>{let t=null;for(const r of e)n.yn(r)&&(!t||r.fields.length>t.fields.length)&&(t=r);return t})}getIndexType(e,t){let n=2;const r=this.Mn(t);return qi.forEach(r,t=>this.xn(e,t).next(e=>{e?0!==n&&e.fields.length<function(e){let t=new Ca(gi.comparator),n=!1;for(const r of e.filters)for(const e of r.getFlattenedFilters())e.field.isKeyField()||("array-contains"===e.op||"array-contains-any"===e.op?n=!0:t=t.add(e.field));for(const r of e.orderBy)r.field.isKeyField()||(t=t.add(r.field));return t.size+(n?1:0)}(t)&&(n=1):n=0})).next(()=>null!==t.limit&&r.length>1&&2===n?1:n)}Qn(e,t){const n=new Pl;for(const r of Oi(e)){const e=t.data.field(r.fieldPath);if(null==e)return null;const s=n.Pn(r.kind);kl.Kt.Dt(e,s)}return n.un()}Ln(e){const t=new Pl;return kl.Kt.Dt(e,t.Pn(0)),t.un()}$n(e,t){const n=new Pl;return kl.Kt.Dt(ac(this.databaseId,t),n.Pn(function(e){const t=Oi(e);return 0===t.length?0:t[t.length-1].kind}(e))),n.un()}Nn(e,t,n){if(null===n)return[];let r=[];r.push(new Pl);let s=0;for(const i of Oi(e)){const e=n[s++];for(const n of r)if(this.Un(t,i.fieldPath)&&uc(e))r=this.Kn(r,i,e);else{const t=n.Pn(i.kind);kl.Kt.Dt(e,t)}}return this.Wn(r)}On(e,t,n){return this.Nn(e,t,n.position)}Wn(e){const t=[];for(let n=0;n<e.length;++n)t[n]=e[n].un();return t}Kn(e,t,n){const r=[...e],s=[];for(const i of n.arrayValue.values||[])for(const e of r){const n=new Pl;n.seed(e.un()),kl.Kt.Dt(i,n.Pn(t.kind)),s.push(n)}return s}Un(e,t){return!!e.filters.find(e=>e instanceof Dc&&e.field.isEqual(t)&&("in"===e.op||"not-in"===e.op))}getFieldIndexes(e,t){const n=rd(e),r=sd(e);return(t?n.J(Wo,IDBKeyRange.bound(t,t)):n.J()).next(e=>{const t=[];return qi.forEach(e,e=>r.get([e.indexId,this.uid]).next(n=>{t.push(function(e,t){const n=t?new Li(t.sequenceNumber,new Ui(fl(t.readTime),new yi(lo(t.documentKey)),t.largestBatchId)):Li.empty(),r=e.fields.map(([e,t])=>new Pi(gi.fromServerFormat(e),t));return new Ri(e.indexId,e.collectionGroup,r,n)}(e,n))})).next(()=>t)})}getNextCollectionGroupToUpdate(e){return this.getFieldIndexes(e).next(e=>0===e.length?null:(e.sort((e,t)=>{const n=e.indexState.sequenceNumber-t.indexState.sequenceNumber;return 0!==n?n:ii(e.collectionGroup,t.collectionGroup)}),e[0].collectionGroup))}updateCollectionGroup(e,t,n){const r=rd(e),s=sd(e);return this.Gn(e).next(e=>r.J(Wo,IDBKeyRange.bound(t,t)).next(t=>qi.forEach(t,t=>s.put(_l(t.indexId,this.uid,e,n)))))}updateIndexEntries(e,t){const n=new Map;return qi.forEach(t,(t,r)=>{const s=n.get(t.collectionGroup);return(s?qi.resolve(s):this.getFieldIndexes(e,t.collectionGroup)).next(s=>(n.set(t.collectionGroup,s),qi.forEach(s,n=>this.zn(e,t,n).next(t=>{const s=this.jn(r,n);return t.isEqual(s)?qi.resolve():this.Jn(e,r,n,t,s)}))))})}Hn(e,t,n,r){return nd(e).put(r.Rn(this.uid,this.$n(n,t.key),t.key))}Yn(e,t,n,r){return nd(e).delete(r.Vn(this.uid,this.$n(n,t.key),t.key))}zn(e,t,n){const r=nd(e);let s=new Ca(Ml);return r.ee({index:ta,range:IDBKeyRange.only([n.indexId,this.uid,Vl(this.$n(n,t))])},(e,r)=>{s=s.add(new Ll(n.indexId,t,Fl(r.arrayValue),Fl(r.directionalValue)))}).next(()=>s)}jn(e,t){let n=new Ca(Ml);const r=this.Qn(t,e);if(null==r)return n;const s=xi(t);if(null!=s){const i=e.data.field(s.fieldPath);if(uc(i))for(const s of i.arrayValue.values||[])n=n.add(new Ll(t.indexId,e.key,this.Ln(s),r))}else n=n.add(new Ll(t.indexId,e.key,Zl,r));return n}Jn(e,t,n,r,s){Vs(Yl,"Updating index entries for document '%s'",t.key);const i=[];return function(e,t,n,r,s){const i=e.getIterator(),o=t.getIterator();let a=Aa(i),c=Aa(o);for(;a||c;){let e=!1,t=!1;if(a&&c){const r=n(a,c);r<0?t=!0:r>0&&(e=!0)}else null!=a?t=!0:e=!0;e?(r(c),c=Aa(o)):t?(s(a),a=Aa(i)):(a=Aa(i),c=Aa(o))}}(r,s,Ml,r=>{i.push(this.Hn(e,t,n,r))},r=>{i.push(this.Yn(e,t,n,r))}),qi.waitFor(i)}Gn(e){let t=1;return sd(e).ee({index:Xo,reverse:!0,range:IDBKeyRange.upperBound([this.uid,Number.MAX_SAFE_INTEGER])},(e,n,r)=>{r.done(),t=n.sequenceNumber+1}).next(()=>t)}createRange(e,t,n){n=n.sort((e,t)=>Ml(e,t)).filter((e,t,n)=>!t||0!==Ml(e,n[t-1]));const r=[];r.push(e);for(const i of n){const n=Ml(i,e),s=Ml(i,t);if(0===n)r[0]=e.An();else if(n>0&&s<0)r.push(i),r.push(i.An());else if(s>0)break}r.push(t);const s=[];for(let i=0;i<r.length;i+=2){if(this.Zn(r[i],r[i+1]))return[];const e=r[i].Vn(this.uid,Zl,yi.empty()),t=r[i+1].Vn(this.uid,Zl,yi.empty());s.push(IDBKeyRange.bound(e,t))}return s}Zn(e,t){return Ml(e,t)>0}getMinOffsetFromCollectionGroup(e,t){return this.getFieldIndexes(e,t).next(id)}getMinOffset(e,t){return qi.mapArray(this.Mn(t),t=>this.xn(e,t).next(e=>e||qs(44426))).next(id)}}function td(e){return va(e,qo)}function nd(e){return va(e,Zo)}function rd(e){return va(e,Ho)}function sd(e){return va(e,Qo)}function id(e){$s(0!==e.length,28825);let t=e[0].indexState.offset,n=t.largestBatchId;for(let r=1;r<e.length;r++){const s=e[r].indexState.offset;Vi(s,t)<0&&(t=s),n<s.largestBatchId&&(n=s.largestBatchId)}return new Ui(t.readTime,t.documentKey,n)}
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const od={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},ad=41943040;class cd{static withCacheSize(e){return new cd(e,cd.DEFAULT_COLLECTION_PERCENTILE,cd.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,n){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=n}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ud(e,t,n){const r=e.store(yo),s=e.store(Eo),i=[],o=IDBKeyRange.only(n.batchId);let a=0;const c=r.ee({range:o},(e,t,n)=>(a++,n.delete()));i.push(c.next(()=>{$s(1===a,47070,{batchId:n.batchId})}));const u=[];for(const h of n.mutations){const e=bo(t,h.key.path,n.batchId);i.push(s.delete(e)),u.push(h.key)}return qi.waitFor(i).next(()=>u)}function hd(e){if(!e)return 0;let t;if(e.document)t=e.document;else if(e.unknownDocument)t=e.unknownDocument;else{if(!e.noDocument)throw qs(14731);t=e.noDocument}return JSON.stringify(t).length}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */cd.DEFAULT_COLLECTION_PERCENTILE=10,cd.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,cd.DEFAULT=new cd(ad,cd.DEFAULT_COLLECTION_PERCENTILE,cd.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),cd.DISABLED=new cd(-1,0,0);class ld{constructor(e,t,n,r){this.userId=e,this.serializer=t,this.indexManager=n,this.referenceDelegate=r,this.Xn={}}static wt(e,t,n,r){$s(""!==e.uid,64387);const s=e.isAuthenticated()?e.uid:"";return new ld(s,t,n,r)}checkEmpty(e){let t=!0;const n=IDBKeyRange.bound([this.userId,Number.NEGATIVE_INFINITY],[this.userId,Number.POSITIVE_INFINITY]);return fd(e).ee({index:vo,range:n},(e,n,r)=>{t=!1,r.done()}).next(()=>t)}addMutationBatch(e,t,n,r){const s=pd(e),i=fd(e);return i.add({}).next(o=>{$s("number"==typeof o,49019);const a=new ah(o,t,n,r),c=function(e,t,n){const r=n.baseMutations.map(t=>Hh(e.yt,t)),s=n.mutations.map(t=>Hh(e.yt,t));return{userId:t,batchId:n.batchId,localWriteTimeMs:n.localWriteTime.toMillis(),baseMutations:r,mutations:s}}(this.serializer,this.userId,a),u=[];let h=new Ca((e,t)=>ii(e.canonicalString(),t.canonicalString()));for(const e of r){const t=bo(this.userId,e.key.path,o);h=h.add(e.key.path.popLast()),u.push(i.put(c)),u.push(s.put(t,To))}return h.forEach(t=>{u.push(this.indexManager.addToCollectionParentIndex(e,t))}),e.addOnCommittedListener(()=>{this.Xn[o]=a.keys()}),qi.waitFor(u).next(()=>a)})}lookupMutationBatch(e,t){return fd(e).get(t).next(e=>e?($s(e.userId===this.userId,48,"Unexpected user for mutation batch",{userId:e.userId,batchId:t}),pl(this.serializer,e)):null)}er(e,t){return this.Xn[t]?qi.resolve(this.Xn[t]):this.lookupMutationBatch(e,t).next(e=>{if(e){const n=e.keys();return this.Xn[t]=n,n}return null})}getNextMutationBatchAfterBatchId(e,t){const n=t+1,r=IDBKeyRange.lowerBound([this.userId,n]);let s=null;return fd(e).ee({index:vo,range:r},(e,t,r)=>{t.userId===this.userId&&($s(t.batchId>=n,47524,{tr:n}),s=pl(this.serializer,t)),r.done()}).next(()=>s)}getHighestUnacknowledgedBatchId(e){const t=IDBKeyRange.upperBound([this.userId,Number.POSITIVE_INFINITY]);let n=so;return fd(e).ee({index:vo,range:t,reverse:!0},(e,t,r)=>{n=t.batchId,r.done()}).next(()=>n)}getAllMutationBatches(e){const t=IDBKeyRange.bound([this.userId,so],[this.userId,Number.POSITIVE_INFINITY]);return fd(e).J(vo,t).next(e=>e.map(e=>pl(this.serializer,e)))}getAllMutationBatchesAffectingDocumentKey(e,t){const n=Io(this.userId,t.path),r=IDBKeyRange.lowerBound(n),s=[];return pd(e).ee({range:r},(n,r,i)=>{const[o,a,c]=n,u=lo(a);if(o===this.userId&&t.path.isEqual(u))return fd(e).get(c).next(e=>{if(!e)throw qs(61480,{nr:n,batchId:c});$s(e.userId===this.userId,10503,"Unexpected user for mutation batch",{userId:e.userId,batchId:c}),s.push(pl(this.serializer,e))});i.done()}).next(()=>s)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new Ca(ii);const r=[];return t.forEach(t=>{const s=Io(this.userId,t.path),i=IDBKeyRange.lowerBound(s),o=pd(e).ee({range:i},(e,r,s)=>{const[i,o,a]=e,c=lo(o);i===this.userId&&t.path.isEqual(c)?n=n.add(a):s.done()});r.push(o)}),qi.waitFor(r).next(()=>this.rr(e,n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,r=n.length+1,s=Io(this.userId,n),i=IDBKeyRange.lowerBound(s);let o=new Ca(ii);return pd(e).ee({range:i},(e,t,s)=>{const[i,a,c]=e,u=lo(a);i===this.userId&&n.isPrefixOf(u)?u.length===r&&(o=o.add(c)):s.done()}).next(()=>this.rr(e,o))}rr(e,t){const n=[],r=[];return t.forEach(t=>{r.push(fd(e).get(t).next(e=>{if(null===e)throw qs(35274,{batchId:t});$s(e.userId===this.userId,9748,"Unexpected user for mutation batch",{userId:e.userId,batchId:t}),n.push(pl(this.serializer,e))}))}),qi.waitFor(r).next(()=>n)}removeMutationBatch(e,t){return ud(e.le,this.userId,t).next(n=>(e.addOnCommittedListener(()=>{this.ir(t.batchId)}),qi.forEach(n,t=>this.referenceDelegate.markPotentiallyOrphaned(e,t))))}ir(e){delete this.Xn[e]}performConsistencyCheck(e){return this.checkEmpty(e).next(t=>{if(!t)return qi.resolve();const n=IDBKeyRange.lowerBound(function(e){return[e]}(this.userId)),r=[];return pd(e).ee({range:n},(e,t,n)=>{if(e[0]===this.userId){const t=lo(e[1]);r.push(t)}else n.done()}).next(()=>{$s(0===r.length,56720,{sr:r.map(e=>e.canonicalString())})})})}containsKey(e,t){return dd(e,this.userId,t)}_r(e){return md(e).get(this.userId).next(e=>e||{userId:this.userId,lastAcknowledgedBatchId:so,lastStreamToken:""})}}function dd(e,t,n){const r=Io(t,n.path),s=r[1],i=IDBKeyRange.lowerBound(r);let o=!1;return pd(e).ee({range:i,X:!0},(e,n,r)=>{const[i,a,c]=e;i===t&&a===s&&(o=!0),r.done()}).next(()=>o)}function fd(e){return va(e,yo)}function pd(e){return va(e,Eo)}function md(e){return va(e,go)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gd{constructor(e){this.ar=e}next(){return this.ar+=2,this.ar}static ur(){return new gd(0)}static cr(){return new gd(-1)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yd{constructor(e,t){this.referenceDelegate=e,this.serializer=t}allocateTargetId(e){return this.lr(e).next(t=>{const n=new gd(t.highestTargetId);return t.highestTargetId=n.next(),this.hr(e,t).next(()=>t.highestTargetId)})}getLastRemoteSnapshotVersion(e){return this.lr(e).next(e=>Di.fromTimestamp(new Ni(e.lastRemoteSnapshotVersion.seconds,e.lastRemoteSnapshotVersion.nanoseconds)))}getHighestSequenceNumber(e){return this.lr(e).next(e=>e.highestListenSequenceNumber)}setTargetsMetadata(e,t,n){return this.lr(e).next(r=>(r.highestListenSequenceNumber=t,n&&(r.lastRemoteSnapshotVersion=n.toTimestamp()),t>r.highestListenSequenceNumber&&(r.highestListenSequenceNumber=t),this.hr(e,r)))}addTargetData(e,t){return this.Pr(e,t).next(()=>this.lr(e).next(n=>(n.targetCount+=1,this.Tr(t,n),this.hr(e,n))))}updateTargetData(e,t){return this.Pr(e,t)}removeTargetData(e,t){return this.removeMatchingKeysForTargetId(e,t.targetId).next(()=>wd(e).delete(t.targetId)).next(()=>this.lr(e)).next(t=>($s(t.targetCount>0,8065),t.targetCount-=1,this.hr(e,t)))}removeTargets(e,t,n){let r=0;const s=[];return wd(e).ee((i,o)=>{const a=ml(o);a.sequenceNumber<=t&&null===n.get(a.targetId)&&(r++,s.push(this.removeTargetData(e,a)))}).next(()=>qi.waitFor(s)).next(()=>r)}forEachTarget(e,t){return wd(e).ee((e,n)=>{const r=ml(n);t(r)})}lr(e){return vd(e).get(Bo).next(e=>($s(null!==e,2888),e))}hr(e,t){return vd(e).put(Bo,t)}Pr(e,t){return wd(e).put(gl(this.serializer,t))}Tr(e,t){let n=!1;return e.targetId>t.highestTargetId&&(t.highestTargetId=e.targetId,n=!0),e.sequenceNumber>t.highestListenSequenceNumber&&(t.highestListenSequenceNumber=e.sequenceNumber,n=!0),n}getTargetCount(e){return this.lr(e).next(e=>e.targetCount)}getTargetData(e,t){const n=Jc(t),r=IDBKeyRange.bound([n,Number.NEGATIVE_INFINITY],[n,Number.POSITIVE_INFINITY]);let s=null;return wd(e).ee({range:r,index:Po},(e,n,r)=>{const i=ml(n);Xc(t,i.target)&&(s=i,r.done())}).next(()=>s)}addMatchingKeys(e,t,n){const r=[],s=_d(e);return t.forEach(t=>{const i=co(t.path);r.push(s.put({targetId:n,path:i})),r.push(this.referenceDelegate.addReference(e,n,t))}),qi.waitFor(r)}removeMatchingKeys(e,t,n){const r=_d(e);return qi.forEach(t,t=>{const s=co(t.path);return qi.waitFor([r.delete([n,s]),this.referenceDelegate.removeReference(e,n,t)])})}removeMatchingKeysForTargetId(e,t){const n=_d(e),r=IDBKeyRange.bound([t],[t+1],!1,!0);return n.delete(r)}getMatchingKeysForTargetId(e,t){const n=IDBKeyRange.bound([t],[t+1],!1,!0),r=_d(e);let s=ku();return r.ee({range:n,X:!0},(e,t,n)=>{const r=lo(e[1]),i=new yi(r);s=s.add(i)}).next(()=>s)}containsKey(e,t){const n=co(t.path),r=IDBKeyRange.bound([n],[li(n)],!1,!0);let s=0;return _d(e).ee({index:Vo,X:!0,range:r},([e,t],n,r)=>{0!==e&&(s++,r.done())}).next(()=>s>0)}At(e,t){return wd(e).get(t).next(e=>e?ml(e):null)}}function wd(e){return va(e,Oo)}function vd(e){return va(e,jo)}function _d(e){return va(e,Mo)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Id="LruGarbageCollector";function bd([e,t],[n,r]){const s=ii(e,n);return 0===s?ii(t,r):s}class Td{constructor(e){this.Ir=e,this.buffer=new Ca(bd),this.Er=0}dr(){return++this.Er}Ar(e){const t=[e,this.dr()];if(this.buffer.size<this.Ir)this.buffer=this.buffer.add(t);else{const e=this.buffer.last();bd(t,e)<0&&(this.buffer=this.buffer.delete(e).add(t))}}get maxValue(){return this.buffer.last()[0]}}class Ed{constructor(e,t,n){this.garbageCollector=e,this.asyncQueue=t,this.localStore=n,this.Rr=null}start(){-1!==this.garbageCollector.params.cacheSizeCollectionThreshold&&this.Vr(6e4)}stop(){this.Rr&&(this.Rr.cancel(),this.Rr=null)}get started(){return null!==this.Rr}Vr(e){Vs(Id,`Garbage collection scheduled in ${e}ms`),this.Rr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,async()=>{this.Rr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(e){Qi(e)?Vs(Id,"Ignoring IndexedDB error during garbage collection: ",e):await ji(e)}await this.Vr(3e5)})}}class Sd{constructor(e,t){this.mr=e,this.params=t}calculateTargetCount(e,t){return this.mr.gr(e).next(e=>Math.floor(t/100*e))}nthSequenceNumber(e,t){if(0===t)return qi.resolve(ro.ce);const n=new Td(t);return this.mr.forEachTarget(e,e=>n.Ar(e.sequenceNumber)).next(()=>this.mr.pr(e,e=>n.Ar(e))).next(()=>n.maxValue)}removeTargets(e,t,n){return this.mr.removeTargets(e,t,n)}removeOrphanedDocuments(e,t){return this.mr.removeOrphanedDocuments(e,t)}collect(e,t){return-1===this.params.cacheSizeCollectionThreshold?(Vs("LruGarbageCollector","Garbage collection skipped; disabled"),qi.resolve(od)):this.getCacheSize(e).next(n=>n<this.params.cacheSizeCollectionThreshold?(Vs("LruGarbageCollector",`Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),od):this.yr(e,t))}getCacheSize(e){return this.mr.getCacheSize(e)}yr(e,t){let n,r,s,i,o,a,c;const u=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next(t=>(t>this.params.maximumSequenceNumbersToCollect?(Vs("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${t}`),r=this.params.maximumSequenceNumbersToCollect):r=t,i=Date.now(),this.nthSequenceNumber(e,r))).next(r=>(n=r,o=Date.now(),this.removeTargets(e,n,t))).next(t=>(s=t,a=Date.now(),this.removeOrphanedDocuments(e,n))).next(e=>(c=Date.now(),Us()<=F.DEBUG&&Vs("LruGarbageCollector",`LRU Garbage Collection\n\tCounted targets in ${i-u}ms\n\tDetermined least recently used ${r} in `+(o-i)+`ms\n\tRemoved ${s} targets in `+(a-o)+`ms\n\tRemoved ${e} documents in `+(c-a)+`ms\nTotal Duration: ${c-u}ms`),qi.resolve({didRun:!0,sequenceNumbersCollected:r,targetsRemoved:s,documentsRemoved:e})))}}function Cd(e,t){return new Sd(e,t)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kd{constructor(e,t){this.db=e,this.garbageCollector=Cd(this,t)}gr(e){const t=this.wr(e);return this.db.getTargetCache().getTargetCount(e).next(e=>t.next(t=>e+t))}wr(e){let t=0;return this.pr(e,e=>{t++}).next(()=>t)}forEachTarget(e,t){return this.db.getTargetCache().forEachTarget(e,t)}pr(e,t){return this.Sr(e,(e,n)=>t(n))}addReference(e,t,n){return Ad(e,n)}removeReference(e,t,n){return Ad(e,n)}removeTargets(e,t,n){return this.db.getTargetCache().removeTargets(e,t,n)}markPotentiallyOrphaned(e,t){return Ad(e,t)}br(e,t){return function(e,t){let n=!1;return md(e).te(r=>dd(e,r,t).next(e=>(e&&(n=!0),qi.resolve(!e)))).next(()=>n)}(e,t)}removeOrphanedDocuments(e,t){const n=this.db.getRemoteDocumentCache().newChangeBuffer(),r=[];let s=0;return this.Sr(e,(i,o)=>{if(o<=t){const t=this.br(e,i).next(t=>{if(!t)return s++,n.getEntry(e,i).next(()=>(n.removeEntry(i,Di.min()),_d(e).delete([0,co(i.path)])))});r.push(t)}}).next(()=>qi.waitFor(r)).next(()=>n.apply(e)).next(()=>s)}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.db.getTargetCache().updateTargetData(e,n)}updateLimboDocument(e,t){return Ad(e,t)}Sr(e,t){const n=_d(e);let r,s=ro.ce;return n.ee({index:Vo},([e,n],{path:i,sequenceNumber:o})=>{0===e?(s!==ro.ce&&t(new yi(lo(r)),s),s=o,r=i):s=ro.ce}).next(()=>{s!==ro.ce&&t(new yi(lo(r)),s)})}getCacheSize(e){return this.db.getRemoteDocumentCache().getSize(e)}}function Ad(e,t){return _d(e).put((n=t,r=e.currentSequenceNumber,{targetId:0,path:co(n.path),sequenceNumber:r}));var n,r}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nd{constructor(){this.changes=new gu(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Tc.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const n=this.changes.get(t);return void 0!==n?qi.resolve(n):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dd{constructor(e){this.serializer=e}setIndexManager(e){this.indexManager=e}addEntry(e,t,n){return Pd(e).put(n)}removeEntry(e,t,n){return Pd(e).delete(function(e,t){const n=e.path.toArray();return[n.slice(0,n.length-2),n[n.length-2],ll(t),n[n.length-1]]}(t,n))}updateMetadata(e,t){return this.getMetadata(e).next(n=>(n.byteSize+=t,this.Dr(e,n)))}getEntry(e,t){let n=Tc.newInvalidDocument(t);return Pd(e).ee({index:ko,range:IDBKeyRange.only(Ld(t))},(e,r)=>{n=this.Cr(t,r)}).next(()=>n)}vr(e,t){let n={size:0,document:Tc.newInvalidDocument(t)};return Pd(e).ee({index:ko,range:IDBKeyRange.only(Ld(t))},(e,r)=>{n={document:this.Cr(t,r),size:hd(r)}}).next(()=>n)}getEntries(e,t){let n=wu();return this.Fr(e,t,(e,t)=>{const r=this.Cr(e,t);n=n.insert(e,r)}).next(()=>n)}Mr(e,t){let n=wu(),r=new Ta(yi.comparator);return this.Fr(e,t,(e,t)=>{const s=this.Cr(e,t);n=n.insert(e,s),r=r.insert(e,hd(t))}).next(()=>({documents:n,Or:r}))}Fr(e,t,n){if(t.isEmpty())return qi.resolve();let r=new Ca(Ud);t.forEach(e=>r=r.add(e));const s=IDBKeyRange.bound(Ld(r.first()),Ld(r.last())),i=r.getIterator();let o=i.getNext();return Pd(e).ee({index:ko,range:s},(e,t,r)=>{const s=yi.fromSegments([...t.prefixPath,t.collectionGroup,t.documentId]);for(;o&&Ud(o,s)<0;)n(o,null),o=i.getNext();o&&o.isEqual(s)&&(n(o,t),o=i.hasNext()?i.getNext():null),o?r.j(Ld(o)):r.done()}).next(()=>{for(;o;)n(o,null),o=i.hasNext()?i.getNext():null})}getDocumentsMatchingQuery(e,t,n,r,s){const i=t.path,o=[i.popLast().toArray(),i.lastSegment(),ll(n.readTime),n.documentKey.path.isEmpty()?"":n.documentKey.path.lastSegment()],a=[i.popLast().toArray(),i.lastSegment(),[Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],""];return Pd(e).J(IDBKeyRange.bound(o,a,!0)).next(e=>{s?.incrementDocumentReadCount(e.length);let n=wu();for(const s of e){const e=this.Cr(yi.fromSegments(s.prefixPath.concat(s.collectionGroup,s.documentId)),s);e.isFoundDocument()&&(fu(t,e)||r.has(e.key))&&(n=n.insert(e.key,e))}return n})}getAllFromCollectionGroup(e,t,n,r){let s=wu();const i=Md(t,n),o=Md(t,Ui.max());return Pd(e).ee({index:No,range:IDBKeyRange.bound(i,o,!0)},(e,t,n)=>{const i=this.Cr(yi.fromSegments(t.prefixPath.concat(t.collectionGroup,t.documentId)),t);s=s.insert(i.key,i),s.size===r&&n.done()}).next(()=>s)}newChangeBuffer(e){return new xd(this,!!e&&e.trackRemovals)}getSize(e){return this.getMetadata(e).next(e=>e.byteSize)}getMetadata(e){return Od(e).get(xo).next(e=>($s(!!e,20021),e))}Dr(e,t){return Od(e).put(xo,t)}Cr(e,t){if(t){const e=ul(this.serializer,t);if(!e.isNoDocument()||!e.version.isEqual(Di.min()))return e}return Tc.newInvalidDocument(e)}}function Rd(e){return new Dd(e)}class xd extends Nd{constructor(e,t){super(),this.Nr=e,this.trackRemovals=t,this.Br=new gu(e=>e.toString(),(e,t)=>e.isEqual(t))}applyChanges(e){const t=[];let n=0,r=new Ca((e,t)=>ii(e.canonicalString(),t.canonicalString()));return this.changes.forEach((s,i)=>{const o=this.Br.get(s);if(t.push(this.Nr.removeEntry(e,s,o.readTime)),i.isValidDocument()){const a=hl(this.Nr.serializer,i);r=r.add(s.path.popLast());const c=hd(a);n+=c-o.size,t.push(this.Nr.addEntry(e,s,a))}else if(n-=o.size,this.trackRemovals){const n=hl(this.Nr.serializer,i.convertToNoDocument(Di.min()));t.push(this.Nr.addEntry(e,s,n))}}),r.forEach(n=>{t.push(this.Nr.indexManager.addToCollectionParentIndex(e,n))}),t.push(this.Nr.updateMetadata(e,n)),qi.waitFor(t)}getFromCache(e,t){return this.Nr.vr(e,t).next(e=>(this.Br.set(t,{size:e.size,readTime:e.document.readTime}),e.document))}getAllFromCache(e,t){return this.Nr.Mr(e,t).next(({documents:e,Or:t})=>(t.forEach((t,n)=>{this.Br.set(t,{size:n,readTime:e.get(t).readTime})}),e))}}function Od(e){return va(e,Ro)}function Pd(e){return va(e,So)}function Ld(e){const t=e.path.toArray();return[t.slice(0,t.length-2),t[t.length-2],t[t.length-1]]}function Md(e,t){const n=t.documentKey.path.toArray();return[e,ll(t.readTime),n.slice(0,n.length-2),n.length>0?n[n.length-1]:""]}function Ud(e,t){const n=e.path.toArray(),r=t.path.toArray();let s=0;for(let i=0;i<n.length-2&&i<r.length-2;++i)if(s=ii(n[i],r[i]),s)return s;return s=ii(n.length,r.length),s||(s=ii(n[n.length-2],r[r.length-2]),s||ii(n[n.length-1],r[r.length-1])
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */)}class Vd{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fd{constructor(e,t,n,r){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=n,this.indexManager=r}getDocument(e,t){let n=null;return this.documentOverlayCache.getOverlay(e,t).next(r=>(n=r,this.remoteDocumentCache.getEntry(e,t))).next(e=>(null!==n&&Xu(n.mutation,e,Na.empty(),Ni.now()),e))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(t=>this.getLocalViewOfDocuments(e,t,ku()).next(()=>t))}getLocalViewOfDocuments(e,t,n=ku()){const r=bu();return this.populateOverlays(e,r,t).next(()=>this.computeViews(e,t,r,n).next(e=>{let t=_u();return e.forEach((e,n)=>{t=t.insert(e,n.overlayedDocument)}),t}))}getOverlayedDocuments(e,t){const n=bu();return this.populateOverlays(e,n,t).next(()=>this.computeViews(e,t,n,ku()))}populateOverlays(e,t,n){const r=[];return n.forEach(e=>{t.has(e)||r.push(e)}),this.documentOverlayCache.getOverlays(e,r).next(e=>{e.forEach((e,n)=>{t.set(e,n)})})}computeViews(e,t,n,r){let s=wu();const i=Eu(),o=Eu();return t.forEach((e,t)=>{const o=n.get(t.key);r.has(t.key)&&(void 0===o||o.mutation instanceof th)?s=s.insert(t.key,t):void 0!==o?(i.set(t.key,o.mutation.getFieldMask()),Xu(o.mutation,t,o.mutation.getFieldMask(),Ni.now())):i.set(t.key,Na.empty())}),this.recalculateAndSaveOverlays(e,s).next(e=>(e.forEach((e,t)=>i.set(e,t)),t.forEach((e,t)=>o.set(e,new Vd(t,i.get(e)??null))),o))}recalculateAndSaveOverlays(e,t){const n=Eu();let r=new Ta((e,t)=>e-t),s=ku();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(e=>{for(const s of e)s.keys().forEach(e=>{const i=t.get(e);if(null===i)return;let o=n.get(e)||Na.empty();o=s.applyToLocalView(i,o),n.set(e,o);const a=(r.get(s.batchId)||ku()).add(e);r=r.insert(s.batchId,a)})}).next(()=>{const i=[],o=r.getReverseIterator();for(;o.hasNext();){const r=o.getNext(),a=r.key,c=r.value,u=Tu();c.forEach(e=>{if(!s.has(e)){const r=Qu(t.get(e),n.get(e));null!==r&&u.set(e,r),s=s.add(e)}}),i.push(this.documentOverlayCache.saveOverlays(e,a,u))}return qi.waitFor(i)}).next(()=>n)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(t=>this.recalculateAndSaveOverlays(e,t))}getDocumentsMatchingQuery(e,t,n,r){return s=t,yi.isDocumentKey(s.path)&&null===s.collectionGroup&&0===s.filters.length?this.getDocumentsMatchingDocumentQuery(e,t.path):iu(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,n,r):this.getDocumentsMatchingCollectionQuery(e,t,n,r);var s}getNextDocuments(e,t,n,r){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,n,r).next(s=>{const i=r-s.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,n.largestBatchId,r-s.size):qi.resolve(bu());let o=-1,a=s;return i.next(t=>qi.forEach(t,(t,n)=>(o<n.largestBatchId&&(o=n.largestBatchId),s.get(t)?qi.resolve():this.remoteDocumentCache.getEntry(e,t).next(e=>{a=a.insert(t,e)}))).next(()=>this.populateOverlays(e,t,s)).next(()=>this.computeViews(e,a,t,ku())).next(e=>({batchId:o,changes:Iu(e)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new yi(t)).next(e=>{let t=_u();return e.isFoundDocument()&&(t=t.insert(e.key,e)),t})}getDocumentsMatchingCollectionGroupQuery(e,t,n,r){const s=t.collectionGroup;let i=_u();return this.indexManager.getCollectionParents(e,s).next(o=>qi.forEach(o,o=>{const a=(c=t,u=o.child(s),new nu(u,null,c.explicitOrderBy.slice(),c.filters.slice(),c.limit,c.limitType,c.startAt,c.endAt));var c,u;return this.getDocumentsMatchingCollectionQuery(e,a,n,r).next(e=>{e.forEach((e,t)=>{i=i.insert(e,t)})})}).next(()=>i))}getDocumentsMatchingCollectionQuery(e,t,n,r){let s;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,n.largestBatchId).next(i=>(s=i,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,s,r))).next(e=>{s.forEach((t,n)=>{const r=n.getKey();null===e.get(r)&&(e=e.insert(r,Tc.newInvalidDocument(r)))});let n=_u();return e.forEach((e,r)=>{const i=s.get(e);void 0!==i&&Xu(i.mutation,r,Na.empty(),Ni.now()),fu(t,r)&&(n=n.insert(e,r))}),n})}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bd{constructor(e){this.serializer=e,this.Lr=new Map,this.kr=new Map}getBundleMetadata(e,t){return qi.resolve(this.Lr.get(t))}saveBundleMetadata(e,t){return this.Lr.set(t.id,{id:(n=t).id,version:n.version,createTime:Mh(n.createTime)}),qi.resolve();var n}getNamedQuery(e,t){return qi.resolve(this.kr.get(t))}saveNamedQuery(e,t){return this.kr.set(t.name,{name:(n=t).name,query:yl(n.bundledQuery),readTime:Mh(n.readTime)}),qi.resolve();var n}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jd{constructor(){this.overlays=new Ta(yi.comparator),this.qr=new Map}getOverlay(e,t){return qi.resolve(this.overlays.get(t))}getOverlays(e,t){const n=bu();return qi.forEach(t,t=>this.getOverlay(e,t).next(e=>{null!==e&&n.set(t,e)})).next(()=>n)}saveOverlays(e,t,n){return n.forEach((n,r)=>{this.St(e,t,r)}),qi.resolve()}removeOverlaysForBatchId(e,t,n){const r=this.qr.get(n);return void 0!==r&&(r.forEach(e=>this.overlays=this.overlays.remove(e)),this.qr.delete(n)),qi.resolve()}getOverlaysForCollection(e,t,n){const r=bu(),s=t.length+1,i=new yi(t.child("")),o=this.overlays.getIteratorFrom(i);for(;o.hasNext();){const e=o.getNext().value,i=e.getKey();if(!t.isPrefixOf(i.path))break;i.path.length===s&&e.largestBatchId>n&&r.set(e.getKey(),e)}return qi.resolve(r)}getOverlaysForCollectionGroup(e,t,n,r){let s=new Ta((e,t)=>e-t);const i=this.overlays.getIterator();for(;i.hasNext();){const e=i.getNext().value;if(e.getKey().getCollectionGroup()===t&&e.largestBatchId>n){let t=s.get(e.largestBatchId);null===t&&(t=bu(),s=s.insert(e.largestBatchId,t)),t.set(e.getKey(),e)}}const o=bu(),a=s.getIterator();for(;a.hasNext()&&(a.getNext().value.forEach((e,t)=>o.set(e,t)),!(o.size()>=r)););return qi.resolve(o)}St(e,t,n){const r=this.overlays.get(n.key);if(null!==r){const e=this.qr.get(r.largestBatchId).delete(n.key);this.qr.set(r.largestBatchId,e)}this.overlays=this.overlays.insert(n.key,new uh(t,n));let s=this.qr.get(t);void 0===s&&(s=ku(),this.qr.set(t,s)),this.qr.set(t,s.add(n.key))}}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qd{constructor(){this.sessionToken=Ra.EMPTY_BYTE_STRING}getSessionToken(e){return qi.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,qi.resolve()}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zd{constructor(){this.Qr=new Ca($d.$r),this.Ur=new Ca($d.Kr)}isEmpty(){return this.Qr.isEmpty()}addReference(e,t){const n=new $d(e,t);this.Qr=this.Qr.add(n),this.Ur=this.Ur.add(n)}Wr(e,t){e.forEach(e=>this.addReference(e,t))}removeReference(e,t){this.Gr(new $d(e,t))}zr(e,t){e.forEach(e=>this.removeReference(e,t))}jr(e){const t=new yi(new pi([])),n=new $d(t,e),r=new $d(t,e+1),s=[];return this.Ur.forEachInRange([n,r],e=>{this.Gr(e),s.push(e.key)}),s}Jr(){this.Qr.forEach(e=>this.Gr(e))}Gr(e){this.Qr=this.Qr.delete(e),this.Ur=this.Ur.delete(e)}Hr(e){const t=new yi(new pi([])),n=new $d(t,e),r=new $d(t,e+1);let s=ku();return this.Ur.forEachInRange([n,r],e=>{s=s.add(e.key)}),s}containsKey(e){const t=new $d(e,0),n=this.Qr.firstAfterOrEqual(t);return null!==n&&e.isEqual(n.key)}}class $d{constructor(e,t){this.key=e,this.Yr=t}static $r(e,t){return yi.comparator(e.key,t.key)||ii(e.Yr,t.Yr)}static Kr(e,t){return ii(e.Yr,t.Yr)||yi.comparator(e.key,t.key)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kd{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.tr=1,this.Zr=new Ca($d.$r)}checkEmpty(e){return qi.resolve(0===this.mutationQueue.length)}addMutationBatch(e,t,n,r){const s=this.tr;this.tr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const i=new ah(s,t,n,r);this.mutationQueue.push(i);for(const o of r)this.Zr=this.Zr.add(new $d(o.key,s)),this.indexManager.addToCollectionParentIndex(e,o.key.path.popLast());return qi.resolve(i)}lookupMutationBatch(e,t){return qi.resolve(this.Xr(t))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,r=this.ei(n),s=r<0?0:r;return qi.resolve(this.mutationQueue.length>s?this.mutationQueue[s]:null)}getHighestUnacknowledgedBatchId(){return qi.resolve(0===this.mutationQueue.length?so:this.tr-1)}getAllMutationBatches(e){return qi.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const n=new $d(t,0),r=new $d(t,Number.POSITIVE_INFINITY),s=[];return this.Zr.forEachInRange([n,r],e=>{const t=this.Xr(e.Yr);s.push(t)}),qi.resolve(s)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new Ca(ii);return t.forEach(e=>{const t=new $d(e,0),r=new $d(e,Number.POSITIVE_INFINITY);this.Zr.forEachInRange([t,r],e=>{n=n.add(e.Yr)})}),qi.resolve(this.ti(n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,r=n.length+1;let s=n;yi.isDocumentKey(s)||(s=s.child(""));const i=new $d(new yi(s),0);let o=new Ca(ii);return this.Zr.forEachWhile(e=>{const t=e.key.path;return!!n.isPrefixOf(t)&&(t.length===r&&(o=o.add(e.Yr)),!0)},i),qi.resolve(this.ti(o))}ti(e){const t=[];return e.forEach(e=>{const n=this.Xr(e);null!==n&&t.push(n)}),t}removeMutationBatch(e,t){$s(0===this.ni(t.batchId,"removed"),55003),this.mutationQueue.shift();let n=this.Zr;return qi.forEach(t.mutations,r=>{const s=new $d(r.key,t.batchId);return n=n.delete(s),this.referenceDelegate.markPotentiallyOrphaned(e,r.key)}).next(()=>{this.Zr=n})}ir(e){}containsKey(e,t){const n=new $d(t,0),r=this.Zr.firstAfterOrEqual(n);return qi.resolve(t.isEqual(r&&r.key))}performConsistencyCheck(e){return this.mutationQueue.length,qi.resolve()}ni(e,t){return this.ei(e)}ei(e){return 0===this.mutationQueue.length?0:e-this.mutationQueue[0].batchId}Xr(e){const t=this.ei(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gd{constructor(e){this.ri=e,this.docs=new Ta(yi.comparator),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const n=t.key,r=this.docs.get(n),s=r?r.size:0,i=this.ri(t);return this.docs=this.docs.insert(n,{document:t.mutableCopy(),size:i}),this.size+=i-s,this.indexManager.addToCollectionParentIndex(e,n.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const n=this.docs.get(t);return qi.resolve(n?n.document.mutableCopy():Tc.newInvalidDocument(t))}getEntries(e,t){let n=wu();return t.forEach(e=>{const t=this.docs.get(e);n=n.insert(e,t?t.document.mutableCopy():Tc.newInvalidDocument(e))}),qi.resolve(n)}getDocumentsMatchingQuery(e,t,n,r){let s=wu();const i=t.path,o=new yi(i.child("__id-9223372036854775808__")),a=this.docs.getIteratorFrom(o);for(;a.hasNext();){const{key:e,value:{document:o}}=a.getNext();if(!i.isPrefixOf(e.path))break;e.path.length>i.length+1||Vi(Mi(o),n)<=0||(r.has(o.key)||fu(t,o))&&(s=s.insert(o.key,o.mutableCopy()))}return qi.resolve(s)}getAllFromCollectionGroup(e,t,n,r){qs(9500)}ii(e,t){return qi.forEach(this.docs,e=>t(e))}newChangeBuffer(e){return new Hd(this)}getSize(e){return qi.resolve(this.size)}}class Hd extends Nd{constructor(e){super(),this.Nr=e}applyChanges(e){const t=[];return this.changes.forEach((n,r)=>{r.isValidDocument()?t.push(this.Nr.addEntry(e,r)):this.Nr.removeEntry(n)}),qi.waitFor(t)}getFromCache(e,t){return this.Nr.getEntry(e,t)}getAllFromCache(e,t){return this.Nr.getEntries(e,t)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wd{constructor(e){this.persistence=e,this.si=new gu(e=>Jc(e),Xc),this.lastRemoteSnapshotVersion=Di.min(),this.highestTargetId=0,this.oi=0,this._i=new zd,this.targetCount=0,this.ai=gd.ur()}forEachTarget(e,t){return this.si.forEach((e,n)=>t(n)),qi.resolve()}getLastRemoteSnapshotVersion(e){return qi.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return qi.resolve(this.oi)}allocateTargetId(e){return this.highestTargetId=this.ai.next(),qi.resolve(this.highestTargetId)}setTargetsMetadata(e,t,n){return n&&(this.lastRemoteSnapshotVersion=n),t>this.oi&&(this.oi=t),qi.resolve()}Pr(e){this.si.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.ai=new gd(t),this.highestTargetId=t),e.sequenceNumber>this.oi&&(this.oi=e.sequenceNumber)}addTargetData(e,t){return this.Pr(t),this.targetCount+=1,qi.resolve()}updateTargetData(e,t){return this.Pr(t),qi.resolve()}removeTargetData(e,t){return this.si.delete(t.target),this._i.jr(t.targetId),this.targetCount-=1,qi.resolve()}removeTargets(e,t,n){let r=0;const s=[];return this.si.forEach((i,o)=>{o.sequenceNumber<=t&&null===n.get(o.targetId)&&(this.si.delete(i),s.push(this.removeMatchingKeysForTargetId(e,o.targetId)),r++)}),qi.waitFor(s).next(()=>r)}getTargetCount(e){return qi.resolve(this.targetCount)}getTargetData(e,t){const n=this.si.get(t)||null;return qi.resolve(n)}addMatchingKeys(e,t,n){return this._i.Wr(t,n),qi.resolve()}removeMatchingKeys(e,t,n){this._i.zr(t,n);const r=this.persistence.referenceDelegate,s=[];return r&&t.forEach(t=>{s.push(r.markPotentiallyOrphaned(e,t))}),qi.waitFor(s)}removeMatchingKeysForTargetId(e,t){return this._i.jr(t),qi.resolve()}getMatchingKeysForTargetId(e,t){const n=this._i.Hr(t);return qi.resolve(n)}containsKey(e,t){return qi.resolve(this._i.containsKey(t))}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qd{constructor(e,t){this.ui={},this.overlays={},this.ci=new ro(0),this.li=!1,this.li=!0,this.hi=new qd,this.referenceDelegate=e(this),this.Pi=new Wd(this),this.indexManager=new Jl,this.remoteDocumentCache=new Gd(e=>this.referenceDelegate.Ti(e)),this.serializer=new cl(t),this.Ii=new Bd(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.li=!1,Promise.resolve()}get started(){return this.li}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new jd,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let n=this.ui[e.toKey()];return n||(n=new Kd(t,this.referenceDelegate),this.ui[e.toKey()]=n),n}getGlobalsCache(){return this.hi}getTargetCache(){return this.Pi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ii}runTransaction(e,t,n){Vs("MemoryPersistence","Starting transaction:",e);const r=new Jd(this.ci.next());return this.referenceDelegate.Ei(),n(r).next(e=>this.referenceDelegate.di(r).next(()=>e)).toPromise().then(e=>(r.raiseOnCommittedEvent(),e))}Ai(e,t){return qi.or(Object.values(this.ui).map(n=>()=>n.containsKey(e,t)))}}class Jd extends Bi{constructor(e){super(),this.currentSequenceNumber=e}}class Xd{constructor(e){this.persistence=e,this.Ri=new zd,this.Vi=null}static mi(e){return new Xd(e)}get fi(){if(this.Vi)return this.Vi;throw qs(60996)}addReference(e,t,n){return this.Ri.addReference(n,t),this.fi.delete(n.toString()),qi.resolve()}removeReference(e,t,n){return this.Ri.removeReference(n,t),this.fi.add(n.toString()),qi.resolve()}markPotentiallyOrphaned(e,t){return this.fi.add(t.toString()),qi.resolve()}removeTarget(e,t){this.Ri.jr(t.targetId).forEach(e=>this.fi.add(e.toString()));const n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(e,t.targetId).next(e=>{e.forEach(e=>this.fi.add(e.toString()))}).next(()=>n.removeTargetData(e,t))}Ei(){this.Vi=new Set}di(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return qi.forEach(this.fi,n=>{const r=yi.fromPath(n);return this.gi(e,r).next(e=>{e||t.removeEntry(r,Di.min())})}).next(()=>(this.Vi=null,t.apply(e)))}updateLimboDocument(e,t){return this.gi(e,t).next(e=>{e?this.fi.delete(t.toString()):this.fi.add(t.toString())})}Ti(e){return 0}gi(e,t){return qi.or([()=>qi.resolve(this.Ri.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ai(e,t)])}}class Yd{constructor(e,t){this.persistence=e,this.pi=new gu(e=>co(e.path),(e,t)=>e.isEqual(t)),this.garbageCollector=Cd(this,t)}static mi(e,t){return new Yd(e,t)}Ei(){}di(e){return qi.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}gr(e){const t=this.wr(e);return this.persistence.getTargetCache().getTargetCount(e).next(e=>t.next(t=>e+t))}wr(e){let t=0;return this.pr(e,e=>{t++}).next(()=>t)}pr(e,t){return qi.forEach(this.pi,(n,r)=>this.br(e,n,r).next(e=>e?qi.resolve():t(r)))}removeTargets(e,t,n){return this.persistence.getTargetCache().removeTargets(e,t,n)}removeOrphanedDocuments(e,t){let n=0;const r=this.persistence.getRemoteDocumentCache(),s=r.newChangeBuffer();return r.ii(e,r=>this.br(e,r,t).next(e=>{e||(n++,s.removeEntry(r,Di.min()))})).next(()=>s.apply(e)).next(()=>n)}markPotentiallyOrphaned(e,t){return this.pi.set(t,e.currentSequenceNumber),qi.resolve()}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,n)}addReference(e,t,n){return this.pi.set(n,e.currentSequenceNumber),qi.resolve()}removeReference(e,t,n){return this.pi.set(n,e.currentSequenceNumber),qi.resolve()}updateLimboDocument(e,t){return this.pi.set(t,e.currentSequenceNumber),qi.resolve()}Ti(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=oc(e.data.value)),t}br(e,t,n){return qi.or([()=>this.persistence.Ai(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const e=this.pi.get(t);return qi.resolve(void 0!==e&&e>n)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zd{constructor(e){this.serializer=e}k(e,t,n,r){const s=new $i("createOrUpgrade",t);n<1&&r>=1&&(e.createObjectStore(po),function(e){e.createObjectStore(go,{keyPath:"userId"});e.createObjectStore(yo,{keyPath:wo,autoIncrement:!0}).createIndex(vo,_o,{unique:!0}),e.createObjectStore(Eo)}(e),ef(e),function(e){e.createObjectStore(fo)}(e));let i=qi.resolve();return n<3&&r>=3&&(0!==n&&(function(e){e.deleteObjectStore(Mo),e.deleteObjectStore(Oo),e.deleteObjectStore(jo)}(e),ef(e)),i=i.next(()=>function(e){const t=e.store(jo),n={highestTargetId:0,highestListenSequenceNumber:0,lastRemoteSnapshotVersion:Di.min().toTimestamp(),targetCount:0};return t.put(Bo,n)}(s))),n<4&&r>=4&&(0!==n&&(i=i.next(()=>function(e,t){return t.store(yo).J().next(n=>{e.deleteObjectStore(yo),e.createObjectStore(yo,{keyPath:wo,autoIncrement:!0}).createIndex(vo,_o,{unique:!0});const r=t.store(yo),s=n.map(e=>r.put(e));return qi.waitFor(s)})}(e,s))),i=i.next(()=>{!function(e){e.createObjectStore($o,{keyPath:"clientId"})}(e)})),n<5&&r>=5&&(i=i.next(()=>this.yi(s))),n<6&&r>=6&&(i=i.next(()=>(function(e){e.createObjectStore(Ro)}(e),this.wi(s)))),n<7&&r>=7&&(i=i.next(()=>this.Si(s))),n<8&&r>=8&&(i=i.next(()=>this.bi(e,s))),n<9&&r>=9&&(i=i.next(()=>{!function(e){e.objectStoreNames.contains("remoteDocumentChanges")&&e.deleteObjectStore("remoteDocumentChanges")}(e)})),n<10&&r>=10&&(i=i.next(()=>this.Di(s))),n<11&&r>=11&&(i=i.next(()=>{!function(e){e.createObjectStore(Ko,{keyPath:"bundleId"})}(e),function(e){e.createObjectStore(Go,{keyPath:"name"})}(e)})),n<12&&r>=12&&(i=i.next(()=>{!function(e){const t=e.createObjectStore(ra,{keyPath:sa});t.createIndex(ia,oa,{unique:!1}),t.createIndex(aa,ca,{unique:!1})}(e)})),n<13&&r>=13&&(i=i.next(()=>function(e){const t=e.createObjectStore(So,{keyPath:Co});t.createIndex(ko,Ao),t.createIndex(No,Do)}(e)).next(()=>this.Ci(e,s)).next(()=>e.deleteObjectStore(fo))),n<14&&r>=14&&(i=i.next(()=>this.Fi(e,s))),n<15&&r>=15&&(i=i.next(()=>function(e){e.createObjectStore(Ho,{keyPath:"indexId",autoIncrement:!0}).createIndex(Wo,"collectionGroup",{unique:!1});e.createObjectStore(Qo,{keyPath:Jo}).createIndex(Xo,Yo,{unique:!1});e.createObjectStore(Zo,{keyPath:ea}).createIndex(ta,na,{unique:!1})}(e))),n<16&&r>=16&&(i=i.next(()=>{t.objectStore(Qo).clear()}).next(()=>{t.objectStore(Zo).clear()})),n<17&&r>=17&&(i=i.next(()=>{!function(e){e.createObjectStore(ua,{keyPath:"name"})}(e)})),n<18&&r>=18&&b()&&(i=i.next(()=>{t.objectStore(Qo).clear()}).next(()=>{t.objectStore(Zo).clear()})),i}wi(e){let t=0;return e.store(fo).ee((e,n)=>{t+=hd(n)}).next(()=>{const n={byteSize:t};return e.store(Ro).put(xo,n)})}yi(e){const t=e.store(go),n=e.store(yo);return t.J().next(t=>qi.forEach(t,t=>{const r=IDBKeyRange.bound([t.userId,so],[t.userId,t.lastAcknowledgedBatchId]);return n.J(vo,r).next(n=>qi.forEach(n,n=>{$s(n.userId===t.userId,18650,"Cannot process batch from unexpected user",{batchId:n.batchId});const r=pl(this.serializer,n);return ud(e,t.userId,r).next(()=>{})}))}))}Si(e){const t=e.store(Mo),n=e.store(fo);return e.store(jo).get(Bo).next(e=>{const r=[];return n.ee((n,s)=>{const i=new pi(n),o=[0,co(i)];r.push(t.get(o).next(n=>{return n?qi.resolve():(r=i,t.put({targetId:0,path:co(r),sequenceNumber:e.highestListenSequenceNumber}));var r}))}).next(()=>qi.waitFor(r))})}bi(e,t){e.createObjectStore(qo,{keyPath:zo});const n=t.store(qo),r=new Xl,s=e=>{if(r.add(e)){const t=e.lastSegment(),r=e.popLast();return n.put({collectionId:t,parent:co(r)})}};return t.store(fo).ee({X:!0},(e,t)=>{const n=new pi(e);return s(n.popLast())}).next(()=>t.store(Eo).ee({X:!0},([e,t,n],r)=>{const i=lo(t);return s(i.popLast())}))}Di(e){const t=e.store(Oo);return t.ee((e,n)=>{const r=ml(n),s=gl(this.serializer,r);return t.put(s)})}Ci(e,t){const n=t.store(fo),r=[];return n.ee((e,n)=>{const s=t.store(So),i=(a=n,a.document?new yi(pi.fromString(a.document.name).popFirst(5)):a.noDocument?yi.fromSegments(a.noDocument.path):a.unknownDocument?yi.fromSegments(a.unknownDocument.path):qs(36783)).path.toArray(),o={prefixPath:i.slice(0,i.length-2),collectionGroup:i[i.length-2],documentId:i[i.length-1],readTime:n.readTime||[0,0],unknownDocument:n.unknownDocument,noDocument:n.noDocument,document:n.document,hasCommittedMutations:!!n.hasCommittedMutations};var a;r.push(s.put(o))}).next(()=>qi.waitFor(r))}Fi(e,t){const n=t.store(yo),r=Rd(this.serializer),s=new Qd(Xd.mi,this.serializer.yt);return n.J().next(e=>{const n=new Map;return e.forEach(e=>{let t=n.get(e.userId)??ku();pl(this.serializer,e).keys().forEach(e=>t=t.add(e)),n.set(e.userId,t)}),qi.forEach(n,(e,n)=>{const i=new Ps(n),o=El.wt(this.serializer,i),a=s.getIndexManager(i),c=ld.wt(i,this.serializer,a,s.referenceDelegate);return new Fd(r,c,o,a).recalculateAndSaveOverlaysForDocumentKeys(new wa(t,ro.ce),e).next()})})}}function ef(e){e.createObjectStore(Mo,{keyPath:Uo}).createIndex(Vo,Fo,{unique:!0}),e.createObjectStore(Oo,{keyPath:"targetId"}).createIndex(Po,Lo,{unique:!0}),e.createObjectStore(jo)}const tf="IndexedDbPersistence",nf=18e5,rf=5e3,sf="Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.";class of{constructor(e,t,n,r,s,i,o,a,c,u,h=18){if(this.allowTabSynchronization=e,this.persistenceKey=t,this.clientId=n,this.Mi=s,this.window=i,this.document=o,this.xi=c,this.Oi=u,this.Ni=h,this.ci=null,this.li=!1,this.isPrimary=!1,this.networkEnabled=!0,this.Bi=null,this.inForeground=!1,this.Li=null,this.ki=null,this.qi=Number.NEGATIVE_INFINITY,this.Qi=e=>Promise.resolve(),!of.v())throw new Hs(Gs.UNIMPLEMENTED,"This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");this.referenceDelegate=new kd(this,r),this.$i=t+"main",this.serializer=new cl(a),this.Ui=new Ki(this.$i,this.Ni,new Zd(this.serializer)),this.hi=new Cl,this.Pi=new yd(this.referenceDelegate,this.serializer),this.remoteDocumentCache=Rd(this.serializer),this.Ii=new Il,this.window&&this.window.localStorage?this.Ki=this.window.localStorage:(this.Ki=null,!1===u&&Fs(tf,"LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."))}start(){return this.Wi().then(()=>{if(!this.isPrimary&&!this.allowTabSynchronization)throw new Hs(Gs.FAILED_PRECONDITION,sf);return this.Gi(),this.zi(),this.ji(),this.runTransaction("getHighestListenSequenceNumber","readonly",e=>this.Pi.getHighestSequenceNumber(e))}).then(e=>{this.ci=new ro(e,this.xi)}).then(()=>{this.li=!0}).catch(e=>(this.Ui&&this.Ui.close(),Promise.reject(e)))}Ji(e){return this.Qi=async t=>{if(this.started)return e(t)},e(this.isPrimary)}setDatabaseDeletedListener(e){this.Ui.$(async t=>{null===t.newVersion&&await e()})}setNetworkEnabled(e){this.networkEnabled!==e&&(this.networkEnabled=e,this.Mi.enqueueAndForget(async()=>{this.started&&await this.Wi()}))}Wi(){return this.runTransaction("updateClientMetadataAndTryBecomePrimary","readwrite",e=>cf(e).put({clientId:this.clientId,updateTimeMs:Date.now(),networkEnabled:this.networkEnabled,inForeground:this.inForeground}).next(()=>{if(this.isPrimary)return this.Hi(e).next(e=>{e||(this.isPrimary=!1,this.Mi.enqueueRetryable(()=>this.Qi(!1)))})}).next(()=>this.Yi(e)).next(t=>this.isPrimary&&!t?this.Zi(e).next(()=>!1):!!t&&this.Xi(e).next(()=>!0))).catch(e=>{if(Qi(e))return Vs(tf,"Failed to extend owner lease: ",e),this.isPrimary;if(!this.allowTabSynchronization)throw e;return Vs(tf,"Releasing owner lease after error during lease refresh",e),!1}).then(e=>{this.isPrimary!==e&&this.Mi.enqueueRetryable(()=>this.Qi(e)),this.isPrimary=e})}Hi(e){return af(e).get(mo).next(e=>qi.resolve(this.es(e)))}ts(e){return cf(e).delete(this.clientId)}async ns(){if(this.isPrimary&&!this.rs(this.qi,nf)){this.qi=Date.now();const e=await this.runTransaction("maybeGarbageCollectMultiClientState","readwrite-primary",e=>{const t=va(e,$o);return t.J().next(e=>{const n=this.ss(e,nf),r=e.filter(e=>-1===n.indexOf(e));return qi.forEach(r,e=>t.delete(e.clientId)).next(()=>r)})}).catch(()=>[]);if(this.Ki)for(const t of e)this.Ki.removeItem(this._s(t.clientId))}}ji(){this.ki=this.Mi.enqueueAfterDelay("client_metadata_refresh",4e3,()=>this.Wi().then(()=>this.ns()).then(()=>this.ji()))}es(e){return!!e&&e.ownerId===this.clientId}Yi(e){return this.Oi?qi.resolve(!0):af(e).get(mo).next(t=>{if(null!==t&&this.rs(t.leaseTimestampMs,rf)&&!this.us(t.ownerId)){if(this.es(t)&&this.networkEnabled)return!0;if(!this.es(t)){if(!t.allowTabSynchronization)throw new Hs(Gs.FAILED_PRECONDITION,sf);return!1}}return!(!this.networkEnabled||!this.inForeground)||cf(e).J().next(e=>void 0===this.ss(e,rf).find(e=>{if(this.clientId!==e.clientId){const t=!this.networkEnabled&&e.networkEnabled,n=!this.inForeground&&e.inForeground,r=this.networkEnabled===e.networkEnabled;if(t||n&&r)return!0}return!1}))}).next(e=>(this.isPrimary!==e&&Vs(tf,`Client ${e?"is":"is not"} eligible for a primary lease.`),e))}async shutdown(){this.li=!1,this.cs(),this.ki&&(this.ki.cancel(),this.ki=null),this.ls(),this.hs(),await this.Ui.runTransaction("shutdown","readwrite",[po,$o],e=>{const t=new wa(e,ro.ce);return this.Zi(t).next(()=>this.ts(t))}),this.Ui.close(),this.Ps()}ss(e,t){return e.filter(e=>this.rs(e.updateTimeMs,t)&&!this.us(e.clientId))}Ts(){return this.runTransaction("getActiveClients","readonly",e=>cf(e).J().next(e=>this.ss(e,nf).map(e=>e.clientId)))}get started(){return this.li}getGlobalsCache(){return this.hi}getMutationQueue(e,t){return ld.wt(e,this.serializer,t,this.referenceDelegate)}getTargetCache(){return this.Pi}getRemoteDocumentCache(){return this.remoteDocumentCache}getIndexManager(e){return new ed(e,this.serializer.yt.databaseId)}getDocumentOverlayCache(e){return El.wt(this.serializer,e)}getBundleCache(){return this.Ii}runTransaction(e,t,n){Vs(tf,"Starting transaction:",e);const r="readonly"===t?"readonly":"readwrite",s=18===(i=this.Ni)?ya:17===i?ga:16===i?ma:15===i?pa:14===i?fa:13===i?da:12===i?la:11===i?ha:void qs(60245);var i;let o;return this.Ui.runTransaction(e,r,s,r=>(o=new wa(r,this.ci?this.ci.next():ro.ce),"readwrite-primary"===t?this.Hi(o).next(e=>!!e||this.Yi(o)).next(t=>{if(!t)throw Fs(`Failed to obtain primary lease for action '${e}'.`),this.isPrimary=!1,this.Mi.enqueueRetryable(()=>this.Qi(!1)),new Hs(Gs.FAILED_PRECONDITION,Fi);return n(o)}).next(e=>this.Xi(o).next(()=>e)):this.Is(o).next(()=>n(o)))).then(e=>(o.raiseOnCommittedEvent(),e))}Is(e){return af(e).get(mo).next(e=>{if(null!==e&&this.rs(e.leaseTimestampMs,rf)&&!this.us(e.ownerId)&&!this.es(e)&&!(this.Oi||this.allowTabSynchronization&&e.allowTabSynchronization))throw new Hs(Gs.FAILED_PRECONDITION,sf)})}Xi(e){const t={ownerId:this.clientId,allowTabSynchronization:this.allowTabSynchronization,leaseTimestampMs:Date.now()};return af(e).put(mo,t)}static v(){return Ki.v()}Zi(e){const t=af(e);return t.get(mo).next(e=>this.es(e)?(Vs(tf,"Releasing primary lease."),t.delete(mo)):qi.resolve())}rs(e,t){const n=Date.now();return!(e<n-t||e>n&&(Fs(`Detected an update time that is in the future: ${e} > ${n}`),1))}Gi(){null!==this.document&&"function"==typeof this.document.addEventListener&&(this.Li=()=>{this.Mi.enqueueAndForget(()=>(this.inForeground="visible"===this.document.visibilityState,this.Wi()))},this.document.addEventListener("visibilitychange",this.Li),this.inForeground="visible"===this.document.visibilityState)}ls(){this.Li&&(this.document.removeEventListener("visibilitychange",this.Li),this.Li=null)}zi(){"function"==typeof this.window?.addEventListener&&(this.Bi=()=>{this.cs();const e=/(?:Version|Mobile)\/1[456]/;I()&&(navigator.appVersion.match(e)||navigator.userAgent.match(e))&&this.Mi.enterRestrictedMode(!0),this.Mi.enqueueAndForget(()=>this.shutdown())},this.window.addEventListener("pagehide",this.Bi))}hs(){this.Bi&&(this.window.removeEventListener("pagehide",this.Bi),this.Bi=null)}us(e){try{const t=null!==this.Ki?.getItem(this._s(e));return Vs(tf,`Client '${e}' ${t?"is":"is not"} zombied in LocalStorage`),t}catch(t){return Fs(tf,"Failed to get zombied client id.",t),!1}}cs(){if(this.Ki)try{this.Ki.setItem(this._s(this.clientId),String(Date.now()))}catch(e){Fs("Failed to set zombie client id.",e)}}Ps(){if(this.Ki)try{this.Ki.removeItem(this._s(this.clientId))}catch(e){}}_s(e){return`firestore_zombie_${this.persistenceKey}_${e}`}}function af(e){return va(e,po)}function cf(e){return va(e,$o)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class uf{constructor(e,t,n,r){this.targetId=e,this.fromCache=t,this.Es=n,this.ds=r}static As(e,t){let n=ku(),r=ku();for(const s of t.docChanges)switch(s.type){case 0:n=n.add(s.doc.key);break;case 1:r=r.add(s.doc.key)}return new uf(e,t.fromCache,n,r)}}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hf{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lf{constructor(){this.Rs=!1,this.Vs=!1,this.fs=100,this.gs=I()?8:Gi(v())>0?6:4}initialize(e,t){this.ps=e,this.indexManager=t,this.Rs=!0}getDocumentsMatchingQuery(e,t,n,r){const s={result:null};return this.ys(e,t).next(e=>{s.result=e}).next(()=>{if(!s.result)return this.ws(e,t,r,n).next(e=>{s.result=e})}).next(()=>{if(s.result)return;const n=new hf;return this.Ss(e,t,n).next(r=>{if(s.result=r,this.Vs)return this.bs(e,t,n,r.size)})}).next(()=>s.result)}bs(e,t,n,r){return n.documentReadCount<this.fs?(Us()<=F.DEBUG&&Vs("QueryEngine","SDK will not create cache indexes for query:",du(t),"since it only creates cache indexes for collection contains","more than or equal to",this.fs,"documents"),qi.resolve()):(Us()<=F.DEBUG&&Vs("QueryEngine","Query:",du(t),"scans",n.documentReadCount,"local documents and returns",r,"documents as results."),n.documentReadCount>this.gs*r?(Us()<=F.DEBUG&&Vs("QueryEngine","The SDK decides to create cache indexes for query:",du(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,au(t))):qi.resolve())}ys(e,t){if(su(t))return qi.resolve(null);let n=au(t);return this.indexManager.getIndexType(e,n).next(r=>0===r?null:(null!==t.limit&&1===r&&(t=uu(t,null,"F"),n=au(t)),this.indexManager.getDocumentsMatchingTarget(e,n).next(r=>{const s=ku(...r);return this.ps.getDocuments(e,s).next(r=>this.indexManager.getMinOffset(e,n).next(n=>{const i=this.Ds(t,r);return this.Cs(t,i,s,n.readTime)?this.ys(e,uu(t,null,"F")):this.vs(e,i,t,n)}))})))}ws(e,t,n,r){return su(t)||r.isEqual(Di.min())?qi.resolve(null):this.ps.getDocuments(e,n).next(s=>{const i=this.Ds(t,s);return this.Cs(t,i,n,r)?qi.resolve(null):(Us()<=F.DEBUG&&Vs("QueryEngine","Re-using previous result from %s to execute query: %s",r.toString(),du(t)),this.vs(e,i,t,function(e,t){const n=e.toTimestamp().seconds,r=e.toTimestamp().nanoseconds+1,s=Di.fromTimestamp(1e9===r?new Ni(n+1,0):new Ni(n,r));return new Ui(s,yi.empty(),t)}(r,-1)).next(e=>e))})}Ds(e,t){let n=new Ca(pu(e));return t.forEach((t,r)=>{fu(e,r)&&(n=n.add(r))}),n}Cs(e,t,n,r){if(null===e.limit)return!1;if(n.size!==t.size)return!0;const s="F"===e.limitType?t.last():t.first();return!!s&&(s.hasPendingWrites||s.version.compareTo(r)>0)}Ss(e,t,n){return Us()<=F.DEBUG&&Vs("QueryEngine","Using full collection scan to execute query:",du(t)),this.ps.getDocumentsMatchingQuery(e,t,Ui.min(),n)}vs(e,t,n,r){return this.ps.getDocumentsMatchingQuery(e,n,r).next(e=>(t.forEach(t=>{e=e.insert(t.key,t)}),e))}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const df="LocalStore";class ff{constructor(e,t,n,r){this.persistence=e,this.Fs=t,this.serializer=r,this.Ms=new Ta(ii),this.xs=new gu(e=>Jc(e),Xc),this.Os=new Map,this.Ns=e.getRemoteDocumentCache(),this.Pi=e.getTargetCache(),this.Ii=e.getBundleCache(),this.Bs(n)}Bs(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new Fd(this.Ns,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Ns.setIndexManager(this.indexManager),this.Fs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.Ms))}}function pf(e,t,n,r){return new ff(e,t,n,r)}async function mf(e,t){const n=Ks(e);return await n.persistence.runTransaction("Handle user change","readonly",e=>{let r;return n.mutationQueue.getAllMutationBatches(e).next(s=>(r=s,n.Bs(t),n.mutationQueue.getAllMutationBatches(e))).next(t=>{const s=[],i=[];let o=ku();for(const e of r){s.push(e.batchId);for(const t of e.mutations)o=o.add(t.key)}for(const e of t){i.push(e.batchId);for(const t of e.mutations)o=o.add(t.key)}return n.localDocuments.getDocuments(e,o).next(e=>({Ls:e,removedBatchIds:s,addedBatchIds:i}))})})}function gf(e){const t=Ks(e);return t.persistence.runTransaction("Get last remote snapshot version","readonly",e=>t.Pi.getLastRemoteSnapshotVersion(e))}function yf(e,t){const n=Ks(e),r=t.snapshotVersion;let s=n.Ms;return n.persistence.runTransaction("Apply remote event","readwrite-primary",e=>{const i=n.Ns.newChangeBuffer({trackRemovals:!0});s=n.Ms;const o=[];t.targetChanges.forEach((i,a)=>{const c=s.get(a);if(!c)return;o.push(n.Pi.removeMatchingKeys(e,i.removedDocuments,a).next(()=>n.Pi.addMatchingKeys(e,i.addedDocuments,a)));let u=c.withSequenceNumber(e.currentSequenceNumber);null!==t.targetMismatches.get(a)?u=u.withResumeToken(Ra.EMPTY_BYTE_STRING,Di.min()).withLastLimboFreeSnapshotVersion(Di.min()):i.resumeToken.approximateByteSize()>0&&(u=u.withResumeToken(i.resumeToken,r)),s=s.insert(a,u),function(e,t,n){if(0===e.resumeToken.approximateByteSize())return!0;if(t.snapshotVersion.toMicroseconds()-e.snapshotVersion.toMicroseconds()>=3e8)return!0;return n.addedDocuments.size+n.modifiedDocuments.size+n.removedDocuments.size>0}(c,u,i)&&o.push(n.Pi.updateTargetData(e,u))});let a=wu(),c=ku();if(t.documentUpdates.forEach(r=>{t.resolvedLimboDocuments.has(r)&&o.push(n.persistence.referenceDelegate.updateLimboDocument(e,r))}),o.push(function(e,t,n){let r=ku(),s=ku();return n.forEach(e=>r=r.add(e)),t.getEntries(e,r).next(e=>{let r=wu();return n.forEach((n,i)=>{const o=e.get(n);i.isFoundDocument()!==o.isFoundDocument()&&(s=s.add(n)),i.isNoDocument()&&i.version.isEqual(Di.min())?(t.removeEntry(n,i.readTime),r=r.insert(n,i)):!o.isValidDocument()||i.version.compareTo(o.version)>0||0===i.version.compareTo(o.version)&&o.hasPendingWrites?(t.addEntry(i),r=r.insert(n,i)):Vs(df,"Ignoring outdated watch update for ",n,". Current version:",o.version," Watch version:",i.version)}),{ks:r,qs:s}})}(e,i,t.documentUpdates).next(e=>{a=e.ks,c=e.qs})),!r.isEqual(Di.min())){const t=n.Pi.getLastRemoteSnapshotVersion(e).next(t=>n.Pi.setTargetsMetadata(e,e.currentSequenceNumber,r));o.push(t)}return qi.waitFor(o).next(()=>i.apply(e)).next(()=>n.localDocuments.getLocalViewOfDocuments(e,a,c)).next(()=>a)}).then(e=>(n.Ms=s,e))}function wf(e,t){const n=Ks(e);return n.persistence.runTransaction("Get next mutation batch","readonly",e=>(void 0===t&&(t=so),n.mutationQueue.getNextMutationBatchAfterBatchId(e,t)))}async function vf(e,t,n){const r=Ks(e),s=r.Ms.get(t),i=n?"readwrite":"readwrite-primary";try{n||await r.persistence.runTransaction("Release target",i,e=>r.persistence.referenceDelegate.removeTarget(e,s))}catch(o){if(!Qi(o))throw o;Vs(df,`Failed to update sequence numbers for target ${t}: ${o}`)}r.Ms=r.Ms.remove(t),r.xs.delete(s.target)}function _f(e,t,n){const r=Ks(e);let s=Di.min(),i=ku();return r.persistence.runTransaction("Execute query","readwrite",e=>function(e,t,n){const r=Ks(e),s=r.xs.get(n);return void 0!==s?qi.resolve(r.Ms.get(s)):r.Pi.getTargetData(t,n)}(r,e,au(t)).next(t=>{if(t)return s=t.lastLimboFreeSnapshotVersion,r.Pi.getMatchingKeysForTargetId(e,t.targetId).next(e=>{i=e})}).next(()=>r.Fs.getDocumentsMatchingQuery(e,t,n?s:Di.min(),n?i:ku())).next(e=>(function(e,t,n){let r=e.Os.get(t)||Di.min();n.forEach((e,t)=>{t.readTime.compareTo(r)>0&&(r=t.readTime)}),e.Os.set(t,r)}(r,function(e){return e.collectionGroup||(e.path.length%2==1?e.path.lastSegment():e.path.get(e.path.length-2))}(t),e),{documents:e,Qs:i})))}class If{constructor(){this.activeTargetIds=Au}zs(e){this.activeTargetIds=this.activeTargetIds.add(e)}js(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Gs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class bf{constructor(){this.Mo=new If,this.xo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,n){}addLocalQueryTarget(e,t=!0){return t&&this.Mo.zs(e),this.xo[e]||"not-current"}updateQueryState(e,t,n){this.xo[e]=t}removeLocalQueryTarget(e){this.Mo.js(e)}isLocalQueryTarget(e){return this.Mo.activeTargetIds.has(e)}clearQueryState(e){delete this.xo[e]}getAllActiveQueryTargets(){return this.Mo.activeTargetIds}isActiveQueryTarget(e){return this.Mo.activeTargetIds.has(e)}start(){return this.Mo=new If,Promise.resolve()}handleUserChange(e,t,n){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tf{Oo(e){}shutdown(){}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ef="ConnectivityMonitor";class Sf{constructor(){this.No=()=>this.Bo(),this.Lo=()=>this.ko(),this.qo=[],this.Qo()}Oo(e){this.qo.push(e)}shutdown(){window.removeEventListener("online",this.No),window.removeEventListener("offline",this.Lo)}Qo(){window.addEventListener("online",this.No),window.addEventListener("offline",this.Lo)}Bo(){Vs(Ef,"Network connectivity changed: AVAILABLE");for(const e of this.qo)e(0)}ko(){Vs(Ef,"Network connectivity changed: UNAVAILABLE");for(const e of this.qo)e(1)}static v(){return"undefined"!=typeof window&&void 0!==window.addEventListener&&void 0!==window.removeEventListener}}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Cf=null;function kf(){return null===Cf?Cf=268435456+Math.round(2147483648*Math.random()):Cf++,"0x"+Cf.toString(16)
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}const Af="RestConnection",Nf={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class Df{get $o(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",n=encodeURIComponent(this.databaseId.projectId),r=encodeURIComponent(this.databaseId.database);this.Uo=t+"://"+e.host,this.Ko=`projects/${n}/databases/${r}`,this.Wo=this.databaseId.database===$a?`project_id=${n}`:`project_id=${n}&database_id=${r}`}Go(e,t,n,r,s){const i=kf(),o=this.zo(e,t.toUriEncodedString());Vs(Af,`Sending RPC '${e}' ${i}:`,o,n);const a={"google-cloud-resource-prefix":this.Ko,"x-goog-request-params":this.Wo};this.jo(a,r,s);const{host:c}=new URL(o),u=f(c);return this.Jo(e,o,a,n,u).then(t=>(Vs(Af,`Received RPC '${e}' ${i}: `,t),t),t=>{throw Bs(Af,`RPC '${e}' ${i} failed with error: `,t,"url: ",o,"request:",n),t})}Ho(e,t,n,r,s,i){return this.Go(e,t,n,r,s)}jo(e,t,n){e["X-Goog-Api-Client"]="gl-js/ fire/"+Ls,e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach((t,n)=>e[n]=t),n&&n.headers.forEach((t,n)=>e[n]=t)}zo(e,t){const n=Nf[e];return`${this.Uo}/v1/${t}:${n}`}terminate(){}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rf{constructor(e){this.Yo=e.Yo,this.Zo=e.Zo}Xo(e){this.e_=e}t_(e){this.n_=e}r_(e){this.i_=e}onMessage(e){this.s_=e}close(){this.Zo()}send(e){this.Yo(e)}o_(){this.e_()}__(){this.n_()}a_(e){this.i_(e)}u_(e){this.s_(e)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xf="WebChannelConnection";class Of extends Df{constructor(e){super(e),this.c_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}Jo(e,t,n,r,s){const i=kf();return new Promise((s,o)=>{const a=new Ts;a.setWithCredentials(!0),a.listenOnce(Ss.COMPLETE,()=>{try{switch(a.getLastErrorCode()){case Cs.NO_ERROR:const t=a.getResponseJson();Vs(xf,`XHR for RPC '${e}' ${i} received:`,JSON.stringify(t)),s(t);break;case Cs.TIMEOUT:Vs(xf,`RPC '${e}' ${i} timed out`),o(new Hs(Gs.DEADLINE_EXCEEDED,"Request time out"));break;case Cs.HTTP_ERROR:const n=a.getStatus();if(Vs(xf,`RPC '${e}' ${i} failed with status:`,n,"response text:",a.getResponseText()),n>0){let e=a.getResponseJson();Array.isArray(e)&&(e=e[0]);const t=e?.error;if(t&&t.status&&t.message){const e=function(e){const t=e.toLowerCase().replace(/_/g,"-");return Object.values(Gs).indexOf(t)>=0?t:Gs.UNKNOWN}(t.status);o(new Hs(e,t.message))}else o(new Hs(Gs.UNKNOWN,"Server responded with status "+a.getStatus()))}else o(new Hs(Gs.UNAVAILABLE,"Connection failed."));break;default:qs(9055,{l_:e,streamId:i,h_:a.getLastErrorCode(),P_:a.getLastError()})}}finally{Vs(xf,`RPC '${e}' ${i} completed.`)}});const c=JSON.stringify(r);Vs(xf,`RPC '${e}' ${i} sending request:`,r),a.send(t,"POST",c,n,15)})}T_(e,t,n){const r=kf(),s=[this.Uo,"/","google.firestore.v1.Firestore","/",e,"/channel"],i=Ds(),o=Ns(),a={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},c=this.longPollingOptions.timeoutSeconds;void 0!==c&&(a.longPollingTimeout=Math.round(1e3*c)),this.useFetchStreams&&(a.useFetchStreams=!0),this.jo(a.initMessageHeaders,t,n),a.encodeInitMessageHeaders=!0;const u=s.join("");Vs(xf,`Creating RPC '${e}' stream ${r}: ${u}`,a);const h=i.createWebChannel(u,a);this.I_(h);let l=!1,d=!1;const f=new Rf({Yo:t=>{d?Vs(xf,`Not sending because RPC '${e}' stream ${r} is closed:`,t):(l||(Vs(xf,`Opening RPC '${e}' stream ${r} transport.`),h.open(),l=!0),Vs(xf,`RPC '${e}' stream ${r} sending:`,t),h.send(t))},Zo:()=>h.close()}),p=(e,t,n)=>{e.listen(t,e=>{try{n(e)}catch(t){setTimeout(()=>{throw t},0)}})};return p(h,Es.EventType.OPEN,()=>{d||(Vs(xf,`RPC '${e}' stream ${r} transport opened.`),f.o_())}),p(h,Es.EventType.CLOSE,()=>{d||(d=!0,Vs(xf,`RPC '${e}' stream ${r} transport closed`),f.a_(),this.E_(h))}),p(h,Es.EventType.ERROR,t=>{d||(d=!0,Bs(xf,`RPC '${e}' stream ${r} transport errored. Name:`,t.name,"Message:",t.message),f.a_(new Hs(Gs.UNAVAILABLE,"The operation could not be completed")))}),p(h,Es.EventType.MESSAGE,t=>{if(!d){const n=t.data[0];$s(!!n,16349);const s=n,i=s?.error||s[0]?.error;if(i){Vs(xf,`RPC '${e}' stream ${r} received error:`,i);const t=i.status;let n=function(e){const t=lh[e];if(void 0!==t)return fh(t)}(t),s=i.message;void 0===n&&(n=Gs.INTERNAL,s="Unknown error status: "+t+" with message "+i.message),d=!0,f.a_(new Hs(n,s)),h.close()}else Vs(xf,`RPC '${e}' stream ${r} received:`,n),f.u_(n)}}),p(o,As.STAT_EVENT,t=>{t.stat===ks.PROXY?Vs(xf,`RPC '${e}' stream ${r} detected buffering proxy`):t.stat===ks.NOPROXY&&Vs(xf,`RPC '${e}' stream ${r} detected no buffering proxy`)}),setTimeout(()=>{f.__()},0),f}terminate(){this.c_.forEach(e=>e.close()),this.c_=[]}I_(e){this.c_.push(e)}E_(e){this.c_=this.c_.filter(t=>t===e)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pf(){return"undefined"!=typeof document?document:null}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Lf(e){return new Rh(e,!0)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mf{constructor(e,t,n=1e3,r=1.5,s=6e4){this.Mi=e,this.timerId=t,this.d_=n,this.A_=r,this.R_=s,this.V_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.V_=0}g_(){this.V_=this.R_}p_(e){this.cancel();const t=Math.floor(this.V_+this.y_()),n=Math.max(0,Date.now()-this.f_),r=Math.max(0,t-n);r>0&&Vs("ExponentialBackoff",`Backing off for ${r} ms (base delay: ${this.V_} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`),this.m_=this.Mi.enqueueAfterDelay(this.timerId,r,()=>(this.f_=Date.now(),e())),this.V_*=this.A_,this.V_<this.d_&&(this.V_=this.d_),this.V_>this.R_&&(this.V_=this.R_)}w_(){null!==this.m_&&(this.m_.skipDelay(),this.m_=null)}cancel(){null!==this.m_&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.V_}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Uf="PersistentStream";class Vf{constructor(e,t,n,r,s,i,o,a){this.Mi=e,this.S_=n,this.b_=r,this.connection=s,this.authCredentialsProvider=i,this.appCheckCredentialsProvider=o,this.listener=a,this.state=0,this.D_=0,this.C_=null,this.v_=null,this.stream=null,this.F_=0,this.M_=new Mf(e,t)}x_(){return 1===this.state||5===this.state||this.O_()}O_(){return 2===this.state||3===this.state}start(){this.F_=0,4!==this.state?this.auth():this.N_()}async stop(){this.x_()&&await this.close(0)}B_(){this.state=0,this.M_.reset()}L_(){this.O_()&&null===this.C_&&(this.C_=this.Mi.enqueueAfterDelay(this.S_,6e4,()=>this.k_()))}q_(e){this.Q_(),this.stream.send(e)}async k_(){if(this.O_())return this.close(0)}Q_(){this.C_&&(this.C_.cancel(),this.C_=null)}U_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,t){this.Q_(),this.U_(),this.M_.cancel(),this.D_++,4!==e?this.M_.reset():t&&t.code===Gs.RESOURCE_EXHAUSTED?(Fs(t.toString()),Fs("Using maximum backoff delay to prevent overloading the backend."),this.M_.g_()):t&&t.code===Gs.UNAUTHENTICATED&&3!==this.state&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),null!==this.stream&&(this.K_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.r_(t)}K_(){}auth(){this.state=1;const e=this.W_(this.D_),t=this.D_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([e,n])=>{this.D_===t&&this.G_(e,n)},t=>{e(()=>{const e=new Hs(Gs.UNKNOWN,"Fetching auth token failed: "+t.message);return this.z_(e)})})}G_(e,t){const n=this.W_(this.D_);this.stream=this.j_(e,t),this.stream.Xo(()=>{n(()=>this.listener.Xo())}),this.stream.t_(()=>{n(()=>(this.state=2,this.v_=this.Mi.enqueueAfterDelay(this.b_,1e4,()=>(this.O_()&&(this.state=3),Promise.resolve())),this.listener.t_()))}),this.stream.r_(e=>{n(()=>this.z_(e))}),this.stream.onMessage(e=>{n(()=>1==++this.F_?this.J_(e):this.onNext(e))})}N_(){this.state=5,this.M_.p_(async()=>{this.state=0,this.start()})}z_(e){return Vs(Uf,`close with error: ${e}`),this.stream=null,this.close(4,e)}W_(e){return t=>{this.Mi.enqueueAndForget(()=>this.D_===e?t():(Vs(Uf,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class Ff extends Vf{constructor(e,t,n,r,s,i){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,n,r,i),this.serializer=s}j_(e,t){return this.connection.T_("Listen",e,t)}J_(e){return this.onNext(e)}onNext(e){this.M_.reset();const t=function(e,t){let n;if("targetChange"in t){t.targetChange;const s="NO_CHANGE"===(r=t.targetChange.targetChangeType||"NO_CHANGE")?0:"ADD"===r?1:"REMOVE"===r?2:"CURRENT"===r?3:"RESET"===r?4:qs(39313,{state:r}),i=t.targetChange.targetIds||[],o=function(e,t){return e.useProto3Json?($s(void 0===t||"string"==typeof t,58123),Ra.fromBase64String(t||"")):($s(void 0===t||t instanceof Buffer||t instanceof Uint8Array,16193),Ra.fromUint8Array(t||new Uint8Array))}(e,t.targetChange.resumeToken),a=t.targetChange.cause,c=a&&function(e){const t=void 0===e.code?Gs.UNKNOWN:fh(e.code);return new Hs(t,e.message||"")}(a);n=new Th(s,i,o,c||null)}else if("documentChange"in t){t.documentChange;const r=t.documentChange;r.document,r.document.name,r.document.updateTime;const s=jh(e,r.document.name),i=Mh(r.document.updateTime),o=r.document.createTime?Mh(r.document.createTime):Di.min(),a=new Ic({mapValue:{fields:r.document.fields}}),c=Tc.newFoundDocument(s,i,o,a),u=r.targetIds||[],h=r.removedTargetIds||[];n=new Ih(u,h,c.key,c)}else if("documentDelete"in t){t.documentDelete;const r=t.documentDelete;r.document;const s=jh(e,r.document),i=r.readTime?Mh(r.readTime):Di.min(),o=Tc.newNoDocument(s,i),a=r.removedTargetIds||[];n=new Ih([],a,o.key,o)}else if("documentRemove"in t){t.documentRemove;const r=t.documentRemove;r.document;const s=jh(e,r.document),i=r.removedTargetIds||[];n=new Ih([],i,s,null)}else{if(!("filter"in t))return qs(11601,{Rt:t});{t.filter;const e=t.filter;e.targetId;const{count:r=0,unchangedNames:s}=e,i=new hh(r,s),o=e.targetId;n=new bh(o,i)}}var r;return n}(this.serializer,e),n=function(e){if(!("targetChange"in e))return Di.min();const t=e.targetChange;return t.targetIds&&t.targetIds.length?Di.min():t.readTime?Mh(t.readTime):Di.min()}(e);return this.listener.H_(t,n)}Y_(e){const t={};t.database=$h(this.serializer),t.addTarget=function(e,t){let n;const r=t.target;if(n=Yc(r)?{documents:Qh(e,r)}:{query:Jh(e,r).ft},n.targetId=t.targetId,t.resumeToken.approximateByteSize()>0){n.resumeToken=Ph(e,t.resumeToken);const r=xh(e,t.expectedCount);null!==r&&(n.expectedCount=r)}else if(t.snapshotVersion.compareTo(Di.min())>0){n.readTime=Oh(e,t.snapshotVersion.toTimestamp());const r=xh(e,t.expectedCount);null!==r&&(n.expectedCount=r)}return n}(this.serializer,e);const n=function(e,t){const n=function(e){switch(e){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return qs(28987,{purpose:e})}}(t.purpose);return null==n?null:{"goog-listen-tags":n}}(this.serializer,e);n&&(t.labels=n),this.q_(t)}Z_(e){const t={};t.database=$h(this.serializer),t.removeTarget=e,this.q_(t)}}class Bf extends Vf{constructor(e,t,n,r,s,i){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,n,r,i),this.serializer=s}get X_(){return this.F_>0}start(){this.lastStreamToken=void 0,super.start()}K_(){this.X_&&this.ea([])}j_(e,t){return this.connection.T_("Write",e,t)}J_(e){return $s(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,$s(!e.writeResults||0===e.writeResults.length,55816),this.listener.ta()}onNext(e){$s(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.M_.reset();const t=function(e,t){return e&&e.length>0?($s(void 0!==t,14353),e.map(e=>function(e,t){let n=e.updateTime?Mh(e.updateTime):Mh(t);return n.isEqual(Di.min())&&(n=Mh(t)),new Ku(n,e.transformResults||[])}(e,t))):[]}(e.writeResults,e.commitTime),n=Mh(e.commitTime);return this.listener.na(n,t)}ra(){const e={};e.database=$h(this.serializer),this.q_(e)}ea(e){const t={streamToken:this.lastStreamToken,writes:e.map(e=>Hh(this.serializer,e))};this.q_(t)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jf{}class qf extends jf{constructor(e,t,n,r){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=n,this.serializer=r,this.ia=!1}sa(){if(this.ia)throw new Hs(Gs.FAILED_PRECONDITION,"The client has already been terminated.")}Go(e,t,n,r){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,i])=>this.connection.Go(e,Vh(t,n),r,s,i)).catch(e=>{throw"FirebaseError"===e.name?(e.code===Gs.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),e):new Hs(Gs.UNKNOWN,e.toString())})}Ho(e,t,n,r,s){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,o])=>this.connection.Ho(e,Vh(t,n),r,i,o,s)).catch(e=>{throw"FirebaseError"===e.name?(e.code===Gs.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),e):new Hs(Gs.UNKNOWN,e.toString())})}terminate(){this.ia=!0,this.connection.terminate()}}class zf{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.oa=0,this._a=null,this.aa=!0}ua(){0===this.oa&&(this.ca("Unknown"),this._a=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this._a=null,this.la("Backend didn't respond within 10 seconds."),this.ca("Offline"),Promise.resolve())))}ha(e){"Online"===this.state?this.ca("Unknown"):(this.oa++,this.oa>=1&&(this.Pa(),this.la(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ca("Offline")))}set(e){this.Pa(),this.oa=0,"Online"===e&&(this.aa=!1),this.ca(e)}ca(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}la(e){const t=`Could not reach Cloud Firestore backend. ${e}\nThis typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.aa?(Fs(t),this.aa=!1):Vs("OnlineStateTracker",t)}Pa(){null!==this._a&&(this._a.cancel(),this._a=null)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $f="RemoteStore";class Kf{constructor(e,t,n,r,s){this.localStore=e,this.datastore=t,this.asyncQueue=n,this.remoteSyncer={},this.Ta=[],this.Ia=new Map,this.Ea=new Set,this.da=[],this.Aa=s,this.Aa.Oo(e=>{n.enqueueAndForget(async()=>{ep(this)&&(Vs($f,"Restarting streams for network reachability change."),await async function(e){const t=Ks(e);t.Ea.add(4),await Hf(t),t.Ra.set("Unknown"),t.Ea.delete(4),await Gf(t)}(this))})}),this.Ra=new zf(n,r)}}async function Gf(e){if(ep(e))for(const t of e.da)await t(!0)}async function Hf(e){for(const t of e.da)await t(!1)}function Wf(e,t){const n=Ks(e);n.Ia.has(t.targetId)||(n.Ia.set(t.targetId,t),Zf(n)?Yf(n):wp(n).O_()&&Jf(n,t))}function Qf(e,t){const n=Ks(e),r=wp(n);n.Ia.delete(t),r.O_()&&Xf(n,t),0===n.Ia.size&&(r.O_()?r.L_():ep(n)&&n.Ra.set("Unknown"))}function Jf(e,t){if(e.Va.Ue(t.targetId),t.resumeToken.approximateByteSize()>0||t.snapshotVersion.compareTo(Di.min())>0){const n=e.remoteSyncer.getRemoteKeysForTarget(t.targetId).size;t=t.withExpectedCount(n)}wp(e).Y_(t)}function Xf(e,t){e.Va.Ue(t),wp(e).Z_(t)}function Yf(e){e.Va=new Sh({getRemoteKeysForTarget:t=>e.remoteSyncer.getRemoteKeysForTarget(t),At:t=>e.Ia.get(t)||null,ht:()=>e.datastore.serializer.databaseId}),wp(e).start(),e.Ra.ua()}function Zf(e){return ep(e)&&!wp(e).x_()&&e.Ia.size>0}function ep(e){return 0===Ks(e).Ea.size}function tp(e){e.Va=void 0}async function np(e){e.Ra.set("Online")}async function rp(e){e.Ia.forEach((t,n)=>{Jf(e,t)})}async function sp(e,t){tp(e),Zf(e)?(e.Ra.ha(t),Yf(e)):e.Ra.set("Unknown")}async function ip(e,t,n){if(e.Ra.set("Online"),t instanceof Th&&2===t.state&&t.cause)try{await async function(e,t){const n=t.cause;for(const r of t.targetIds)e.Ia.has(r)&&(await e.remoteSyncer.rejectListen(r,n),e.Ia.delete(r),e.Va.removeTarget(r))}(e,t)}catch(r){Vs($f,"Failed to remove targets %s: %s ",t.targetIds.join(","),r),await op(e,r)}else if(t instanceof Ih?e.Va.Ze(t):t instanceof bh?e.Va.st(t):e.Va.tt(t),!n.isEqual(Di.min()))try{const t=await gf(e.localStore);n.compareTo(t)>=0&&await function(e,t){const n=e.Va.Tt(t);return n.targetChanges.forEach((n,r)=>{if(n.resumeToken.approximateByteSize()>0){const s=e.Ia.get(r);s&&e.Ia.set(r,s.withResumeToken(n.resumeToken,t))}}),n.targetMismatches.forEach((t,n)=>{const r=e.Ia.get(t);if(!r)return;e.Ia.set(t,r.withResumeToken(Ra.EMPTY_BYTE_STRING,r.snapshotVersion)),Xf(e,t);const s=new al(r.target,t,n,r.sequenceNumber);Jf(e,s)}),e.remoteSyncer.applyRemoteEvent(n)}(e,n)}catch(s){Vs($f,"Failed to raise snapshot:",s),await op(e,s)}}async function op(e,t,n){if(!Qi(t))throw t;e.Ea.add(1),await Hf(e),e.Ra.set("Offline"),n||(n=()=>gf(e.localStore)),e.asyncQueue.enqueueRetryable(async()=>{Vs($f,"Retrying IndexedDB access"),await n(),e.Ea.delete(1),await Gf(e)})}function ap(e,t){return t().catch(n=>op(e,n,t))}async function cp(e){const t=Ks(e),n=vp(t);let r=t.Ta.length>0?t.Ta[t.Ta.length-1].batchId:so;for(;up(t);)try{const e=await wf(t.localStore,r);if(null===e){0===t.Ta.length&&n.L_();break}r=e.batchId,hp(t,e)}catch(s){await op(t,s)}lp(t)&&dp(t)}function up(e){return ep(e)&&e.Ta.length<10}function hp(e,t){e.Ta.push(t);const n=vp(e);n.O_()&&n.X_&&n.ea(t.mutations)}function lp(e){return ep(e)&&!vp(e).x_()&&e.Ta.length>0}function dp(e){vp(e).start()}async function fp(e){vp(e).ra()}async function pp(e){const t=vp(e);for(const n of e.Ta)t.ea(n.mutations)}async function mp(e,t,n){const r=e.Ta.shift(),s=ch.from(r,t,n);await ap(e,()=>e.remoteSyncer.applySuccessfulWrite(s)),await cp(e)}async function gp(e,t){t&&vp(e).X_&&await async function(e,t){if(function(e){switch(e){case Gs.OK:return qs(64938);case Gs.CANCELLED:case Gs.UNKNOWN:case Gs.DEADLINE_EXCEEDED:case Gs.RESOURCE_EXHAUSTED:case Gs.INTERNAL:case Gs.UNAVAILABLE:case Gs.UNAUTHENTICATED:return!1;case Gs.INVALID_ARGUMENT:case Gs.NOT_FOUND:case Gs.ALREADY_EXISTS:case Gs.PERMISSION_DENIED:case Gs.FAILED_PRECONDITION:case Gs.ABORTED:case Gs.OUT_OF_RANGE:case Gs.UNIMPLEMENTED:case Gs.DATA_LOSS:return!0;default:return qs(15467,{code:e})}}(n=t.code)&&n!==Gs.ABORTED){const n=e.Ta.shift();vp(e).B_(),await ap(e,()=>e.remoteSyncer.rejectFailedWrite(n.batchId,t)),await cp(e)}var n}(e,t),lp(e)&&dp(e)}async function yp(e,t){const n=Ks(e);n.asyncQueue.verifyOperationInProgress(),Vs($f,"RemoteStore received new credentials");const r=ep(n);n.Ea.add(3),await Hf(n),r&&n.Ra.set("Unknown"),await n.remoteSyncer.handleCredentialChange(t),n.Ea.delete(3),await Gf(n)}function wp(e){return e.ma||(e.ma=function(e,t,n){const r=Ks(e);return r.sa(),new Ff(t,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,n)}(e.datastore,e.asyncQueue,{Xo:np.bind(null,e),t_:rp.bind(null,e),r_:sp.bind(null,e),H_:ip.bind(null,e)}),e.da.push(async t=>{t?(e.ma.B_(),Zf(e)?Yf(e):e.Ra.set("Unknown")):(await e.ma.stop(),tp(e))})),e.ma}function vp(e){return e.fa||(e.fa=function(e,t,n){const r=Ks(e);return r.sa(),new Bf(t,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,n)}(e.datastore,e.asyncQueue,{Xo:()=>Promise.resolve(),t_:fp.bind(null,e),r_:gp.bind(null,e),ta:pp.bind(null,e),na:mp.bind(null,e)}),e.da.push(async t=>{t?(e.fa.B_(),await cp(e)):(await e.fa.stop(),e.Ta.length>0&&(Vs($f,`Stopping write stream with ${e.Ta.length} pending writes`),e.Ta=[]))})),e.fa
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}class _p{constructor(e,t,n,r,s){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=n,this.op=r,this.removalCallback=s,this.deferred=new Ws,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(e=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,n,r,s){const i=Date.now()+n,o=new _p(e,t,i,r,s);return o.start(n),o}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){null!==this.timerHandle&&(this.clearTimeout(),this.deferred.reject(new Hs(Gs.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>null!==this.timerHandle?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){null!==this.timerHandle&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Ip(e,t){if(Fs("AsyncQueue",`${t}: ${e}`),Qi(e))return new Hs(Gs.UNAVAILABLE,`${t}: ${e}`);throw e}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bp{static emptySet(e){return new bp(e.comparator)}constructor(e){this.comparator=e?(t,n)=>e(t,n)||yi.comparator(t.key,n.key):(e,t)=>yi.comparator(e.key,t.key),this.keyedMap=_u(),this.sortedSet=new Ta(this.comparator)}has(e){return null!=this.keyedMap.get(e)}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,n)=>(e(t),!1))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof bp))return!1;if(this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),n=e.sortedSet.getIterator();for(;t.hasNext();){const e=t.getNext().key,r=n.getNext().key;if(!e.isEqual(r))return!1}return!0}toString(){const e=[];return this.forEach(t=>{e.push(t.toString())}),0===e.length?"DocumentSet ()":"DocumentSet (\n  "+e.join("  \n")+"\n)"}copy(e,t){const n=new bp;return n.comparator=this.comparator,n.keyedMap=e,n.sortedSet=t,n}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tp{constructor(){this.ga=new Ta(yi.comparator)}track(e){const t=e.doc.key,n=this.ga.get(t);n?0!==e.type&&3===n.type?this.ga=this.ga.insert(t,e):3===e.type&&1!==n.type?this.ga=this.ga.insert(t,{type:n.type,doc:e.doc}):2===e.type&&2===n.type?this.ga=this.ga.insert(t,{type:2,doc:e.doc}):2===e.type&&0===n.type?this.ga=this.ga.insert(t,{type:0,doc:e.doc}):1===e.type&&0===n.type?this.ga=this.ga.remove(t):1===e.type&&2===n.type?this.ga=this.ga.insert(t,{type:1,doc:n.doc}):0===e.type&&1===n.type?this.ga=this.ga.insert(t,{type:2,doc:e.doc}):qs(63341,{Rt:e,pa:n}):this.ga=this.ga.insert(t,e)}ya(){const e=[];return this.ga.inorderTraversal((t,n)=>{e.push(n)}),e}}class Ep{constructor(e,t,n,r,s,i,o,a,c){this.query=e,this.docs=t,this.oldDocs=n,this.docChanges=r,this.mutatedKeys=s,this.fromCache=i,this.syncStateChanged=o,this.excludesMetadataChanges=a,this.hasCachedResults=c}static fromInitialDocuments(e,t,n,r,s){const i=[];return t.forEach(e=>{i.push({type:0,doc:e})}),new Ep(e,t,bp.emptySet(t),i,n,r,!0,!1,s)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&hu(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,n=e.docChanges;if(t.length!==n.length)return!1;for(let r=0;r<t.length;r++)if(t[r].type!==n[r].type||!t[r].doc.isEqual(n[r].doc))return!1;return!0}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sp{constructor(){this.wa=void 0,this.Sa=[]}ba(){return this.Sa.some(e=>e.Da())}}class Cp{constructor(){this.queries=kp(),this.onlineState="Unknown",this.Ca=new Set}terminate(){!function(e,t){const n=Ks(e),r=n.queries;n.queries=kp(),r.forEach((e,n)=>{for(const r of n.Sa)r.onError(t)})}(this,new Hs(Gs.ABORTED,"Firestore shutting down"))}}function kp(){return new gu(e=>lu(e),hu)}async function Ap(e,t){const n=Ks(e);let r=3;const s=t.query;let i=n.queries.get(s);i?!i.ba()&&t.Da()&&(r=2):(i=new Sp,r=t.Da()?0:1);try{switch(r){case 0:i.wa=await n.onListen(s,!0);break;case 1:i.wa=await n.onListen(s,!1);break;case 2:await n.onFirstRemoteStoreListen(s)}}catch(o){const e=Ip(o,`Initialization of query '${du(t.query)}' failed`);return void t.onError(e)}n.queries.set(s,i),i.Sa.push(t),t.va(n.onlineState),i.wa&&t.Fa(i.wa)&&xp(n)}async function Np(e,t){const n=Ks(e),r=t.query;let s=3;const i=n.queries.get(r);if(i){const e=i.Sa.indexOf(t);e>=0&&(i.Sa.splice(e,1),0===i.Sa.length?s=t.Da()?0:1:!i.ba()&&t.Da()&&(s=2))}switch(s){case 0:return n.queries.delete(r),n.onUnlisten(r,!0);case 1:return n.queries.delete(r),n.onUnlisten(r,!1);case 2:return n.onLastRemoteStoreUnlisten(r);default:return}}function Dp(e,t){const n=Ks(e);let r=!1;for(const s of t){const e=s.query,t=n.queries.get(e);if(t){for(const e of t.Sa)e.Fa(s)&&(r=!0);t.wa=s}}r&&xp(n)}function Rp(e,t,n){const r=Ks(e),s=r.queries.get(t);if(s)for(const i of s.Sa)i.onError(n);r.queries.delete(t)}function xp(e){e.Ca.forEach(e=>{e.next()})}var Op,Pp;(Pp=Op||(Op={})).Ma="default",Pp.Cache="cache";class Lp{constructor(e,t,n){this.query=e,this.xa=t,this.Oa=!1,this.Na=null,this.onlineState="Unknown",this.options=n||{}}Fa(e){if(!this.options.includeMetadataChanges){const t=[];for(const n of e.docChanges)3!==n.type&&t.push(n);e=new Ep(e.query,e.docs,e.oldDocs,t,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.Oa?this.Ba(e)&&(this.xa.next(e),t=!0):this.La(e,this.onlineState)&&(this.ka(e),t=!0),this.Na=e,t}onError(e){this.xa.error(e)}va(e){this.onlineState=e;let t=!1;return this.Na&&!this.Oa&&this.La(this.Na,e)&&(this.ka(this.Na),t=!0),t}La(e,t){if(!e.fromCache)return!0;if(!this.Da())return!0;const n="Offline"!==t;return(!this.options.qa||!n)&&(!e.docs.isEmpty()||e.hasCachedResults||"Offline"===t)}Ba(e){if(e.docChanges.length>0)return!0;const t=this.Na&&this.Na.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&!0===this.options.includeMetadataChanges}ka(e){e=Ep.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Oa=!0,this.xa.next(e)}Da(){return this.options.source!==Op.Cache}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mp{constructor(e){this.key=e}}class Up{constructor(e){this.key=e}}class Vp{constructor(e,t){this.query=e,this.Ya=t,this.Za=null,this.hasCachedResults=!1,this.current=!1,this.Xa=ku(),this.mutatedKeys=ku(),this.eu=pu(e),this.tu=new bp(this.eu)}get nu(){return this.Ya}ru(e,t){const n=t?t.iu:new Tp,r=t?t.tu:this.tu;let s=t?t.mutatedKeys:this.mutatedKeys,i=r,o=!1;const a="F"===this.query.limitType&&r.size===this.query.limit?r.last():null,c="L"===this.query.limitType&&r.size===this.query.limit?r.first():null;if(e.inorderTraversal((e,t)=>{const u=r.get(e),h=fu(this.query,t)?t:null,l=!!u&&this.mutatedKeys.has(u.key),d=!!h&&(h.hasLocalMutations||this.mutatedKeys.has(h.key)&&h.hasCommittedMutations);let f=!1;u&&h?u.data.isEqual(h.data)?l!==d&&(n.track({type:3,doc:h}),f=!0):this.su(u,h)||(n.track({type:2,doc:h}),f=!0,(a&&this.eu(h,a)>0||c&&this.eu(h,c)<0)&&(o=!0)):!u&&h?(n.track({type:0,doc:h}),f=!0):u&&!h&&(n.track({type:1,doc:u}),f=!0,(a||c)&&(o=!0)),f&&(h?(i=i.add(h),s=d?s.add(e):s.delete(e)):(i=i.delete(e),s=s.delete(e)))}),null!==this.query.limit)for(;i.size>this.query.limit;){const e="F"===this.query.limitType?i.last():i.first();i=i.delete(e.key),s=s.delete(e.key),n.track({type:1,doc:e})}return{tu:i,iu:n,Cs:o,mutatedKeys:s}}su(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,n,r){const s=this.tu;this.tu=e.tu,this.mutatedKeys=e.mutatedKeys;const i=e.iu.ya();i.sort((e,t)=>function(e,t){const n=e=>{switch(e){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return qs(20277,{Rt:e})}};return n(e)-n(t)}(e.type,t.type)||this.eu(e.doc,t.doc)),this.ou(n),r=r??!1;const o=t&&!r?this._u():[],a=0===this.Xa.size&&this.current&&!r?1:0,c=a!==this.Za;return this.Za=a,0!==i.length||c?{snapshot:new Ep(this.query,e.tu,s,i,e.mutatedKeys,0===a,c,!1,!!n&&n.resumeToken.approximateByteSize()>0),au:o}:{au:o}}va(e){return this.current&&"Offline"===e?(this.current=!1,this.applyChanges({tu:this.tu,iu:new Tp,mutatedKeys:this.mutatedKeys,Cs:!1},!1)):{au:[]}}uu(e){return!this.Ya.has(e)&&!!this.tu.has(e)&&!this.tu.get(e).hasLocalMutations}ou(e){e&&(e.addedDocuments.forEach(e=>this.Ya=this.Ya.add(e)),e.modifiedDocuments.forEach(e=>{}),e.removedDocuments.forEach(e=>this.Ya=this.Ya.delete(e)),this.current=e.current)}_u(){if(!this.current)return[];const e=this.Xa;this.Xa=ku(),this.tu.forEach(e=>{this.uu(e.key)&&(this.Xa=this.Xa.add(e.key))});const t=[];return e.forEach(e=>{this.Xa.has(e)||t.push(new Up(e))}),this.Xa.forEach(n=>{e.has(n)||t.push(new Mp(n))}),t}cu(e){this.Ya=e.Qs,this.Xa=ku();const t=this.ru(e.documents);return this.applyChanges(t,!0)}lu(){return Ep.fromInitialDocuments(this.query,this.tu,this.mutatedKeys,0===this.Za,this.hasCachedResults)}}const Fp="SyncEngine";class Bp{constructor(e,t,n){this.query=e,this.targetId=t,this.view=n}}class jp{constructor(e){this.key=e,this.hu=!1}}class qp{constructor(e,t,n,r,s,i){this.localStore=e,this.remoteStore=t,this.eventManager=n,this.sharedClientState=r,this.currentUser=s,this.maxConcurrentLimboResolutions=i,this.Pu={},this.Tu=new gu(e=>lu(e),hu),this.Iu=new Map,this.Eu=new Set,this.du=new Ta(yi.comparator),this.Au=new Map,this.Ru=new zd,this.Vu={},this.mu=new Map,this.fu=gd.cr(),this.onlineState="Unknown",this.gu=void 0}get isPrimaryClient(){return!0===this.gu}}async function zp(e,t,n=!0){const r=um(e);let s;const i=r.Tu.get(t);return i?(r.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.lu()):s=await Kp(r,t,n,!0),s}async function $p(e,t){const n=um(e);await Kp(n,t,!0,!1)}async function Kp(e,t,n,r){const s=await function(e,t){const n=Ks(e);return n.persistence.runTransaction("Allocate target","readwrite",e=>{let r;return n.Pi.getTargetData(e,t).next(s=>s?(r=s,qi.resolve(r)):n.Pi.allocateTargetId(e).next(s=>(r=new al(t,s,"TargetPurposeListen",e.currentSequenceNumber),n.Pi.addTargetData(e,r).next(()=>r))))}).then(e=>{const r=n.Ms.get(e.targetId);return(null===r||e.snapshotVersion.compareTo(r.snapshotVersion)>0)&&(n.Ms=n.Ms.insert(e.targetId,e),n.xs.set(t,e.targetId)),e})}(e.localStore,au(t)),i=s.targetId,o=e.sharedClientState.addLocalQueryTarget(i,n);let a;return r&&(a=await async function(e,t,n,r,s){e.pu=(t,n,r)=>async function(e,t,n,r){let s=t.view.ru(n);s.Cs&&(s=await _f(e.localStore,t.query,!1).then(({documents:e})=>t.view.ru(e,s)));const i=r&&r.targetChanges.get(t.targetId),o=r&&null!=r.targetMismatches.get(t.targetId),a=t.view.applyChanges(s,e.isPrimaryClient,i,o);return rm(e,t.targetId,a.au),a.snapshot}(e,t,n,r);const i=await _f(e.localStore,t,!0),o=new Vp(t,i.Qs),a=o.ru(i.documents),c=_h.createSynthesizedTargetChangeForCurrentChange(n,r&&"Offline"!==e.onlineState,s),u=o.applyChanges(a,e.isPrimaryClient,c);rm(e,n,u.au);const h=new Bp(t,n,o);return e.Tu.set(t,h),e.Iu.has(n)?e.Iu.get(n).push(t):e.Iu.set(n,[t]),u.snapshot}(e,t,i,"current"===o,s.resumeToken)),e.isPrimaryClient&&n&&Wf(e.remoteStore,s),a}async function Gp(e,t,n){const r=Ks(e),s=r.Tu.get(t),i=r.Iu.get(s.targetId);if(i.length>1)return r.Iu.set(s.targetId,i.filter(e=>!hu(e,t))),void r.Tu.delete(t);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(s.targetId),r.sharedClientState.isActiveQueryTarget(s.targetId)||await vf(r.localStore,s.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(s.targetId),n&&Qf(r.remoteStore,s.targetId),tm(r,s.targetId)}).catch(ji)):(tm(r,s.targetId),await vf(r.localStore,s.targetId,!0))}async function Hp(e,t){const n=Ks(e),r=n.Tu.get(t),s=n.Iu.get(r.targetId);n.isPrimaryClient&&1===s.length&&(n.sharedClientState.removeLocalQueryTarget(r.targetId),Qf(n.remoteStore,r.targetId))}async function Wp(e,t){const n=Ks(e);try{const e=await yf(n.localStore,t);t.targetChanges.forEach((e,t)=>{const r=n.Au.get(t);r&&($s(e.addedDocuments.size+e.modifiedDocuments.size+e.removedDocuments.size<=1,22616),e.addedDocuments.size>0?r.hu=!0:e.modifiedDocuments.size>0?$s(r.hu,14607):e.removedDocuments.size>0&&($s(r.hu,42227),r.hu=!1))}),await om(n,e,t)}catch(r){await ji(r)}}function Qp(e,t,n){const r=Ks(e);if(r.isPrimaryClient&&0===n||!r.isPrimaryClient&&1===n){const e=[];r.Tu.forEach((n,r)=>{const s=r.view.va(t);s.snapshot&&e.push(s.snapshot)}),function(e,t){const n=Ks(e);n.onlineState=t;let r=!1;n.queries.forEach((e,n)=>{for(const s of n.Sa)s.va(t)&&(r=!0)}),r&&xp(n)}(r.eventManager,t),e.length&&r.Pu.H_(e),r.onlineState=t,r.isPrimaryClient&&r.sharedClientState.setOnlineState(t)}}async function Jp(e,t,n){const r=Ks(e);r.sharedClientState.updateQueryState(t,"rejected",n);const s=r.Au.get(t),i=s&&s.key;if(i){let e=new Ta(yi.comparator);e=e.insert(i,Tc.newNoDocument(i,Di.min()));const n=ku().add(i),s=new vh(Di.min(),new Map,new Ta(ii),e,n);await Wp(r,s),r.du=r.du.remove(i),r.Au.delete(t),im(r)}else await vf(r.localStore,t,!1).then(()=>tm(r,t,n)).catch(ji)}async function Xp(e,t){const n=Ks(e),r=t.batch.batchId;try{const e=await function(e,t){const n=Ks(e);return n.persistence.runTransaction("Acknowledge batch","readwrite-primary",e=>{const r=t.batch.keys(),s=n.Ns.newChangeBuffer({trackRemovals:!0});return function(e,t,n,r){const s=n.batch,i=s.keys();let o=qi.resolve();return i.forEach(e=>{o=o.next(()=>r.getEntry(t,e)).next(t=>{const i=n.docVersions.get(e);$s(null!==i,48541),t.version.compareTo(i)<0&&(s.applyToRemoteDocument(t,n),t.isValidDocument()&&(t.setReadTime(n.commitVersion),r.addEntry(t)))})}),o.next(()=>e.mutationQueue.removeMutationBatch(t,s))}(n,e,t,s).next(()=>s.apply(e)).next(()=>n.mutationQueue.performConsistencyCheck(e)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(e,r,t.batch.batchId)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e,function(e){let t=ku();for(let n=0;n<e.mutationResults.length;++n)e.mutationResults[n].transformResults.length>0&&(t=t.add(e.batch.mutations[n].key));return t}(t))).next(()=>n.localDocuments.getDocuments(e,r))})}(n.localStore,t);em(n,r,null),Zp(n,r),n.sharedClientState.updateMutationState(r,"acknowledged"),await om(n,e)}catch(s){await ji(s)}}async function Yp(e,t,n){const r=Ks(e);try{const e=await function(e,t){const n=Ks(e);return n.persistence.runTransaction("Reject batch","readwrite-primary",e=>{let r;return n.mutationQueue.lookupMutationBatch(e,t).next(t=>($s(null!==t,37113),r=t.keys(),n.mutationQueue.removeMutationBatch(e,t))).next(()=>n.mutationQueue.performConsistencyCheck(e)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(e,r,t)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e,r)).next(()=>n.localDocuments.getDocuments(e,r))})}(r.localStore,t);em(r,t,n),Zp(r,t),r.sharedClientState.updateMutationState(t,"rejected",n),await om(r,e)}catch(s){await ji(s)}}function Zp(e,t){(e.mu.get(t)||[]).forEach(e=>{e.resolve()}),e.mu.delete(t)}function em(e,t,n){const r=Ks(e);let s=r.Vu[r.currentUser.toKey()];if(s){const e=s.get(t);e&&(n?e.reject(n):e.resolve(),s=s.remove(t)),r.Vu[r.currentUser.toKey()]=s}}function tm(e,t,n=null){e.sharedClientState.removeLocalQueryTarget(t);for(const r of e.Iu.get(t))e.Tu.delete(r),n&&e.Pu.yu(r,n);e.Iu.delete(t),e.isPrimaryClient&&e.Ru.jr(t).forEach(t=>{e.Ru.containsKey(t)||nm(e,t)})}function nm(e,t){e.Eu.delete(t.path.canonicalString());const n=e.du.get(t);null!==n&&(Qf(e.remoteStore,n),e.du=e.du.remove(t),e.Au.delete(n),im(e))}function rm(e,t,n){for(const r of n)r instanceof Mp?(e.Ru.addReference(r.key,t),sm(e,r)):r instanceof Up?(Vs(Fp,"Document no longer in limbo: "+r.key),e.Ru.removeReference(r.key,t),e.Ru.containsKey(r.key)||nm(e,r.key)):qs(19791,{wu:r})}function sm(e,t){const n=t.key,r=n.path.canonicalString();e.du.get(n)||e.Eu.has(r)||(Vs(Fp,"New document in limbo: "+n),e.Eu.add(r),im(e))}function im(e){for(;e.Eu.size>0&&e.du.size<e.maxConcurrentLimboResolutions;){const t=e.Eu.values().next().value;e.Eu.delete(t);const n=new yi(pi.fromString(t)),r=e.fu.next();e.Au.set(r,new jp(n)),e.du=e.du.insert(n,r),Wf(e.remoteStore,new al(au(ru(n.path)),r,"TargetPurposeLimboResolution",ro.ce))}}async function om(e,t,n){const r=Ks(e),s=[],i=[],o=[];r.Tu.isEmpty()||(r.Tu.forEach((e,a)=>{o.push(r.pu(a,t,n).then(e=>{if((e||n)&&r.isPrimaryClient){const t=e?!e.fromCache:n?.targetChanges.get(a.targetId)?.current;r.sharedClientState.updateQueryState(a.targetId,t?"current":"not-current")}if(e){s.push(e);const t=uf.As(a.targetId,e);i.push(t)}}))}),await Promise.all(o),r.Pu.H_(s),await async function(e,t){const n=Ks(e);try{await n.persistence.runTransaction("notifyLocalViewChanges","readwrite",e=>qi.forEach(t,t=>qi.forEach(t.Es,r=>n.persistence.referenceDelegate.addReference(e,t.targetId,r)).next(()=>qi.forEach(t.ds,r=>n.persistence.referenceDelegate.removeReference(e,t.targetId,r)))))}catch(r){if(!Qi(r))throw r;Vs(df,"Failed to update sequence numbers: "+r)}for(const s of t){const e=s.targetId;if(!s.fromCache){const t=n.Ms.get(e),r=t.snapshotVersion,s=t.withLastLimboFreeSnapshotVersion(r);n.Ms=n.Ms.insert(e,s)}}}(r.localStore,i))}async function am(e,t){const n=Ks(e);if(!n.currentUser.isEqual(t)){Vs(Fp,"User change. New user:",t.toKey());const e=await mf(n.localStore,t);n.currentUser=t,s="'waitForPendingWrites' promise is rejected due to a user change.",(r=n).mu.forEach(e=>{e.forEach(e=>{e.reject(new Hs(Gs.CANCELLED,s))})}),r.mu.clear(),n.sharedClientState.handleUserChange(t,e.removedBatchIds,e.addedBatchIds),await om(n,e.Ls)}var r,s}function cm(e,t){const n=Ks(e),r=n.Au.get(t);if(r&&r.hu)return ku().add(r.key);{let e=ku();const r=n.Iu.get(t);if(!r)return e;for(const t of r){const r=n.Tu.get(t);e=e.unionWith(r.view.nu)}return e}}function um(e){const t=Ks(e);return t.remoteStore.remoteSyncer.applyRemoteEvent=Wp.bind(null,t),t.remoteStore.remoteSyncer.getRemoteKeysForTarget=cm.bind(null,t),t.remoteStore.remoteSyncer.rejectListen=Jp.bind(null,t),t.Pu.H_=Dp.bind(null,t.eventManager),t.Pu.yu=Rp.bind(null,t.eventManager),t}function hm(e){const t=Ks(e);return t.remoteStore.remoteSyncer.applySuccessfulWrite=Xp.bind(null,t),t.remoteStore.remoteSyncer.rejectFailedWrite=Yp.bind(null,t),t}class lm{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Lf(e.databaseInfo.databaseId),this.sharedClientState=this.Du(e),this.persistence=this.Cu(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Fu(e,this.localStore),this.indexBackfillerScheduler=this.Mu(e,this.localStore)}Fu(e,t){return null}Mu(e,t){return null}vu(e){return pf(this.persistence,new lf,e.initialUser,this.serializer)}Cu(e){return new Qd(Xd.mi,this.serializer)}Du(e){return new bf}async terminate(){this.gcScheduler?.stop(),this.indexBackfillerScheduler?.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}lm.provider={build:()=>new lm};class dm extends lm{constructor(e){super(),this.cacheSizeBytes=e}Fu(e,t){$s(this.persistence.referenceDelegate instanceof Yd,46915);const n=this.persistence.referenceDelegate.garbageCollector;return new Ed(n,e.asyncQueue,t)}Cu(e){const t=void 0!==this.cacheSizeBytes?cd.withCacheSize(this.cacheSizeBytes):cd.DEFAULT;return new Qd(e=>Yd.mi(e,t),this.serializer)}}class fm extends lm{constructor(e,t,n){super(),this.xu=e,this.cacheSizeBytes=t,this.forceOwnership=n,this.kind="persistent",this.synchronizeTabs=!1}async initialize(e){await super.initialize(e),await this.xu.initialize(this,e),await hm(this.xu.syncEngine),await cp(this.xu.remoteStore),await this.persistence.Ji(()=>(this.gcScheduler&&!this.gcScheduler.started&&this.gcScheduler.start(),this.indexBackfillerScheduler&&!this.indexBackfillerScheduler.started&&this.indexBackfillerScheduler.start(),Promise.resolve()))}vu(e){return pf(this.persistence,new lf,e.initialUser,this.serializer)}Fu(e,t){const n=this.persistence.referenceDelegate.garbageCollector;return new Ed(n,e.asyncQueue,t)}Mu(e,t){const n=new no(t,this.persistence);return new to(e.asyncQueue,n)}Cu(e){const t=function(e,t){let n=e.projectId;return e.isDefaultDatabase||(n+="."+e.database),"firestore/"+t+"/"+n+"/"}(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey),n=void 0!==this.cacheSizeBytes?cd.withCacheSize(this.cacheSizeBytes):cd.DEFAULT;return new of(this.synchronizeTabs,t,e.clientId,n,e.asyncQueue,"undefined"!=typeof window?window:null,Pf(),this.serializer,this.sharedClientState,!!this.forceOwnership)}Du(e){return new bf}}class pm{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=e=>Qp(this.syncEngine,e,1),this.remoteStore.remoteSyncer.handleCredentialChange=am.bind(null,this.syncEngine),await async function(e,t){const n=Ks(e);t?(n.Ea.delete(2),await Gf(n)):t||(n.Ea.add(2),await Hf(n),n.Ra.set("Unknown"))}(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return new Cp}createDatastore(e){const t=Lf(e.databaseInfo.databaseId),n=(r=e.databaseInfo,new Of(r));var r;return function(e,t,n,r){return new qf(e,t,n,r)}(e.authCredentials,e.appCheckCredentials,n,t)}createRemoteStore(e){return t=this.localStore,n=this.datastore,r=e.asyncQueue,s=e=>Qp(this.syncEngine,e,0),i=Sf.v()?new Sf:new Tf,new Kf(t,n,r,s,i);var t,n,r,s,i}createSyncEngine(e,t){return function(e,t,n,r,s,i,o){const a=new qp(e,t,n,r,s,i);return o&&(a.gu=!0),a}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){await async function(e){const t=Ks(e);Vs($f,"RemoteStore shutting down."),t.Ea.add(5),await Hf(t),t.Aa.shutdown(),t.Ra.set("Unknown")}(this.remoteStore),this.datastore?.terminate(),this.eventManager?.terminate()}}pm.provider={build:()=>new pm};
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class mm{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ou(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ou(this.observer.error,e):Fs("Uncaught Error in snapshot listener:",e.toString()))}Nu(){this.muted=!0}Ou(e,t){setTimeout(()=>{this.muted||e(t)},0)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gm="FirestoreClient";class ym{constructor(e,t,n,r,s){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=n,this.databaseInfo=r,this.user=Ps.UNAUTHENTICATED,this.clientId=si.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=s,this.authCredentials.start(n,async e=>{Vs(gm,"Received user=",e.uid),await this.authCredentialListener(e),this.user=e}),this.appCheckCredentials.start(n,e=>(Vs(gm,"Received new app check token=",e),this.appCheckCredentialListener(e,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Ws;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const n=Ip(t,"Failed to shutdown persistence");e.reject(n)}}),e.promise}}async function wm(e,t){e.asyncQueue.verifyOperationInProgress(),Vs(gm,"Initializing OfflineComponentProvider");const n=e.configuration;await t.initialize(n);let r=n.initialUser;e.setCredentialChangeListener(async e=>{r.isEqual(e)||(await mf(t.localStore,e),r=e)}),t.persistence.setDatabaseDeletedListener(()=>e.terminate()),e._offlineComponents=t}async function vm(e,t){e.asyncQueue.verifyOperationInProgress();const n=await async function(e){if(!e._offlineComponents)if(e._uninitializedComponentsProvider){Vs(gm,"Using user provided OfflineComponentProvider");try{await wm(e,e._uninitializedComponentsProvider._offline)}catch(t){const s=t;if(!("FirebaseError"===(n=s).name?n.code===Gs.FAILED_PRECONDITION||n.code===Gs.UNIMPLEMENTED:!("undefined"!=typeof DOMException&&n instanceof DOMException)||22===n.code||20===n.code||11===n.code))throw s;Bs("Error using user provided cache. Falling back to memory cache: "+s),await wm(e,new lm)}}else Vs(gm,"Using default OfflineComponentProvider"),await wm(e,new dm(void 0));var n;return e._offlineComponents}(e);Vs(gm,"Initializing OnlineComponentProvider"),await t.initialize(n,e.configuration),e.setCredentialChangeListener(e=>yp(t.remoteStore,e)),e.setAppCheckTokenChangeListener((e,n)=>yp(t.remoteStore,n)),e._onlineComponents=t}async function _m(e){return e._onlineComponents||(e._uninitializedComponentsProvider?(Vs(gm,"Using user provided OnlineComponentProvider"),await vm(e,e._uninitializedComponentsProvider._online)):(Vs(gm,"Using default OnlineComponentProvider"),await vm(e,new pm))),e._onlineComponents}async function Im(e){const t=await _m(e),n=t.eventManager;return n.onListen=zp.bind(null,t.syncEngine),n.onUnlisten=Gp.bind(null,t.syncEngine),n.onFirstRemoteStoreListen=$p.bind(null,t.syncEngine),n.onLastRemoteStoreUnlisten=Hp.bind(null,t.syncEngine),n}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function bm(e){const t={};return void 0!==e.timeoutSeconds&&(t.timeoutSeconds=e.timeoutSeconds),t
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}const Tm=new Map,Em="firestore.googleapis.com",Sm=!0;
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cm{constructor(e){if(void 0===e.host){if(void 0!==e.ssl)throw new Hs(Gs.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Em,this.ssl=Sm}else this.host=e.host,this.ssl=e.ssl??Sm;if(this.isUsingEmulator=void 0!==e.emulatorOptions,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,void 0===e.cacheSizeBytes)this.cacheSizeBytes=ad;else{if(-1!==e.cacheSizeBytes&&e.cacheSizeBytes<1048576)throw new Hs(Gs.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}vi("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:void 0===e.experimentalAutoDetectLongPolling?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=bm(e.experimentalLongPollingOptions??{}),function(e){if(void 0!==e.timeoutSeconds){if(isNaN(e.timeoutSeconds))throw new Hs(Gs.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (must not be NaN)`);if(e.timeoutSeconds<5)throw new Hs(Gs.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (minimum allowed value is 5)`);if(e.timeoutSeconds>30)throw new Hs(Gs.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(t=this.experimentalLongPollingOptions,n=e.experimentalLongPollingOptions,t.timeoutSeconds===n.timeoutSeconds)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams;var t,n}}class km{constructor(e,t,n,r){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=n,this._app=r,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Cm({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new Hs(Gs.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return"notTerminated"!==this._terminateTask}_setSettings(e){if(this._settingsFrozen)throw new Hs(Gs.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Cm(e),this._emulatorOptions=e.emulatorOptions||{},void 0!==e.credentials&&(this._authCredentials=function(e){if(!e)return new Js;switch(e.type){case"firstParty":return new ei(e.sessionIndex||"0",e.iamToken||null,e.authTokenFactory||null);case"provider":return e.client;default:throw new Hs(Gs.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return"notTerminated"===this._terminateTask&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){"notTerminated"===this._terminateTask?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(e){const t=Tm.get(e);t&&(Vs("ComponentProvider","Removing Datastore"),Tm.delete(e),t.terminate())}(this),Promise.resolve()}}function Am(e,t,n,r={}){e=Ei(e,km);const s=f(t),i=e._getSettings(),o={...i,emulatorOptions:e._getEmulatorOptions()},a=`${t}:${n}`;s&&(p(`https://${a}`),w("Firestore",!0)),i.host!==Em&&i.host!==a&&Bs("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const c={...i,host:a,ssl:s,emulatorOptions:r};if(!k(c,o)&&(e._setSettings(c),r.mockUserToken)){let t,n;if("string"==typeof r.mockUserToken)t=r.mockUserToken,n=Ps.MOCK_USER;else{t=m(r.mockUserToken,e._app?.options.projectId);const s=r.mockUserToken.sub||r.mockUserToken.user_id;if(!s)throw new Hs(Gs.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");n=new Ps(s)}e._authCredentials=new Xs(new Qs(t,n))}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nm{constructor(e,t,n){this.converter=t,this._query=n,this.type="query",this.firestore=e}withConverter(e){return new Nm(this.firestore,e,this._query)}}class Dm{constructor(e,t,n){this.converter=t,this._key=n,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Rm(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Dm(this.firestore,e,this._key)}toJSON(){return{type:Dm._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,n){if(Ci(t,Dm._jsonSchema))return new Dm(e,n||null,new yi(pi.fromString(t.referencePath)))}}Dm._jsonSchemaVersion="firestore/documentReference/1.0",Dm._jsonSchema={type:Si("string",Dm._jsonSchemaVersion),referencePath:Si("string")};class Rm extends Nm{constructor(e,t,n){super(e,t,ru(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Dm(this.firestore,null,new yi(e))}withConverter(e){return new Rm(this.firestore,e,this._path)}}function xm(e,t,...n){if(e=P(e),wi("collection","path",t),e instanceof km){const r=pi.fromString(t,...n);return Ii(r),new Rm(e,null,r)}{if(!(e instanceof Dm||e instanceof Rm))throw new Hs(Gs.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=e._path.child(pi.fromString(t,...n));return Ii(r),new Rm(e.firestore,null,r)}}function Om(e,t,...n){if(e=P(e),1===arguments.length&&(t=si.newId()),wi("doc","path",t),e instanceof km){const r=pi.fromString(t,...n);return _i(r),new Dm(e,null,new yi(r))}{if(!(e instanceof Dm||e instanceof Rm))throw new Hs(Gs.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=e._path.child(pi.fromString(t,...n));return _i(r),new Dm(e.firestore,e instanceof Rm?e.converter:null,new yi(r))}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pm="AsyncQueue";class Lm{constructor(e=Promise.resolve()){this.Xu=[],this.ec=!1,this.tc=[],this.nc=null,this.rc=!1,this.sc=!1,this.oc=[],this.M_=new Mf(this,"async_queue_retry"),this._c=()=>{const e=Pf();e&&Vs(Pm,"Visibility state changed to "+e.visibilityState),this.M_.w_()},this.ac=e;const t=Pf();t&&"function"==typeof t.addEventListener&&t.addEventListener("visibilitychange",this._c)}get isShuttingDown(){return this.ec}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.uc(),this.cc(e)}enterRestrictedMode(e){if(!this.ec){this.ec=!0,this.sc=e||!1;const t=Pf();t&&"function"==typeof t.removeEventListener&&t.removeEventListener("visibilitychange",this._c)}}enqueue(e){if(this.uc(),this.ec)return new Promise(()=>{});const t=new Ws;return this.cc(()=>this.ec&&this.sc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Xu.push(e),this.lc()))}async lc(){if(0!==this.Xu.length){try{await this.Xu[0](),this.Xu.shift(),this.M_.reset()}catch(e){if(!Qi(e))throw e;Vs(Pm,"Operation failed with retryable error: "+e)}this.Xu.length>0&&this.M_.p_(()=>this.lc())}}cc(e){const t=this.ac.then(()=>(this.rc=!0,e().catch(e=>{throw this.nc=e,this.rc=!1,Fs("INTERNAL UNHANDLED ERROR: ",Mm(e)),e}).then(e=>(this.rc=!1,e))));return this.ac=t,t}enqueueAfterDelay(e,t,n){this.uc(),this.oc.indexOf(e)>-1&&(t=0);const r=_p.createAndSchedule(this,e,t,n,e=>this.hc(e));return this.tc.push(r),r}uc(){this.nc&&qs(47125,{Pc:Mm(this.nc)})}verifyOperationInProgress(){}async Tc(){let e;do{e=this.ac,await e}while(e!==this.ac)}Ic(e){for(const t of this.tc)if(t.timerId===e)return!0;return!1}Ec(e){return this.Tc().then(()=>{this.tc.sort((e,t)=>e.targetTimeMs-t.targetTimeMs);for(const t of this.tc)if(t.skipDelay(),"all"!==e&&t.timerId===e)break;return this.Tc()})}dc(e){this.oc.push(e)}hc(e){const t=this.tc.indexOf(e);this.tc.splice(t,1)}}function Mm(e){let t=e.message||"";return e.stack&&(t=e.stack.includes(e.message)?e.stack:e.message+"\n"+e.stack),t}class Um extends km{constructor(e,t,n,r){super(e,t,n,r),this.type="firestore",this._queue=new Lm,this._persistenceKey=r?.name||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Lm(e),this._firestoreClient=void 0,await e}}}function Vm(e,t){const n="object"==typeof e?e:Xe(),r="string"==typeof e?e:$a,s=Ke(n,"firestore").getImmediate({identifier:r});if(!s._initialized){const e=u("firestore");e&&Am(s,...e)}return s}function Fm(e){if(e._terminated)throw new Hs(Gs.FAILED_PRECONDITION,"The client has already been terminated.");return e._firestoreClient||Bm(e),e._firestoreClient}function Bm(e){const t=e._freezeSettings(),n=(r=e._databaseId,s=e._app?.options.appId||"",i=e._persistenceKey,new za(r,s,i,(o=t).host,o.ssl,o.experimentalForceLongPolling,o.experimentalAutoDetectLongPolling,bm(o.experimentalLongPollingOptions),o.useFetchStreams,o.isUsingEmulator));var r,s,i,o;e._componentsProvider||t.localCache?._offlineComponentProvider&&t.localCache?._onlineComponentProvider&&(e._componentsProvider={_offline:t.localCache._offlineComponentProvider,_online:t.localCache._onlineComponentProvider}),e._firestoreClient=new ym(e._authCredentials,e._appCheckCredentials,e._queue,n,e._componentsProvider&&function(e){const t=e?._online.build();return{_offline:e?._offline.build(t),_online:t}}(e._componentsProvider))}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class jm{constructor(e){this._byteString=e}static fromBase64String(e){try{return new jm(Ra.fromBase64String(e))}catch(t){throw new Hs(Gs.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new jm(Ra.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:jm._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(Ci(e,jm._jsonSchema))return jm.fromBase64String(e.bytes)}}jm._jsonSchemaVersion="firestore/bytes/1.0",jm._jsonSchema={type:Si("string",jm._jsonSchemaVersion),bytes:Si("string")};
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class qm{constructor(...e){for(let t=0;t<e.length;++t)if(0===e[t].length)throw new Hs(Gs.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new gi(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zm{constructor(e){this._methodName=e}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $m{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new Hs(Gs.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new Hs(Gs.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return ii(this._lat,e._lat)||ii(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:$m._jsonSchemaVersion}}static fromJSON(e){if(Ci(e,$m._jsonSchema))return new $m(e.latitude,e.longitude)}}$m._jsonSchemaVersion="firestore/geoPoint/1.0",$m._jsonSchema={type:Si("string",$m._jsonSchemaVersion),latitude:Si("number"),longitude:Si("number")};
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Km{constructor(e){this._values=(e||[]).map(e=>e)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(e,t){if(e.length!==t.length)return!1;for(let n=0;n<e.length;++n)if(e[n]!==t[n])return!1;return!0}(this._values,e._values)}toJSON(){return{type:Km._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(Ci(e,Km._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every(e=>"number"==typeof e))return new Km(e.vectorValues);throw new Hs(Gs.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}Km._jsonSchemaVersion="firestore/vectorValue/1.0",Km._jsonSchema={type:Si("string",Km._jsonSchemaVersion),vectorValues:Si("object")};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Gm=/^__.*__$/;class Hm{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return null!==this.fieldMask?new th(e,this.data,this.fieldMask,t,this.fieldTransforms):new eh(e,this.data,t,this.fieldTransforms)}}class Wm{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return new th(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function Qm(e){switch(e){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw qs(40011,{Ac:e})}}class Jm{constructor(e,t,n,r,s,i){this.settings=e,this.databaseId=t,this.serializer=n,this.ignoreUndefinedProperties=r,void 0===s&&this.Rc(),this.fieldTransforms=s||[],this.fieldMask=i||[]}get path(){return this.settings.path}get Ac(){return this.settings.Ac}Vc(e){return new Jm({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}mc(e){const t=this.path?.child(e),n=this.Vc({path:t,fc:!1});return n.gc(e),n}yc(e){const t=this.path?.child(e),n=this.Vc({path:t,fc:!1});return n.Rc(),n}wc(e){return this.Vc({path:void 0,fc:!0})}Sc(e){return lg(e,this.settings.methodName,this.settings.bc||!1,this.path,this.settings.Dc)}contains(e){return void 0!==this.fieldMask.find(t=>e.isPrefixOf(t))||void 0!==this.fieldTransforms.find(t=>e.isPrefixOf(t.field))}Rc(){if(this.path)for(let e=0;e<this.path.length;e++)this.gc(this.path.get(e))}gc(e){if(0===e.length)throw this.Sc("Document fields must not be empty");if(Qm(this.Ac)&&Gm.test(e))throw this.Sc('Document fields cannot begin and end with "__"')}}class Xm{constructor(e,t,n){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=n||Lf(e)}Cc(e,t,n,r=!1){return new Jm({Ac:e,methodName:t,Dc:n,path:gi.emptyPath(),fc:!1,bc:r},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Ym(e){const t=e._freezeSettings(),n=Lf(e._databaseId);return new Xm(e._databaseId,!!t.ignoreUndefinedProperties,n)}function Zm(e,t,n,r,s,i={}){const o=e.Cc(i.merge||i.mergeFields?2:0,t,n,s);ag("Data must be an object, but it was:",o,r);const a=ig(r,o);let c,u;if(i.merge)c=new Na(o.fieldMask),u=o.fieldTransforms;else if(i.mergeFields){const e=[];for(const r of i.mergeFields){const s=cg(t,r,n);if(!o.contains(s))throw new Hs(Gs.INVALID_ARGUMENT,`Field '${s}' is specified in your field mask but missing from your input data.`);dg(e,s)||e.push(s)}c=new Na(e),u=o.fieldTransforms.filter(e=>c.covers(e.field))}else c=null,u=o.fieldTransforms;return new Hm(new Ic(a),c,u)}class eg extends zm{_toFieldTransform(e){if(2!==e.Ac)throw 1===e.Ac?e.Sc(`${this._methodName}() can only appear at the top level of your update data`):e.Sc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof eg}}class tg extends zm{_toFieldTransform(e){return new $u(e.path,new Mu)}isEqual(e){return e instanceof tg}}function ng(e,t,n,r){const s=e.Cc(1,t,n);ag("Data must be an object, but it was:",s,r);const i=[],o=Ic.empty();Ia(r,(e,r)=>{const a=hg(t,e,n);r=P(r);const c=s.yc(a);if(r instanceof eg)i.push(a);else{const e=sg(r,c);null!=e&&(i.push(a),o.set(a,e))}});const a=new Na(i);return new Wm(o,a,s.fieldTransforms)}function rg(e,t,n,r,s,i){const o=e.Cc(1,t,n),a=[cg(t,r,n)],c=[s];if(i.length%2!=0)throw new Hs(Gs.INVALID_ARGUMENT,`Function ${t}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let d=0;d<i.length;d+=2)a.push(cg(t,i[d])),c.push(i[d+1]);const u=[],h=Ic.empty();for(let d=a.length-1;d>=0;--d)if(!dg(u,a[d])){const e=a[d];let t=c[d];t=P(t);const n=o.yc(e);if(t instanceof eg)u.push(e);else{const r=sg(t,n);null!=r&&(u.push(e),h.set(e,r))}}const l=new Na(u);return new Wm(h,l,o.fieldTransforms)}function sg(e,t){if(og(e=P(e)))return ag("Unsupported field value:",t,e),ig(e,t);if(e instanceof zm)return function(e,t){if(!Qm(t.Ac))throw t.Sc(`${e._methodName}() can only be used with update() and set()`);if(!t.path)throw t.Sc(`${e._methodName}() is not currently supported inside arrays`);const n=e._toFieldTransform(t);n&&t.fieldTransforms.push(n)}(e,t),null;if(void 0===e&&t.ignoreUndefinedProperties)return null;if(t.path&&t.fieldMask.push(t.path),e instanceof Array){if(t.settings.fc&&4!==t.Ac)throw t.Sc("Nested arrays are not supported");return function(e,t){const n=[];let r=0;for(const s of e){let e=sg(s,t.wc(r));null==e&&(e={nullValue:"NULL_VALUE"}),n.push(e),r++}return{arrayValue:{values:n}}}(e,t)}return function(e,t){if(null===(e=P(e)))return{nullValue:"NULL_VALUE"};if("number"==typeof e)return Ru(t.serializer,e);if("boolean"==typeof e)return{booleanValue:e};if("string"==typeof e)return{stringValue:e};if(e instanceof Date){const n=Ni.fromDate(e);return{timestampValue:Oh(t.serializer,n)}}if(e instanceof Ni){const n=new Ni(e.seconds,1e3*Math.floor(e.nanoseconds/1e3));return{timestampValue:Oh(t.serializer,n)}}if(e instanceof $m)return{geoPointValue:{latitude:e.latitude,longitude:e.longitude}};if(e instanceof jm)return{bytesValue:Ph(t.serializer,e._byteString)};if(e instanceof Dm){const n=t.databaseId,r=e.firestore._databaseId;if(!r.isEqual(n))throw t.Sc(`Document reference is for database ${r.projectId}/${r.database} but should be for database ${n.projectId}/${n.database}`);return{referenceValue:Uh(e.firestore._databaseId||t.databaseId,e._key.path)}}if(e instanceof Km)return n=e,r=t,{mapValue:{fields:{[Ga]:{stringValue:Qa},[Ja]:{arrayValue:{values:n.toArray().map(e=>{if("number"!=typeof e)throw r.Sc("VectorValues must only contain numeric values.");return Nu(r.serializer,e)})}}}}};var n,r;throw t.Sc(`Unsupported field value: ${Ti(e)}`)}(e,t)}function ig(e,t){const n={};return ba(e)?t.path&&t.path.length>0&&t.fieldMask.push(t.path):Ia(e,(e,r)=>{const s=sg(r,t.mc(e));null!=s&&(n[e]=s)}),{mapValue:{fields:n}}}function og(e){return!("object"!=typeof e||null===e||e instanceof Array||e instanceof Date||e instanceof Ni||e instanceof $m||e instanceof jm||e instanceof Dm||e instanceof zm||e instanceof Km)}function ag(e,t,n){if(!og(n)||!bi(n)){const r=Ti(n);throw"an object"===r?t.Sc(e+" a custom object"):t.Sc(e+" "+r)}}function cg(e,t,n){if((t=P(t))instanceof qm)return t._internalPath;if("string"==typeof t)return hg(e,t);throw lg("Field path arguments must be of type string or ",e,!1,void 0,n)}const ug=new RegExp("[~\\*/\\[\\]]");function hg(e,t,n){if(t.search(ug)>=0)throw lg(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,e,!1,void 0,n);try{return new qm(...t.split("."))._internalPath}catch(r){throw lg(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,e,!1,void 0,n)}}function lg(e,t,n,r,s){const i=r&&!r.isEmpty(),o=void 0!==s;let a=`Function ${t}() called with invalid data`;n&&(a+=" (via `toFirestore()`)"),a+=". ";let c="";return(i||o)&&(c+=" (found",i&&(c+=` in field ${r}`),o&&(c+=` in document ${s}`),c+=")"),new Hs(Gs.INVALID_ARGUMENT,a+e+c)}function dg(e,t){return e.some(e=>e.isEqual(t))}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fg{constructor(e,t,n,r,s){this._firestore=e,this._userDataWriter=t,this._key=n,this._document=r,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new Dm(this._firestore,this._converter,this._key)}exists(){return null!==this._document}data(){if(this._document){if(this._converter){const e=new pg(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(mg("DocumentSnapshot.get",e));if(null!==t)return this._userDataWriter.convertValue(t)}}}class pg extends fg{data(){return super.data()}}function mg(e,t){return"string"==typeof t?hg(e,t):t instanceof qm?t._internalPath:t._delegate._internalPath}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gg{}class yg extends gg{}function wg(e,t,...n){let r=[];t instanceof gg&&r.push(t),r=r.concat(n),function(e){const t=e.filter(e=>e instanceof Ig).length,n=e.filter(e=>e instanceof vg).length;if(t>1||t>0&&n>0)throw new Hs(Gs.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(r);for(const s of r)e=s._apply(e);return e}class vg extends yg{constructor(e,t,n){super(),this._field=e,this._op=t,this._value=n,this.type="where"}static _create(e,t,n){return new vg(e,t,n)}_apply(e){const t=this._parse(e);return Ag(e._query,t),new Nm(e.firestore,e.converter,cu(e._query,t))}_parse(e){const t=Ym(e.firestore),n=function(e,t,n,r,s,i,o){let a;if(s.isKeyField()){if("array-contains"===i||"array-contains-any"===i)throw new Hs(Gs.INVALID_ARGUMENT,`Invalid Query. You can't perform '${i}' queries on documentId().`);if("in"===i||"not-in"===i){kg(o,i);const t=[];for(const n of o)t.push(Cg(r,e,n));a={arrayValue:{values:t}}}else a=Cg(r,e,o)}else"in"!==i&&"not-in"!==i&&"array-contains-any"!==i||kg(o,i),a=function(e,t,n,r=!1){return sg(n,e.Cc(r?4:3,t))}(n,t,o,"in"===i||"not-in"===i);return Dc.create(s,i,a)}(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value);return n}}function _g(e,t,n){const r=t,s=mg("where",e);return vg._create(s,r,n)}class Ig extends gg{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new Ig(e,t)}_parse(e){const t=this._queryConstraints.map(t=>t._parse(e)).filter(e=>e.getFilters().length>0);return 1===t.length?t[0]:Rc.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return 0===t.getFilters().length?e:(function(e,t){let n=e;const r=t.getFlattenedFilters();for(const s of r)Ag(n,s),n=cu(n,s)}(e._query,t),new Nm(e.firestore,e.converter,cu(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return"and"===this.type?"and":"or"}}class bg extends yg{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new bg(e,t)}_apply(e){const t=function(e,t,n){if(null!==e.startAt)throw new Hs(Gs.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(null!==e.endAt)throw new Hs(Gs.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new kc(t,n)}(e._query,this._field,this._direction);return new Nm(e.firestore,e.converter,function(e,t){const n=e.explicitOrderBy.concat([t]);return new nu(e.path,e.collectionGroup,n,e.filters.slice(),e.limit,e.limitType,e.startAt,e.endAt)}(e._query,t))}}function Tg(e,t="asc"){const n=t,r=mg("orderBy",e);return bg._create(r,n)}class Eg extends yg{constructor(e,t,n){super(),this.type=e,this._limit=t,this._limitType=n}static _create(e,t,n){return new Eg(e,t,n)}_apply(e){return new Nm(e.firestore,e.converter,uu(e._query,this._limit,this._limitType))}}function Sg(e){return Eg._create("limit",e,"F")}function Cg(e,t,n){if("string"==typeof(n=P(n))){if(""===n)throw new Hs(Gs.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!iu(t)&&-1!==n.indexOf("/"))throw new Hs(Gs.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);const r=t.path.child(pi.fromString(n));if(!yi.isDocumentKey(r))throw new Hs(Gs.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return ac(e,new yi(r))}if(n instanceof Dm)return ac(e,n._key);throw new Hs(Gs.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Ti(n)}.`)}function kg(e,t){if(!Array.isArray(e)||0===e.length)throw new Hs(Gs.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${t.toString()}' filters.`)}function Ag(e,t){const n=function(e,t){for(const n of e)for(const e of n.getFlattenedFilters())if(t.indexOf(e.op)>=0)return e.op;return null}(e.filters,function(e){switch(e){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(t.op));if(null!==n)throw n===t.op?new Hs(Gs.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${t.op.toString()}' filter.`):new Hs(Gs.INVALID_ARGUMENT,`Invalid query. You cannot use '${t.op.toString()}' filters with '${n.toString()}' filters.`)}class Ng{convertValue(e,t="none"){switch(Ya(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Pa(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(La(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw qs(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const n={};return Ia(e,(e,r)=>{n[e]=this.convertValue(r,t)}),n}convertVectorValue(e){const t=e.fields?.[Ja].arrayValue?.values?.map(e=>Pa(e.doubleValue));return new Km(t)}convertGeoPoint(e){return new $m(Pa(e.latitude),Pa(e.longitude))}convertArray(e,t){return(e.values||[]).map(e=>this.convertValue(e,t))}convertServerTimestamp(e,t){switch(t){case"previous":const n=ja(e);return null==n?null:this.convertValue(n,t);case"estimate":return this.convertTimestamp(qa(e));default:return null}}convertTimestamp(e){const t=Oa(e);return new Ni(t.seconds,t.nanos)}convertDocumentKey(e,t){const n=pi.fromString(e);$s(ol(n),9688,{name:e});const r=new Ka(n.get(1),n.get(3)),s=new yi(n.popFirst(5));return r.isEqual(t)||Fs(`Document ${s} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),s}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Dg(e,t,n){let r;return r=e?n&&(n.merge||n.mergeFields)?e.toFirestore(t,n):e.toFirestore(t):t,r}class Rg{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class xg extends fg{constructor(e,t,n,r,s,i){super(e,t,n,r,i),this._firestore=e,this._firestoreImpl=e,this.metadata=s}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Og(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const n=this._document.data.field(mg("DocumentSnapshot.get",e));if(null!==n)return this._userDataWriter.convertValue(n,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new Hs(Gs.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=xg._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),e&&e.isValidDocument()&&e.isFoundDocument()?(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t):t}}xg._jsonSchemaVersion="firestore/documentSnapshot/1.0",xg._jsonSchema={type:Si("string",xg._jsonSchemaVersion),bundleSource:Si("string","DocumentSnapshot"),bundleName:Si("string"),bundle:Si("string")};class Og extends xg{data(e={}){return super.data(e)}}class Pg{constructor(e,t,n,r){this._firestore=e,this._userDataWriter=t,this._snapshot=r,this.metadata=new Rg(r.hasPendingWrites,r.fromCache),this.query=n}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return 0===this.size}forEach(e,t){this._snapshot.docs.forEach(n=>{e.call(t,new Og(this._firestore,this._userDataWriter,n.key,n,new Rg(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new Hs(Gs.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(e,t){if(e._snapshot.oldDocs.isEmpty()){let t=0;return e._snapshot.docChanges.map(n=>{const r=new Og(e._firestore,e._userDataWriter,n.doc.key,n.doc,new Rg(e._snapshot.mutatedKeys.has(n.doc.key),e._snapshot.fromCache),e.query.converter);return n.doc,{type:"added",doc:r,oldIndex:-1,newIndex:t++}})}{let n=e._snapshot.oldDocs;return e._snapshot.docChanges.filter(e=>t||3!==e.type).map(t=>{const r=new Og(e._firestore,e._userDataWriter,t.doc.key,t.doc,new Rg(e._snapshot.mutatedKeys.has(t.doc.key),e._snapshot.fromCache),e.query.converter);let s=-1,i=-1;return 0!==t.type&&(s=n.indexOf(t.doc.key),n=n.delete(t.doc.key)),1!==t.type&&(n=n.add(t.doc),i=n.indexOf(t.doc.key)),{type:Lg(t.type),doc:r,oldIndex:s,newIndex:i}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new Hs(Gs.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=Pg._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=si.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],n=[],r=[];return this.docs.forEach(e=>{null!==e._document&&(t.push(e._document),n.push(this._userDataWriter.convertObjectMap(e._document.data.value.mapValue.fields,"previous")),r.push(e.ref.path))}),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function Lg(e){switch(e){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return qs(61501,{type:e})}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mg(e){e=Ei(e,Dm);const t=Ei(e.firestore,Um);return function(e,t,n={}){const r=new Ws;return e.asyncQueue.enqueueAndForget(async()=>function(e,t,n,r,s){const i=new mm({next:a=>{i.Nu(),t.enqueueAndForget(()=>Np(e,o));const c=a.docs.has(n);!c&&a.fromCache?s.reject(new Hs(Gs.UNAVAILABLE,"Failed to get document because the client is offline.")):c&&a.fromCache&&r&&"server"===r.source?s.reject(new Hs(Gs.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):s.resolve(a)},error:e=>s.reject(e)}),o=new Lp(ru(n.path),i,{includeMetadataChanges:!0,qa:!0});return Ap(e,o)}(await Im(e),e.asyncQueue,t,n,r)),r.promise}(Fm(t),e._key).then(n=>function(e,t,n){const r=n.docs.get(t._key),s=new Ug(e);return new xg(e,s,t._key,r,new Rg(n.hasPendingWrites,n.fromCache),t.converter)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(t,e,n))}Pg._jsonSchemaVersion="firestore/querySnapshot/1.0",Pg._jsonSchema={type:Si("string",Pg._jsonSchemaVersion),bundleSource:Si("string","QuerySnapshot"),bundleName:Si("string"),bundle:Si("string")};class Ug extends Ng{constructor(e){super(),this.firestore=e}convertBytes(e){return new jm(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new Dm(this.firestore,null,t)}}function Vg(e){e=Ei(e,Nm);const t=Ei(e.firestore,Um),n=Fm(t),r=new Ug(t);return function(e){if("L"===e.limitType&&0===e.explicitOrderBy.length)throw new Hs(Gs.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}(e._query),function(e,t,n={}){const r=new Ws;return e.asyncQueue.enqueueAndForget(async()=>function(e,t,n,r,s){const i=new mm({next:n=>{i.Nu(),t.enqueueAndForget(()=>Np(e,o)),n.fromCache&&"server"===r.source?s.reject(new Hs(Gs.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):s.resolve(n)},error:e=>s.reject(e)}),o=new Lp(n,i,{includeMetadataChanges:!0,qa:!0});return Ap(e,o)}(await Im(e),e.asyncQueue,t,n,r)),r.promise}(n,e._query).then(n=>new Pg(t,r,e,n))}function Fg(e,t,n){e=Ei(e,Dm);const r=Ei(e.firestore,Um),s=Dg(e.converter,t,n);return zg(r,[Zm(Ym(r),"setDoc",e._key,s,null!==e.converter,n).toMutation(e._key,Gu.none())])}function Bg(e,t,n,...r){e=Ei(e,Dm);const s=Ei(e.firestore,Um),i=Ym(s);let o;return o="string"==typeof(t=P(t))||t instanceof qm?rg(i,"updateDoc",e._key,t,n,r):ng(i,"updateDoc",e._key,t),zg(s,[o.toMutation(e._key,Gu.exists(!0))])}function jg(e){return zg(Ei(e.firestore,Um),[new ih(e._key,Gu.none())])}function qg(e,t){const n=Ei(e.firestore,Um),r=Om(e),s=Dg(e.converter,t);return zg(n,[Zm(Ym(e.firestore),"addDoc",r._key,s,null!==e.converter,{}).toMutation(r._key,Gu.exists(!1))]).then(()=>r)}function zg(e,t){return function(e,t){const n=new Ws;return e.asyncQueue.enqueueAndForget(async()=>async function(t,n,r){const s=hm(t);try{const e=await function(e,t){const n=Ks(e),r=Ni.now(),s=t.reduce((e,t)=>e.add(t.key),ku());let i,o;return n.persistence.runTransaction("Locally write mutations","readwrite",e=>{let a=wu(),c=ku();return n.Ns.getEntries(e,s).next(e=>{a=e,a.forEach((e,t)=>{t.isValidDocument()||(c=c.add(e))})}).next(()=>n.localDocuments.getOverlayedDocuments(e,a)).next(s=>{i=s;const o=[];for(const e of t){const t=Yu(e,i.get(e.key).overlayedDocument);null!=t&&o.push(new th(e.key,t,bc(t.value.mapValue),Gu.exists(!0)))}return n.mutationQueue.addMutationBatch(e,r,o,t)}).next(t=>{o=t;const r=t.applyToLocalDocumentSet(i,c);return n.documentOverlayCache.saveOverlays(e,t.batchId,r)})}).then(()=>({batchId:o.batchId,changes:Iu(i)}))}(s.localStore,n);s.sharedClientState.addPendingMutation(e.batchId),function(e,t,n){let r=e.Vu[e.currentUser.toKey()];r||(r=new Ta(ii)),r=r.insert(t,n),e.Vu[e.currentUser.toKey()]=r}(s,e.batchId,r),await om(s,e.changes),await cp(s.remoteStore)}catch(e){const n=Ip(e,"Failed to persist write");r.reject(n)}}(await function(e){return _m(e).then(e=>e.syncEngine)}(e),t,n)),n.promise}(Fm(e),t)}class $g{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=Ym(e)}set(e,t,n){this._verifyNotCommitted();const r=Kg(e,this._firestore),s=Dg(r.converter,t,n),i=Zm(this._dataReader,"WriteBatch.set",r._key,s,null!==r.converter,n);return this._mutations.push(i.toMutation(r._key,Gu.none())),this}update(e,t,n,...r){this._verifyNotCommitted();const s=Kg(e,this._firestore);let i;return i="string"==typeof(t=P(t))||t instanceof qm?rg(this._dataReader,"WriteBatch.update",s._key,t,n,r):ng(this._dataReader,"WriteBatch.update",s._key,t),this._mutations.push(i.toMutation(s._key,Gu.exists(!0))),this}delete(e){this._verifyNotCommitted();const t=Kg(e,this._firestore);return this._mutations=this._mutations.concat(new ih(t._key,Gu.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new Hs(Gs.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function Kg(e,t){if((e=P(e)).firestore!==t)throw new Hs(Gs.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return e}function Gg(){return new tg("serverTimestamp")}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hg(e){return Fm(e=Ei(e,Um)),new $g(e,t=>zg(e,t))}!function(e,t=!0){Ls=Qe,$e(new L("firestore",(e,{instanceIdentifier:n,options:r})=>{const s=e.getProvider("app").getImmediate(),i=new Um(new Ys(e.getProvider("auth-internal")),new ni(s,e.getProvider("app-check-internal")),function(e,t){if(!Object.prototype.hasOwnProperty.apply(e.options,["projectId"]))throw new Hs(Gs.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Ka(e.options.projectId,t)}(s,n),s);return r={useFetchStreams:t,...r},i._setSettings(r),i},"PUBLIC").setMultipleInstances(!0)),Ye(xs,Os,e),Ye(xs,Os,"esm2020")}();const Wg=Object.freeze(Object.defineProperty({__proto__:null,AbstractUserDataWriter:Ng,Bytes:jm,CollectionReference:Rm,DocumentReference:Dm,DocumentSnapshot:xg,FieldPath:qm,FieldValue:zm,Firestore:Um,FirestoreError:Hs,GeoPoint:$m,Query:Nm,QueryCompositeFilterConstraint:Ig,QueryConstraint:yg,QueryDocumentSnapshot:Og,QueryFieldFilterConstraint:vg,QueryLimitConstraint:Eg,QueryOrderByConstraint:bg,QuerySnapshot:Pg,SnapshotMetadata:Rg,Timestamp:Ni,VectorValue:Km,WriteBatch:$g,_AutoId:si,_ByteString:Ra,_DatabaseId:Ka,_DocumentKey:yi,_EmptyAuthCredentialsProvider:Js,_FieldPath:gi,_cast:Ei,_logWarn:Bs,_validateIsNotUsedTogether:vi,addDoc:qg,collection:xm,connectFirestoreEmulator:Am,deleteDoc:jg,doc:Om,enableIndexedDbPersistence:function(e,t){Bs("enableIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");const n=e._freezeSettings();return function(e,t,n){if((e=Ei(e,Um))._firestoreClient||e._terminated)throw new Hs(Gs.FAILED_PRECONDITION,"Firestore has already been started and persistence can no longer be enabled. You can only enable persistence before calling any other methods on a Firestore object.");if(e._componentsProvider||e._getSettings().localCache)throw new Hs(Gs.FAILED_PRECONDITION,"SDK cache is already specified.");e._componentsProvider={_online:t,_offline:n},Bm(e)}(e,pm.provider,{build:e=>new fm(e,n.cacheSizeBytes,t?.forceOwnership)}),Promise.resolve()},ensureFirestoreConfigured:Fm,executeWrite:zg,getDoc:Mg,getDocs:Vg,getFirestore:Vm,limit:Sg,orderBy:Tg,query:wg,serverTimestamp:Gg,setDoc:Fg,updateDoc:Bg,where:_g,writeBatch:Hg},Symbol.toStringTag,{value:"Module"})),Qg="firebasestorage.googleapis.com",Jg="storageBucket";
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Xg extends E{constructor(e,t,n=0){super(ny(e),`Firebase Storage: ${t} (${ny(e)})`),this.status_=n,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,Xg.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return ny(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}\n${this.customData.serverResponse}`:this.message=this._baseMessage}}var Yg,Zg,ey,ty;function ny(e){return"storage/"+e}function ry(){return new Xg(Yg.UNKNOWN,"An unknown error occurred, please check the error payload for server response.")}function sy(e){return new Xg(Yg.INVALID_ARGUMENT,e)}function iy(){return new Xg(Yg.APP_DELETED,"The Firebase app was deleted.")}function oy(e,t){return new Xg(Yg.INVALID_FORMAT,"String does not match format '"+e+"': "+t)}function ay(e){throw new Xg(Yg.INTERNAL_ERROR,"Internal error: "+e)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(Zg=Yg||(Yg={})).UNKNOWN="unknown",Zg.OBJECT_NOT_FOUND="object-not-found",Zg.BUCKET_NOT_FOUND="bucket-not-found",Zg.PROJECT_NOT_FOUND="project-not-found",Zg.QUOTA_EXCEEDED="quota-exceeded",Zg.UNAUTHENTICATED="unauthenticated",Zg.UNAUTHORIZED="unauthorized",Zg.UNAUTHORIZED_APP="unauthorized-app",Zg.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",Zg.INVALID_CHECKSUM="invalid-checksum",Zg.CANCELED="canceled",Zg.INVALID_EVENT_NAME="invalid-event-name",Zg.INVALID_URL="invalid-url",Zg.INVALID_DEFAULT_BUCKET="invalid-default-bucket",Zg.NO_DEFAULT_BUCKET="no-default-bucket",Zg.CANNOT_SLICE_BLOB="cannot-slice-blob",Zg.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",Zg.NO_DOWNLOAD_URL="no-download-url",Zg.INVALID_ARGUMENT="invalid-argument",Zg.INVALID_ARGUMENT_COUNT="invalid-argument-count",Zg.APP_DELETED="app-deleted",Zg.INVALID_ROOT_OPERATION="invalid-root-operation",Zg.INVALID_FORMAT="invalid-format",Zg.INTERNAL_ERROR="internal-error",Zg.UNSUPPORTED_ENVIRONMENT="unsupported-environment";class cy{constructor(e,t){this.bucket=e,this.path_=t}get path(){return this.path_}get isRoot(){return 0===this.path.length}fullServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,t){let n;try{n=cy.makeFromUrl(e,t)}catch(s){return new cy(e,"")}if(""===n.path)return n;throw r=e,new Xg(Yg.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+r+"'.");var r}static makeFromUrl(e,t){let n=null;const r="([A-Za-z0-9.\\-_]+)";const s=new RegExp("^gs://"+r+"(/(.*))?$","i");function i(e){e.path_=decodeURIComponent(e.path)}const o=t.replace(/[.]/g,"\\."),a=[{regex:s,indices:{bucket:1,path:3},postModify:function(e){"/"===e.path.charAt(e.path.length-1)&&(e.path_=e.path_.slice(0,-1))}},{regex:new RegExp(`^https?://${o}/v[A-Za-z0-9_]+/b/${r}/o(/([^?#]*).*)?$`,"i"),indices:{bucket:1,path:3},postModify:i},{regex:new RegExp(`^https?://${t===Qg?"(?:storage.googleapis.com|storage.cloud.google.com)":t}/${r}/([^?#]*)`,"i"),indices:{bucket:1,path:2},postModify:i}];for(let c=0;c<a.length;c++){const t=a[c],r=t.regex.exec(e);if(r){const e=r[t.indices.bucket];let s=r[t.indices.path];s||(s=""),n=new cy(e,s),t.postModify(n);break}}if(null==n)throw function(e){return new Xg(Yg.INVALID_URL,"Invalid URL '"+e+"'.")}(e);return n}}class uy{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hy(e){return"string"==typeof e||e instanceof String}function ly(e){return dy()&&e instanceof Blob}function dy(){return"undefined"!=typeof Blob}function fy(e,t,n,r){if(r<t)throw sy(`Invalid value for '${e}'. Expected ${t} or greater.`);if(r>n)throw sy(`Invalid value for '${e}'. Expected ${n} or less.`)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function py(e,t,n){let r=t;return null==n&&(r=`https://${t}`),`${n}://${r}/v0${e}`}function my(e){const t=encodeURIComponent;let n="?";for(const r in e)if(e.hasOwnProperty(r)){n=n+(t(r)+"="+t(e[r]))+"&"}return n=n.slice(0,-1),n}(ty=ey||(ey={}))[ty.NO_ERROR=0]="NO_ERROR",ty[ty.NETWORK_ERROR=1]="NETWORK_ERROR",ty[ty.ABORT=2]="ABORT";
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class gy{constructor(e,t,n,r,s,i,o,a,c,u,h,l=!0,d=!1){this.url_=e,this.method_=t,this.headers_=n,this.body_=r,this.successCodes_=s,this.additionalRetryCodes_=i,this.callback_=o,this.errorCallback_=a,this.timeout_=c,this.progressCallback_=u,this.connectionFactory_=h,this.retry=l,this.isUsingEmulator=d,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((e,t)=>{this.resolve_=e,this.reject_=t,this.start_()})}start_(){const e=(e,t)=>{if(t)return void e(!1,new yy(!1,null,!0));const n=this.connectionFactory_();this.pendingConnection_=n;const r=e=>{const t=e.loaded,n=e.lengthComputable?e.total:-1;null!==this.progressCallback_&&this.progressCallback_(t,n)};null!==this.progressCallback_&&n.addUploadProgressListener(r),n.send(this.url_,this.method_,this.isUsingEmulator,this.body_,this.headers_).then(()=>{null!==this.progressCallback_&&n.removeUploadProgressListener(r),this.pendingConnection_=null;const t=n.getErrorCode()===ey.NO_ERROR,s=n.getStatus();if(!t||
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(e,t){const n=e>=500&&e<600,r=-1!==[408,429].indexOf(e),s=-1!==t.indexOf(e);return n||r||s}(s,this.additionalRetryCodes_)&&this.retry){const t=n.getErrorCode()===ey.ABORT;return void e(!1,new yy(!1,null,t))}const i=-1!==this.successCodes_.indexOf(s);e(!0,new yy(i,n))})},t=(e,t)=>{const n=this.resolve_,r=this.reject_,s=t.connection;if(t.wasSuccessCode)try{const e=this.callback_(s,s.getResponse());!
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(e){return void 0!==e}(e)?n():n(e)}catch(i){r(i)}else if(null!==s){const e=ry();e.serverResponse=s.getErrorText(),this.errorCallback_?r(this.errorCallback_(s,e)):r(e)}else if(t.canceled){r(this.appDelete_?iy():new Xg(Yg.CANCELED,"User canceled the upload/download."))}else{r(new Xg(Yg.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again."))}};this.canceled_?t(0,new yy(!1,null,!0)):this.backoffId_=function(e,t,n){let r=1,s=null,i=null,o=!1,a=0;function c(){return 2===a}let u=!1;function h(...e){u||(u=!0,t.apply(null,e))}function l(t){s=setTimeout(()=>{s=null,e(f,c())},t)}function d(){i&&clearTimeout(i)}function f(e,...t){if(u)return void d();if(e)return d(),void h.call(null,e,...t);if(c()||o)return d(),void h.call(null,e,...t);let n;r<64&&(r*=2),1===a?(a=2,n=0):n=1e3*(r+Math.random()),l(n)}let p=!1;function m(e){p||(p=!0,d(),u||(null!==s?(e||(a=2),clearTimeout(s),l(0)):e||(a=1)))}return l(0),i=setTimeout(()=>{o=!0,m(!0)},n),m}(e,t,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,null!==this.backoffId_&&(0,this.backoffId_)(!1),null!==this.pendingConnection_&&this.pendingConnection_.abort()}}class yy{constructor(e,t,n){this.wasSuccessCode=e,this.connection=t,this.canceled=!!n}}function wy(...e){const t="undefined"!=typeof BlobBuilder?BlobBuilder:"undefined"!=typeof WebKitBlobBuilder?WebKitBlobBuilder:void 0;if(void 0!==t){const n=new t;for(let t=0;t<e.length;t++)n.append(e[t]);return n.getBlob()}if(dy())return new Blob(e);throw new Xg(Yg.UNSUPPORTED_ENVIRONMENT,"This browser doesn't seem to support creating Blobs")}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function vy(e){if("undefined"==typeof atob)throw t="base-64",new Xg(Yg.UNSUPPORTED_ENVIRONMENT,`${t} is missing. Make sure to install the required polyfills. See https://firebase.google.com/docs/web/environments-js-sdk#polyfills for more information.`);var t;return atob(e)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _y="raw",Iy="base64",by="base64url",Ty="data_url";class Ey{constructor(e,t){this.data=e,this.contentType=t||null}}function Sy(e,t){switch(e){case _y:return new Ey(Cy(t));case Iy:case by:return new Ey(ky(e,t));case Ty:return new Ey(function(e){const t=new Ay(e);return t.base64?ky(Iy,t.rest):function(e){let t;try{t=decodeURIComponent(e)}catch(n){throw oy(Ty,"Malformed data URL.")}return Cy(t)}(t.rest)}(t),new Ay(t).contentType)}throw ry()}function Cy(e){const t=[];for(let n=0;n<e.length;n++){let r=e.charCodeAt(n);if(r<=127)t.push(r);else if(r<=2047)t.push(192|r>>6,128|63&r);else if(55296==(64512&r)){if(n<e.length-1&&56320==(64512&e.charCodeAt(n+1))){r=65536|(1023&r)<<10|1023&e.charCodeAt(++n),t.push(240|r>>18,128|r>>12&63,128|r>>6&63,128|63&r)}else t.push(239,191,189)}else 56320==(64512&r)?t.push(239,191,189):t.push(224|r>>12,128|r>>6&63,128|63&r)}return new Uint8Array(t)}function ky(e,t){switch(e){case Iy:{const n=-1!==t.indexOf("-"),r=-1!==t.indexOf("_");if(n||r){throw oy(e,"Invalid character '"+(n?"-":"_")+"' found: is it base64url encoded?")}break}case by:{const n=-1!==t.indexOf("+"),r=-1!==t.indexOf("/");if(n||r){throw oy(e,"Invalid character '"+(n?"+":"/")+"' found: is it base64 encoded?")}t=t.replace(/-/g,"+").replace(/_/g,"/");break}}let n;try{n=vy(t)}catch(s){if(s.message.includes("polyfill"))throw s;throw oy(e,"Invalid character found")}const r=new Uint8Array(n.length);for(let i=0;i<n.length;i++)r[i]=n.charCodeAt(i);return r}class Ay{constructor(e){this.base64=!1,this.contentType=null;const t=e.match(/^data:([^,]+)?,/);if(null===t)throw oy(Ty,"Must be formatted 'data:[<mediatype>][;base64],<data>");const n=t[1]||null;null!=n&&(this.base64=function(e,t){if(!(e.length>=t.length))return!1;return e.substring(e.length-t.length)===t}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(n,";base64"),this.contentType=this.base64?n.substring(0,n.length-7):n),this.rest=e.substring(e.indexOf(",")+1)}}class Ny{constructor(e,t){let n=0,r="";ly(e)?(this.data_=e,n=e.size,r=e.type):e instanceof ArrayBuffer?(t?this.data_=new Uint8Array(e):(this.data_=new Uint8Array(e.byteLength),this.data_.set(new Uint8Array(e))),n=this.data_.length):e instanceof Uint8Array&&(t?this.data_=e:(this.data_=new Uint8Array(e.length),this.data_.set(e)),n=e.length),this.size_=n,this.type_=r}size(){return this.size_}type(){return this.type_}slice(e,t){if(ly(this.data_)){const i=this.data_,o=(r=e,s=t,(n=i).webkitSlice?n.webkitSlice(r,s):n.mozSlice?n.mozSlice(r,s):n.slice?n.slice(r,s):null);return null===o?null:new Ny(o)}{const n=new Uint8Array(this.data_.buffer,e,t-e);return new Ny(n,!0)}var n,r,s}static getBlob(...e){if(dy()){const t=e.map(e=>e instanceof Ny?e.data_:e);return new Ny(wy.apply(null,t))}{const t=e.map(e=>hy(e)?Sy(_y,e).data:e.data_);let n=0;t.forEach(e=>{n+=e.byteLength});const r=new Uint8Array(n);let s=0;return t.forEach(e=>{for(let t=0;t<e.length;t++)r[s++]=e[t]}),new Ny(r,!0)}}uploadData(){return this.data_}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Dy(e){let t;try{t=JSON.parse(e)}catch(n){return null}return function(e){return"object"==typeof e&&!Array.isArray(e)}(t)?t:null}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ry(e){const t=e.lastIndexOf("/",e.length-2);return-1===t?e:e.slice(t+1)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xy(e,t){return t}class Oy{constructor(e,t,n,r){this.server=e,this.local=t||e,this.writable=!!n,this.xform=r||xy}}let Py=null;function Ly(){if(Py)return Py;const e=[];e.push(new Oy("bucket")),e.push(new Oy("generation")),e.push(new Oy("metageneration")),e.push(new Oy("name","fullPath",!0));const t=new Oy("name");t.xform=function(e,t){return function(e){return!hy(e)||e.length<2?e:Ry(e)}(t)},e.push(t);const n=new Oy("size");return n.xform=function(e,t){return void 0!==t?Number(t):t},e.push(n),e.push(new Oy("timeCreated")),e.push(new Oy("updated")),e.push(new Oy("md5Hash",null,!0)),e.push(new Oy("cacheControl",null,!0)),e.push(new Oy("contentDisposition",null,!0)),e.push(new Oy("contentEncoding",null,!0)),e.push(new Oy("contentLanguage",null,!0)),e.push(new Oy("contentType",null,!0)),e.push(new Oy("metadata","customMetadata",!0)),Py=e,Py}function My(e,t,n){const r={type:"file"},s=n.length;for(let i=0;i<s;i++){const e=n[i];r[e.local]=e.xform(r,t[e.server])}return function(e,t){Object.defineProperty(e,"ref",{get:function(){const n=e.bucket,r=e.fullPath,s=new cy(n,r);return t._makeStorageReference(s)}})}(r,e),r}function Uy(e,t,n){const r=Dy(t);if(null===r)return null;return My(e,r,n)}class Vy{constructor(e,t,n,r){this.url=e,this.method=t,this.handler=n,this.timeout=r,this.urlParams={},this.headers={},this.body=null,this.errorHandler=null,this.progressCallback=null,this.successCodes=[200],this.additionalRetryCodes=[]}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fy(e){if(!e)throw ry()}function By(e,t){return function(n,r){const s=Uy(e,r,t);return Fy(null!==s),function(e,t,n,r){const s=Dy(t);if(null===s)return null;if(!hy(s.downloadTokens))return null;const i=s.downloadTokens;if(0===i.length)return null;const o=encodeURIComponent;return i.split(",").map(t=>{const s=e.bucket,i=e.fullPath;return py("/b/"+o(s)+"/o/"+o(i),n,r)+my({alt:"media",token:t})})[0]}(s,r,e.host,e._protocol)}}function jy(e){return function(t,n){let r;var s,i;return 401===t.getStatus()?r=t.getErrorText().includes("Firebase App Check token is invalid")?new Xg(Yg.UNAUTHORIZED_APP,"This app does not have permission to access Firebase Storage on this project."):new Xg(Yg.UNAUTHENTICATED,"User is not authenticated, please authenticate using Firebase Authentication and try again."):402===t.getStatus()?(i=e.bucket,r=new Xg(Yg.QUOTA_EXCEEDED,"Quota for bucket '"+i+"' exceeded, please view quota on https://firebase.google.com/pricing/.")):403===t.getStatus()?(s=e.path,r=new Xg(Yg.UNAUTHORIZED,"User does not have permission to access '"+s+"'.")):r=n,r.status=t.getStatus(),r.serverResponse=n.serverResponse,r}}function qy(e){const t=jy(e);return function(n,r){let s=t(n,r);var i;return 404===n.getStatus()&&(i=e.path,s=new Xg(Yg.OBJECT_NOT_FOUND,"Object '"+i+"' does not exist.")),s.serverResponse=r.serverResponse,s}}function zy(e,t,n,r,s){const i=t.bucketOnlyServerUrl(),o={"X-Goog-Upload-Protocol":"multipart"};const a=function(){let e="";for(let t=0;t<2;t++)e+=Math.random().toString().slice(2);return e}();o["Content-Type"]="multipart/related; boundary="+a;const c=function(e,t,n){const r=Object.assign({},n);return r.fullPath=e.path,r.size=t.size(),r.contentType||(r.contentType=function(e,t){return e&&e.contentType||t&&t.type()||"application/octet-stream"}(null,t)),r}(t,r,s),u=function(e,t){const n={},r=t.length;for(let s=0;s<r;s++){const r=t[s];r.writable&&(n[r.server]=e[r.local])}return JSON.stringify(n)}(c,n),h="--"+a+"\r\nContent-Type: application/json; charset=utf-8\r\n\r\n"+u+"\r\n--"+a+"\r\nContent-Type: "+c.contentType+"\r\n\r\n",l="\r\n--"+a+"--",d=Ny.getBlob(h,r,l);if(null===d)throw new Xg(Yg.CANNOT_SLICE_BLOB,"Cannot slice blob for upload. Please retry the upload.");const f={name:c.fullPath},p=py(i,e.host,e._protocol),m=e.maxUploadRetryTime,g=new Vy(p,"POST",function(e,t){return function(n,r){const s=Uy(e,r,t);return Fy(null!==s),s}}(e,n),m);return g.urlParams=f,g.headers=o,g.body=d.uploadData(),g.errorHandler=jy(t),g}class $y{constructor(){this.sent_=!1,this.xhr_=new XMLHttpRequest,this.initXhr(),this.errorCode_=ey.NO_ERROR,this.sendPromise_=new Promise(e=>{this.xhr_.addEventListener("abort",()=>{this.errorCode_=ey.ABORT,e()}),this.xhr_.addEventListener("error",()=>{this.errorCode_=ey.NETWORK_ERROR,e()}),this.xhr_.addEventListener("load",()=>{e()})})}send(e,t,n,r,s){if(this.sent_)throw ay("cannot .send() more than once");if(f(e)&&n&&(this.xhr_.withCredentials=!0),this.sent_=!0,this.xhr_.open(t,e,!0),void 0!==s)for(const i in s)s.hasOwnProperty(i)&&this.xhr_.setRequestHeader(i,s[i].toString());return void 0!==r?this.xhr_.send(r):this.xhr_.send(),this.sendPromise_}getErrorCode(){if(!this.sent_)throw ay("cannot .getErrorCode() before sending");return this.errorCode_}getStatus(){if(!this.sent_)throw ay("cannot .getStatus() before sending");try{return this.xhr_.status}catch(e){return-1}}getResponse(){if(!this.sent_)throw ay("cannot .getResponse() before sending");return this.xhr_.response}getErrorText(){if(!this.sent_)throw ay("cannot .getErrorText() before sending");return this.xhr_.statusText}abort(){this.xhr_.abort()}getResponseHeader(e){return this.xhr_.getResponseHeader(e)}addUploadProgressListener(e){null!=this.xhr_.upload&&this.xhr_.upload.addEventListener("progress",e)}removeUploadProgressListener(e){null!=this.xhr_.upload&&this.xhr_.upload.removeEventListener("progress",e)}}class Ky extends $y{initXhr(){this.xhr_.responseType="text"}}function Gy(){return new Ky}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hy{constructor(e,t){this._service=e,this._location=t instanceof cy?t:cy.makeFromUrl(t,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,t){return new Hy(e,t)}get root(){const e=new cy(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return Ry(this._location.path)}get storage(){return this._service}get parent(){const e=function(e){if(0===e.length)return null;const t=e.lastIndexOf("/");return-1===t?"":e.slice(0,t)}(this._location.path);if(null===e)return null;const t=new cy(this._location.bucket,e);return new Hy(this._service,t)}_throwIfRoot(e){if(""===this._location.path)throw function(e){return new Xg(Yg.INVALID_ROOT_OPERATION,"The operation '"+e+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}(e)}}function Wy(e){e._throwIfRoot("getDownloadURL");const t=function(e,t,n){const r=py(t.fullServerUrl(),e.host,e._protocol),s=e.maxOperationRetryTime,i=new Vy(r,"GET",By(e,n),s);return i.errorHandler=qy(t),i}(e.storage,e._location,Ly());return e.storage.makeRequestWithTokens(t,Gy).then(e=>{if(null===e)throw new Xg(Yg.NO_DOWNLOAD_URL,"The given file does not have any download URLs.");return e})}function Qy(e,t){if(e instanceof Yy){const n=e;if(null==n._bucket)throw new Xg(Yg.NO_DEFAULT_BUCKET,"No default bucket found. Did you set the '"+Jg+"' property when initializing the app?");const r=new Hy(n,n._bucket);return null!=t?Qy(r,t):r}return void 0!==t?function(e,t){const n=function(e,t){const n=t.split("/").filter(e=>e.length>0).join("/");return 0===e.length?n:e+"/"+n}(e._location.path,t),r=new cy(e._location.bucket,n);return new Hy(e.storage,r)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e,t):e}function Jy(e,t){if(t&&/^[A-Za-z]+:\/\//.test(t)){if(e instanceof Yy)return new Hy(e,t);throw sy("To use ref(service, url), the first argument must be a Storage instance.")}return Qy(e,t)}function Xy(e,t){const n=t?.[Jg];return null==n?null:cy.makeFromBucketSpec(n,e)}class Yy{constructor(e,t,n,r,s,i=!1){this.app=e,this._authProvider=t,this._appCheckProvider=n,this._url=r,this._firebaseVersion=s,this._isUsingEmulator=i,this._bucket=null,this._host=Qg,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=12e4,this._maxUploadRetryTime=6e5,this._requests=new Set,this._bucket=null!=r?cy.makeFromBucketSpec(r,this._host):Xy(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,null!=this._url?this._bucket=cy.makeFromBucketSpec(this._url,e):this._bucket=Xy(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){fy("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){fy("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const e=this._authProvider.getImmediate({optional:!0});if(e){const t=await e.getToken();if(null!==t)return t.accessToken}return null}async _getAppCheckToken(){if(Ge(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=this._appCheckProvider.getImmediate({optional:!0});if(e){return(await e.getToken()).token}return null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new Hy(this,e)}_makeRequest(e,t,n,r,s=!0){if(this._deleted)return new uy(iy());{const i=function(e,t,n,r,s,i,o=!0,a=!1){const c=my(e.urlParams),u=e.url+c,h=Object.assign({},e.headers);return function(e,t){t&&(e["X-Firebase-GMPID"]=t)}(h,t),function(e,t){null!==t&&t.length>0&&(e.Authorization="Firebase "+t)}(h,n),function(e,t){e["X-Firebase-Storage-Version"]="webjs/"+(t??"AppManager")}(h,i),function(e,t){null!==t&&(e["X-Firebase-AppCheck"]=t)}(h,r),new gy(u,e.method,h,e.body,e.successCodes,e.additionalRetryCodes,e.handler,e.errorHandler,e.timeout,e.progressCallback,s,o,a)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e,this._appId,n,r,t,this._firebaseVersion,s,this._isUsingEmulator);return this._requests.add(i),i.getPromise().then(()=>this._requests.delete(i),()=>this._requests.delete(i)),i}}async makeRequestWithTokens(e,t){const[n,r]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,t,n,r).getPromise()}}const Zy="@firebase/storage",ew="0.14.0",tw="storage";function nw(e,t,n){return function(e,t,n){e._throwIfRoot("uploadBytes");const r=zy(e.storage,e._location,Ly(),new Ny(t,!0),n);return e.storage.makeRequestWithTokens(r,Gy).then(t=>({metadata:t,ref:e}))}(e=P(e),t,n)}function rw(e){return Wy(e=P(e))}function sw(e,t){return Jy(e=P(e),t)}function iw(e=Xe(),t){const n=Ke(e=P(e),tw).getImmediate({identifier:t}),r=u("storage");return r&&function(e,t,n,r={}){!function(e,t,n,r={}){e.host=`${t}:${n}`;const s=f(t);s&&(p(`https://${e.host}/b`),w("Storage",!0)),e._isUsingEmulator=!0,e._protocol=s?"https":"http";const{mockUserToken:i}=r;i&&(e._overrideAuthToken="string"==typeof i?i:m(i,e.app.options.projectId))}(e,t,n,r)}(n,...r),n}function ow(e,{instanceIdentifier:t}){const n=e.getProvider("app").getImmediate(),r=e.getProvider("auth-internal"),s=e.getProvider("app-check-internal");return new Yy(n,r,s,t,Qe)}$e(new L(tw,ow,"PUBLIC").setMultipleInstances(!0)),Ye(Zy,ew,""),Ye(Zy,ew,"esm2020");function aw(e,t){const n={};for(const r in e)e.hasOwnProperty(r)&&(n[r]=t(e[r]));return n}function cw(e){if(null==e)return null;if(e instanceof Number&&(e=e.valueOf()),"number"==typeof e&&isFinite(e))return e;if(!0===e||!1===e)return e;if("[object String]"===Object.prototype.toString.call(e))return e;if(e instanceof Date)return e.toISOString();if(Array.isArray(e))return e.map(e=>cw(e));if("function"==typeof e||"object"==typeof e)return aw(e,e=>cw(e));throw new Error("Data cannot be encoded in JSON: "+e)}function uw(e){if(null==e)return e;if(e["@type"])switch(e["@type"]){case"type.googleapis.com/google.protobuf.Int64Value":case"type.googleapis.com/google.protobuf.UInt64Value":{const t=Number(e.value);if(isNaN(t))throw new Error("Data cannot be decoded from JSON: "+e);return t}default:throw new Error("Data cannot be decoded from JSON: "+e)}return Array.isArray(e)?e.map(e=>uw(e)):"function"==typeof e||"object"==typeof e?aw(e,e=>uw(e)):e}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hw="functions",lw={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dw extends E{constructor(e,t,n){super(`${hw}/${e}`,t||""),this.details=n,Object.setPrototypeOf(this,dw.prototype)}}function fw(e,t){let n,r=function(e){if(e>=200&&e<300)return"ok";switch(e){case 0:case 500:return"internal";case 400:return"invalid-argument";case 401:return"unauthenticated";case 403:return"permission-denied";case 404:return"not-found";case 409:return"aborted";case 429:return"resource-exhausted";case 499:return"cancelled";case 501:return"unimplemented";case 503:return"unavailable";case 504:return"deadline-exceeded"}return"unknown"}(e),s=r;try{const e=t&&t.error;if(e){const t=e.status;if("string"==typeof t){if(!lw[t])return new dw("internal","internal");r=lw[t],s=t}const i=e.message;"string"==typeof i&&(s=i),n=e.details,void 0!==n&&(n=uw(n))}}catch(i){}return"ok"===r?null:new dw(r,s,n)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pw{constructor(e,t,n,r){this.app=e,this.auth=null,this.messaging=null,this.appCheck=null,this.serverAppAppCheckToken=null,Ge(e)&&e.settings.appCheckToken&&(this.serverAppAppCheckToken=e.settings.appCheckToken),this.auth=t.getImmediate({optional:!0}),this.messaging=n.getImmediate({optional:!0}),this.auth||t.get().then(e=>this.auth=e,()=>{}),this.messaging||n.get().then(e=>this.messaging=e,()=>{}),this.appCheck||r?.get().then(e=>this.appCheck=e,()=>{})}async getAuthToken(){if(this.auth)try{const e=await this.auth.getToken();return e?.accessToken}catch(e){return}}async getMessagingToken(){if(this.messaging&&"Notification"in self&&"granted"===Notification.permission)try{return await this.messaging.getToken()}catch(e){return}}async getAppCheckToken(e){if(this.serverAppAppCheckToken)return this.serverAppAppCheckToken;if(this.appCheck){const t=e?await this.appCheck.getLimitedUseToken():await this.appCheck.getToken();return t.error?null:t.token}return null}async getContext(e){return{authToken:await this.getAuthToken(),messagingToken:await this.getMessagingToken(),appCheckToken:await this.getAppCheckToken(e)}}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mw="us-central1",gw=/^data: (.*?)(?:\n|$)/;class yw{constructor(e,t,n,r,s=mw,i=(...e)=>fetch(...e)){this.app=e,this.fetchImpl=i,this.emulatorOrigin=null,this.contextProvider=new pw(e,t,n,r),this.cancelAllRequests=new Promise(e=>{this.deleteService=()=>Promise.resolve(e())});try{const e=new URL(s);this.customDomain=e.origin+("/"===e.pathname?"":e.pathname),this.region=mw}catch(o){this.customDomain=null,this.region=s}}_delete(){return this.deleteService()}_url(e){const t=this.app.options.projectId;if(null!==this.emulatorOrigin){return`${this.emulatorOrigin}/${t}/${this.region}/${e}`}return null!==this.customDomain?`${this.customDomain}/${e}`:`https://${this.region}-${t}.cloudfunctions.net/${e}`}}function ww(e,t,n){const r=n=>function(e,t,n,r){const s=e._url(t);return async function(e,t,n,r){n=cw(n);const s={data:n},i=await _w(e,r),o=r.timeout||7e4,a=function(e){let t=null;return{promise:new Promise((n,r)=>{t=setTimeout(()=>{r(new dw("deadline-exceeded","deadline-exceeded"))},e)}),cancel:()=>{t&&clearTimeout(t)}}}(o),c=await Promise.race([vw(t,s,i,e.fetchImpl),a.promise,e.cancelAllRequests]);if(a.cancel(),!c)throw new dw("cancelled","Firebase Functions instance was deleted.");const u=fw(c.status,c.json);if(u)throw u;if(!c.json)throw new dw("internal","Response is not valid JSON object.");let h=c.json.data;void 0===h&&(h=c.json.result);if(void 0===h)throw new dw("internal","Response is missing data field.");return{data:uw(h)}}(e,s,n,r)}(e,t,n,{});return r.stream=(n,r)=>function(e,t,n,r){const s=e._url(t);return async function(e,t,n,r){n=cw(n);const s={data:n},i=await _w(e,r);let o,a,c;i["Content-Type"]="application/json",i.Accept="text/event-stream";try{o=await e.fetchImpl(t,{method:"POST",body:JSON.stringify(s),headers:i,signal:r?.signal})}catch(l){if(l instanceof Error&&"AbortError"===l.name){const e=new dw("cancelled","Request was cancelled.");return{data:Promise.reject(e),stream:{[Symbol.asyncIterator]:()=>({next:()=>Promise.reject(e)})}}}const e=fw(0,null);return{data:Promise.reject(e),stream:{[Symbol.asyncIterator]:()=>({next:()=>Promise.reject(e)})}}}const u=new Promise((e,t)=>{a=e,c=t});r?.signal?.addEventListener("abort",()=>{const e=new dw("cancelled","Request was cancelled.");c(e)});const h=function(e,t,n,r){const s=(e,r)=>{const s=e.match(gw);if(!s)return;const i=s[1];try{const e=JSON.parse(i);if("result"in e)return void t(uw(e.result));if("message"in e)return void r.enqueue(uw(e.message));if("error"in e){const t=fw(0,e);return r.error(t),void n(t)}}catch(o){if(o instanceof dw)return r.error(o),void n(o)}},i=new TextDecoder;return new ReadableStream({start(t){let o="";return a();async function a(){if(r?.aborted){const e=new dw("cancelled","Request was cancelled");return t.error(e),n(e),Promise.resolve()}try{const{value:c,done:u}=await e.read();if(u)return o.trim()&&s(o.trim(),t),void t.close();if(r?.aborted){const r=new dw("cancelled","Request was cancelled");return t.error(r),n(r),void(await e.cancel())}o+=i.decode(c,{stream:!0});const h=o.split("\n");o=h.pop()||"";for(const e of h)e.trim()&&s(e.trim(),t);return a()}catch(c){const e=c instanceof dw?c:fw(0,null);t.error(e),n(e)}}},cancel:()=>e.cancel()})}(o.body.getReader(),a,c,r?.signal);return{stream:{[Symbol.asyncIterator](){const e=h.getReader();return{async next(){const{value:t,done:n}=await e.read();return{value:t,done:n}},return:async()=>(await e.cancel(),{done:!0,value:void 0})}}},data:u}}(e,s,n,r||{})}(e,t,n,r),r}async function vw(e,t,n,r){let s;n["Content-Type"]="application/json";try{s=await r(e,{method:"POST",body:JSON.stringify(t),headers:n})}catch(o){return{status:0,json:null}}let i=null;try{i=await s.json()}catch(o){}return{status:s.status,json:i}}async function _w(e,t){const n={},r=await e.contextProvider.getContext(t.limitedUseAppCheckTokens);return r.authToken&&(n.Authorization="Bearer "+r.authToken),r.messagingToken&&(n["Firebase-Instance-ID-Token"]=r.messagingToken),null!==r.appCheckToken&&(n["X-Firebase-AppCheck"]=r.appCheckToken),n}const Iw="@firebase/functions",bw="0.13.0";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Tw(e=Xe(),t=mw){const n=Ke(P(e),hw).getImmediate({identifier:t}),r=u("functions");return r&&function(e,t,n){!function(e,t,n){const r=f(t);e.emulatorOrigin=`http${r?"s":""}://${t}:${n}`,r&&(p(e.emulatorOrigin),w("Functions",!0))}(P(e),t,n)}(n,...r),n}function Ew(e,t,n){return ww(P(e),t)}!function(e){$e(new L(hw,(e,{instanceIdentifier:t})=>{const n=e.getProvider("app").getImmediate(),r=e.getProvider("auth-internal"),s=e.getProvider("messaging-internal"),i=e.getProvider("app-check-internal");return new yw(n,r,s,i,t)},"PUBLIC").setMultipleInstances(!0)),Ye(Iw,bw,e),Ye(Iw,bw,"esm2020")}();export{rw as A,Fg as B,Gg as C,Wg as D,Ni as T,Vm as a,iw as b,Tw as c,xm as d,Vg as e,Om as f,ws as g,sr as h,Je as i,or as j,qg as k,Sg as l,jg as m,Hg as n,Tg as o,ar as p,wg as q,ir as r,cr as s,rr as t,Bg as u,Mg as v,_g as w,Ew as x,sw as y,nw as z};
