module.exports.setAttributes = function setAttributes(element, attributes) {
  for(let attributeName in attributes) {
    element.setAttribute(attributeName, attributes[attributeName])
  }
}
