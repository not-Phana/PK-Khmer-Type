/**
 * PK Khmer Type — Windows Virtual Desktop Switch Coordinator
 *
 * Registers blocking-render `pageswap` and `pagereveal` listeners for
 * directional Cross-Document View Transitions (`desktop-next` / `desktop-prev`),
 * honors system & in-app reduced-motion settings, and provides a safe
 * compositor fallback for browsers/contexts without cross-document VT.
 *
 * Strict Zero-Emoji Policy enforced.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'pk_desktop_switch_pending';
  var ENTER_CLASS_NEXT = 'pk-dt-entering-next';
  var ENTER_CLASS_PREV = 'pk-dt-entering-prev';
  var LEAVE_CLASS_NEXT = 'pk-dt-leaving-next';
  var LEAVE_CLASS_PREV = 'pk-dt-leaving-prev';
  var MAX_HANDOFF_AGE_MS = 3000;
  var _isNavigatingFallback = false;

  /**
   * Map workspace routes onto a left-to-right virtual desktop strip:
   * Desktop 1: Welcome / Launch
   * Desktop 2: Studio Pro (index.html)
   * Desktop 3: Rei Tutor (rei.html / rei/index.html)
   * Desktop 4: Mastery Dashboard (dashboard.html)
   * Desktop 5: Documentation (Documents/index.html)
   * Desktop 6: Motion Graphic (motion-graphic.html)
   */
  function classifyDesktopRoute(urlLike) {
    var pathname = '';
    try {
      if (typeof URL === 'function' && urlLike) {
        var baseHref = (typeof location !== 'undefined' && location.href)
          ? location.href
          : 'https://not-phana.github.io/PK-Khmer-Type/';
        pathname = new URL(String(urlLike), baseHref).pathname;
      } else {
        pathname = String(urlLike || '');
      }
    } catch (e) {
      pathname = String(urlLike || '');
    }

    var p = pathname.toLowerCase().replace(/\\/g, '/').split('#')[0].split('?')[0];

    if (/\/welcome(?:\.html|\/index\.html|\/)?$/.test(p)) {
      return { id: 'welcome', rank: 1 };
    }
    if (/\/launch(?:\/index\.html|\/)?$/.test(p)) {
      return { id: 'launch', rank: 1 };
    }
    if (/\/documents(?:\/index\.html|\/.*)?$/.test(p) || /\/docs(?:\/index\.html|\/)?$/.test(p)) {
      return { id: 'documents', rank: 5 };
    }
    if (/\/dashboard(?:\.html|\/index\.html|\/)?$/.test(p)) {
      return { id: 'dashboard', rank: 4 };
    }
    if (/\/motion-graphic(?:\.html|\/)?$/.test(p)) {
      return { id: 'motion', rank: 6 };
    }
    if (/\/rei(?:\.html|\/index\.html|\/)?$/.test(p) || /\/rei\//.test(p)) {
      return { id: 'rei', rank: 3 };
    }
    if (/\/index\.html$/.test(p) || /\/$/.test(p) || p === '' || /\/pk-khmer-type$/.test(p)) {
      return { id: 'studio', rank: 2 };
    }

    return { id: p, rank: 2 };
  }

  function resolveDesktopDirection(fromUrl, toUrl) {
    var fromInfo = classifyDesktopRoute(fromUrl);
    var toInfo = classifyDesktopRoute(toUrl);

    if (fromInfo.id === toInfo.id) {
      return null;
    }
    if (toInfo.rank > fromInfo.rank) {
      return 'desktop-next';
    }
    if (toInfo.rank < fromInfo.rank) {
      return 'desktop-prev';
    }
    return 'desktop-next';
  }

  function isMotionDisabled() {
    try {
      if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          return true;
        }
      }
      if (typeof document !== 'undefined' && document.documentElement && document.documentElement.classList) {
        var cl = document.documentElement.classList;
        if (
          cl.contains('reduce-motion') ||
          cl.contains('reduced-motion') ||
          cl.contains('performance-mode') ||
          cl.contains('anim-mode-off')
        ) {
          return true;
        }
      }
      if (typeof localStorage !== 'undefined') {
        var r = localStorage.getItem('khmerSettingReducedMotion');
        var p = localStorage.getItem('khmerSettingPerformanceMode');
        var a = localStorage.getItem('khmerSettingAnimationMode');
        if (r === '1' || p === '1' || a === 'off') {
          return true;
        }
      }
    } catch (e) {}
    return false;
  }

  function readPendingDirection() {
    try {
      if (typeof sessionStorage === 'undefined') return null;
      var raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (!data || !data.dir || !data.ts) return null;
      if ((Date.now() - Number(data.ts)) > MAX_HANDOFF_AGE_MS) {
        sessionStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return data;
    } catch (e) {
      return null;
    }
  }

  function writePendingDirection(dir, fromUrl, toUrl) {
    try {
      if (typeof sessionStorage === 'undefined') return;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        dir: dir,
        from: String(fromUrl || ''),
        to: String(toUrl || ''),
        ts: Date.now()
      }));
    } catch (e) {}
  }

  function clearPendingDirection() {
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {}
  }

  function clearFallbackClasses() {
    try {
      if (typeof document !== 'undefined' && document.documentElement && document.documentElement.classList) {
        document.documentElement.classList.remove(
          ENTER_CLASS_NEXT,
          ENTER_CLASS_PREV,
          LEAVE_CLASS_NEXT,
          LEAVE_CLASS_PREV
        );
      }
    } catch (e) {}
  }

  function supportsNativeCrossDocVT() {
    try {
      if (typeof window === 'undefined') return false;
      if (!('onpagereveal' in window)) return false;
      if (typeof location !== 'undefined' && location.protocol === 'file:') return false;
      return true;
    } catch (e) {
      return false;
    }
  }

  function resolveActivationUrls(eventObj) {
    var act = (eventObj && eventObj.activation) ||
      (typeof window !== 'undefined' && window.navigation && window.navigation.activation) ||
      null;
    var fromUrl = act && act.from && act.from.url ? act.from.url : null;
    var toUrl = act && act.entry && act.entry.url ? act.entry.url : null;
    return { act: act, fromUrl: fromUrl, toUrl: toUrl };
  }

  /* ------------------------------------------------------------------------
   * 1. Native Cross-Document View Transitions (pageswap + pagereveal)
   * ------------------------------------------------------------------------ */
  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('pageswap', function (event) {
      if (!event || !event.viewTransition) return;

      if (isMotionDisabled()) {
        try {
          if (typeof event.viewTransition.skipTransition === 'function') {
            event.viewTransition.skipTransition();
          }
        } catch (e) {}
        return;
      }

      var urls = resolveActivationUrls(event);
      var currentHref = (typeof location !== 'undefined' && location.href) ? location.href : '';
      var fromUrl = urls.fromUrl || currentHref;
      var toUrl = urls.toUrl;

      if (!toUrl) return;

      var dir = resolveDesktopDirection(fromUrl, toUrl);
      if (!dir) {
        try {
          if (typeof event.viewTransition.skipTransition === 'function') {
            event.viewTransition.skipTransition();
          }
        } catch (e) {}
        return;
      }

      writePendingDirection(dir, fromUrl, toUrl);

      try {
        if (event.viewTransition.types && typeof event.viewTransition.types.add === 'function') {
          event.viewTransition.types.add(dir);
        }
      } catch (e) {}
    });

    window.addEventListener('pagereveal', function (event) {
      var pending = readPendingDirection();
      clearPendingDirection();
      clearFallbackClasses();

      if (!event || !event.viewTransition) return;

      if (isMotionDisabled()) {
        try {
          if (typeof event.viewTransition.skipTransition === 'function') {
            event.viewTransition.skipTransition();
          }
        } catch (e) {}
        return;
      }

      var urls = resolveActivationUrls(event);
      var currentHref = (typeof location !== 'undefined' && location.href) ? location.href : '';
      var fromUrl = urls.fromUrl || (pending && pending.from) || '';
      var toUrl = urls.toUrl || currentHref;

      var dir = fromUrl ? resolveDesktopDirection(fromUrl, toUrl) : (pending && pending.dir);
      if (!dir) {
        try {
          if (typeof event.viewTransition.skipTransition === 'function') {
            event.viewTransition.skipTransition();
          }
        } catch (e) {}
        return;
      }

      try {
        if (event.viewTransition.types && typeof event.viewTransition.types.add === 'function') {
          event.viewTransition.types.add(dir);
        }
      } catch (e) {}
    });

    window.addEventListener('pageshow', function (event) {
      if (event && event.persisted) {
        _isNavigatingFallback = false;
        clearPendingDirection();
        clearFallbackClasses();
      }
    });
  }

  /* ------------------------------------------------------------------------
   * 2. Progressive Fallback Entrance & Link Interception (Firefox / file://)
   * ------------------------------------------------------------------------ */
  var hasNativeVT = supportsNativeCrossDocVT();

  if (!hasNativeVT && !isMotionDisabled()) {
    var pendingEnter = readPendingDirection();
    if (pendingEnter && pendingEnter.dir) {
      var currentLocation = (typeof location !== 'undefined' && location.href) ? location.href : '';
      var verifiedDir = pendingEnter.from
        ? resolveDesktopDirection(pendingEnter.from, currentLocation)
        : pendingEnter.dir;
      clearPendingDirection();

      if (verifiedDir && typeof document !== 'undefined' && document.documentElement && document.documentElement.classList) {
        var enterClass = verifiedDir === 'desktop-prev' ? ENTER_CLASS_PREV : ENTER_CLASS_NEXT;
        document.documentElement.classList.add(enterClass);

        var cleanEnter = function () {
          try {
            document.documentElement.classList.remove(ENTER_CLASS_NEXT, ENTER_CLASS_PREV);
          } catch (e) {}
        };

        if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
          window.addEventListener('animationend', function onEnd(ev) {
            if (ev && ev.target === document.body) {
              window.removeEventListener('animationend', onEnd);
              cleanEnter();
            }
          });
        }
        if (typeof setTimeout === 'function') {
          setTimeout(cleanEnter, 420);
        }
      }
    }
  } else if (hasNativeVT) {
    // Wait until pagereveal consumes the pending direction; nothing else needed on load.
  }

  function performFallbackSwitch(destHref) {
    if (!destHref || _isNavigatingFallback) return;

    var currentHref = (typeof location !== 'undefined' && location.href) ? location.href : '';
    var dir = resolveDesktopDirection(currentHref, destHref);
    if (!dir || isMotionDisabled()) {
      location.href = destHref;
      return;
    }

    _isNavigatingFallback = true;
    writePendingDirection(dir, currentHref, destHref);

    if (typeof document !== 'undefined' && document.documentElement && document.documentElement.classList) {
      document.documentElement.classList.add(dir === 'desktop-prev' ? LEAVE_CLASS_PREV : LEAVE_CLASS_NEXT);
    }

    setTimeout(function () {
      location.href = destHref;
    }, 185);
  }

  if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
    document.addEventListener('click', function (event) {
      if (!event || event.defaultPrevented) return;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      var target = event.target;
      if (!target || typeof target.closest !== 'function') return;
      var anchor = target.closest('a[href]');
      if (!anchor) return;

      var rawHref = anchor.getAttribute('href');
      if (!rawHref || rawHref.charAt(0) === '#') return;
      if (/^(?:mailto:|tel:|javascript:|data:|blob:)/i.test(rawHref)) return;
      if (anchor.hasAttribute('download')) return;
      var tgtAttr = anchor.getAttribute('target');
      if (tgtAttr && tgtAttr.toLowerCase() !== '_self') return;

      var destHref = anchor.href || rawHref;
      var currentHref = (typeof location !== 'undefined' && location.href) ? location.href : '';

      try {
        if (typeof URL === 'function' && location && location.protocol !== 'file:') {
          var parsedDest = new URL(destHref, currentHref);
          var parsedCur = new URL(currentHref);
          if (parsedDest.origin !== parsedCur.origin) return;
          if (parsedDest.pathname === parsedCur.pathname && parsedDest.search === parsedCur.search) return;
          destHref = parsedDest.href;
        }
      } catch (e) {}

      // If native Cross-Document View Transitions are active, just seed pending direction
      // for edge-case fallback and allow 100% native browser navigation!
      if (supportsNativeCrossDocVT()) {
        var nativeDir = resolveDesktopDirection(currentHref, destHref);
        if (nativeDir && !isMotionDisabled()) {
          writePendingDirection(nativeDir, currentHref, destHref);
        }
        return;
      }

      var fallbackDir = resolveDesktopDirection(currentHref, destHref);
      if (!fallbackDir || isMotionDisabled()) return;

      event.preventDefault();
      performFallbackSwitch(destHref);
    }, false);
  }

  /* ------------------------------------------------------------------------
   * 3. Public Helper for JS-driven Switch Triggers (tutorial, dashboard, etc.)
   * ------------------------------------------------------------------------ */
  if (typeof window !== 'undefined') {
    window.pkSwitchDesktop = function (url) {
      if (!url) return;
      var currentHref = (typeof location !== 'undefined' && location.href) ? location.href : '';
      if (supportsNativeCrossDocVT()) {
        var dir = resolveDesktopDirection(currentHref, url);
        if (dir && !isMotionDisabled()) {
          writePendingDirection(dir, currentHref, url);
        }
        location.href = url;
        return;
      }
      performFallbackSwitch(url);
    };

    window.PKDesktopTransition = {
      classifyDesktopRoute: classifyDesktopRoute,
      resolveDesktopDirection: resolveDesktopDirection,
      isMotionDisabled: isMotionDisabled,
      supportsNativeCrossDocVT: supportsNativeCrossDocVT
    };
  }
})();
