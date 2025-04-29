import React, { useState } from 'react';

/**
 * Skip to content link for keyboard users
 * This component provides a way for keyboard users to skip navigation
 * and go directly to the main content of the page
 */
const SkipToContent: React.FC = () => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.tabIndex = -1;
      mainContent.focus();
      // Reset tabIndex after focus to avoid interfering with normal tab navigation
      setTimeout(() => {
        mainContent.removeAttribute('tabIndex');
      }, 1000);
    }
  };

  return (
    <a
      href="#main-content"
      className={`
        fixed top-0 left-0 p-3 m-3 z-50 bg-primary-600 text-white
        rounded-md transition-transform duration-200 focus:outline-none
        ${isFocused ? 'transform-none' : '-translate-y-full'}
      `}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={handleClick}
    >
      Skip to content
    </a>
  );
};

export default SkipToContent;
