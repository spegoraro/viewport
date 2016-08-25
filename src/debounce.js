/*
 * Viewport - friendly wrapper for HTML5 Canvases
 *
 * Copyright (C) 2016 Tutive Ltd.
 * Debounce
 * Returns a function that only fires every `wait` ms regardless of how many
 * times it is called.
 *
 * Usage:
 *   debounce(function(){}, 3000);
 *   debounce(function(){}, 3000, true); // To fire it once immediately.
 */

export default function debounce(func, wait, immediate) {
    var timeout;
    return function() {
	let context = this, args = arguments;
	let later = function() {
	    timeout = null;
	    if (!immediate) func.apply(context, args);
	};
	let callNow = immediate && !timeout;
	window.clearTimeout(timeout);
	timeout = window.setTimeout(later, wait);
	if (callNow) func.apply(context, args);
    };
};

