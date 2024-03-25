function e(e){const t=e/1e3,n=e>=1e3?Math.round(t):t;return n<60?function(e){const t=e.toFixed(1);return(t.endsWith(".0")?t.slice(0,-2):t)+"s"}(n):function(e){const t=Math.trunc(e%60);return[Math.trunc(e/60)+"m",0!==t?t+"s":""].filter((e=>e)).join(" ")}(n)}if(!(document.getElementsByClassName("mt-widget").length>0))try{const t=function(e){const t=/https:\/\/online-go\.com\/(game|review)\/(\d+)/.exec(e),n=t?t[2]:null;if(!n)throw new Error("This only works on OGS games and OGS game reviews");return n}(window.location.toString()),{playerCards:n,actionBar:r,moveNumberContainer:o}=function(){const e=document.querySelector("div:has(> .players)"),t=document.querySelector(".action-bar"),n=document.querySelector(".move-number");if(!e)throw new Error("Unable to find players (div:has(> .players))");if(!t)throw new Error("Unable to find action bar (.action-bar)");if(!n)throw new Error("Unable to find move number (.move-number)");return{playerCards:e,actionBar:t,moveNumberContainer:n}}(),a=[],i=()=>a.forEach((e=>e())),{content:l,widget:c,putWidget:s}=function(e){const t=document.createElement("div");t.classList.add("mt-widget"),t.style.display="flex",t.style.flexDirection="column",t.style.paddingBlock="1rem",t.style.gap="0.5rem",t.style.boxSizing="border-box",t.style.flex="1 0 12rem";const n=document.createElement("div");return n.style.flex="1 1 100%",t.appendChild(e),t.appendChild(n),{widget:t,content:n,putWidget(e,n){t.remove(),"before"===e?n.parentElement.insertBefore(t,n):n.insertAdjacentElement("afterend",t)}}}(function(e,t){let n=e;const r=document.createElement("div");r.style.display="flex",r.style.gap="0.4rem",r.style.flex="0 0 auto";const o=(e,t,n)=>{const r=document.createElement("button");return r.id=e,r.textContent=t,r.addEventListener("click",n),r},a=o("mt-toggle",n?"Collapse":"Expand",(()=>{n?(t.onCollapse(),a.textContent="Expand"):(t.onExpand(),a.textContent="Collapse"),n=!n})),i=o("mt-hide","Hide",t.onHide);return r.appendChild(i),r.appendChild(a),r}(!1,{onHide:i,onExpand:()=>s("before",r),onCollapse:()=>s("after",n)}));s("after",n),a.push((()=>c.remove())),l.replaceChildren("Loading..."),function(e){return fetch(function(e){return`https://online-go.com/api/v1/games/${e}`}(e)).then((e=>e.json()))}(t).then((t=>{const n=function(e){const t="black"===e.gamedata.initial_player,n=t?"black":"white",r=t?"white":"black";return e.gamedata.moves.map(((e,t)=>{const o=t+1;var a;return{move:o,color:(a=o,a%2==1?n:r),millis:e[2]}}))}(t);(function(t,n){const r=document.createElement("div");r.classList.add("mt-chart");const o="1rem",a=document.createElement("style");a.textContent=`\n.mt-chart, .mt-chart * {\n  box-sizing: border-box;\n}\n\n.mt-chart {\n  display: flex;\n  position: relative;\n  background-color: darkgray;\n  min-height: 100%;\n  cursor: crosshair;\n  padding-inline: ${o};\n\n  --mt-dark-highlight: #ffd800;\n  --mt-light-highlight: yellow;\n}\n\n.mt-bar {\n  flex: 1 1 100%;\n  background-color: var(--mt-bar-color);\n}\n\n.mt-bar-wrapper {\n  min-height: 100%;\n  position: relative;\n  display: flex;\n  align-items: flex-end;\n  flex: 1 0 1px;\n}\n\n.mt-bar-wrapper:hover {\n  background-color: var(--mt-light-highlight);\n}\n\n.mt-bar-wrapper:hover .mt-bar {\n  background-color: var(--mt-dark-highlight);\n}\n\n.mt-bar-wrapper::before {\n  display: none;\n  position: absolute;\n  content: attr(data-time) ' on move ' attr(data-move);\n  top: 0px;\n  min-width: 10rem;\n  padding: 0.2rem;\n  background-color: white;\n  border-radius: 5px;\n  z-index: 1;\n  text-align: center;\n  pointer-events: none;\n}\n\n.mt-bar-wrapper:hover::before {\n  display: inline;\n}\n\n.mt-bar-wrapper--left::before {\n  left: 0;\n}\n\n.mt-bar-wrapper--right::before {\n  right: 0;\n}\n\n/* Only when there's no hovered bar, show current bar and its tooltip */\n.mt-chart:not(:has(.mt-bar-wrapper:hover)) {\n  & .mt-bar-wrapper--current {\n    background-color: var(--mt-light-highlight);\n  }\n\n  & .mt-bar-wrapper--current .mt-bar {\n    background-color: var(--mt-dark-highlight);\n  }\n\n  & .mt-bar-wrapper--current::before {\n    display: inline;\n  }\n}\n\n.mt-yaxis-tick {\n  border-top: 1px dashed lightgray;\n  left: ${o};\n  right: ${o};\n  height: 0;\n  position: absolute;\n  z-index: 0;\n}`,r.appendChild(a);const i=Math.max(...n.map((e=>e.millis))),l=1.1*i;for(const e of function(e,t){const n=[];let r=t;for(;r<e;)n.push(r),r+=t;return n}(i,3e4)){const t=document.createElement("div");t.classList.add("mt-yaxis-tick"),t.style.bottom=String(e/l*100)+"%",r.appendChild(t)}n.forEach((t=>{const o=document.createElement("div");o.classList.add("mt-bar"),o.style.height=t.millis/l*100+"%",o.style.setProperty("--mt-bar-color","black"===t.color?"black":"white");const a=document.createElement("div");a.classList.add("mt-bar-wrapper","mt-bar-wrapper--"+(t.move/n.length<.5?"left":"right")),a.dataset.time=e(t.millis),a.dataset.move=t.move,a.appendChild(o),r.appendChild(a)})),t.replaceChildren(r)})(l,n);const r=function(e,t){const n=e=>{const n=e.split("").filter((e=>e.match(/\d/))).join("");n&&t(Number(n))};n(e.textContent);const r=new MutationObserver((e=>{e.filter((e=>"characterData"===e.type)).forEach((e=>n(e.target.data)))}));return r.observe(e,{characterData:!0,subtree:!0}),()=>r.disconnect()}(o,(e=>function(e){const t="mt-bar-wrapper--current",n=document.querySelector("."+t);n&&n.classList.remove(t);const r=document.querySelector(`.mt-bar-wrapper[data-move="${e}"]`);r&&r.classList.add(t)}(e)));a.push(r)})).catch((e=>console.error(e)))}catch(e){console.error(e),alert("Error: "+e.message)}
