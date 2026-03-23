function loadHeader(type = "home") {
  const headerMap = {
    home: "https://www.bulmacan.com/header/header_home.html",
    back: "https://www.bulmacan.com/header/header_back.html",
    blogs: "https://www.bulmacan.com/header/header_blogs.html",
    docs: "https://www.bulmacan.com/header/header_docs.html"
  };

  const file = headerMap[type] || headerMap.home;

  fetch(file)
    .then(res => res.text())
    .then(html => {
      document.getElementById("smart-header").innerHTML = html;
      initCookiePopup(); // ⭐ run cookie logic AFTER header is injected
    })
    .catch(err => console.error("Header load error:", err));
}

