import React from 'react';

export const Logo = ({ className }: { className?: string }) => {
  return (
    <div
      className={className}
      style={{
        backgroundColor: 'currentColor',
        WebkitMask: 'url(/icon.svg) center/contain no-repeat',
        mask: 'url(/icon.svg) center/contain no-repeat',
      }}
    />
  );
};
