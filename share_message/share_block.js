function loadShareBlock() {
  fetch("/components/share_block.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("share-block").innerHTML = html;
    });
}
document.addEventListener("DOMContentLoaded", loadShareBlock);

function copyLink(event) {
  event.preventDefault();
  navigator.clipboard.writeText("https://www.bulmacan.com");
  alert("Link kopyalandı!");
}


