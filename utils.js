EventTarget.prototype.on = EventTarget.prototype.addEventListener;
EventTarget.prototype.off = EventTarget.prototype.removeEventListener;

HTMLDocument.prototype.qq = HTMLDocument.prototype.querySelector;
HTMLDocument.prototype.qqq = function (selector) {
  return Array.from(this.querySelectorAll(selector));
};
const qq = selector => document.qq(selector);
const qqq = selector => document.qqq(selector);

HTMLElement.prototype.qq = HTMLElement.prototype.querySelector;
HTMLElement.prototype.qqq = function (selector) {
  return Array.from(this.querySelectorAll(selector));
};
HTMLElement.prototype.hide = function () {
  this.classList.add("d-none");
};
HTMLElement.prototype.show = function () {
  this.classList.remove("d-none");
};
HTMLElement.prototype.closest = function (selector) {
  const variants = qqq(selector);
  let target = this;
  while (target) {
    if (variants.includes(target)) {
      return target;
    }
    
    target = target.parentElement;
  }
};


function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
// const $_GET = new Proxy(new URLSearchParams(window.location.search), {
//   get: (searchParams, prop) => searchParams.get(prop),
// });

const rand = (mi = 0, ma = Number.MAX_SAFE_INTEGER) => {
  return Math.floor(Math.random() * (ma - mi + 1) + mi);
};

let uniqIdIterator = 0;
const uniqId = prefix => [prefix, ++uniqIdIterator, Date.now().toString(36), rand().toString(36)].filter(Boolean).join("-");

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const mergeDeep = (target, source) => {
  const mergedSymbol = Symbol.for("@@merged");
  if (target[mergedSymbol]) {
    return target;
  }
  
  const isObject = item => (item && typeof item === 'object' && !Array.isArray(item));
  
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  target[mergedSymbol] = true;
  
  return target;
};

/**
 * @param {string} tagOrSelector
 * @param {Object} [props]
 * @param {(string|number|HTMLElement|Array<(string|number|HTMLElement)>)} children
 * @return HTMLElement
 */
const el = (tagOrSelector, props = {}, ...children) => {
  // https://stackoverflow.com/a/17888178/5698975
  const [tagName, ...selectorParts] = tagOrSelector.split(/(?=\.)|(?=#)|(?=\[)/);
  const element = document.createElement(tagName);
  
  selectorParts.forEach(part => {
    switch (part[0]) {
      case ".":
        element.classList.add(part.substr(1));
        break;
      case "#":
        element.id = part.substr(1);
        break;
      case "[":
        const [/* all */, key, /*quot*/, value] = part.match(/\[([^=]+)+=(["'])((?:\\\2|.)*)?\2/);
        if (key && value) {
          element.setAttribute(key, value);
        }
        break;
    }
  });
  
  let elementWithProps = element;
  if (props && props.constructor && props.constructor.name === "Object") {
    // добавляєм пропси
    elementWithProps = mergeDeep(element, props);
    // добавляєм евенти
    const events = props.on || {};
    for (const eventName in events) {
      const callback = events[eventName].bind(elementWithProps);
      elementWithProps.addEventListener(eventName, callback);
    }
  } else if (props) {
    children.unshift(props);
  }
  
  // добавляєм чайлдів
  children
    .flat()
    .filter(Boolean)
    .forEach(child => {
      if (!(child instanceof Element)) {
        child = document.createTextNode(String(child));
      }
      elementWithProps.appendChild(child);
    });
  
  return elementWithProps;
};

Array.prototype.rand = function () {
  if (this.length) {
    return this[rand(0, this.length - 1)];
  }
};


const isValidURL = str => str.split(".").length >= 2 || str.split("/").length >= 2;

/*
  Safe HTML for `template strings`
*/
const saferHTML = function (templateData) {
  let s = templateData[0];
  for (let i = 1; i < arguments.length; i++) {
    let arg = String(arguments[i]);
    
    // Escape special characters in the substitution.
    s += arg.replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;")
      .replace(/>/g, "&gt;")
      .replace(/&amp;#/g, "&#");
    
    // Don't escape special characters in the template.
    s += templateData[i];
  }
  return s;
};
