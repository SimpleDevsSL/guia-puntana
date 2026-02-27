import React from 'react';

export const Logo = ({ className }: { className?: string }) => {
  return (
    <div
      className={className}
      style={{
        backgroundColor: 'currentColor',
        WebkitMask: 'url(/logo-oscuro.svg) center/contain no-repeat', // Actualizado
        mask: 'url(/logo-oscuro.svg) center/contain no-repeat', // Actualizado
      }}
    />
  );
};
