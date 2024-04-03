/**
 * Slightly nicer wrapper around dom's element insertion methods.
 *
 * @param {HTMLElement} element
 * @param {'before' | 'after'} where
 * @param {HTMLElement} referenceElement
 */
export function putElement(element, where, referenceElement) {
  element.remove();

  const insertPosition = where === 'before' ? 'beforebegin' : 'afterend';
  referenceElement.insertAdjacentElement(insertPosition, element);
}
