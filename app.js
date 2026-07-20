const STATES = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];
const INITIAL_CLIENTS = [
  ["Ana Beatriz Souza","(11) 99845-1203","Rua das Flores, 142 - Jardim Paulista","1988-03-14","São Paulo","SP"],
  ["Bruno Henrique Lima","(21) 98762-4510","Av. Atlântica, 880 - Copacabana","1992-07-22","Rio de Janeiro","RJ"],
  ["Carla Mendes Oliveira","(31) 99124-7735","Rua Pernambuco, 320 - Savassi","1985-11-06","Belo Horizonte","MG"],
  ["Daniel Costa Ribeiro","(41) 98410-3382","Rua XV de Novembro, 611 - Centro","1979-01-28","Curitiba","PR"],
  ["Eduarda Martins Alves","(51) 99733-6291","Av. Ipiranga, 1540 - Azenha","1995-09-17","Porto Alegre","RS"],
  ["Felipe Rocha Santos","(71) 98861-2044","Rua Chile, 75 - Comércio","1990-05-09","Salvador","BA"],
  ["Gabriela Ferreira Nunes","(85) 99602-8157","Av. Beira Mar, 920 - Meireles","1998-12-03","Fortaleza","CE"],
  ["Henrique Azevedo Campos","(61) 98355-4902","SQS 308, Bloco B, 204 - Asa Sul","1982-04-25","Brasília","DF"],
  ["Isabela Gomes Freitas","(19) 99218-5476","Rua Barreto Leme, 410 - Cambuí","2000-08-11","Campinas","SP"],
  ["João Pedro Barbosa","(81) 98740-3619","Rua do Sol, 238 - Santo Antônio","1975-02-19","Recife","PE"],
  ["Karen Cristina Duarte","(48) 99931-7064","Av. Mauro Ramos, 705 - Centro","1993-06-30","Florianópolis","SC"],
  ["Lucas Vieira Monteiro","(62) 98527-1180","Rua 9, 530 - Setor Oeste","1987-10-12","Goiânia","GO"],
  ["Mariana Lopes Cardoso","(27) 99463-8205","Av. Nossa Senhora da Penha, 1040","1997-01-05","Vitória","ES"],
  ["Nicolas Teixeira Moura","(91) 98176-4559","Av. Nazaré, 660 - Nazaré","1984-07-08","Belém","PA"],
  ["Olívia Castro Farias","(83) 99320-6741","Av. Epitácio Pessoa, 1250 - Tambaú","2001-03-21","João Pessoa","PB"],
  ["Paulo Roberto Silveira","(84) 98644-3290","Rua Açu, 190 - Tirol","1972-09-15","Natal","RN"],
  ["Queila Andrade Pinto","(98) 99710-5823","Av. dos Holandeses, 430 - Calhau","1989-12-27","São Luís","MA"],
  ["Rafael Tavares Coelho","(65) 98471-9306","Av. Isaac Póvoas, 815 - Centro","1994-04-02","Cuiabá","MT"],
  ["Sabrina Moreira Reis","(67) 99105-2478","Rua Bahia, 540 - Jardim dos Estados","1981-08-24","Campo Grande","MS"],
  ["Thiago Araújo Bastos","(79) 99822-6135","Av. Hermes Fontes, 365 - Suíssa","1996-05-16","Aracaju","SE"],
  ["Úrsula Macedo Dias","(82) 98539-7701","Rua do Comércio, 280 - Farol","1977-11-29","Maceió","AL"],
  ["Vinícius Paiva Melo","(92) 99267-1844","Av. Djalma Batista, 1710 - Chapada","1991-02-07","Manaus","AM"],
  ["Wagner Queiroz Neves","(69) 98430-5562","Av. Carlos Gomes, 920 - São Cristóvão","1983-06-18","Porto Velho","RO"],
  ["Yasmin Cavalcante Luz","(86) 99615-4087","Av. Frei Serafim, 1320 - Centro","1999-10-04","Teresina","PI"],
  ["Zeca Almeida Peixoto","(63) 98190-3726","Av. JK, 740 - Plano Diretor Sul","1974-12-10","Palmas","TO"],
  ["Amanda Reis Guimarães","(11) 97544-8901","Rua Vergueiro, 1850 - Vila Mariana","1986-05-31","São Paulo","SP"],
  ["Caio César Fonseca","(19) 98970-2254","Av. Andrade Neves, 920 - Centro","1993-09-08","Campinas","SP"],
  ["Débora Pires Machado","(41) 99761-0438","Av. República Argentina, 480 - Água Verde","1980-03-26","Curitiba","PR"],
  ["Marcelo Fernandes Braga","(31) 98234-6695","Av. Amazonas, 2300 - Barro Preto","1969-07-13","Belo Horizonte","MG"],
  ["Renata Soares Vasconcelos","(21) 99587-3126","Rua Voluntários da Pátria, 340 - Botafogo","2002-01-20","Rio de Janeiro","RJ"]
].map((c,index)=>({id:index+1,name:c[0],phone:c[1],address:c[2],birth:c[3],city:c[4],state:c[5]}));

