Element.prototype.showBlock = async function () {
  this.classList.remove("hide");
  const transitionDuration = getComputedStyle(this).transitionDuration || "0s";
  if (transitionDuration !== "0s") {
    await new Promise(resolve => this.addEventListener("transitionend", resolve, { once: true }));
  }
};
Element.prototype.hideBlock = async function () {
  this.classList.add("hide");
  const transitionDuration = getComputedStyle(this).transitionDuration || "0s";
  if (transitionDuration !== "0s") {
    await new Promise(resolve => this.addEventListener("transitionend", resolve, { once: true }));
  }
};

Element.prototype.showBlockFast = async function () {
  this.classList.add("slide-same-type");
  await this.showBlock();
  this.classList.remove("slide-same-type");
};
Element.prototype.hideBlockFast = async function () {
  this.classList.add("slide-same-type");
  await this.hideBlock();
  this.classList.remove("slide-same-type");
};

const createRenderer = container => {
  const slideTypes = {};
  const dummyRenderer = () => el("div.slide.slide-empty");
  slideTypes.EMPTY = dummyRenderer;
  
  const registerRenderer = (slideType, renderer) => slideTypes[slideType] = renderer;
  
  let lastType;
  const render = async slideInfo => {
    const lastMemorizedType = lastType;
    lastType = slideInfo.type;
    const slidesToBeHidden = container.qqq(".slide:not(.slide-to-be-hidden)");
    
    const newBlock = (slideTypes[slideInfo.type] || dummyRenderer)(slideInfo);
    newBlock.dataset.type = slideInfo.type;
    newBlock.classList.add("slide", "hide");
    container.appendChild(newBlock);
    
    await sleep(1);
    if (slidesToBeHidden.length) {
      slidesToBeHidden.forEach(slideToBeHidden => slideToBeHidden.classList.add("slide-to-be-hidden"));
      if (lastMemorizedType === slideInfo.type) {
        newBlock.showBlockFast();
        await Promise.all(slidesToBeHidden.map(slideToBeHidden => slideToBeHidden.hideBlockFast()));
      } else {
        await Promise.all(slidesToBeHidden.map(slideToBeHidden => slideToBeHidden.hideBlock()));
        await newBlock.showBlock();
      }
      slidesToBeHidden.forEach(slideToBeHidden => slideToBeHidden.remove());
    } else {
      await newBlock.showBlock();
    }
  };
  
  
  return { registerRenderer, render };
};
