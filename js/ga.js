(() => {
  try {
    const html = document.documentElement;
    const id = html.getAttribute('data-ga-id') || '';
    if (!id || !/^G-[A-Z0-9]+$/.test(id)) return; // só segue se ID válido

    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', id);
  } catch (e) {
    // silencioso
  }
})();

