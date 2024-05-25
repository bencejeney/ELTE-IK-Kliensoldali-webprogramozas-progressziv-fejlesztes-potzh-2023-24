(() => {
  // src/getID.js
  function getID(el) {
    const id = el.getAttribute("id");
    if (id !== null && id !== "") {
      return id.match(/(?:^\d|:)/) ? `[id="${id}"]` : "#" + id;
    }
    return null;
  }

  // src/getClasses.js
  function getClasses(el) {
    if (!el.hasAttribute("class")) {
      return [];
    }
    try {
      let classList = Array.prototype.slice.call(el.classList);
      return classList.filter((item) => !/^[a-z_-][a-z\d_-]*$/i.test(item) ? null : item);
    } catch (e) {
      let className = el.getAttribute("class");
      className = className.trim().replace(/\s+/g, " ");
      return className.split(" ");
    }
  }
  function getClassSelectors(el) {
    const classList = getClasses(el).filter(Boolean);
    return classList.map((cl) => `.${cl}`);
  }

  // src/getCombinations.js
  function kCombinations(result, items, data, start, end, index, k) {
    if (index === k) {
      result.push(data.slice(0, index).join(""));
      return;
    }
    for (let i = start; i <= end && end - i + 1 >= k - index; ++i) {
      data[index] = items[i];
      kCombinations(result, items, data, i + 1, end, index + 1, k);
    }
  }
  function getCombinations(items, k) {
    const result = [], n = items.length, data = [];
    for (var l = 1; l <= k; ++l) {
      kCombinations(result, items, data, 0, n - 1, 0, l);
    }
    return result;
  }

  // src/getAttributes.js
  function getAttributes(el, attributesToIgnore = ["id", "class", "length"]) {
    const { attributes } = el;
    const attrs = [...attributes];
    return attrs.reduce((sum, next) => {
      if (!(attributesToIgnore.indexOf(next.nodeName) > -1)) {
        sum.push(`[${next.nodeName}="${next.value}"]`);
      }
      return sum;
    }, []);
  }

  // src/isElement.js
  function isElement(el) {
    let isElem;
    if (typeof HTMLElement === "object") {
      isElem = el instanceof HTMLElement;
    } else {
      isElem = !!el && typeof el === "object" && el.nodeType === 1 && typeof el.nodeName === "string";
    }
    return isElem;
  }

  // src/getNthChild.js
  function getNthChild(element) {
    let counter = 0;
    let k;
    let sibling;
    const { parentNode } = element;
    if (Boolean(parentNode)) {
      const { childNodes } = parentNode;
      const len = childNodes.length;
      for (k = 0; k < len; k++) {
        sibling = childNodes[k];
        if (isElement(sibling)) {
          counter++;
          if (sibling === element) {
            return `:nth-child(${counter})`;
          }
        }
      }
    }
    return null;
  }

  // src/getTag.js
  function getTag(el) {
    return el.tagName.toLowerCase().replace(/:/g, "\\:");
  }

  // src/isUnique.js
  function isUnique(el, selector) {
    if (!Boolean(selector)) return false;
    const elems = el.ownerDocument.querySelectorAll(selector);
    return elems.length === 1 && elems[0] === el;
  }

  // src/getParents.js
  function getParents(el) {
    const parents = [];
    let currentElement = el;
    while (isElement(currentElement)) {
      parents.push(currentElement);
      currentElement = currentElement.parentNode;
    }
    return parents;
  }

  // src/index.js
  function getAllSelectors(el, selectors, attributesToIgnore) {
    const funcs = {
      "Tag": getTag,
      "NthChild": getNthChild,
      "Attributes": (elem) => getAttributes(elem, attributesToIgnore),
      "Class": getClassSelectors,
      "ID": getID
    };
    return selectors.reduce((res, next) => {
      res[next] = funcs[next](el);
      return res;
    }, {});
  }
  function testUniqueness(element, selector) {
    const { parentNode } = element;
    const elements = parentNode.querySelectorAll(selector);
    return elements.length === 1 && elements[0] === element;
  }
  function getFirstUnique(element, selectors) {
    return selectors.find(testUniqueness.bind(null, element));
  }
  function getUniqueCombination(element, items, tag) {
    let combinations = getCombinations(items, 3), firstUnique = getFirstUnique(element, combinations);
    if (Boolean(firstUnique)) {
      return firstUnique;
    }
    if (Boolean(tag)) {
      combinations = combinations.map((combination) => tag + combination);
      firstUnique = getFirstUnique(element, combinations);
      if (Boolean(firstUnique)) {
        return firstUnique;
      }
    }
    return null;
  }
  function getUniqueSelector(element, selectorTypes, attributesToIgnore, excludeRegex) {
    let foundSelector;
    const elementSelectors = getAllSelectors(element, selectorTypes, attributesToIgnore);
    if (excludeRegex && excludeRegex instanceof RegExp) {
      elementSelectors.ID = excludeRegex.test(elementSelectors.ID) ? null : elementSelectors.ID;
      elementSelectors.Class = elementSelectors.Class.filter((className) => !excludeRegex.test(className));
    }
    for (let selectorType of selectorTypes) {
      const { ID, Tag, Class: Classes, Attributes, NthChild } = elementSelectors;
      switch (selectorType) {
        case "ID":
          if (Boolean(ID) && testUniqueness(element, ID)) {
            return ID;
          }
          break;
        case "Tag":
          if (Boolean(Tag) && testUniqueness(element, Tag)) {
            return Tag;
          }
          break;
        case "Class":
          if (Boolean(Classes) && Classes.length) {
            foundSelector = getUniqueCombination(element, Classes, Tag);
            if (foundSelector) {
              return foundSelector;
            }
          }
          break;
        case "Attributes":
          if (Boolean(Attributes) && Attributes.length) {
            foundSelector = getUniqueCombination(element, Attributes, Tag);
            if (foundSelector) {
              return foundSelector;
            }
          }
          break;
        case "NthChild":
          if (Boolean(NthChild)) {
            return NthChild;
          }
      }
    }
    return "*";
  }
  function unique(el, options = {}) {
    const {
      selectorTypes = ["ID", "Class", "Tag", "NthChild"],
      attributesToIgnore = ["id", "class", "length"],
      excludeRegex = null
    } = options;
    const allSelectors = [];
    const parents = getParents(el);
    for (let elem of parents) {
      const selector = getUniqueSelector(elem, selectorTypes, attributesToIgnore, excludeRegex);
      if (Boolean(selector)) {
        allSelectors.push(selector);
      }
    }
    const selectors = [];
    for (let it of allSelectors) {
      selectors.unshift(it);
      const selector = selectors.join(" > ");
      if (isUnique(el, selector)) {
        return selector;
      }
    }
    return null;
  }
  window.unique = unique;
})();
