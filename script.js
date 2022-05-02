const container = qq("#output");
const renderer = createRenderer(container);
slideStore.subscribe(renderer.render);

renderer.registerRenderer("BIBLE", slideInfo => {
  return el("div.slide.slide-bible", el("div.slide-bible__container", [
    el("div.slide-bible__address", slideInfo.address),
    el("div.slide-bible__verse", {
      innerHTML: slideInfo.verse,
    }),
  ]));
});

renderer.registerRenderer("MUSIC", slideInfo => {
  return el("div.slide.slide-music", el("div.slide-music__container", slideInfo.rows.map(row => el("div.slide-music__row", row))));
});

renderer.registerRenderer("TEXT", slideInfo => {
  return el("div.slide.slide-text", el("div.slide-text__container", {
    innerHTML: slideInfo.text,
  }));
});

renderer.registerRenderer("IMAGE", slideInfo => {
  return el("div.slide.slide-image", el("div.slide-image__container", {
    style: {
      backgroundImage: `url('data:image/jpeg;base64,${slideInfo.img64}')`,
    },
  }));
});

slideStore.loop();
