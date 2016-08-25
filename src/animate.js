/*
 * Viewport - friendly wrapper for HTML5 Canvases
 *
 * Copyright (C) 2016 Tutive Ltd.
 *
 * Polyfill for requestAnimationFrame
 */

let vendors	= ['ms', 'moz', 'webkit', 'o'],
    rAF		= window.requestAnimationFrame,
    cAF		= window.cancelAnimationFrame;

// Find the browser-specific function
for (let i = 0; i < vendors.length && !rAF; ++i) {
  const vendor = vendors[i];
  rAF = window[`${vendor}RequestAnimationFrame`];
  cAF = window[`${vendor}CancelAnimationFrame`] ||
    window[`${vendor}CancelRequestAnimationFrame`];
}

// Fallback to timers if there really isn't support
let tLast = 0;
if (!rAF) {
  rAF = (callback) => {
    let tCurr = new Date().getTime(),
	callAt = Math.max(0, 16 - (tCurr - tLast));

    let id = window.setTimeout(() => callback(tCurr + callAt), callAt);
    tLast = tCurr + callAt;
    return id;
  };
}

if (!cAF) {
  cAF =  (id) => {
    window.clearTimeout(id);
  };
}

export {rAF, cAF};
