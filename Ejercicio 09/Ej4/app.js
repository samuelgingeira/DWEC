let popupWindow = null;

function openPopup() {
  if (popupWindow && !popupWindow.closed) {
    popupWindow.focus();
    return;
  }

  const width = 400;
  const height = 300;
  const left = (window.innerWidth - width) / 2;
  const top = 50;

  popupWindow = window.open(
    "popup.html",
    "popupWindow",
    `width=${width},height=${height},left=${left},top=${top}`
  );
}

window.addEventListener("load", () => {
  setTimeout(openPopup, 5000);
});

document.getElementById("openPopup").addEventListener("click", openPopup);

document.getElementById("closePopup").addEventListener("click", () => {
  if (popupWindow && !popupWindow.closed) {
    popupWindow.close();
  }
});
