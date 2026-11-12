/* Builds the whole page from data/content.json.
   All text goes in through textContent, so nothing in the JSON can inject HTML. */

const h = (tag, props, ...kids) => {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(props || {})) {
    if (value === null || value === undefined || value === false) continue;
    if (key === "class") el.className = value;
    else el.setAttribute(key, value === true ? "" : value);
  }
  for (const kid of kids.flat(Infinity)) {
    if (kid === null || kid === undefined || kid === false) continue;
    el.append(kid instanceof Node ? kid : document.createTextNode(String(kid)));
  }
  return el;
};

const icon = (classes) => h("i", { class: classes, "aria-hidden": "true" });

/* Only allow normal link types. Anything else becomes "#". */
const safeUrl = (url) => (/^(https?:|mailto:|tel:|#|\.{0,2}\/|[\w-]+\/)/i.test(url || "") ? url : "#");
const isExternal = (url) => /^https?:/i.test(url || "");
const linkAttrs = (url) =>
  isExternal(url) ? { href: safeUrl(url), target: "_blank", rel: "noopener noreferrer" } : { href: safeUrl(url) };

/* ---------- shared pieces ---------- */

function section(id, title, note, ...body) {
  const titleId = `${id}-title`;
  return h(
    "section",
    { id, class: "section", "aria-labelledby": titleId },
    h(
      "div",
      { class: "container section__grid" },
      h("div", { class: "section__head" }, h("h2", { id: titleId, class: "section__title" }, title), note ? h("p", { class: "section__note" }, note) : null),
      h("div", { class: "section__body" }, ...body)
    )
  );
}

function timeline(items) {
  return h(
    "ol",
    { class: "timeline" },
    items.map((item) =>
      h(
        "li",
        { class: `timeline__item${/present/i.test(item.period || "") ? " is-current" : ""}` },
        h("p", { class: "timeline__period" }, item.period),
        h(
          "div",
          { class: "timeline__content" },
          h("h3", { class: "timeline__title" }, item.title),
          item.org ? h("p", { class: "timeline__org" }, item.org) : null,
          item.detail ? h("p", { class: "timeline__detail" }, item.detail) : null
        )
      )
    )
  );
}

/* ---------- sections ---------- */

function renderEducation(data) {
  return section("education", data.title, null, timeline(data.items));
}

function renderResearch(data, site) {
  const statuses = data.statuses || {};
  const counts = {};
  data.items.forEach((p) => (counts[p.status] = (counts[p.status] || 0) + 1));
  const parts = Object.entries(counts).map(([key, n]) => `${n} ${(statuses[key] && statuses[key].summary) || key}`);
  const total = data.items.length;
  const note = total ? `${total} paper${total === 1 ? "" : "s"}: ${parts.join(", ")}` : null;

  const list = h(
    "ul",
    { class: "pubs" },
    data.items.map((paper) => {
      const status = statuses[paper.status] || { label: paper.status || "" };
      const titleEl = paper.link
        ? h("a", { ...linkAttrs(paper.link), class: "pub__link" }, paper.title)
        : paper.title;
      const authors = h(
        "p",
        { class: "pub__authors" },
        (paper.authors || []).map((name, i, all) => [
          name === site.name ? h("strong", null, name) : name,
          i < all.length - 1 ? ", " : ""
        ])
      );
      return h(
        "li",
        { class: `pub${paper.link ? " pub--link" : ""}` },
        h("h3", { class: "pub__title" }, titleEl),
        authors,
        paper.status ? h("p", { class: `status status--${paper.status}` }, status.label) : null
      );
    })
  );
  return section("research", data.title, note, list);
}

function renderActivities(data) {
  const honors = (data.achievements || []).map((group) =>
    h(
      "div",
      { class: "honors__group" },
      h("h4", { class: "honors__name" }, group.group),
      h(
        "ul",
        { class: "honors" },
        group.items.map((item) =>
          h(
            "li",
            { class: "honor" },
            h("span", { class: "honor__year" }, item.year),
            h(
              "div",
              null,
              h("p", { class: "honor__title" }, item.title),
              h("p", { class: "honor__meta" }, [item.result, item.org].filter(Boolean).join(", "))
            )
          )
        )
      )
    )
  );

  return section(
    "activities",
    data.title,
    null,
    data.leadership && data.leadership.length
      ? h("div", { class: "block" }, h("h3", { class: "block__title" }, data.leadershipTitle || "Leadership"), timeline(data.leadership))
      : null,
    data.volunteering
      ? h("div", { class: "block" }, h("h3", { class: "block__title" }, data.volunteeringTitle || "Volunteering"), h("p", { class: "prose" }, data.volunteering))
      : null,
    honors.length
      ? h("div", { class: "block" }, h("h3", { class: "block__title" }, data.achievementsTitle || "Achievements"), h("div", { class: "honors__grid" }, honors))
      : null
  );
}

function renderProjects(data) {
  const tiles = data.items.map((project) => {
    const links = project.links || [];
    return h(
      "article",
      { class: `tile${project.featured ? " tile--featured" : ""}`, "data-tilt": "" },
      h("h3", { class: "tile__title" }, project.title),
      h("p", { class: "tile__text" }, project.description),
      project.tags && project.tags.length ? h("ul", { class: "tags" }, project.tags.map((t) => h("li", null, t))) : null,
      links.length
        ? h(
            "div",
            { class: "tile__links" },
            links.map((link, i) =>
              h(
                "a",
                { ...linkAttrs(link.url), class: `tile__link${i === 0 ? " tile__link--main" : ""}` },
                icon(link.icon || (/github\.com/i.test(link.url) ? "fa-brands fa-github" : "fa-solid fa-arrow-up-right-from-square")),
                link.label || "Open"
              )
            )
          )
        : null
    );
  });
  return section("projects", data.title, null, h("div", { class: "projects" }, tiles));
}

function renderSkills(data) {
  return section(
    "skills",
    data.title,
    null,
    h(
      "div",
      { class: "skills" },
      data.groups.map((group) =>
        h(
          "div",
          { class: "skillgroup" },
          h("h3", { class: "skillgroup__name" }, group.name),
          h(
            "ul",
            { class: "skillgroup__list" },
            group.items.map((item) => h("li", { class: "skill" }, item.icon ? icon(item.icon) : null, item.name))
          )
        )
      )
    )
  );
}

function renderContact(data) {
  return section(
    "contact",
    data.title,
    null,
    data.intro ? h("p", { class: "contact__intro" }, data.intro) : null,
    h(
      "div",
      { class: "qrgrid" },
      data.links.map((link) =>
        h(
          "div",
          { class: "qr", "data-tilt": "" },
          h("div", { class: "qr__code" }, h("img", { src: safeUrl(link.qr), alt: `${link.name} QR code`, width: "150", height: "150", loading: "lazy" })),
          h("h3", { class: "qr__name" }, link.icon ? icon(link.icon) : null, link.name),
          h("a", { ...linkAttrs(link.url), class: "qr__action" }, link.action || "Open")
        )
      )
    )
  );
}

const SECTION_RENDERERS = {
  education: renderEducation,
  research: renderResearch,
  activities: renderActivities,
  projects: renderProjects,
  skills: renderSkills,
  contact: renderContact
};

/* ---------- page chrome ---------- */

function renderNav(data, ids) {
  const links = [{ href: "#home", label: "Home", id: "home" }].concat(
    ids.map((id) => ({ href: `#${id}`, label: data[id].nav || data[id].title, id }))
  );
  return h(
    "div",
    { class: "nav__bar" },
    h("a", { href: "#home", class: "nav__brand" }, data.site.name),
    h("nav", { id: "nav-links", class: "nav__links", "aria-label": "Sections" }, h("ul", null, links.map((l) => h("li", null, h("a", { href: l.href, "data-section": l.id }, l.label))))),
    h(
      "div",
      { class: "nav__actions" },
      h("button", { id: "themeToggle", class: "icon-btn", type: "button", "aria-label": "Switch between light and dark theme" }, icon("fa-solid fa-circle-half-stroke")),
      h("button", { id: "menuToggle", class: "icon-btn nav__menu", type: "button", "aria-label": "Open menu", "aria-expanded": "false", "aria-controls": "nav-links" }, icon("fa-solid fa-bars"))
    )
  );
}

function renderHero(data) {
  const hero = data.hero;
  /* The space sits outside each clipped word box so it never collapses. */
  const words = data.site.name.split(" ").map((word, i) => [h("span", { class: "word", style: `--i:${i}` }, h("span", null, word)), " "]);
  const socials = (data.contact.links || []).filter((l) => l.hero);

  return h(
    "section",
    { id: "home", class: "hero", "aria-labelledby": "hero-name" },
    h(
      "div",
      { class: "container hero__grid" },
      h(
        "div",
        { class: "hero__text" },
        h("h1", { id: "hero-name", class: "hero__name" }, words),
        hero.tagline ? h("p", { class: "hero__tagline hero__reveal", style: "--d:520" }, hero.tagline) : null,
        h("p", { class: "hero__bio hero__reveal", style: "--d:640" }, hero.bio),
        h(
          "div",
          { class: "hero__actions hero__reveal", style: "--d:760" },
          (hero.buttons || []).map((b) => h("a", { ...linkAttrs(b.href), class: `btn btn--${b.style || "primary"}` }, b.label)),
          socials.map((s) => h("a", { ...linkAttrs(s.url), class: "icon-link", "aria-label": s.name }, icon(s.icon)))
        )
      ),
      h(
        "div",
        { class: "hero__visual hero__reveal", style: "--d:380" },
        h(
          "div",
          { class: "hero__photo", "data-tilt": "", "data-tilt-max": "7" },
          h("div", { class: "hero__frame" }, h("img", { src: safeUrl(hero.photo.src), alt: hero.photo.alt || "", width: "900", height: "987", fetchpriority: "high" })),
          hero.caption ? h("p", { class: "hero__caption" }, h("strong", null, hero.caption.title), h("span", null, hero.caption.subtitle)) : null
        )
      )
    )
  );
}

/* ---------- entry point ---------- */

export function renderSite(data) {
  const site = data.site;
  document.title = site.title || site.name;
  const desc = document.querySelector('meta[name="description"]');
  if (desc && site.description) desc.setAttribute("content", site.description);

  const ids = (data.sections || []).filter((id) => {
    if (!SECTION_RENDERERS[id]) {
      console.warn(`content.json: unknown section "${id}" skipped`);
      return false;
    }
    return data[id] && !data[id].hidden;
  });

  document.getElementById("site-header").replaceChildren(renderNav(data, ids));

  const main = document.getElementById("site-main");
  main.replaceChildren(renderHero(data), ...ids.map((id) => SECTION_RENDERERS[id](data[id], site)));

  const year = new Date().getFullYear();
  document.getElementById("site-footer").replaceChildren(
    h("div", { class: "container" }, h("p", null, (site.footer || "").replace("{year}", year)))
  );
}
