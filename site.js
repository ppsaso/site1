(function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector(".site-nav");

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", function () {
      const isOpen = siteNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  const directoryRoot = document.querySelector("[data-hotel-directory]");
  if (directoryRoot) {
    const rawData = directoryRoot.getAttribute("data-hotel-directory");
    const hotels = JSON.parse(rawData);
    const inputs = directoryRoot.querySelectorAll("input, select");
    const resultsList = directoryRoot.querySelector("[data-results-list]");
    const resultsCount = directoryRoot.querySelector("[data-results-count]");
    const loadMoreButton = directoryRoot.querySelector("[data-load-more]");
    const resetButton = directoryRoot.querySelector("[data-reset-filters]");
    const chunkSize = 6;
    let visibleCount = chunkSize;
    let filteredHotels = hotels.slice();

    function cardMarkup(hotel) {
      const amenities = hotel.amenities
        .map(function (item) {
          return '<span class="amenity-badge">' + item + "</span>";
        })
        .join("");

      return [
        '<article class="hotel-card" data-hotel-card>',
        '  <a class="hotel-card-media" href="hotel-' + hotel.slug + '.html">',
        '    <img src="' + hotel.slug + '.svg" alt="' + hotel.name + '" loading="lazy" width="720" height="520">',
        "  </a>",
        '  <div class="hotel-card-body">',
        '    <div class="eyebrow-row"><span>' + hotel.destination + "</span><span>Rating " + Number(hotel.rating).toFixed(1) + "</span></div>",
        '    <h3><a href="hotel-' + hotel.slug + '.html">' + hotel.name + "</a></h3>",
        "    <p>" + hotel.summary + "</p>",
        '    <div class="meta-row"><span>' + hotel.city + ", " + hotel.state + "</span><span>" + hotel.priceTier + "</span></div>",
        '    <div class="amenity-row">' + amenities + "</div>",
        '    <div class="card-actions"><a class="button button-secondary" href="hotel-' + hotel.slug + '.html">View Details</a><a class="button" href="' + hotel.visitUrl + '" rel="nofollow sponsored noopener" target="_blank">Visit Hotel</a></div>',
        "  </div>",
        "</article>"
      ].join("");
    }

    function getValues() {
      const formData = {};
      inputs.forEach(function (input) {
        if (input.type === "checkbox") {
          formData[input.name] = input.checked;
        } else {
          formData[input.name] = input.value.trim();
        }
      });
      return formData;
    }

    function applyFilters() {
      const values = getValues();

      filteredHotels = hotels.filter(function (hotel) {
        const searchMatch = !values.search || [hotel.name, hotel.city, hotel.destination].join(" ").toLowerCase().includes(values.search.toLowerCase());
        const stateMatch = !values.state || hotel.state === values.state;
        const cityMatch = !values.city || hotel.city === values.city;
        const ratingMatch = !values.rating || hotel.rating >= Number(values.rating);
        const typeMatch = !values.casinoType || hotel.casinoType === values.casinoType;
        const luxuryMatch = !values.luxury || hotel.priceTier === "Luxury";
        const budgetMatch = !values.budget || hotel.budget === true || hotel.priceTier === "Budget";
        const familyMatch = !values.familyFriendly || hotel.familyFriendly === true;
        const poolMatch = !values.pool || hotel.pool === true;
        const spaMatch = !values.spa || hotel.spa === true;
        const resortMatch = !values.resort || hotel.resort === true;

        return searchMatch && stateMatch && cityMatch && ratingMatch && typeMatch && luxuryMatch && budgetMatch && familyMatch && poolMatch && spaMatch && resortMatch;
      });

      visibleCount = chunkSize;
      render();
    }

    function render() {
      const visibleHotels = filteredHotels.slice(0, visibleCount);
      resultsList.innerHTML = visibleHotels.map(cardMarkup).join("");
      resultsCount.textContent = filteredHotels.length + (filteredHotels.length === 1 ? " hotel" : " hotels");

      if (filteredHotels.length === 0) {
        resultsList.innerHTML = '<div class="info-card"><h3>No matching hotels</h3><p>Try broadening your filters or clearing the search terms.</p></div>';
      }

      if (loadMoreButton) {
        loadMoreButton.hidden = visibleCount >= filteredHotels.length;
      }
    }

    inputs.forEach(function (input) {
      input.addEventListener("input", applyFilters);
      input.addEventListener("change", applyFilters);
    });

    if (loadMoreButton) {
      loadMoreButton.addEventListener("click", function () {
        visibleCount += chunkSize;
        render();
      });
    }

    if (resetButton) {
      resetButton.addEventListener("click", function () {
        inputs.forEach(function (input) {
          if (input.type === "checkbox") {
            input.checked = false;
          } else {
            input.value = "";
          }
        });
        applyFilters();
      });
    }

    render();
  }

  const contactForm = document.querySelector("[data-rate-limit-form]");
  if (contactForm) {
    const message = contactForm.querySelector("[data-form-message]");
    const storageKey = "casino-hotels-contact-last-submit";

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const honeypot = contactForm.elements.website;
      const lastSubmit = Number(localStorage.getItem(storageKey) || 0);
      const now = Date.now();
      const cooldownMs = 24 * 60 * 60 * 1000;

      if (honeypot && honeypot.value) {
        message.textContent = "Submission blocked.";
        return;
      }

      if (now - lastSubmit < cooldownMs) {
        message.textContent = "Please wait before sending another inquiry from this browser.";
        return;
      }

      localStorage.setItem(storageKey, String(now));
      contactForm.reset();
      message.textContent = "Form captured locally. Connect this form to your CRM, inbox, or serverless function in production.";
    });
  }
})();
