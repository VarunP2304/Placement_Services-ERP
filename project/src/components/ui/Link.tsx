import React, { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface LinkProps {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
}

export function Link({ href, children, icon }: LinkProps) {
  return (
    <RouterLink
      to={href}
      className="flex items-center space-x-1 hover:text-indigo-200 transition-colors"
    >
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </RouterLink>
  );
}