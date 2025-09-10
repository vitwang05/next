import { useEffect, useState } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const roots = new Set();
    const findRoots = () => {
      document.querySelectorAll('[data-scroll-root]')?.forEach((el) => roots.add(el));
    };
    findRoots();

    const calcVisible = () => {
      let scrolled = window.scrollY > 300;
      roots.forEach((el) => {
        if (el && el.scrollTop > 300) scrolled = true;
      });
      setVisible(scrolled);
    };

    const onWindowScroll = () => calcVisible();
    window.addEventListener('scroll', onWindowScroll, { passive: true });

    const rootListeners = new Map();
    roots.forEach((el) => {
      const fn = () => calcVisible();
      el.addEventListener('scroll', fn, { passive: true });
      rootListeners.set(el, fn);
    });

    const mo = new MutationObserver(() => {
      // Attach listeners to any new roots
      const before = new Set(roots);
      findRoots();
      roots.forEach((el) => {
        if (!before.has(el)) {
          const fn = () => calcVisible();
          el.addEventListener('scroll', fn, { passive: true });
          rootListeners.set(el, fn);
        }
      });
      calcVisible();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    calcVisible();

    return () => {
      window.removeEventListener('scroll', onWindowScroll);
      rootListeners.forEach((fn, el) => el.removeEventListener('scroll', fn));
      mo.disconnect();
    };
  }, []);

  const scrollToTop = () => {
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch {}
    document.querySelectorAll('[data-scroll-root]')?.forEach((el) => {
      el.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-50 rounded-full bg-gray-900 text-white shadow-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 p-3"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
    </button>
  );
}
