const DAY=864e5,today=new Date();today.setHours(0,0,0,0);
const $=id=>document.getElementById(id);
const dk=d=>d==="AI × Finance"?"both":d;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const safeUrl=u=>/^https?:\/\//.test(u)?u:"#";
let D=[],saved=new Set();
try{saved=new Set(JSON.parse(localStorage.getItem("saved")||"[]"))}catch(e){}
const st={type:"",domain:"",saved:false};

fetch("data/listings.json").then(r=>r.json()).then(j=>{
  D=j.map(x=>({...x,left:Math.round((new Date(x.deadline+"T00:00:00")-today)/DAY)})).filter(x=>x.left>=0);
  $("banner").hidden=!D.some(x=>x.sample);
  const regions=[...new Set(D.map(x=>x.region))].sort();
  $("region").innerHTML='<option value="">Any region</option>'+regions.map(r=>`<option>${esc(r)}</option>`).join("");
  runway();render();
}).catch(()=>{$("list").innerHTML='<div class="empty">Could not load data/listings.json. If you opened this file directly, run a local server instead (see the README).</div>'});

function chips(id,vals,key,label){const el=$(id);el.innerHTML="";
  vals.forEach(v=>{const b=document.createElement("button");b.className="chip";b.textContent=v||label;
    b.setAttribute("aria-pressed",st[key]===v);b.onclick=()=>{st[key]=v;render()};el.appendChild(b)})}
function runway(){const t=$("track");t.innerHTML="";
  [0,15,30,45].forEach(n=>{const e=document.createElement("span");e.className="tick";e.style.left=(n/45*100)+"%";e.textContent=n?"+"+n+"d":"Today";t.appendChild(e)});
  D.filter(x=>x.left<=45).forEach((x,i)=>{const b=document.createElement("button");b.className="dot "+dk(x.domain);
    b.style.left=(x.left/45*100)+"%";b.style.bottom=(-7+(i%3)*14)+"px";b.title=x.title+" ("+x.left+" days)";
    b.setAttribute("aria-label",x.title+", "+x.left+" days left");b.onclick=()=>{$("q").value=x.title;render()};t.appendChild(b)})}
function render(){
  chips("types",["","Internship","Hackathon","Fellowship","Scholarship"],"type","All types");
  chips("domains",["","AI","Finance","AI × Finance"],"domain","All fields");
  const sv=document.createElement("button");sv.className="chip";sv.textContent="Saved ("+saved.size+")";
  sv.setAttribute("aria-pressed",st.saved);sv.onclick=()=>{st.saved=!st.saved;render()};$("domains").appendChild(sv);
  const q=$("q").value.toLowerCase(),r=$("region").value,f=$("funding").value,l=$("level").value;
  const out=D.filter(x=>(!st.type||x.type===st.type)&&(!st.domain||x.domain===st.domain)&&(!r||x.region===r||x.region==="Global"||x.region==="Online")&&(!f||x.funding===f)&&(!l||x.level===l||x.level==="Anyone")&&(!q||(x.title+x.org).toLowerCase().includes(q))&&(!st.saved||saved.has(x.id))).sort((a,b)=>a.left-b.left);
  $("count").textContent=out.length+" open, closing soonest first";
  $("list").innerHTML=out.length?out.map(x=>{const dt=new Date(x.deadline+"T00:00:00").toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});
    return `<article class="row ${dk(x.domain)}"><div class="days ${x.left<=7?"soon":""}"><b>${x.left}</b><span>days left</span></div>
    <div><h3><a href="${esc(safeUrl(x.url))}" target="_blank" rel="noopener">${esc(x.title)}</a></h3><p class="org">${esc(x.org)}, closes ${dt}</p>
    <div class="tags"><span class="tag">${esc(x.type)}</span><span class="tag">${esc(x.domain)}</span><span class="tag">${esc(x.region)}</span><span class="tag">${esc(x.funding)}</span><span class="tag">${esc(x.level)}</span></div>
    <p class="note">${esc(x.summary)}</p></div>
    <button class="save" data-id="${esc(x.id)}" aria-pressed="${saved.has(x.id)}">${saved.has(x.id)?"Saved":"Save"}</button></article>`}).join("")
    :'<div class="empty">Nothing matches these filters. Clear a filter or search term to see more.</div>';
  document.querySelectorAll(".save").forEach(b=>b.onclick=()=>{const id=b.dataset.id;saved.has(id)?saved.delete(id):saved.add(id);
    try{localStorage.setItem("saved",JSON.stringify([...saved]))}catch(e){}render()})}
["q","region","funding","level"].forEach(i=>$(i).addEventListener("input",render));
