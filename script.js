const container = qq("#output");
const renderer = createRenderer(container);
slideStore.subscribe(renderer.render);

renderer.registerRenderer("BIBLE", slideInfo => {
  return el("div.slide.slide-bible", el("div.slide-bible__container", [
    el("div.slide-bible__address", slideInfo.address),
    el("div.slide-bible__verse", slideInfo.verse),
  ]));
});
// renderer.registerRenderer("MUSIC", slideInfo => {
//   return el("div.slide.slide-music", {
//     style: {
//       // backgroundColor: "#" + rand(0, 0xffffff).toString(16).padStart(6, "0"),
//     }
//   }, slideInfo.rows.map(row => el("div.slide-music__row", row)));
// });
slideStore.loop();