const $ = selector => document.querySelector(selector);
const normalize = value => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const storageKey = "clientela-clientes-v1";
let clients = loadClients();
let pendingDeleteId = null;
const filterIds = ["generalFilter","nameFilter","phoneFilter","addressFilter","cityFilter","birthFromFilter","birthToFilter"];

function loadClients(){try{const saved=JSON.parse(localStorage.getItem(storageKey));return Array.isArray(saved)?saved:INITIAL_CLIENTS}catch(error){return INITIAL_CLIENTS}}
function saveClients(){localStorage.setItem(storageKey,JSON.stringify(clients))}
function initials(name){return name.split(" ").filter(Boolean).slice(0,2).map(word=>word[0]).join("").toUpperCase()}
function formatDate(date){return new Intl.DateTimeFormat("pt-BR",{timeZone:"UTC"}).format(new Date(`${date}T00:00:00Z`))}
function age(date){const today=new Date(),birth=new Date(`${date}T00:00:00`);let value=today.getFullYear()-birth.getFullYear();if(today<new Date(today.getFullYear(),birth.getMonth(),birth.getDate()))value--;return value}
function escapeHtml(value){const div=document.createElement("div");div.textContent=value;return div.innerHTML}
function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2600)}

function filteredClients(){
  const values=Object.fromEntries(filterIds.map(id=>[id,$(`#${id}`).value]));
  const selectedStates=[...document.querySelectorAll(".state-checkbox:checked")].map(input=>input.value);
  const result=clients.filter(c=>{
    const all=`${c.name} ${c.phone} ${c.address} ${c.birth} ${c.city} ${c.state}`;
    return (!values.generalFilter||normalize(all).includes(normalize(values.generalFilter)))&&
      (!values.nameFilter||normalize(c.name).includes(normalize(values.nameFilter)))&&
      (!values.phoneFilter||normalize(c.phone).includes(normalize(values.phoneFilter)))&&
      (!values.addressFilter||normalize(c.address).includes(normalize(values.addressFilter)))&&
      (!values.cityFilter||normalize(c.city).includes(normalize(values.cityFilter)))&&
      (!selectedStates.length||selectedStates.includes(c.state))&&
      (!values.birthFromFilter||c.birth>=values.birthFromFilter)&&(!values.birthToFilter||c.birth<=values.birthToFilter);
  });
  const [field,direction]=$("#sortSelect").value.split("-");
  const key=field==="name"?"name":field==="birth"?"birth":field;
  return result.sort((a,b)=>String(a[key]).localeCompare(String(b[key]),"pt-BR")*(direction==="desc"?-1:1));
}

function render(){
  const result=filteredClients(),body=$("#clientTable");
  body.innerHTML=result.map(c=>`<tr><td><div class="client-cell"><span class="avatar">${initials(c.name)}</span><div><strong>${escapeHtml(c.name)}</strong><small>Código #${String(c.id).padStart(4,"0")}</small></div></div></td><td><strong>${escapeHtml(c.phone)}</strong></td><td class="location">${escapeHtml(c.address)}<small>${escapeHtml(c.city)} <span class="state-tag">${c.state}</span></small></td><td>${formatDate(c.birth)}<small>${age(c.birth)} anos</small></td><td><div class="actions"><button class="icon-button edit" data-id="${c.id}" title="Editar">✎</button><button class="icon-button delete" data-id="${c.id}" title="Excluir">×</button></div></td></tr>`).join("");
  $("#resultCount").textContent=`${result.length} ${result.length===1?"encontrado":"encontrados"}`;
  $("#totalClients").textContent=clients.length;
  $("#emptyState").hidden=result.length>0;
}

