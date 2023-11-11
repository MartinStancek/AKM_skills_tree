function openInfoPopup() {
  document.getElementById("popupInfo").style.display = "block";
  document.getElementById("tree-structrure-content").style.filter = "blur(6px)";

}

function closeInfoPopup() {
  document.getElementById("popupInfo").style.display = "none";
  document.getElementById("tree-structrure-content").style.filter = "none";
}