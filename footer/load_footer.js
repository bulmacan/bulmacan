function loadFooter() {
  fetch("/footer/footer.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("smart-footer").innerHTML = html;
    })
    .catch(err => console.error("Footer yüklenemedi:", err));
}

  window.addEventListener('load', function() {
    const ads = document.querySelectorAll('.ad-slot');
    ads.forEach(ad => {
      // load ad script here
    });
  });

