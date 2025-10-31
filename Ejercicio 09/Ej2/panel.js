const viewport = document.getElementById("viewport");
const windowSize = document.getElementById("windowSize");
const windowPos = document.getElementById("windowPos");
const screenResolution = document.getElementById("screenResolution");
const screenAvail = document.getElementById("screenAvail");
const connection = document.getElementById("connection");
const indicator = document.getElementById("indicator");

let lastX = window.screenX;
let lastY = window.screenY;

function updateInfo() {
  viewport.textContent = `${window.innerWidth} x ${window.innerHeight}`;
  windowSize.textContent = `${window.outerWidth} x ${window.outerHeight}`;
  windowPos.textContent = `${window.screenX} , ${window.screenY}`;
  screenResolution.textContent = `${screen.width} x ${screen.height}`;
  screenAvail.textContent = `${screen.availWidth} x ${screen.availHeight}`;

  const onlineStatus = navigator.onLine;
  connection.textContent = onlineStatus ? "Online" : "Offline";
  indicator.style.backgroundColor = onlineStatus ? "green" : "red";
}

updateInfo();

window.addEventListener("resize", updateInfo);

window.addEventListener("online", updateInfo);
window.addEventListener("offline", updateInfo);

setInterval(() => {
  if (lastX !== window.screenX || lastY !== window.screenY) {
    lastX = window.screenX;
    lastY = window.screenY;
    updateInfo();
  }
}, 250);
