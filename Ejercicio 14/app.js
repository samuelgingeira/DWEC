function aplicarTema(tema){
  document.body.className = tema;
  sessionStorage.setItem("tema", tema);
}
document.getElementById("tema-claro").onclick = ()=>aplicarTema("claro");
document.getElementById("tema-oscuro").onclick = ()=>aplicarTema("oscuro");
const tema = sessionStorage.getItem("tema");
if(tema) aplicarTema(tema);

function getCookie(n){
  return document.cookie.split("; ").find(r=>r.startsWith(n+"="))?.split("=")[1];
}
function setCookie(n,v,d){
  const f=new Date();
  f.setTime(f.getTime()+d*86400000);
  document.cookie=`${n}=${v};expires=${f.toUTCString()};path=/`;
}
const ultima=getCookie("ultimaVisita");
if(ultima){
  document.getElementById("banner").innerHTML =
    `Bienvenido de nuevo. Tu última visita fue ${ultima}
     <button onclick="this.parentNode.style.display='none'">Cerrar</button>`;
}
setCookie("ultimaVisita", new Date().toLocaleString(), 30);

let db;
const req=indexedDB.open("tiendaDB",1);
req.onupgradeneeded=e=>{
  db=e.target.result;
  db.createObjectStore("productos",{keyPath:"id"});
  db.createObjectStore("carrito",{keyPath:"productoId"});
};
req.onsuccess=e=>{db=e.target.result; cargarProductos();};

const cont=document.getElementById("productosContainer");

function cargarProductos(){
  const tx=db.transaction("productos","readonly");
  const store=tx.objectStore("productos");
  store.getAll().onsuccess=e=>{
    if(e.target.result.length){
      mostrarProductos(e.target.result);
    }else{
      fetch("./data/productos.json").then(r=>r.json()).then(data=>{
        const txw=db.transaction("productos","readwrite");
        const s=txw.objectStore("productos");
        data.forEach(p=>s.add(p));
        mostrarProductos(data);
      });
    }
  }
}

function mostrarProductos(lista){
  cont.innerHTML="";
  lista.forEach(p=>{
    cont.innerHTML+=`
      <div class="card">
        <h3>${p.nombre}</h3>
        <p>€${p.precio}</p>
        <button onclick="addCarrito('${p.id}')">Añadir al carrito</button>
      </div>`;
  });
  mostrarCarrito();
}

function addCarrito(id){
  const tx=db.transaction("carrito","readwrite");
  const s=tx.objectStore("carrito");
  s.get(id).onsuccess=e=>{
    if(e.target.result){
      e.target.result.cantidad++;
      s.put(e.target.result);
    }else{
      s.add({productoId:id,cantidad:1});
    }
    mostrarCarrito();
  };
}

function mostrarCarrito(){
  const div=document.getElementById("carrito");
  div.innerHTML="";
  const tx=db.transaction("carrito","readonly");
  tx.objectStore("carrito").getAll().onsuccess=e=>{
    e.target.result.forEach(p=>{
      div.innerHTML+=`
        <p>${p.productoId} (${p.cantidad})
        <button onclick="modCarrito('${p.productoId}',1)">+</button>
        <button onclick="modCarrito('${p.productoId}',-1)">-</button>
        <button onclick="delCarrito('${p.productoId}')">x</button></p>`;
    });
  };
}

function modCarrito(id,d){
  const tx=db.transaction("carrito","readwrite");
  const s=tx.objectStore("carrito");
  s.get(id).onsuccess=e=>{
    if(!e.target.result) return;
    e.target.result.cantidad+=d;
    if(e.target.result.cantidad<=0) s.delete(id);
    else s.put(e.target.result);
    mostrarCarrito();
  };
}

function delCarrito(id){
  const tx=db.transaction("carrito","readwrite");
  tx.objectStore("carrito").delete(id);
  mostrarCarrito();
}

document.getElementById("vaciar-carrito").onclick=()=>{
  const tx=db.transaction("carrito","readwrite");
  tx.objectStore("carrito").clear();
  mostrarCarrito();
};

document.getElementById("actualizar-catalogo").onclick=()=>{
  const tx=db.transaction("productos","readwrite");
  tx.objectStore("productos").clear();
  tx.oncomplete=cargarProductos;
};
