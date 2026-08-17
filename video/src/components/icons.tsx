// SVG 图标库（内联，单色描边，2026-08-15 组件库化抽出）
import React from 'react';

export type IconKey =
  | 'cup' | 'x' | 'check' | 'gift' | 'clock' | 'users' | 'cash' | 'bolt' | 'search' | 'arrow';

export const Ico: Record<IconKey, (c: string) => React.ReactElement> = {
  cup: (c) => (
    <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none">
      <path d="M10 18h26v10a10 10 0 01-10 10H20a10 10 0 01-10-10V18z" stroke={c} strokeWidth="3" />
      <path d="M36 20h5a4 4 0 010 8h-5" stroke={c} strokeWidth="3" />
      <path d="M14 8c0 3-3 3-3 6M22 8c0 3-3 3-3 6M30 8c0 3-3 3-3 6" stroke={c} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  ),
  x: (c) => (
    <svg width="100%" height="100%" viewBox="0 0 32 32" fill="none">
      <path d="M8 8l16 16M24 8L8 24" stroke={c} strokeWidth="4" strokeLinecap="round" />
    </svg>
  ),
  check: (c) => (
    <svg width="100%" height="100%" viewBox="0 0 32 32" fill="none">
      <path d="M7 16l6 6 12-13" stroke={c} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  gift: (c) => (
    <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none">
      <rect x="8" y="20" width="32" height="20" rx="2" stroke={c} strokeWidth="3" />
      <path d="M6 12h36v8H6z" stroke={c} strokeWidth="3" />
      <path d="M24 12v28M18 12a6 6 0 010-6c4 0 6 6 6 6zm12 0a6 6 0 000-6c-4 0-6 6-6 6z" stroke={c} strokeWidth="3" />
    </svg>
  ),
  clock: (c) => (
    <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="18" stroke={c} strokeWidth="3" />
      <path d="M24 13v11l8 5" stroke={c} strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  users: (c) => (
    <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none">
      <circle cx="17" cy="17" r="7" stroke={c} strokeWidth="3" />
      <circle cx="33" cy="19" r="6" stroke={c} strokeWidth="3" />
      <path d="M6 40c0-7 5-11 11-11s11 4 11 11M30 40c0-5 4-9 9-9" stroke={c} strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  cash: (c) => (
    <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none">
      <rect x="6" y="12" width="36" height="24" rx="3" stroke={c} strokeWidth="3" />
      <circle cx="24" cy="24" r="7" stroke={c} strokeWidth="3" />
      <path d="M12 18v12M36 18v12" stroke={c} strokeWidth="3" />
    </svg>
  ),
  bolt: (c) => (
    <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none">
      <path d="M26 6L12 27h10l-2 15 16-23H25l3-13z" stroke={c} strokeWidth="3" strokeLinejoin="round" />
    </svg>
  ),
  search: (c) => (
    <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none">
      <circle cx="21" cy="21" r="13" stroke={c} strokeWidth="3" />
      <path d="M32 32l10 10" stroke={c} strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  arrow: (c) => (
    <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none">
      <path d="M8 24h30M30 12l12 12-12 12" stroke={c} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};
