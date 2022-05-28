const slideStore = (() => {
  let state = {};
  let networkSleepInterval = 0; // seconds
  let networkSleepIntervalMax = 5; // seconds
  const subscribers = [];
  
  const subscribe = callback => subscribers.push(callback);
  const dispatch = info => subscribers.forEach(callback => callback(info));
  
  const fetchSlide = async () => {
    let slideInfo = {};
    try {
      const fetchEndpoint = `http://${getParameterByName("host")}/stage-view/text.json?html_type=0&img_id=${state.img_id || ""}&css_hash=0&_=${Date.now()}`;
      let result = await fetch(fetchEndpoint).then(response => response.json());
      const map = result.map || {};
      slideInfo.type = map.type;
      slideInfo.text = map.text;
      slideInfo.header = map.header;
      slideInfo.img64 = (map.img64 || "").split(/['"]\s*/)[0]; // data:image/jpeg;base64,
      slideInfo.img_id = map.img_id;
      
      switch (slideInfo.type) {
        case "BIBLE":
          const slideTextElement = el("div", { innerHTML: slideInfo.text });
          const verseAddressElement = slideTextElement.qq("desc");
          let verseAddress = "";
          if (verseAddressElement) {
            verseAddress = verseAddressElement.innerText.trim();
            verseAddressElement.remove();
          }
          slideInfo.verse = slideTextElement.innerHTML;
          slideInfo.address = el("div", {
            innerHTML: slideInfo.header || verseAddress,
          }).innerText.trim();
          
          if (!slideInfo.verse && !slideInfo.address) {
            slideInfo.type = "EMPTY";
          }
          break;
        
        case "MUSIC":
          slideInfo.rows = el("div", { innerHTML: slideInfo.text })
            .qqq("span")
            .map(span => span.innerText.trim())
            .filter(Boolean);
          
          if (!slideInfo.rows.length) {
            slideInfo.type = "EMPTY";
          }
          break;
        
        case "IMAGE":
          if (slideInfo.img64 === "equals") {
            slideInfo.img64 = state.img64;
          }
          break;
        
        case "TEXT":
          if (slideInfo.text === "Searching Server...") {
            slideInfo.type = "EMPTY";
          }
          break;
      }
      
      networkSleepInterval = 0;
    } catch (e) {
      if (networkSleepInterval < networkSleepIntervalMax) {
        networkSleepInterval += 1;
      } else {
        return null;
      }
      await sleep(networkSleepInterval * 1000);
      console.error(e);
    }
    
    return slideInfo;
  };
  
  const loop = async () => {
    while (true) {
      const newSlideInfo = await fetchSlide();
      if (JSON.stringify(newSlideInfo) !== JSON.stringify(state)) {
        state = newSlideInfo;
        dispatch(state);
      }
      
      await sleep(100);
    }
  };
  
  
  return { fetchSlide, loop, subscribe };
})();
