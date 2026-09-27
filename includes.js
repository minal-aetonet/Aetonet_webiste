// Load shared page sections before starting the site's interactive scripts.
Promise.all(
  [...document.querySelectorAll("[data-include]")].map(async (slot) => {
    const response = await fetch(slot.dataset.include);
    if (!response.ok) throw new Error(`Could not load ${slot.dataset.include}`);
    slot.outerHTML = await response.text();
  }),
)
  .catch((error) => console.error("Page component loading failed:", error))
  // Start the page scripts even if a component failed, so the page content still works.
  .then(() => {
    const siteScript = document.createElement("script");
    siteScript.src = "script.js";
    document.body.appendChild(siteScript);
  });
