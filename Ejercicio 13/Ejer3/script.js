const API_URL = "https://crudcrud.com/api/34133e511b514456897c02175a7c7ab5/users";


const initialUsers = [
{"firstName":"Alice","lastName":"Smith","email":"alice.smith@example.com","picture":"https://randomuser.me/api/portraits/women/1.jpg"},
{"firstName":"Bob","lastName":"Johnson","email":"bob.johnson@example.com","picture":"https://randomuser.me/api/portraits/men/2.jpg"},
{"firstName":"Charlie","lastName":"Brown","email":"charlie.brown@example.com","picture":"https://randomuser.me/api/portraits/men/3.jpg"},
{"firstName":"Diana","lastName":"Prince","email":"diana.prince@example.com","picture":"https://randomuser.me/api/portraits/women/4.jpg"},
{"firstName":"Eve","lastName":"Adams","email":"eve.adams@example.com","picture":"https://randomuser.me/api/portraits/women/5.jpg"},
{"firstName":"Frank","lastName":"White","email":"frank.white@example.com","picture":"https://randomuser.me/api/portraits/men/6.jpg"},
{"firstName":"Grace","lastName":"Taylor","email":"grace.taylor@example.com","picture":"https://randomuser.me/api/portraits/women/7.jpg"},
{"firstName":"Henry","lastName":"Moore","email":"henry.moore@example.com","picture":"https://randomuser.me/api/portraits/men/8.jpg"},
{"firstName":"Ivy","lastName":"Clark","email":"ivy.clark@example.com","picture":"https://randomuser.me/api/portraits/women/9.jpg"},
{"firstName":"Jack","lastName":"Lewis","email":"jack.lewis@example.com","picture":"https://randomuser.me/api/portraits/men/10.jpg"}
];

const els = {
  tbody: document.getElementById('usersTbody'),
  form: document.getElementById('userForm'),
  firstName: document.getElementById('firstName'),
  lastName: document.getElementById('lastName'),
  email: document.getElementById('email'),
  picture: document.getElementById('picture'),
  userId: document.getElementById('userId'),
  submitBtn: document.getElementById('submitBtn'),
  cancelBtn: document.getElementById('cancelEditBtn'),
  loadBtn: document.getElementById('loadInitialBtn'),
  refreshBtn: document.getElementById('refreshBtn'),
  msg: document.getElementById('messages'),
  loading: document.getElementById('loading'),
  search: document.getElementById('searchInput'),
  title: document.getElementById('formTitle'),
  gradesModal: document.getElementById('gradesModal'),
  gradesForm: document.getElementById('gradesForm'),
  gradesTitle: document.getElementById('gradesTitle'),
  gMath: document.getElementById('g-math'),
  gHistory: document.getElementById('g-history'),
  gScience: document.getElementById('g-science'),
  gEnglish: document.getElementById('g-english'),
  gArt: document.getElementById('g-art'),
  saveGradesBtn: document.getElementById('saveGradesBtn'),
  clearGradesBtn: document.getElementById('clearGradesBtn'),
  closeGradesBtn: document.getElementById('closeGradesBtn')
};

let usersCache = [];
let busy = false;
let currentGradesUserId = null;

function showMessage(text, type='success'){
  els.msg.textContent = text;
  els.msg.className = type === 'success' ? 'success' : 'error';
  setTimeout(()=>{ if(els.msg.textContent===text) els.msg.textContent=''; els.msg.className=''; }, 4000);
}

function validate(){
  let ok = true;
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const urlRe = /^(https?:\/\/).+$/i;
  document.getElementById('err-firstName').textContent = '';
  document.getElementById('err-lastName').textContent = '';
  document.getElementById('err-email').textContent = '';
  document.getElementById('err-picture').textContent = '';
  if(!els.firstName.value.trim()){ document.getElementById('err-firstName').textContent = 'El nombre es obligatorio'; ok=false; }
  if(!els.lastName.value.trim()){ document.getElementById('err-lastName').textContent = 'Los apellidos son obligatorios'; ok=false; }
  if(!emailRe.test(els.email.value.trim())){ document.getElementById('err-email').textContent = 'Email no válido'; ok=false; }
  if(!urlRe.test(els.picture.value.trim())){ document.getElementById('err-picture').textContent = 'URL no válida (debe empezar por http(s)://)'; ok=false; }
  return ok;
}

