/** Canonical IMFO finance dashboard page ids and URL builder — keep in sync with FinanceRoutes.jsx */
export const FINANCE_PAGE_IDS = [
  'dashboard',
  'portfolio-management',
  'fund-performance',
  'investor-relations',
  'deal-pipeline',
  'compliance',
  'reporting',
  'analytics',
  'documents',
  'settings'
];

export function financePath(page) {
  return `/finance/${page}`;
}

export function resolveFinancePageFromPath(pathname) {
  const segment = pathname.replace(/^\/finance\/?/, '').split('/').filter(Boolean)[0];
  if (segment && FINANCE_PAGE_IDS.includes(segment)) {
    return segment;
  }
  return 'dashboard';
}
