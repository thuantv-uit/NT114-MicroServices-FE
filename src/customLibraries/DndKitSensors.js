import { MouseSensor as LibMouseSensor, TouchSensor as LibTouchSensor } from '@dnd-kit/core';

/**
 * Custom MouseSensor to ignore elements with data-no-dnd
 */
export class MouseSensor extends LibMouseSensor {
  static activators = [
    {
      eventName: 'onMouseDown',
      handler: ({ nativeEvent: event }) => {
        return shouldHandleEvent(event.target);
      },
    },
  ];
}

/**
 * Custom TouchSensor to ignore elements with data-no-dnd
 */
export class TouchSensor extends LibTouchSensor {
  static activators = [
    {
      eventName: 'onTouchStart',
      handler: ({ nativeEvent: event }) => {
        return shouldHandleEvent(event.target);
      },
    },
  ];
}

/**
 * Check if element should be handled for drag and drop
 * @param {HTMLElement} element - DOM element
 * @returns {boolean}
 */
function shouldHandleEvent(element) {
  let current = element;
  while (current) {
    if (current.dataset && current.dataset.noDnd) {
      return false;
    }
    current = current.parentElement;
  }
  return true;
}