function validateGrades(){
  let ok = true;
  document.getElementById('err-g-math').textContent = '';
  document.getElementById('err-g-history').textContent = '';
  document.getElementById('err-g-science').textContent = '';
  document.getElementById('err-g-english').textContent = '';
  document.getElementById('err-g-art').textContent = '';
  const fields = [
    {el: els.gMath, id: 'err-g-math'},
    {el: els.gHistory, id: 'err-g-history'},
    {el: els.gScience, id: 'err-g-science'},
    {el: els.gEnglish, id: 'err-g-english'},
    {el: els.gArt, id: 'err-g-art'}
  ];
  fields.forEach(f=>{
    const v = f.el.value;
    if(v === '') { document.getElementById(f.id).textContent = 'Valor requerido'; ok=false; return; }
    const n = Number(v);
    if(Number.isNaN(n) || n < 0 || n > 10){ document.getElementById(f.id).textContent = 'Debe ser número entre 0 y 10'; ok=false; }
  });
  return ok;
}

function setBusy(v){
  busy = v;
  els.submitBtn.disabled = v;
  els.loadBtn.disabled = v;
  els.refreshBtn.disabled = v;
  document.querySelectorAll('.edit,.del,.grades').forEach(b=> b.disabled = v);
  els.loading.hidden = !v;
}

function renderList(list){
  els.tbody.innerHTML = '';
  list.forEach(u=>{
    const tr = document.createElement('tr');
    tr.dataset.id = u._id || u._tmp;
    const gradesHtml = u.calificaciones ? Object.entries(u.calificaciones).map(([k,v])=>`<div class="small-grade"><strong>${k}:</strong> ${v}</div>`).join('') : '<div class="muted">Sin calificaciones</div>';
    tr.innerHTML = `
      <td><img src="${u.picture}" class="avatar" alt="${u.firstName}"></td>
      <td>${u.firstName}</td>
      <td>${u.lastName}</td>
      <td>${u.email}</td>
      <td>${gradesHtml}</td>
      <td>
        <button class="secondary edit" data-id="${u._id || u._tmp}">Editar</button>
        <button class="secondary grades" data-id="${u._id || u._tmp}">Calificaciones</button>
        <button class="danger del" data-id="${u._id || u._tmp}">Eliminar</button>
      </td>
    `;
    els.tbody.appendChild(tr);
  });
  attachEvents();
}

function getFiltered(){
  const q = (els.search.value || '').toLowerCase().trim();
  if(!q) return usersCache;
  return usersCache.filter(u => (u.firstName+ ' ' + u.lastName).toLowerCase().includes(q));
}

async function fetchUsers(){
  try{
    setBusy(true);
    const res = await fetch(API_URL);
    if(!res.ok) throw new Error('Error al obtener usuarios');
    const data = await res.json();
    usersCache = data;
    renderList(getFiltered());
  }catch(e){
    showMessage(e.message || 'Error', 'error');
  }finally{
    setBusy(false);
  }
}

async function uploadInitialUsers(){
  try{
    setBusy(true);
    for(const u of initialUsers){
      await fetch(API_URL, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(u) });
    }
    await fetchUsers();
    showMessage('Usuarios iniciales subidos');
  }catch(e){
    showMessage('Error al subir iniciales', 'error');
  }finally{
    setBusy(false);
  }
}

function createRowObject(data){
  return { firstName:data.firstName, lastName:data.lastName, email:data.email, picture:data.picture, _tmp:'tmp-'+Date.now() };
}

