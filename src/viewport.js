/*
 * Viewport - friendly wrapper for HTML5 Canvases
 *
 * Copyright (C) 2016 Tutive Ltd.
 * Viewport
 * Wraps a HTML canvas element providing automatic HiDPI support and resizing as
 * well as rendering functionality.
 *
 * Usage:
 *   let canvas = document.getElementById('#my-canvas-id');
 *   let viewport = new Viewport(canvas);
 */

import debounce from './debounce';
import {rAF, cAF} from './animate';


class Viewport {

  constructor(el) {
    this.canvas = el;
    this.context = el.getContext('2d');
    this.deviceRatio = window.devicePixelRatio || 1;
    this.pixelRatio = 1;
    this.geometry = {};
    this.listeners = [];
    this.draw = ctx => console.log('No render method provided.');

    window.addEventListener('resize', debounce(this.resize, 50).bind(this));
    this.resize();
  }


  // Clears the viewport efficiently.
  clear() {
    this.context.clearRect(0, 0, this.geometry.width, this.geometry.height);
  }

  render() {
    this.clear();
    this.context.save();
    this.context.translate(this.geometry.width / 2, this.geometry.height / 2);
    this.draw(this.context);
    this.context.restore();
    this.animId = rAF(this.render.bind(this));
  }

  start() {
    this.animId = rAF(this.render.bind(this));
  }

  stop() {
    cAF(this.animId);
  }


  addEventListener(event, callback) {
    this.listeners.push({event: event, callback: callback});
  }


  // Browser-independent way of getting the actual pixel ratio.
  getPixelRatio() {
    let backingStoreRatio =
	this.context.backingStorePixelRatio       ||
	this.context.webkitBackingStorePixelRatio ||
	this.context.mozBackingStorePixelRatio    ||
	this.context.msBackingStorePixelRatio     ||
	this.context.oBackingStorePixelRatio      ||
	this.context.backingStorePixelRatio       ||
	1;
    return this.deviceRatio / backingStoreRatio;
  }


  // Refreshes the context and determines the new size of the canvas element and
  // internal geometry.
  rescale() {
    this.context = this.canvas.getContext('2d');
    let computed = window.getComputedStyle(this.canvas);

    this.geometry = {
      width  : parseInt(computed['width'], 10),
      height : parseInt(computed['height'], 10)
    };

    this.canvas.width  = this.geometry.width * this.pixelRatio;
    this.canvas.height = this.geometry.height * this.pixelRatio;

    this.context.scale(this.pixelRatio, this.pixelRatio);
  }


  // Updates the pixel ratio and canvas size.
  resize() {
    this.pixelRatio = this.getPixelRatio();
    this.rescale();
    this.listeners
      .filter(l => l.event === 'resize')
      .forEach(l => l.callback(this.geometry));
  }
}

export default Viewport;
