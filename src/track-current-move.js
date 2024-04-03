/**
 * @param {HTMLElement} moveNumberContainer
 * @param {(number) => void} onChange
 */
export function trackCurrentMove(moveNumberContainer, onChange) {
  // Due to i18n not sure what the exact text will be so just grab digits and
  // that's probably the move number.
  const notify = (str) => {
    const digits = str.split('').filter(ch => ch.match(/\d/)).join('');
    if (digits) {
      onChange(Number(digits));
    }
  }

  // invoke for current move number
  notify(moveNumberContainer.textContent);

  // watch for future move number changes
  const observer = new MutationObserver((mutations) => {
    mutations
      .filter(m => m.type === 'characterData')
      .forEach(mutation => notify(mutation.target.data));
  });

  observer.observe(moveNumberContainer, {
    characterData: true,
    subtree: true
  });

  return () => observer.disconnect();
}
