
/* =====================================================
   DR DANA'S DENTISTRY
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log("Dr Dana's Dentistry JavaScript is running!");

    /* =====================================================
       1. ACTIVE NAVIGATION LINK
       ===================================================== */

    const currentPage = window.location.pathname
        .split("/")
        .pop() || "index.html";

    document.querySelectorAll("nav a").forEach(function (link) {
        const linkPage = link.getAttribute("href");

        if (
            linkPage &&
            linkPage.split("#")[0] === currentPage
        ) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
    });


    /* =====================================================
       2. BACK TO TOP BUTTON
       Works when an element with id="backToTop" exists.
       ===================================================== */

    const backToTop = document.getElementById("backToTop");

    if (backToTop) {

        backToTop.hidden = window.scrollY <= 300;

        window.addEventListener("scroll", function () {
            backToTop.hidden = window.scrollY <= 300;
        });

        backToTop.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }


    /* =====================================================
       3. ACCORDION
       Add data-accordion to each accordion button.
       ===================================================== */

    document.querySelectorAll("[data-accordion]").forEach(
        function (button) {

            const panelId = button.getAttribute("aria-controls");
            const panel = panelId
                ? document.getElementById(panelId)
                : button.nextElementSibling;

            if (!panel) return;

            button.setAttribute("aria-expanded", "false");
            panel.hidden = true;

            button.addEventListener("click", function () {

                const isOpen =
                    button.getAttribute("aria-expanded") === "true";

                button.setAttribute(
                    "aria-expanded",
                    String(!isOpen)
                );

                panel.hidden = isOpen;
            });
        }
    );


    /* =====================================================
       4. TABS
       Buttons use data-tab-target="#panel-id".
       Panels use data-tab-panel.
       ===================================================== */

    document.querySelectorAll("[data-tab-target]").forEach(
        function (tab) {

            tab.addEventListener("click", function () {

                const targetSelector =
                    tab.getAttribute("data-tab-target");

                const targetPanel =
                    document.querySelector(targetSelector);

                if (!targetPanel) return;

                const container = tab.closest("[data-tabs]");

                if (!container) return;

                container.querySelectorAll("[data-tab-target]")
                    .forEach(function (otherTab) {
                        otherTab.setAttribute(
                            "aria-selected",
                            String(otherTab === tab)
                        );
                    });

                container.querySelectorAll("[data-tab-panel]")
                    .forEach(function (panel) {
                        panel.hidden = panel !== targetPanel;
                    });

                targetPanel.hidden = false;
            });
        }
    );


    /* =====================================================
       5. MODAL WINDOWS
       Open: data-modal-open="modal-id"
       Close: data-modal-close
       ===================================================== */

    document.querySelectorAll("[data-modal-open]").forEach(
        function (button) {

            button.addEventListener("click", function () {

                const modalId =
                    button.getAttribute("data-modal-open");

                const modal = document.getElementById(modalId);

                if (!modal) return;

                modal.hidden = false;
                modal.setAttribute("aria-modal", "true");
                modal.setAttribute("role", "dialog");

                const closeButton =
                    modal.querySelector("[data-modal-close]");

                if (closeButton) {
                    closeButton.focus();
                }
            });
        }
    );

    document.querySelectorAll("[data-modal-close]").forEach(
        function (button) {

            button.addEventListener("click", function () {

                const modal = button.closest("[data-modal]");

                if (modal) {
                    modal.hidden = true;
                    modal.removeAttribute("aria-modal");
                }
            });
        }
    );

    document.querySelectorAll("[data-modal]").forEach(
        function (modal) {

            modal.addEventListener("click", function (event) {
                if (event.target === modal) {
                    modal.hidden = true;
                    modal.removeAttribute("aria-modal");
                }
            });
        }
    );

    document.addEventListener("keydown", function (event) {

        if (event.key !== "Escape") return;

        document.querySelectorAll("[data-modal]").forEach(
            function (modal) {
                modal.hidden = true;
                modal.removeAttribute("aria-modal");
            }
        );

        closeLightbox();
    });


    /* =====================================================
       6. IMAGE GALLERY WITH LIGHTBOX
       Add class="js-lightbox-gallery" to a gallery.
       Images open in a larger view when clicked.
       ===================================================== */

    let lightbox = null;
    let lightboxImage = null;
    let lightboxCaption = null;

    function createLightbox() {

        if (lightbox) return;

        lightbox = document.createElement("div");
        lightbox.id = "imageLightbox";
        lightbox.className = "image-lightbox";
        lightbox.hidden = true;

        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button
                    type="button"
                    class="lightbox-close"
                    aria-label="Close image"
                >&times;</button>

                <img class="lightbox-image" alt="">

                <p class="lightbox-caption"></p>
            </div>
        `;

        document.body.appendChild(lightbox);

        lightboxImage =
            lightbox.querySelector(".lightbox-image");

        lightboxCaption =
            lightbox.querySelector(".lightbox-caption");

        lightbox.querySelector(".lightbox-close")
            .addEventListener("click", closeLightbox);

        lightbox.addEventListener("click", function (event) {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });
    }

    function openLightbox(image) {

        createLightbox();

        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt || "Gallery image";

        lightboxCaption.textContent =
            image.dataset.caption || image.alt || "";

        lightbox.hidden = false;
        document.body.style.overflow = "hidden";

        lightbox.querySelector(".lightbox-close").focus();
    }

    function closeLightbox() {

        if (!lightbox || lightbox.hidden) return;

        lightbox.hidden = true;
        document.body.style.overflow = "";
    }

    document.querySelectorAll(
        ".js-lightbox-gallery img, img[data-lightbox]"
    ).forEach(function (image) {

        image.style.cursor = "zoom-in";

        image.addEventListener("click", function () {
            openLightbox(image);
        });

        image.addEventListener("keydown", function (event) {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {
                event.preventDefault();
                openLightbox(image);
            }
        });

        image.setAttribute("tabindex", "0");
        image.setAttribute("role", "button");
        image.setAttribute(
            "aria-label",
            "Enlarge image: " + (image.alt || "Gallery image")
        );
    });


    /* =====================================================
       7. DYNAMIC SERVICE CONTENT
       Creates service cards when #dynamic-services exists.
       ===================================================== */

    const services = [
        {
            name: "Oral Hygiene",
            description:
                "Professional oral hygiene care to help maintain healthy teeth and gums."
        },
        {
            name: "Restorative Treatment",
            description:
                "Dental treatments that help restore the function and appearance of teeth."
        }
    ];

    const servicesContainer =
        document.getElementById("dynamic-services");

    if (servicesContainer) {

        servicesContainer.replaceChildren();

        services.forEach(function (service) {

            const card = document.createElement("article");
            card.className = "service-card searchable-item";

            const heading = document.createElement("h3");
            heading.textContent = service.name;

            const description = document.createElement("p");
            description.textContent = service.description;

            card.append(heading, description);
            servicesContainer.appendChild(card);
        });
    }


    /* =====================================================
       8. SEARCH AND FILTER
       Input: id="contentSearch"
       Items: class="searchable-item"
       ===================================================== */

    const searchInput =
        document.getElementById("contentSearch");

    const searchItems = Array.from(
        document.querySelectorAll(".searchable-item")
    );

    const searchMessage =
        document.getElementById("searchMessage");

    if (searchInput) {

        function filterContent() {

            const query =
                searchInput.value.trim().toLowerCase();

            let visibleCount = 0;

            searchItems.forEach(function (item) {

                const matches =
                    item.textContent.toLowerCase().includes(query);

                item.hidden = !matches;

                if (matches) {
                    visibleCount++;
                }
            });

            if (searchMessage) {
                searchMessage.textContent =
                    visibleCount === 0
                        ? "No matching results found."
                        : visibleCount + " result(s) found.";
            }
        }

        searchInput.addEventListener("input", filterContent);
    }


    /* =====================================================
       9. SCROLL ANIMATIONS
       Add class="js-reveal" to elements to animate.
       ===================================================== */

    const revealElements =
        document.querySelectorAll(".js-reveal");

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            function (entries, currentObserver) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("is-visible");

                        currentObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.15
            }
        );

        revealElements.forEach(function (element) {
            observer.observe(element);
        });

    } else {

        revealElements.forEach(function (element) {
            element.classList.add("is-visible");
        });
    }


    /* =====================================================
       10. CONTACT AND ENQUIRY FORM VALIDATION
       Applies to forms with class="js-validate-form".
       ===================================================== */

    document.querySelectorAll(".js-validate-form")
        .forEach(function (form) {

            form.addEventListener("submit", function (event) {

                let formIsValid = true;

                const fields =
                    form.querySelectorAll("input, select, textarea");

                fields.forEach(function (field) {

                    field.setCustomValidity("");

                    if (
                        field.hasAttribute("required") &&
                        !field.value.trim()
                    ) {
                        field.setCustomValidity(
                            "Please complete this field."
                        );
                    }

                    if (
                        field.type === "email" &&
                        field.value.trim() &&
                        !field.validity.valid
                    ) {
                        field.setCustomValidity(
                            "Please enter a valid email address."
                        );
                    }

                    if (!field.checkValidity()) {
                        formIsValid = false;
                        field.reportValidity();
                    }
                });

                if (!formIsValid) {
                    event.preventDefault();
                }
            });
        });


    /* =====================================================
       11. INTERACTIVE MAP
       If Leaflet and an element with id="map" are added,
       initialize the map.
       ===================================================== */

    const mapElement = document.getElementById("map");

    if (
        mapElement &&
        typeof L !== "undefined" &&
        !mapElement.dataset.mapInitialized
    ) {

        const latitude = Number(mapElement.dataset.latitude);
        const longitude = Number(mapElement.dataset.longitude);

        if (
            Number.isFinite(latitude) &&
            Number.isFinite(longitude)
        ) {

            const map = L.map(mapElement).setView(
                [latitude, longitude],
                14
            );

            L.tileLayer(
                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                    attribution:
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }
            ).addTo(map);

            L.marker([latitude, longitude])
                .addTo(map)
                .bindPopup("Dr Dana's Dentistry");

            mapElement.dataset.mapInitialized = "true";
        }
    }


    /* =====================================================
       12. SMOOTH INTERNAL PAGE LINKS
       Smooth scrolling for links pointing to page sections.
       ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(
        function (link) {

            link.addEventListener("click", function (event) {

                const targetId =
                    link.getAttribute("href");

                if (!targetId || targetId === "#") return;

                const target =
                    document.querySelector(targetId);

                if (target) {
                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                    history.replaceState(null, "", targetId);
                }
            });
        }
    );

});