async function addUserOptimistic(data){
  const tmp = createRowObject(data);
  usersCache.unshift(tmp);
  renderList(getFiltered());
  try{
    setBusy(true);
    const res = await fetch(API_URL, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
    if(!res.ok) throw new Error('Error creando');
    const saved = await res.json();
    usersCache = usersCache.map(u => u._tmp === tmp._tmp ? saved : u);
    renderList(getFiltered());
    showMessage('Usuario añadido correctamente');
  }catch(e){
    usersCache = usersCache.filter(u => u._tmp !== tmp._tmp);
    renderList(getFiltered());
    showMessage('Error creando usuario', 'error');
  }finally{
    setBusy(false);
  }
}

async function deleteUserOptimistic(id){
  const idx = usersCache.findIndex(u => u._id === id);
  const tmp = usersCache.splice(idx,1)[0];
  renderList(getFiltered());
  try{
    setBusy(true);
    const res = await fetch(API_URL+'/'+id, { method:'DELETE' });
    if(!res.ok) throw new Error('Error eliminando');
    showMessage('Usuario eliminado');
  }catch(e){
    usersCache.splice(idx,0,tmp);
    renderList(getFiltered());
    showMessage('Error eliminando usuario', 'error');
  }finally{
    setBusy(false);
  }
}

async function updateUser(id,data){
  const old = usersCache.find(u => (u._id||u._tmp) === id);
  const backup = Object.assign({}, old);
  Object.assign(old, data);
  renderList(getFiltered());
  try{
    setBusy(true);
    const body = { firstName: old.firstName, lastName: old.lastName, email: old.email, picture: old.picture };
    if(old.calificaciones) body.calificaciones = old.calificaciones;
    const res = await fetch(API_URL+'/'+id, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
    if(!res.ok) throw new Error('Error actualizando');
    showMessage('Usuario actualizado');
  }catch(e){
    Object.assign(old, backup);
    renderList(getFiltered());
    showMessage('Error actualizando usuario', 'error');
  }finally{
    setBusy(false);
  }
}

function openGradesModalFor(user){
  currentGradesUserId = user._id || user._tmp;
  els.gradesTitle.textContent = 'Calificaciones - ' + (user.firstName + ' ' + user.lastName);
  els.gMath.value = user.calificaciones && user.calificaciones['Matemáticas'] != null ? user.calificaciones['Matemáticas'] : '';
  els.gHistory.value = user.calificaciones && user.calificaciones['Historia'] != null ? user.calificaciones['Historia'] : '';
  els.gScience.value = user.calificaciones && user.calificaciones['Ciencia'] != null ? user.calificaciones['Ciencia'] : '';
  els.gEnglish.value = user.calificaciones && user.calificaciones['Inglés'] != null ? user.calificaciones['Inglés'] : '';
  els.gArt.value = user.calificaciones && user.calificaciones['Arte'] != null ? user.calificaciones['Arte'] : '';
  els.gradesModal.hidden = false;
}

function closeGradesModal(){
  currentGradesUserId = null;
  els.gradesModal.hidden = true;
  els.gradesForm.reset();
  document.getElementById('err-g-math').textContent = '';
  document.getElementById('err-g-history').textContent = '';
  document.getElementById('err-g-science').textContent = '';
  document.getElementById('err-g-english').textContent = '';
  document.getElementById('err-g-art').textContent = '';
}

async function saveGrades(){
  if(!validateGrades()) return;
  const id = currentGradesUserId;
  const user = usersCache.find(u => (u._id||u._tmp) === id);
  if(!user){ showMessage('Usuario no encontrado', 'error'); return; }
  const cal = {
    "Matemáticas": Number(els.gMath.value),
    "Historia": Number(els.gHistory.value),
    "Ciencia": Number(els.gScience.value),
    "Inglés": Number(els.gEnglish.value),
    "Arte": Number(els.gArt.value)
  };
  const backup = Object.assign({}, user);
  user.calificaciones = cal;
  renderList(getFiltered());
  try{
    setBusy(true);
    const body = { firstName: user.firstName, lastName: user.lastName, email: user.email, picture: user.picture, calificaciones: user.calificaciones };
    const res = await fetch(API_URL + '/' + (user._id), { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
    if(!res.ok) throw new Error('Error guardando calificaciones');
    showMessage('Calificaciones guardadas');
    closeGradesModal();
    await fetchUsers();
  }catch(e){
    Object.assign(user, backup);
    renderList(getFiltered());
    showMessage('Error guardando calificaciones', 'error');
  }finally{
    setBusy(false);
  }
}

async function clearGrades(){
  if(!confirm('¿Borrar todas las calificaciones de este usuario?')) return;
  const id = currentGradesUserId;
  const user = usersCache.find(u => (u._id||u._tmp) === id);
  if(!user){ showMessage('Usuario no encontrado', 'error'); return; }
  const backup = Object.assign({}, user);
  delete user.calificaciones;
  renderList(getFiltered());
  try{
    setBusy(true);
    const body = { firstName: user.firstName, lastName: user.lastName, email: user.email, picture: user.picture };
    const res = await fetch(API_URL + '/' + (user._id), { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
    if(!res.ok) throw new Error('Error borrando calificaciones');
    showMessage('Calificaciones borradas');
    closeGradesModal();
    await fetchUsers();
  }catch(e){
    Object.assign(user, backup);
    renderList(getFiltered());
    showMessage('Error borrando calificaciones', 'error');
  }finally{
    setBusy(false);
  }
}

els.gradesForm.addEventListener('submit', async (ev)=>{
  ev.preventDefault();
  await saveGrades();
});

els.closeGradesBtn.addEventListener('click', ()=> closeGradesModal());
els.clearGradesBtn.addEventListener('click', ()=> clearGrades());

function attachEvents(){
  document.querySelectorAll('.edit').forEach(b=>{
    b.disabled = busy;
    b.onclick = async (e)=>{
      const id = e.target.dataset.id;
      const u = usersCache.find(x => (x._id||x._tmp) === id);
      if(!u) return;
      els.firstName.value = u.firstName;
      els.lastName.value = u.lastName;
      els.email.value = u.email;
      els.picture.value = u.picture;
      els.userId.value = id;
      els.submitBtn.textContent = 'Guardar Cambios';
      els.cancelBtn.hidden = false;
      els.title.textContent = 'Editar Usuario';
    };
  });

  document.querySelectorAll('.del').forEach(b=>{
    b.disabled = busy;
    b.onclick = async (e)=>{
      const id = e.target.dataset.id;
      if(id.startsWith('tmp-')){ usersCache = usersCache.filter(u => u._tmp !== id); renderList(getFiltered()); return; }
      if(!confirm('¿Estás seguro?')) return;
      await deleteUserOptimistic(id);
    };
  });

  document.querySelectorAll('.grades').forEach(b=>{
    b.disabled = busy;
    b.onclick = async (e)=>{
      const id = e.target.dataset.id;
      const u = usersCache.find(x => (x._id||x._tmp) === id);
      if(!u) return;
      openGradesModalFor(u);
    };
  });
}

els.form.addEventListener('submit', async (ev)=>{
  ev.preventDefault();
  if(!validate()) return;
  const payload = {
    firstName: els.firstName.value.trim(),
    lastName: els.lastName.value.trim(),
    email: els.email.value.trim(),
    picture: els.picture.value.trim()
  };
  const id = els.userId.value;
  if(id){
    await updateUser(id,payload);
    els.form.reset();
    els.userId.value = '';
    els.submitBtn.textContent = 'Añadir';
    els.cancelBtn.hidden = true;
    els.title.textContent = 'Añadir Usuario';
    await fetchUsers();
  } else {
    await addUserOptimistic(payload);
    els.form.reset();
  }
});

els.cancelBtn.addEventListener('click', ()=>{
  els.form.reset();
  els.userId.value = '';
  els.submitBtn.textContent = 'Añadir';
  els.cancelBtn.hidden = true;
  els.title.textContent = 'Añadir Usuario';
});

els.loadBtn.addEventListener('click', uploadInitialUsers);
els.refreshBtn.addEventListener('click', fetchUsers);
els.search.addEventListener('input', ()=> renderList(getFiltered()));

window.addEventListener('load', ()=> fetchUsers());
