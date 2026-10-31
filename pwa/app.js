const cardsEl=document.querySelector("#cards");
const countEl=document.querySelector("#count");
const emptyEl=document.querySelector("#emptyState");
const chatLog=document.querySelector("#chatLog");
const assistantInput=document.querySelector("#assistantInput");
let cards=readStore("atom-cards",[]);
let chat=readStore("atom-chat",[]);
let searchTerm="";
let dragIndex=null;
function readStore(key,fallback){try{const value=JSON.parse(localStorage.getItem(key)||"null");return value??fallback}catch{return fallback}}
function save(){localStorage.setItem("atom-cards",JSON.stringify(cards));render()}
function add(title,body="待处理任务"){cards.unshift({id:makeId(),title,body,createdAt:new Date().toISOString()});save()}
function makeId(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
function move(from,to){if(from===null||to===null||from===to||from<0||to<0||from>=cards.length||to>=cards.length)return;const [item]=cards.splice(from,1);cards.splice(to,0,item);save()}
function render(){
  cardsEl.replaceChildren();
  const visible=cards.map((card,index)=>({card,index})).filter(x=>(x.card.title+" "+x.card.body).toLowerCase().includes(searchTerm));
  countEl.textContent=searchTerm?visible.length+" / "+cards.length+" 个卡片":cards.length+" 个卡片";
  emptyEl.hidden=visible.length>0;
  visible.forEach(({card:c,index:i})=>{
    const el=document.createElement("article");el.className="card";el.draggable=true;el.dataset.index=String(i);
    const h=document.createElement("h3");h.textContent=c.title;
    const p=document.createElement("p");p.textContent=c.body;
    const actions=document.createElement("div");actions.className="card-actions";
    const edit=document.createElement("button");edit.textContent="编辑";edit.className="secondary";
    edit.onclick=()=>{const title=prompt("卡片标题",c.title);if(title===null)return;const body=prompt("卡片内容",c.body);if(body===null)return;c.title=title.trim()||"未命名卡片";c.body=body;save()};
    const up=document.createElement("button");up.textContent="↑";up.className="icon-button";up.setAttribute("aria-label","上移");up.disabled=i===0;up.onclick=()=>move(i,i-1);
    const down=document.createElement("button");down.textContent="↓";down.className="icon-button";down.setAttribute("aria-label","下移");down.disabled=i===cards.length-1;down.onclick=()=>move(i,i+1);
    const del=document.createElement("button");del.textContent="删除";del.className="danger";del.onclick=()=>{cards.splice(i,1);save()};
    actions.append(edit,up,down,del);el.append(h,p,actions);
    el.addEventListener("dragstart",e=>{dragIndex=i;el.classList.add("dragging");e.dataTransfer.effectAllowed="move"});
    el.addEventListener("dragend",()=>{dragIndex=null;el.classList.remove("dragging");cardsEl.querySelectorAll(".card").forEach(x=>x.classList.remove("drop-target"))});
    el.addEventListener("dragover",e=>{e.preventDefault();el.classList.add("drop-target")});
    el.addEventListener("dragleave",()=>el.classList.remove("drop-target"));
    el.addEventListener("drop",e=>{e.preventDefault();el.classList.remove("drop-target");move(dragIndex,i)});
    cardsEl.append(el);
  });
}
function appendMessage(role,text){
  const wrap=document.createElement("div");wrap.className="chat-message "+(role==="user"?"user-message":"assistant-message");
  const label=document.createElement("strong");label.textContent=role==="user"?"你":"ATOM";
  const body=document.createElement("p");body.textContent=text;
  wrap.append(label,body);chatLog.append(wrap);chatLog.scrollTop=chatLog.scrollHeight;
  chat.push({role,text});if(chat.length>40)chat=chat.slice(-40);
  localStorage.setItem("atom-chat",JSON.stringify(chat));
}
function showHistory(){
  chat.forEach(m=>{const wrap=document.createElement("div");wrap.className="chat-message "+(m.role==="user"?"user-message":"assistant-message");const label=document.createElement("strong");label.textContent=m.role==="user"?"你":"ATOM";const p=document.createElement("p");p.textContent=m.text;wrap.append(label,p);chatLog.append(wrap)});
  if(chat.length)chatLog.scrollTop=chatLog.scrollHeight;
}
function handleCommand(raw){
  const text=raw.trim();if(!text)return;
  appendMessage("user",text);
  const addMatch=text.match(/^(?:添加任务|新建任务|创建卡片|添加卡片)\s*[:：]\s*(.+)$/i);
  if(addMatch){const title=addMatch[1].trim();add(title,"由 ATOM 助手创建 · "+new Date().toLocaleString());appendMessage("assistant","已在本机工作台创建任务卡片：“"+title+"”。");return}
  if(/^(?:总结|汇总|我的任务|任务列表)$/i.test(text)){appendMessage("assistant",cards.length?"当前共有 "+cards.length+" 张卡片：\n"+cards.map((c,i)=>(i+1)+". "+c.title+" — "+c.body).join("\n"):"工作台目前没有卡片。你可以说“添加任务：任务名称”。");return}
  const searchMatch=text.match(/^(?:搜索|查找)\s*[:：]?\s*(.+)$/i);
  if(searchMatch){searchTerm=searchMatch[1].trim().toLowerCase();document.querySelector("#cardSearch").value=searchMatch[1].trim();render();appendMessage("assistant",searchTerm?"已筛选包含“"+searchMatch[1].trim()+"”的卡片。":"请输入要搜索的内容。");return}
  if(/^(?:清除搜索|显示全部|取消筛选)$/i.test(text)){searchTerm="";document.querySelector("#cardSearch").value="";render();appendMessage("assistant","已显示全部卡片。");return}
  if(/^(?:帮助|你会什么|指令)$/i.test(text)){appendMessage("assistant","当前本地可用指令：\n• 添加任务：任务名称\n• 搜索：关键词\n• 总结（列出所有卡片）\n• 显示全部（清除搜索）\n\n我还没有连接云端大模型，因此暂时不能进行开放式问答或自动操作其他应用。");return}
  appendMessage("assistant","我目前运行在本地指令模式，暂时不能像云端大模型一样理解所有自然语言。你可以输入“添加任务：…”，“搜索：…”或“总结”。");
}
document.querySelector("#addCard").onclick=()=>{const title=prompt("卡片标题","新工作卡片");if(title)add(title.trim()||"新工作卡片","点击编辑你的工作内容。")};
document.querySelector("#newTask").onclick=()=>{const t=prompt("任务名称");if(t)add(t,"待处理任务")};
document.querySelector("#assistantForm").addEventListener("submit",e=>{e.preventDefault();const value=assistantInput.value;assistantInput.value="";handleCommand(value)});
document.querySelector("#cardSearch").addEventListener("input",e=>{searchTerm=e.target.value.trim().toLowerCase();render()});
document.querySelector("#voiceBtn").onclick=()=>{
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){alert("当前浏览器不支持网页语音识别。你仍可使用键盘输入，或使用系统键盘上的语音输入。");assistantInput.focus();return}
  const recognition=new SR();recognition.lang="zh-CN";recognition.interimResults=false;recognition.maxAlternatives=1;
  recognition.onresult=e=>{assistantInput.value=e.results[0][0].transcript;handleCommand(assistantInput.value);assistantInput.value=""};
  recognition.onerror=()=>appendMessage("assistant","语音识别没有成功，请检查麦克风权限或改用键盘输入。");
  recognition.start();
};
if("serviceWorker"in navigator)navigator.serviceWorker.register("./service-worker.js").catch(()=>{});

