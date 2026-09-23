(function () {
  const storageKey = 'homepage-language';
  const pageLanguage = document.documentElement.lang.toLowerCase().startsWith('zh') ? 'zh' : 'en';
  const explicitLanguage = new URLSearchParams(window.location.search).get('lang');
  let savedLanguage = null;

  try {
    savedLanguage = window.localStorage.getItem(storageKey);
    if (explicitLanguage === 'zh' || explicitLanguage === 'en') {
      window.localStorage.setItem(storageKey, explicitLanguage);
    }
  } catch (_) {
    // The language selector still works for this visit when storage is unavailable.
  }

  const browserLanguage = (navigator.languages && navigator.languages[0]) || navigator.language || '';
  const preferredLanguage = (explicitLanguage === 'zh' || explicitLanguage === 'en')
    ? explicitLanguage
    : (savedLanguage === 'zh' || savedLanguage === 'en')
      ? savedLanguage
      : /^zh(?:-|$)/i.test(browserLanguage) ? 'zh' : 'en';

  if (pageLanguage === 'zh' && preferredLanguage === 'en') {
    window.location.replace('/en/' + window.location.hash);
    return;
  }

  document.addEventListener('DOMContentLoaded', function () {
    const selector = document.getElementById('language-select');
    if (!selector) return;
    selector.value = pageLanguage;
    selector.addEventListener('change', function () {
      const language = selector.value;
      let stored = false;
      try {
        window.localStorage.setItem(storageKey, language);
        stored = true;
      } catch (_) {
        // Keep the explicit language in the URL when storage is unavailable.
      }
      const destination = language === 'zh' ? '/' : '/en/';
      window.location.assign(destination + (stored ? '' : '?lang=' + language) + window.location.hash);
    });
  });
})();