function openForm(client=null){
  $("#clientForm").reset();$("#clientId").value=client ? client.id : "";
  $("#dialogEyebrow").textContent=client?"ALTERAR CADASTRO":"NOVO CADASTRO";$("#dialogTitle").textContent=client?"Editar cliente":"Adicionar cliente";
  if(client){$("#clientName").value=client.name;$("#clientPhone").value=client.phone;$("#clientAddress").value=client.address;$("#clientBirth").value=client.birth;$("#clientCity").value=client.city;$("#clientState").value=client.state}
  $("#clientDialog").showModal();setTimeout(()=>$("#clientName").focus(),50);
}

STATES.forEach(state=>{const label=document.createElement("label");label.innerHTML=`<input class="state-checkbox" type="checkbox" value="${state}"> ${state}`;$("#stateOptions").append(label);$("#clientState").add(new Option(state,state))});
filterIds.forEach(id=>$(`#${id}`).addEventListener("input",render));
$("#stateOptions").addEventListener("change",()=>{const selected=[...document.querySelectorAll(".state-checkbox:checked")];$("#stateFilter summary").textContent=selected.length?`${selected.length} ${selected.length===1?"estado selecionado":"estados selecionados"}`:"Todos os estados";render()});
$("#sortSelect").addEventListener("change",render);
$("#clearFilters").addEventListener("click",()=>{filterIds.forEach(id=>$(`#${id}`).value="");document.querySelectorAll(".state-checkbox").forEach(input=>input.checked=false);$("#stateFilter summary").textContent="Todos os estados";render()});
$("#newButton").addEventListener("click",()=>openForm());
[$("#closeDialog"),$("#cancelDialog")].forEach(button=>button.addEventListener("click",()=>$("#clientDialog").close()));
$("#clientForm").addEventListener("submit",event=>{event.preventDefault();const id=Number($("#clientId").value);const data={id:id||Math.max(0,...clients.map(c=>c.id))+1,name:$("#clientName").value.trim(),phone:$("#clientPhone").value.trim(),address:$("#clientAddress").value.trim(),birth:$("#clientBirth").value,city:$("#clientCity").value.trim(),state:$("#clientState").value};if(id)clients=clients.map(c=>c.id===id?data:c);else clients.push(data);saveClients();render();$("#clientDialog").close();toast(id?"Cliente atualizado com sucesso.":"Cliente cadastrado com sucesso.")});
$("#clientTable").addEventListener("click",event=>{const button=event.target.closest("button");if(!button)return;const id=Number(button.dataset.id),client=clients.find(c=>c.id===id);if(button.classList.contains("edit"))openForm(client);if(button.classList.contains("delete")){pendingDeleteId=id;$("#confirmText").textContent=`O cadastro de ${client.name} será removido permanentemente.`;$("#confirmDialog").showModal()}});
$("#cancelDelete").addEventListener("click",()=>$("#confirmDialog").close());
$("#confirmDelete").addEventListener("click",()=>{clients=clients.filter(c=>c.id!==pendingDeleteId);saveClients();render();$("#confirmDialog").close();toast("Cliente excluído.")});
$("#exportButton").addEventListener("click",()=>{const blob=new Blob([JSON.stringify(clients,null,2)],{type:"application/json"});const link=document.createElement("a");link.href=URL.createObjectURL(blob);link.download=`clientes-${new Date().toISOString().slice(0,10)}.json`;link.click();URL.revokeObjectURL(link.href);toast("Arquivo JSON exportado.")});
$("#importButton").addEventListener("click",()=>$("#fileInput").click());
$("#fileInput").addEventListener("change",async event=>{try{const data=JSON.parse(await event.target.files[0].text());if(!Array.isArray(data)||!data.every(c=>c.name&&c.phone&&c.address&&c.birth&&c.city&&c.state))throw new Error();clients=data.map((c,i)=>({...c,id:Number(c.id)||i+1}));saveClients();render();toast(`${clients.length} clientes importados.`)}catch(error){alert("O arquivo não possui um cadastro de clientes válido.")}event.target.value=""});
render();
