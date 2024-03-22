const script = document.createElement('script');

// clean up
script.onload = () => setTimeout(() => script.remove(), 1000);
script.src = '__BOOKMARKLET_URL__/bookmarklet.js';

document.body.appendChild(script);
