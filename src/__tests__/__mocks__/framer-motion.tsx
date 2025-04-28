import React from 'react';

// Mock the framer-motion components
const mockMotionComponent = (Component: string) => 
  React.forwardRef((props: any, ref: any) => {
    const { children, ...rest } = props;
    return React.createElement(Component, { ...rest, ref }, children);
  });

export const motion = {
  div: mockMotionComponent('div'),
  button: mockMotionComponent('button'),
  span: mockMotionComponent('span'),
  p: mockMotionComponent('p'),
  a: mockMotionComponent('a'),
  ul: mockMotionComponent('ul'),
  li: mockMotionComponent('li'),
  section: mockMotionComponent('section'),
  article: mockMotionComponent('article'),
  header: mockMotionComponent('header'),
  footer: mockMotionComponent('footer'),
  main: mockMotionComponent('main'),
  nav: mockMotionComponent('nav'),
  aside: mockMotionComponent('aside'),
  form: mockMotionComponent('form'),
  input: mockMotionComponent('input'),
  textarea: mockMotionComponent('textarea'),
  select: mockMotionComponent('select'),
  option: mockMotionComponent('option'),
  label: mockMotionComponent('label'),
  h1: mockMotionComponent('h1'),
  h2: mockMotionComponent('h2'),
  h3: mockMotionComponent('h3'),
  h4: mockMotionComponent('h4'),
  h5: mockMotionComponent('h5'),
  h6: mockMotionComponent('h6'),
};

export const AnimatePresence = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export const useAnimation = () => ({
  start: jest.fn(),
  stop: jest.fn(),
});

export const useMotionValue = (initial: any) => ({
  get: () => initial,
  set: jest.fn(),
  onChange: jest.fn(),
});

export const useTransform = () => 0;

export const useViewportScroll = () => ({
  scrollY: {
    get: () => 0,
    onChange: jest.fn(),
  },
});

export const useInView = () => true;
