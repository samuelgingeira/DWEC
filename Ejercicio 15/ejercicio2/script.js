let dragged;

document.querySelectorAll('.card').forEach(card=>{
 card.addEventListener('dragstart',e=>{
   dragged=card;
   card.classList.add('dragging');
   e.dataTransfer.setData('application/json',JSON.stringify({id:card.id}));
 });
 card.addEventListener('dragend',()=>card.classList.remove('dragging'));
});

document.querySelectorAll('.column').forEach(col=>{
 col.addEventListener('dragover',e=>{e.preventDefault();col.classList.add('over');});
 col.addEventListener('dragleave',()=>col.classList.remove('over'));
 col.addEventListener('drop',e=>{
   e.preventDefault();
   col.classList.remove('over');
   col.appendChild(dragged);
 });
});