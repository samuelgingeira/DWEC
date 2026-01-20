const dropZone = document.getElementById('drop-zone');
const preview = document.getElementById('preview');
const downloads = document.getElementById('downloads');
let files = [];

dropZone.addEventListener('dragover', e => {e.preventDefault();});
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  files = [...e.dataTransfer.files];
  preview.innerHTML = '';
  files.forEach(f => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.createElement('img');
      img.src = e.target.result;
      preview.appendChild(img);
    };
    reader.readAsDataURL(f);
  });
});

document.getElementById('process').onclick = () => {
  downloads.innerHTML = '';
  files.forEach(file => {
    const img = new Image();
    img.onload = () => {
      const maxWidth = +document.getElementById('maxWidth').value;
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img,0,0,canvas.width,canvas.height);
      ctx.font = '20px Arial';
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillText(document.getElementById('watermark').value,10,canvas.height-10);
      const format = document.getElementById('format').value;
      canvas.toBlob(blob=>{
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'editada-'+file.name;
        a.textContent = a.download;
        downloads.appendChild(a);
        downloads.appendChild(document.createElement('br'));
      }, format);
    };
    img.src = URL.createObjectURL(file);
  });
};