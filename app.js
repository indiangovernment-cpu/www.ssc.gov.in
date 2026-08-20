<header class="ssc-header"><div class="container header-main">
  <a href="#home" class="brand" data-route="home">
    <img class="brand-reference" src="assets/brand.jpg" alt="Staff Selection Commission">
  </a>

  <div class="header-actions">
    <button class="lang-btn" id="langBtn">${state.lang==='en'?'हिन्दी':'English'}</button>

    <div class="searchbox">
      <input id="searchInput" placeholder="${tr('search')}..." aria-label="Search">
      <button id="searchBtn" aria-label="Search">⌕</button>
    </div>

    <button class="login-btn" id="loginBtn">${tr('login')}</button>

    <img class="govt-emblem"
         src="assets/government-of-india-emblem.jpg"
         alt="Government of India">
  </div>

</div></header>
