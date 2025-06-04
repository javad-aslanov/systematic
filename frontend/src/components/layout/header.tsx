"use client"

import React from 'react';
import { SidebarTrigger } from '../ui/sidebar';
import { Separator } from '../ui/separator';
import { Breadcrumbs } from '../breadcrumbs';
import SearchInput from '../search-input';
import { UserNav } from './user-nav';
import { ThemeSelector } from '../theme-selector';
import { useThemeConfig } from '@/components/active-theme';
import { useTheme } from 'next-themes';

export default function Header() {
  const { activeTheme, setActiveTheme } = useThemeConfig();
  const { setTheme, resolvedTheme } = useTheme();

  if (resolvedTheme !== 'dark') {
    setTheme("dark")
  }
  if (activeTheme !== "blue-scaled"){
    setActiveTheme("blue-scaled");
  }

  return (
    <header className='flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
      <div className='flex items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mr-2 h-4' />
        <Breadcrumbs />
      </div>

      <div className='flex items-center gap-2 px-4'>
        <div className='hidden md:flex'>
          <SearchInput />
        </div>
        <UserNav />
      </div>
    </header>
  );
}
