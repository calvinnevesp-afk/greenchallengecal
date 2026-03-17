import React from 'react';

interface TreeLogoProps {
  className?: string;
  size?: number;
}

export default function TreeLogo({ className = '', size = 24 }: TreeLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Trunk */}
      <rect x="10" y="14" width="4" height="8" fill="#8B6F47" rx="1" />
      
      {/* Main foliage - three circles creating tree shape */}
      <circle cx="12" cy="8" r="5" fill="#10B981" />
      <circle cx="7" cy="11" r="4" fill="#10B981" />
      <circle cx="17" cy="11" r="4" fill="#10B981" />
      
      {/* Highlight for depth */}
      <circle cx="11" cy="7" r="1.5" fill="#34D399" opacity="0.6" />
    </svg>
  );
}
