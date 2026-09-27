'use strict';
let content, baseline;
const form = document.getElementById('editor-form');
const status = document.getElementById('editor-status');
const templates = {
  expertise: {title:'New expertise group',items:['New skill']},
  experience: {role:'New role',organization:'Organization',period:'',location:'',description:''},
  education: {degree:'New degree',institution:'Institution',period:'',description:''},
  projects: {id:'new-project',title:'New project',category:'Robotics',summary:'',tags:[],featured:false,image:'',imageAlt:'',repository:'',demo:'',overview:'',contributions:[],results:''}
};
const labels = {
  profile:'Profile & introduction',pages:'Page headings & descriptions',technologies:'Core technologies',expertise:'Technical expertise',experience:'Experience',education:'Education',projects:'Projects',
  name:'Full name',brand:'Navigation name',brandSuffix:'Navigation suffix',role:'Current role / company badge',headline:'Headline — first part',headlineAccent:'Headline — cyan part',intro:'Short homepage introduction',location:'Location',email:'Contact email',github:'GitHub URL',linkedin:'LinkedIn URL',resume:'Résumé file path or URL (optional)',portrait:'Portrait file path or URL (optional)',footer:'Short footer description',about:'About paragraphs',
  id:'Project URL ID (unique, lowercase, hyphens)',title:'Title',category:'Category',summary:'Short card description',tags:'Technology tags',featured:'Show on homepage',image:'Image file path or URL (optional)',imageAlt:'Image description for accessibility',repository:'GitHub repository URL (optional)',demo:'Demo URL (optional)',overview:'Project overview',contributions:'Your contributions',results:'Results & learnings (optional)',organization:'Organization',period:'Dates',description:'Description',degree:'Degree',institution:'Institution',items:'Skills',expertiseTitle:'Expertise section title',featuredTitle:'Featured projects title',quickLinksTitle:'Quick links title',aboutTitle:'About page title',aboutIntro:'About page introduction',projectsTitle:'Projects page title',projectsIntro:'Projects page introduction',contactTitle:'Contact page title',contactIntro:'Contact page introduction'
};
const longFields = new Set(['intro','footer','summary','overview','description','results','aboutIntro','projectsIntro','contactIntro']);
function el(tag, props = {}, text) { const node=document.createElement(tag);Object.assign(node,props);if(text!==undefined)node.textContent=text;return node; }
function updateStatus(message) {status.textContent=message;}
function saveDraft(){try{sessionStorage.setItem('portfolioDraft',JSON.stringify(content));updateStatus('Draft saved in this tab. Download it when you are ready to update your website.');}catch{updateStatus('Browser draft storage is unavailable. Download your content before leaving this page.');}}
function validate(data) {
  const assert=(condition,message)=>{if(!condition)throw new Error(message);};
  assert(data && typeof data==='object' && !Array.isArray(data),'The file must contain a portfolio object.');
  for(const section of ['profile','pages']) {assert(data[section] && typeof data[section]==='object'&&!Array.isArray(data[section]),`Missing ${section}.`);for(const key of Object.keys(baseline[section])){if(key==='about'){assert(Array.isArray(data.profile.about)&&data.profile.about.every(x=>typeof x==='string'),'About must be a list of paragraphs.');}else assert(typeof data[section][key]==='string',`Invalid ${section}: ${key}.`);}}
  assert(Array.isArray(data.technologies)&&data.technologies.every(x=>typeof x==='string'),'Core technologies must be a list of text.');
  for(const [section,template] of Object.entries(templates)){assert(Array.isArray(data[section]),`Missing ${section} list.`);for(const item of data[section]){assert(item&&typeof item==='object',`Invalid entry in ${section}.`);for(const [key,value] of Object.entries(template)){if(Array.isArray(value))assert(Array.isArray(item[key])&&item[key].every(x=>typeof x==='string'),`${section}: ${key} must be a list of text.`);else assert(typeof item[key]===typeof value,`${section}: invalid ${key}.`);}}}
  assert(data.profile.name.trim(),'Please enter your name.');
  const ids=new Set();for(const p of data.projects){assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.id),'Project URL IDs must use lowercase letters, numbers, and single hyphens.');assert(!ids.has(p.id),'Each project needs a unique URL ID.');ids.add(p.id);assert(p.title.trim(),'Each project needs a title.');}
  const urls=[data.profile.github,data.profile.linkedin,data.profile.resume,data.profile.portrait,...data.projects.flatMap(p=>[p.repository,p.demo,p.image])];
  for(const value of urls){if(!value)continue;const url=new URL(value,location.href);assert(['http:','https:'].includes(url.protocol),'Links must be web URLs or relative asset paths.');}
  assert(!data.profile.email||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.profile.email),'Please enter a valid contact email or leave it blank.');
  return data;
}
function field(container,object,key,path){const value=object[key],id='field-'+path.join('-');const label=el('label',{htmlFor:id},labels[key]||key);container.append(label);if(Array.isArray(value)){const textarea=el('textarea',{id,value:value.join('\n'),rows:Math.min(Math.max(value.length,3),9)});container.append(textarea,el('small',{},key==='about'?'One paragraph per line.':'One item per line. Add or remove lines to change the list.'));textarea.addEventListener('input',()=>{object[key]=textarea.value.split('\n').map(x=>x.trim()).filter(Boolean);saveDraft();});}else if(typeof value==='boolean'){const checkbox=el('input',{id,type:'checkbox',checked:value});checkbox.addEventListener('change',()=>{object[key]=checkbox.checked;saveDraft();});container.append(checkbox);}else{const input=el(longFields.has(key)?'textarea':'input',{id,value});input.addEventListener('input',()=>{object[key]=input.value;saveDraft();});container.append(input);}}
function render(openSections = ['profile']){
  form.replaceChildren();
  for(const section of ['profile','pages','technologies','expertise','experience','education','projects']){
    const details=el('details',{open:openSections.includes(section)});details.dataset.section=section;details.append(el('summary',{},labels[section]));form.append(details);
    if(section==='technologies'){field(details,content,section,[section]);continue;}
    if(!Array.isArray(content[section])){for(const key of Object.keys(content[section]))field(details,content[section],key,[section,key]);continue;}
    content[section].forEach((item,index)=>{const box=el('fieldset');box.append(el('legend',{},`${index+1}. ${item.title||item.role||item.degree||'Entry'}`));details.append(box);for(const key of Object.keys(templates[section]))field(box,item,key,[section,index,key]);const controls=el('div',{className:'item-actions'});box.append(controls);const up=el('button',{type:'button',className:'minor',disabled:index===0},'Move up'),down=el('button',{type:'button',className:'minor',disabled:index===content[section].length-1},'Move down'),remove=el('button',{type:'button',className:'minor danger'},'Remove entry');controls.append(up,down,remove);const move=delta=>{[content[section][index],content[section][index+delta]]=[content[section][index+delta],content[section][index]];redraw();};up.onclick=()=>move(-1);down.onclick=()=>move(1);remove.onclick=()=>{content[section].splice(index,1);redraw();};});
    const add=el('button',{type:'button',className:'button'},'Add '+({expertise:'expertise group',experience:'experience',education:'education',projects:'project'}[section]));details.append(add);add.onclick=()=>{const item=structuredClone(templates[section]);if(section==='projects'){let number=1;while(content.projects.some(x=>x.id===`new-project-${number}`))number++;item.id=`new-project-${number}`;}content[section].push(item);redraw();};
  }
}
function redraw(){const open=[...form.querySelectorAll('details[open]')].map(x=>x.dataset.section);saveDraft();render(open);}
function validAction(action){try{validate(content);action();}catch(error){updateStatus(error.message);status.scrollIntoView({block:'center'});}}
document.getElementById('preview').onclick=()=>validAction(()=>{try{sessionStorage.setItem('portfolioDraft',JSON.stringify(content));location.href='index.html?draft=1';}catch{updateStatus('Preview needs browser session storage. You can still download your content.');}});
document.getElementById('download').onclick=()=>validAction(()=>{const blob=new Blob([JSON.stringify(content,null,2)+'\n'],{type:'application/json'}),url=URL.createObjectURL(blob),link=el('a',{href:url,download:'content.json'});document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);updateStatus('Downloaded content.json. Replace content.json in your GitHub repository and commit to publish your changes.');});
document.getElementById('import').onchange=async event=>{const file=event.target.files[0];if(!file)return;try{const imported=validate(JSON.parse(await file.text()));content=imported;saveDraft();render();updateStatus('Imported content into your draft. The website has not changed.');}catch(error){updateStatus('Import failed: '+error.message);}event.target.value='';};
document.getElementById('reset').onclick=()=>{content=structuredClone(baseline);try{sessionStorage.removeItem('portfolioDraft');}catch{}render();updateStatus('Draft discarded. Showing saved website content.');};
form.addEventListener('submit',event=>event.preventDefault());
(async()=>{try{const response=await fetch('content.json',{cache:'no-cache'});if(!response.ok)throw new Error('Unable to load content.json');baseline=await response.json();content=structuredClone(baseline);let restored=false;try{const draft=sessionStorage.getItem('portfolioDraft');if(draft){content=validate(JSON.parse(draft));restored=true;}}catch{content=structuredClone(baseline);}render();for(const id of ['preview','download','import','reset'])document.getElementById(id).disabled=false;updateStatus(restored?'Your previous draft is restored in this tab.':'Ready to edit. Changes stay in this browser until you download and publish the file.');}catch(error){updateStatus(error.message+'. Open this editor through the local preview or your hosted website.');}})();

