const script = document.createElement('script');

script.src = `__BOOKMARKLET_URL__/bookmarklet.js?${Date.now()}`;
script.type = 'module';

// clean up
script.onload = () => setTimeout(() => script.remove(), 1000);

document.body.appendChild(script);
