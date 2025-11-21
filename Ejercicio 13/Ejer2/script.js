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
  title: document.getElementById('formTitle')
};

let usersCache = [];
let busy = false;

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

function setBusy(v){
  busy = v;
  els.submitBtn.disabled = v;
  els.loadBtn.disabled = v;
  els.refreshBtn.disabled = v;
  document.querySelectorAll('.edit,.del').forEach(b=> b.disabled = v);
  els.loading.hidden = !v;
}

function renderList(list){
  els.tbody.innerHTML = '';
  list.forEach(u=>{
    const tr = document.createElement('tr');
    tr.dataset.id = u._id || u._tmp;
    tr.innerHTML = `
      <td><img src="${u.picture}" class="avatar" alt="${u.firstName}"></td>
      <td>${u.firstName}</td>
      <td>${u.lastName}</td>
      <td>${u.email}</td>
      <td>
        <button class="secondary edit" data-id="${u._id || u._tmp}">Editar</button>
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
    const res = await fetch(API_URL+'/'+id, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
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
}

els.loadBtn.addEventListener('click', uploadInitialUsers);
els.refreshBtn.addEventListener('click', fetchUsers);
els.search.addEventListener('input', ()=> renderList(getFiltered()));

window.addEventListener('load', ()=> fetchUsers());
