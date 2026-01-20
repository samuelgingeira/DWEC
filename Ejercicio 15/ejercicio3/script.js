let map = L.map('map').setView([0,0],2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
let points=[], poly = L.polyline([]).addTo(map), total=0;

function hav(a,b,c,d){
 const R=6371, dLat=(c-a)*Math.PI/180, dLon=(d-b)*Math.PI/180;
 const x=Math.sin(dLat/2)**2+Math.cos(a*Math.PI/180)*Math.cos(c*Math.PI/180)*Math.sin(dLon/2)**2;
 return 2*R*Math.asin(Math.sqrt(x));
}

document.getElementById('add').onclick=async()=>{
 const lat=+lat.value, lon=+lon.value;
 const res=await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
 const data=await res.json();
 document.getElementById('list').innerHTML+=`<li>${lat}, ${lon} - ${data.display_name}</li>`;
 if(points.length){
   total+=h(points.at(-1)[0],points.at(-1)[1],lat,lon);
   distance.textContent='Distancia total: '+total.toFixed(2)+' km';
 }
 points.push([lat,lon]);
 L.marker([lat,lon]).addTo(map);
 poly.setLatLngs(points);
 map.fitBounds(poly.getBounds());
};