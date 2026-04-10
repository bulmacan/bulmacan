function loadHeader(type = "home") {
  const headerMap = {
    home: "/header/header_home.html",
    back: "/header/header_back.html",
    blogs: "/header/header_blogs.html",
    docs: "/header/header_docs.html"
  };

  const file = headerMap[type] || headerMap.home;

  fetch(file)
    .then(res => res.text())
    .then(html => {
      document.getElementById("smart-header").innerHTML = html;
      initCookiePopup();
    })
    .catch(err => console.error("Header load error:", err));
}

