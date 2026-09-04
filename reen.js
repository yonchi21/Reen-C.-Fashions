 // ---- One place to edit shop details ----
  const CONFIG = {
    shopName: "REEN C. FASHION",      
    whatsappNumber: "265991289945",    
    phoneDisplay: "+265 991 289 945",  
  };

  // ---- Page loading screen ----
  // Shows on every page (index + all category pages) until images/assets
  // finish loading, with a minimum display time so it never just flickers.
  (function () {
    const loader = document.getElementById('page-loader');
    if (!loader) return;
    const MIN_VISIBLE_MS = 350;
    const shownAt = Date.now();
    function hideLoader() {
      const wait = Math.max(0, MIN_VISIBLE_MS - (Date.now() - shownAt));
      setTimeout(function () { loader.classList.add('page-loader--hidden'); }, wait);
    }
    if (document.readyState === 'complete') {
      hideLoader();
    } else {
      window.addEventListener('load', hideLoader);
    }
  })();

  const shopNameEl = document.getElementById('shop-name');
  if (shopNameEl) {
    shopNameEl.textContent = CONFIG.shopName;
    document.title = CONFIG.shopName + " — Clothing, Shoes, Bags & Beddings";
  }

  function waLink(item) {
    const msg = "Hi Reen C. Fashion! I would like to order: " + item;
    return "https://wa.me/" + CONFIG.whatsappNumber + "?text=" + encodeURIComponent(msg);
  }

  document.querySelectorAll('[data-wa-item]').forEach(function (el) {
    el.href = waLink(el.dataset.waItem);
  });

  const waBtn = document.getElementById('whatsapp-btn');
  if (waBtn) waBtn.href = waLink("your products");

  const phoneBtn = document.getElementById('phone-btn');
  if (phoneBtn) {
    phoneBtn.href = 'tel:' + CONFIG.phoneDisplay.replace(/\s+/g, '');
    phoneBtn.textContent = '📞 ' + CONFIG.phoneDisplay;
  }

  // ---- Sticky tab highlighting ----
  const sections = document.querySelectorAll('.page');
  const tabs = document.querySelectorAll('.tab');
  function setActive(id) {
    tabs.forEach(function (t) { t.classList.toggle('is-active', t.dataset.tab === id); });
  }
  const tabObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) setActive(entry.target.dataset.cat);
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach(function (s) { tabObserver.observe(s); });

  // ---- Gentle reveal on scroll (safe if JS is slow: content is visible by default) ----
  sections.forEach(function (s) { s.classList.add('will-reveal'); });
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
  sections.forEach(function (s) { revealObserver.observe(s); });

  // Safety net: on pages with a LOT of content (many large photos), layout can be
  // slow enough that the observer above never reports "in view" in time, which
  // would leave the whole section stuck invisible. Force it to reveal after a
  // short delay no matter what, so this can never make a page look blank.
  setTimeout(function () {
    sections.forEach(function (s) { s.classList.add('is-visible'); });
  }, 1200);


  // ---- Checkbox price calculator + dynamic WhatsApp order link ----
  // Only runs on pages that actually have these elements (e.g. women clothes.html),
  // so it stays safe to include on every page via the shared reen.js file.
  const itemCheckboxes = document.querySelectorAll('.item_checkbox');
  const totalPriceElement = document.getElementById('total-price');
  const orderBtn = document.getElementById('whatsapp-btn');
  const selectedItemsEl = document.getElementById('selected-items');

  if (itemCheckboxes.length && totalPriceElement && orderBtn) {
    function calculateTotalAndGenerateLink() {
      let total = 0;
      const selectedItems = [];
      const selectedImages = [];

      itemCheckboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
          const name = checkbox.getAttribute('data-name');
          const price = parseInt(checkbox.getAttribute('data-price'), 10) || 0;
          const img = checkbox.getAttribute('data-img');
          total += price;
          selectedItems.push(name + ' (MK ' + price.toLocaleString() + ')');
          if (img) selectedImages.push({ img: img, name: name });
        }
      });

      totalPriceElement.textContent = 'MK ' + total.toLocaleString();

      // Show a thumbnail for every checked item
      if (selectedItemsEl) {
        selectedItemsEl.innerHTML = '';
        selectedImages.forEach(function (item) {
          const thumb = document.createElement('img');
          thumb.src = item.img;
          thumb.alt = item.name;
          thumb.className = 'selected-items__thumb';
          selectedItemsEl.appendChild(thumb);
        });
      }

      if (selectedItems.length > 0) {
        const messageText = "Hi Reen C. Fashion! I would like to order:\n- " +
          selectedItems.join('\n- ') +
          "\n\nTotal Estimated Cost: MK " + total.toLocaleString();
        orderBtn.href = "https://wa.me/" + CONFIG.whatsappNumber + "?text=" + encodeURIComponent(messageText);
        orderBtn.textContent = '💬 Order on WhatsApp';
        orderBtn.classList.remove('is-disabled');
      } else {
        orderBtn.href = "https://wa.me/" + CONFIG.whatsappNumber;
        orderBtn.textContent = '💬 Select item(s) to order';
        orderBtn.classList.add('is-disabled');
      }
    }

    itemCheckboxes.forEach(function (checkbox) {
      checkbox.addEventListener('change', calculateTotalAndGenerateLink);
    });

    // Set the correct starting state (MK 0, button faint) as soon as the page loads
    calculateTotalAndGenerateLink();
  }