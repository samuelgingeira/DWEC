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

const el = {
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
  title: document.getElementById('formTitle')
};

function msg(t, err=false){
  el.msg.textContent = t;
  el.msg.style.color = err ? "#b91c1c" : "#16a34a";
  setTimeout(()=> el.msg.textContent="", 3000);
}

function uploadInitialUsers(){
  initialUsers.forEach(u=>{
    fetch(API_URL,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(u)
    })
    .then(r=>{ if(!r.ok) throw 0; return r.json(); })
    .then(()=> msg("Usuario subido"))
    .catch(()=> msg("Error subiendo",true));
  });
}

function displayUsers(){
  fetch(API_URL)
  .then(r=>{ if(!r.ok) throw 0; return r.json(); })
  .then(data=>{
    el.tbody.innerHTML="";
    data.forEach(u=>{
      const tr=document.createElement("tr");
      tr.innerHTML=`
      <td><img src="${u.picture}" class="avatar"></td>
      <td>${u.firstName}</td>
      <td>${u.lastName}</td>
      <td>${u.email}</td>
      <td>
        <button class="secondary edit" data-id="${u._id}">Editar</button>
        <button class="danger del" data-id="${u._id}">Eliminar</button>
      </td>`;
      el.tbody.appendChild(tr);
    });
    attachEvents();
  })
  .catch(()=> msg("Error cargando usuarios",true));
}

function attachEvents(){
  document.querySelectorAll(".edit").forEach(b=>{
    b.onclick=e=>{
      const id=e.target.dataset.id;
      fetch(API_URL+"/"+id)
      .then(r=>{ if(!r.ok) throw 0; return r.json(); })
      .then(u=>{
        el.firstName.value=u.firstName;
        el.lastName.value=u.lastName;
        el.email.value=u.email;
        el.picture.value=u.picture;
        el.userId.value=u._id;
        el.submitBtn.textContent="Guardar Cambios";
        el.cancelBtn.hidden=false;
        el.title.textContent="Editar Usuario";
      })
      .catch(()=> msg("Error cargando",true));
    };
  });

  document.querySelectorAll(".del").forEach(b=>{
    b.onclick=e=>{
      const id=e.target.dataset.id;
      if(!confirm("¿Eliminar?")) return;
      fetch(API_URL+"/"+id,{method:"DELETE"})
      .then(r=>{ if(!r.ok) throw 0; })
      .then(()=>{ msg("Eliminado"); displayUsers(); })
      .catch(()=> msg("Error eliminando",true));
    };
  });
}

el.form.onsubmit=e=>{
  e.preventDefault();
  const data={
    firstName:el.firstName.value,
    lastName:el.lastName.value,
    email:el.email.value,
    picture:el.picture.value
  };
  const id=el.userId.value;

  if(id){
    fetch(API_URL+"/"+id,{
      method:"PUT",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(data)
    })
    .then(r=>{ if(!r.ok) throw 0; })
    .then(()=>{
      el.form.reset();
      el.userId.value="";
      el.submitBtn.textContent="Añadir";
      el.cancelBtn.hidden=true;
      el.title.textContent="Añadir Usuario";
      msg("Actualizado");
      displayUsers();
    })
    .catch(()=> msg("Error actualizando",true));
  } else {
    fetch(API_URL,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(data)
    })
    .then(r=>{ if(!r.ok) throw 0; return r.json(); })
    .then(()=>{
      el.form.reset();
      msg("Creado");
      displayUsers();
    })
    .catch(()=> msg("Error creando",true));
  }
};

el.cancelBtn.onclick=()=>{
  el.form.reset();
  el.userId.value="";
  el.submitBtn.textContent="Añadir";
  el.cancelBtn.hidden=true;
  el.title.textContent="Añadir Usuario";
};

el.loadBtn.onclick=uploadInitialUsers;
el.refreshBtn.onclick=displayUsers;
window.onload=displayUsers;