document.querySelector("#exportBackup").onclick=()=>{
  const payload={format:"atom-workbench-backup",version:1,exportedAt:new Date().toISOString(),cards};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);const link=document.createElement("a");link.href=url;link.download="atom-workbench-backup.json";link.click();URL.revokeObjectURL(url);
  appendMessage("assistant","备份文件已生成。你可以把它传到另一台设备，再选择“导入备份”。");
};
document.querySelector("#importBackup").onclick=()=>document.querySelector("#backupFile").click();
document.querySelector("#backupFile").addEventListener("change",async event=>{
  const file=event.target.files?.[0];if(!file)return;
  try{
    const parsed=JSON.parse(await file.text());
    if(parsed.format!=="atom-workbench-backup"||!Array.isArray(parsed.cards))throw new Error("invalid backup");
    const imported=parsed.cards.filter(c=>c&&typeof c.title==="string"&&typeof c.body==="string").map(c=>({id:makeId(),title:c.title.slice(0,160),body:c.body.slice(0,5000),createdAt:c.createdAt||new Date().toISOString()}));
    if(!imported.length)throw new Error("empty backup");
    if(!confirm("备份中有 "+imported.length+" 张卡片。选择“确定”将它们导入到现有卡片前面，不会删除当前内容。"))return;
    cards=[...imported,...cards];save();appendMessage("assistant","已导入 "+imported.length+" 张卡片。");
  }catch{alert("无法读取备份文件。请确认它是 ATOM Workbench 导出的 JSON 文件。")}
  finally{event.target.value=""}
});

showHistory();render();