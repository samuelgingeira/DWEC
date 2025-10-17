const ul = document.getElementById('listaOrdenable');

function updateButtons(){
  const lis = Array.from(ul.children);
  lis.forEach((li, idx) => {
    const btnUp = li.querySelector('.subir');
    const btnDown = li.querySelector('.bajar');
    btnUp.disabled = idx === 0;
    btnDown.disabled = idx === lis.length - 1;
  });
}

ul.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const li = btn.closest('li');
  if (btn.classList.contains('subir')) {
    const prev = li.previousElementSibling;
    if (prev) ul.insertBefore(li, prev);
  } else if (btn.classList.contains('bajar')) {
    const next = li.nextElementSibling;
    if (next) ul.insertBefore(next, li);
  }
  updateButtons();
});


updateButtons();
