import*as e from"../../core/root/root.js";import*as s from"../../services/puppeteer/puppeteer.js";import"../../third_party/lighthouse/lighthouse-dt-bundle.js";class t{sessionId;onMessage;onDisconnect;constructor(e){this.sessionId=e,this.onMessage=null,this.onDisconnect=null}setOnMessage(e){this.onMessage=e}setOnDisconnect(e){this.onDisconnect=e}getOnDisconnect(){return this.onDisconnect}getSessionId(){return this.sessionId}sendRawMessage(e){r("sendProtocolMessage",{message:e})}async disconnect(){this.onDisconnect?.("force disconnect"),this.onDisconnect=null,this.onMessage=null}}const n=new class{onMessage;onClose;on(e,s){"message"===e?this.onMessage=s:"close"===e&&(this.onClose=s)}send(e){r("sendProtocolMessage",{message:e})}close(){}};let o,a;async function i(i,c){let l;e.Runtime.Runtime.queryParam("isUnderTest")&&(console.log=()=>{},c.flags.maxWaitForLoad=2e3),self.listenForStatus((e=>{r("statusUpdate",{message:e[1]})}));try{if("endTimespan"===i){if(!a)throw new Error("Cannot end a timespan before starting one");const e=await a();return a=void 0,e}const r=await async function(s){const t=self.lookupLocale(s);if("en-US"===t||"en"===t)return;try{const s=e.Runtime.getRemoteBase();let n;n=s&&s.base?`${s.base}third_party/lighthouse/locales/${t}.json`:new URL(`../../third_party/lighthouse/locales/${t}.json`,import.meta.url).toString();const o=new Promise(((e,s)=>setTimeout((()=>s(new Error("timed out fetching locale"))),5e3))),a=await Promise.race([o,fetch(n).then((e=>e.json()))]);return self.registerLocaleData(t,a),t}catch(e){console.error(e)}return}(c.locales),g=c.flags;g.logLevel=g.logLevel||"info",g.channel="devtools",g.locale=r,"startTimespan"!==i&&"snapshot"!==i||(c.categoryIDs=c.categoryIDs.filter((e=>"lighthouse-plugin-publisher-ads"!==e)));const u=c.config||self.createConfig(c.categoryIDs,g.formFactor),f=c.url;if("navigation"===i&&g.legacyNavigation){const e=self.setUpWorkerConnection(n);return await self.runLighthouse(f,g,u,e)}const{mainFrameId:p,mainTargetId:h,mainSessionId:m,targetInfos:d}=c;o=new t(m),l=await s.PuppeteerConnection.PuppeteerConnectionHelper.connectPuppeteerToConnection({connection:o,mainFrameId:p,targetInfos:d,targetFilterCallback:e=>!e.url.startsWith("https://i0.devtools-frontend")&&!e.url.startsWith("devtools://")&&(e.targetId===h||e.openerId===h||"iframe"===e.type),isPageTargetCallback:e=>"page"===e.type});const{page:b}=l,w={logLevel:g.logLevel,settingsOverrides:g};if("snapshot"===i)return await self.runLighthouseSnapshot({config:u,page:b,configContext:w,flags:g});if("startTimespan"===i){const e=await self.startLighthouseTimespan({config:u,page:b,configContext:w,flags:g});return void(a=e.endTimespan)}return await self.runLighthouseNavigation(f,{config:u,page:b,configContext:w,flags:g})}catch(e){return{fatal:!0,message:e.message,stack:e.stack}}finally{"startTimespan"!==i&&l?.browser.disconnect()}}function r(e,s){self.postMessage({action:e,args:s})}self.onmessage=async function(e){const s=e.data;switch(s.action){case"startTimespan":case"endTimespan":case"snapshot":case"navigation":{const e=await i(s.action,s.args);e&&"object"==typeof e&&("report"in e&&delete e.report,"artifacts"in e&&(e.artifacts.Timing=JSON.parse(JSON.stringify(e.artifacts.Timing)))),self.postMessage({id:s.id,result:e});break}case"dispatchProtocolMessage":o?.onMessage?.(s.args.message),n.onMessage?.(JSON.stringify(s.args.message));break;default:throw new Error(`Unknown event: ${e.data}`)}},globalThis.global=self,globalThis.global.isVinn=!0,globalThis.global.document={},globalThis.global.document.documentElement={},globalThis.global.document.documentElement.style={WebkitAppearance:"WebkitAppearance"},self.postMessage("workerReady");