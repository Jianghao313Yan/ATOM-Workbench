const cardsEl=document.querySelector("#cards"),count=document.querySelector("#count");
let cards=JSON.parse(localStorage.getItem("atom-cards")||"[]");
let dragIndex=null;
function save(){localStorage.setItem("atom-cards",JSON.stringify(cards));render()}
function move(from,to){if(from===null||to===null||from===to)return;const [item]=cards.splice(from,1);cards.splice(to,0,item);save()}
function render(){
  cardsEl.replaceChildren();count.textContent=cards.length+" 个卡片";
  cards.forEach((c,i)=>{
    const el=document.createElement("article");el.className="card";el.draggable=true;el.dataset.index=String(i);
    const h=document.createElement("h3");h.textContent=c.title;
    const p=document.createElement("p");p.textContent=c.body;
    const actions=document.createElement("div");actions.className="card-actions";
    const edit=document.createElement("button");edit.textContent="编辑";edit.className="secondary";
    edit.onclick=()=>{const title=prompt("卡片标题",c.title);if(title===null)return;const body=prompt("卡片内容",c.body);if(body===null)return;c.title=title.trim()||"未命名卡片";c.body=body;save()};
    const del=document.createElement("button");del.textContent="删除";del.className="danger";
    del.onclick=()=>{cards.splice(i,1);save()};
    actions.append(edit,del);el.append(h,p,actions);
    el.addEventListener("dragstart",e=>{dragIndex=i;el.classList.add("dragging");e.dataTransfer.effectAllowed="move"});
    el.addEventListener("dragend",()=>{dragIndex=null;el.classList.remove("dragging");cardsEl.querySelectorAll(".card").forEach(x=>x.classList.remove("drop-target"))});
    el.addEventListener("dragover",e=>{e.preventDefault();el.classList.add("drop-target")});
    el.addEventListener("dragleave",()=>el.classList.remove("drop-target"));
    el.addEventListener("drop",e=>{e.preventDefault();el.classList.remove("drop-target");move(dragIndex,i)});
    cardsEl.append(el);
  });
}
function add(title="新工作卡片",body="点击编辑你的工作内容。"){cards.unshift({title,body});save()}
document.querySelector("#addCard").onclick=()=>add();
document.querySelector("#newTask").onclick=()=>{const t=prompt("任务名称");if(t)add(t,"待处理任务")};
document.querySelector("#voiceBtn").onclick=()=>{
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){alert("当前浏览器不支持语音识别，请使用支持语音输入的浏览器。");return}
  const r=new SR();r.lang="zh-CN";r.onresult=e=>add("语音记录",e.results[0][0].transcript);r.start();
};
if("serviceWorker"in navigator)navigator.serviceWorker.register("./service-worker.js").catch(()=>{});
render();