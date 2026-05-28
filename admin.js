(function () {
  var source = window.__ADMIN_DATA__;
  if (!source) {
    return;
  }

  var state = JSON.parse(JSON.stringify(source));
  var loginRoot = document.querySelector("[data-admin-login]");
  var appRoot = document.querySelector("[data-admin-app]");
  var loginMessage = document.querySelector("[data-admin-login-message]");
  var loginForm = document.querySelector(".admin-login-form");
  var tabButtons = document.querySelectorAll("[data-admin-tab-button]");
  var panels = document.querySelectorAll("[data-admin-tab]");
  var importInput = document.querySelector("[data-admin-import]");
  var importTrigger = document.querySelector("[data-admin-import-trigger]");
  var exportButton = document.querySelector("[data-admin-export]");
  var resetButton = document.querySelector("[data-admin-reset]");

  function render() {
    renderSitePanel();
    renderHotelsPanel();
    renderArticlesPanel();
    renderFaqPanel();
    bindDynamicEvents();
  }

  function textInput(label, value, path, type) {
    return [
      '<label>',
      "<span>" + label + "</span>",
      '<input type="' + (type || "text") + '" data-path="' + path + '" value="' + String(value || "").replace(/"/g, "&quot;") + '">',
      "</label>"
    ].join("");
  }

  function textareaInput(label, value, path) {
    return [
      '<label>',
      "<span>" + label + "</span>",
      '<textarea rows="4" data-path="' + path + '">' + String(value || "") + "</textarea>",
      "</label>"
    ].join("");
  }

  function renderSitePanel() {
    var panel = document.querySelector('[data-admin-tab="site"]');
    panel.innerHTML = [
      '<p class="admin-helper">Edit the project name, contact info, tracking IDs, and default SEO settings.</p>',
      '<div class="admin-form">',
      '<div class="admin-row">',
      textInput("Site Name", state.site.name, "site.name"),
      textInput("Tagline", state.site.tagline, "site.tagline"),
      textInput("Base URL", state.site.baseUrl, "site.baseUrl", "url"),
      "</div>",
      '<div class="admin-row">',
      textInput("Email", state.site.email, "site.email", "email"),
      textInput("Phone", state.site.phone, "site.phone"),
      textInput("Address", state.site.address, "site.address"),
      "</div>",
      '<div class="admin-row">',
      textInput("GA ID", state.site.gaId, "site.gaId"),
      textInput("GTM ID", state.site.gtmId, "site.gtmId"),
      textInput("Meta Pixel ID", state.site.metaPixelId, "site.metaPixelId"),
      "</div>",
      textareaInput("Default SEO Title", state.site.seo.defaultTitle, "site.seo.defaultTitle"),
      textareaInput("Default SEO Description", state.site.seo.defaultDescription, "site.seo.defaultDescription"),
      textareaInput("Google Ads Conversion Note", state.site.adsConversionNote, "site.adsConversionNote"),
      "</div>"
    ].join("");
  }

  function renderHotelsPanel() {
    var panel = document.querySelector('[data-admin-tab="hotels"]');
    panel.innerHTML = [
      '<div class="admin-item-header"><div><h3>Hotels</h3><p class="admin-helper">CRUD-ready hotel entries with SEO-facing content fields.</p></div><button class="button button-small" type="button" data-add-hotel>Add hotel</button></div>',
      '<div class="admin-list">',
      state.hotels.map(function (hotel, index) {
        return [
          '<article class="admin-item">',
          '<div class="admin-item-header"><strong>' + hotel.name + '</strong><button class="button button-secondary button-small" type="button" data-remove-hotel="' + index + '">Delete</button></div>',
          '<div class="admin-form">',
          '<div class="admin-row">',
          textInput("Name", hotel.name, "hotels." + index + ".name"),
          textInput("Slug", hotel.slug, "hotels." + index + ".slug"),
          textInput("Visit URL", hotel.visitUrl, "hotels." + index + ".visitUrl", "url"),
          "</div>",
          '<div class="admin-row">',
          textInput("Destination", hotel.destination, "hotels." + index + ".destination"),
          textInput("State", hotel.state, "hotels." + index + ".state"),
          textInput("City", hotel.city, "hotels." + index + ".city"),
          "</div>",
          '<div class="admin-row">',
          textInput("Rating", hotel.rating, "hotels." + index + ".rating", "number"),
          textInput("Price Tier", hotel.priceTier, "hotels." + index + ".priceTier"),
          textInput("Casino Type", hotel.casinoType, "hotels." + index + ".casinoType"),
          "</div>",
          textareaInput("Summary", hotel.summary, "hotels." + index + ".summary"),
          textareaInput("Description", hotel.description, "hotels." + index + ".description"),
          textInput("Amenities (comma separated)", hotel.amenities.join(", "), "hotels." + index + ".amenities"),
          "</div>",
          "</article>"
        ].join("");
      }).join(""),
      "</div>"
    ].join("");
  }

  function renderArticlesPanel() {
    var panel = document.querySelector('[data-admin-tab="articles"]');
    panel.innerHTML = [
      '<div class="admin-item-header"><div><h3>Articles</h3><p class="admin-helper">Manage blog entries and SEO metadata.</p></div><button class="button button-small" type="button" data-add-article>Add article</button></div>',
      '<div class="admin-list">',
      state.articles.map(function (article, index) {
        return [
          '<article class="admin-item">',
          '<div class="admin-item-header"><strong>' + article.title + '</strong><button class="button button-secondary button-small" type="button" data-remove-article="' + index + '">Delete</button></div>',
          '<div class="admin-form">',
          '<div class="admin-row">',
          textInput("Title", article.title, "articles." + index + ".title"),
          textInput("Slug", article.slug, "articles." + index + ".slug"),
          textInput("Category", article.category, "articles." + index + ".category"),
          "</div>",
          '<div class="admin-row">',
          textInput("Author", article.author, "articles." + index + ".author"),
          textInput("Published At", article.publishedAt, "articles." + index + ".publishedAt"),
          textInput("Read Time", article.readTime, "articles." + index + ".readTime"),
          "</div>",
          textareaInput("Excerpt", article.excerpt, "articles." + index + ".excerpt"),
          textareaInput("SEO Title", article.seoTitle, "articles." + index + ".seoTitle"),
          textareaInput("SEO Description", article.seoDescription, "articles." + index + ".seoDescription"),
          textareaInput("Content Paragraphs (one per line)", article.content.join("\n"), "articles." + index + ".content"),
          "</div>",
          "</article>"
        ].join("");
      }).join(""),
      "</div>"
    ].join("");
  }

  function renderFaqPanel() {
    var panel = document.querySelector('[data-admin-tab="faqs"]');
    panel.innerHTML = [
      '<div class="admin-item-header"><div><h3>Homepage FAQ</h3><p class="admin-helper">Edit FAQ entries used on the homepage and in schema markup.</p></div><button class="button button-small" type="button" data-add-faq>Add FAQ</button></div>',
      '<div class="admin-list">',
      state.faqs.map(function (faq, index) {
        return [
          '<article class="admin-item">',
          '<div class="admin-item-header"><strong>FAQ ' + (index + 1) + '</strong><button class="button button-secondary button-small" type="button" data-remove-faq="' + index + '">Delete</button></div>',
          '<div class="admin-form">',
          textareaInput("Question", faq.question, "faqs." + index + ".question"),
          textareaInput("Answer", faq.answer, "faqs." + index + ".answer"),
          "</div>",
          "</article>"
        ].join("");
      }).join(""),
      "</div>"
    ].join("");
  }

  function setByPath(root, path, value) {
    var keys = path.split(".");
    var target = root;
    for (var i = 0; i < keys.length - 1; i += 1) {
      target = target[keys[i]];
    }
    target[keys[keys.length - 1]] = value;
  }

  function parseValue(path, value) {
    if (path.endsWith(".rating")) {
      return Number(value || 0);
    }
    if (path.endsWith(".amenities")) {
      return value.split(",").map(function (item) { return item.trim(); }).filter(Boolean);
    }
    if (path.endsWith(".content")) {
      return value.split("\n").map(function (item) { return item.trim(); }).filter(Boolean);
    }
    return value;
  }

  function addHotel() {
    state.hotels.push({
      name: "New Hotel",
      slug: "new-hotel",
      destination: "Las Vegas",
      state: "Nevada",
      city: "Las Vegas",
      rating: 4.5,
      priceTier: "Luxury",
      casinoType: "Integrated Resort",
      familyFriendly: true,
      pool: true,
      spa: true,
      resort: true,
      budget: false,
      amenities: ["Casino", "Spa", "Pool", "Restaurants", "Parking", "Entertainment"],
      location: "",
      summary: "",
      description: "",
      visitUrl: "https://example.com",
      gallery: ["new-hotel", "new-hotel-2", "new-hotel-3"],
      faq: [
        { question: "Who is this hotel best for?", answer: "Add guidance here." },
        { question: "What stands out about this property?", answer: "Add guidance here." }
      ]
    });
    render();
  }

  function addArticle() {
    state.articles.push({
      title: "New Article",
      slug: "new-article",
      excerpt: "",
      category: "Travel Tips",
      author: "Editorial Team",
      publishedAt: "2026-05-28",
      readTime: "5 min read",
      seoTitle: "New Article",
      seoDescription: "",
      content: ["First paragraph."]
    });
    render();
  }

  function addFaq() {
    state.faqs.push({ question: "New question?", answer: "New answer." });
    render();
  }

  function bindDynamicEvents() {
    document.querySelectorAll("[data-path]").forEach(function (field) {
      field.addEventListener("input", function () {
        var path = field.getAttribute("data-path");
        setByPath(state, path, parseValue(path, field.value));
      });
    });

    var addHotelButton = document.querySelector("[data-add-hotel]");
    var addArticleButton = document.querySelector("[data-add-article]");
    var addFaqButton = document.querySelector("[data-add-faq]");

    if (addHotelButton) addHotelButton.addEventListener("click", addHotel);
    if (addArticleButton) addArticleButton.addEventListener("click", addArticle);
    if (addFaqButton) addFaqButton.addEventListener("click", addFaq);

    document.querySelectorAll("[data-remove-hotel]").forEach(function (button) {
      button.addEventListener("click", function () {
        state.hotels.splice(Number(button.getAttribute("data-remove-hotel")), 1);
        render();
      });
    });

    document.querySelectorAll("[data-remove-article]").forEach(function (button) {
      button.addEventListener("click", function () {
        state.articles.splice(Number(button.getAttribute("data-remove-article")), 1);
        render();
      });
    });

    document.querySelectorAll("[data-remove-faq]").forEach(function (button) {
      button.addEventListener("click", function () {
        state.faqs.splice(Number(button.getAttribute("data-remove-faq")), 1);
        render();
      });
    });
  }

  function showApp() {
    loginRoot.hidden = true;
    appRoot.hidden = false;
    render();
  }

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var username = loginForm.elements.username.value;
    var password = loginForm.elements.password.value;

    if (username === source.site.admin.username && password === source.site.admin.password) {
      sessionStorage.setItem("casino-hotels-admin-auth", "true");
      showApp();
      return;
    }

    loginMessage.textContent = "Invalid credentials.";
  });

  tabButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var tab = button.getAttribute("data-admin-tab-button");
      tabButtons.forEach(function (item) {
        item.classList.toggle("is-active", item === button);
      });
      panels.forEach(function (panel) {
        panel.classList.toggle("is-active", panel.getAttribute("data-admin-tab") === tab);
      });
    });
  });

  importTrigger.addEventListener("click", function () {
    importInput.click();
  });

  importInput.addEventListener("change", function () {
    var file = importInput.files && importInput.files[0];
    if (!file) {
      return;
    }

    var reader = new FileReader();
    reader.onload = function () {
      state = JSON.parse(reader.result);
      render();
    };
    reader.readAsText(file);
  });

  exportButton.addEventListener("click", function () {
    var blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = "site-data.json";
    link.click();
    URL.revokeObjectURL(url);
  });

  resetButton.addEventListener("click", function () {
    state = JSON.parse(JSON.stringify(source));
    render();
  });

  if (sessionStorage.getItem("casino-hotels-admin-auth") === "true") {
    showApp();
  }
})();
