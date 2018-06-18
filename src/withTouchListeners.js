// @flow
import React, { PureComponent, type ComponentType } from 'react';
import { canUseDOM } from 'exenv';

import { allowTouchMove, isTouchDevice, preventInertiaScroll, preventTouchMove } from './utils';

type Props = {
  touchScrollTarget?: HTMLElement,
};

export default function withTouchListeners(WrappedComponent: ComponentType<*>) {
  return class TouchProvider extends PureComponent<Props> {
    listenerOptions = {
      capture: false,
      passive: false,
    };
    componentDidMount() {
      if (!canUseDOM) return;

      const { touchScrollTarget } = this.props;
      const target = document.body;

      // account for touch devices
      if (target && isTouchDevice()) {
        // Mobile Safari ignores { overflow: hidden } declaration on the body.
        target.addEventListener('touchmove', preventTouchMove, this.listenerOptions);

        // Allow scroll on provided target
        if (touchScrollTarget) {
          touchScrollTarget.current.addEventListener(
            'touchstart',
            preventInertiaScroll,
            this.listenerOptions,
          );
          touchScrollTarget.current.addEventListener('touchmove', allowTouchMove, this.listenerOptions);
        }
      }
    }
    componentWillUnmount() {
      if (!canUseDOM) return;

      const { touchScrollTarget } = this.props;
      const target = document.body;

      // remove touch listeners
      if (target && isTouchDevice()) {
        target.removeEventListener('touchmove', preventTouchMove, this.listenerOptions);

        if (touchScrollTarget) {
          touchScrollTarget.current.removeEventListener(
            'touchstart',
            preventInertiaScroll,
            this.listenerOptions,
          );
          touchScrollTarget.current.removeEventListener('touchmove', allowTouchMove, this.listenerOptions);
        }
      }
    }
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}
