// Design System Tokens for Grow Accounting
// Based on Figma spec: 8pt spacing, Inter typography, clean SaaS UI

export const spacing = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '32px',
  8: '40px',
  9: '48px',
  10: '64px'
};

export const radius = {
  1: '6px',
  2: '10px',
  3: '14px',
  4: '18px'
};

export const shadows = {
  1: '0 1px 6px rgba(0, 0, 0, 0.10)',
  2: '0 6px 18px rgba(0, 0, 0, 0.12)'
};

export const typography = {
  h1: {
    fontSize: '28px',
    lineHeight: '36px',
    fontWeight: 600
  },
  h2: {
    fontSize: '22px',
    lineHeight: '30px',
    fontWeight: 600
  },
  h3: {
    fontSize: '18px',
    lineHeight: '26px',
    fontWeight: 600
  },
  body: {
    fontSize: '14px',
    lineHeight: '22px',
    fontWeight: 400
  },
  small: {
    fontSize: '12px',
    lineHeight: '18px',
    fontWeight: 400
  },
  mono: {
    fontSize: '12px',
    lineHeight: '18px',
    fontWeight: 400,
    fontFamily: 'monospace'
  }
};

export const colors = {
  ink: {
    900: '#0B1220',
    700: '#334155',
    500: '#64748B'
  },
  line: {
    200: '#E2E8F0',
    100: '#F1F5F9'
  },
  surface: {
    0: '#FFFFFF',
    50: '#F8FAFC',
    100: '#F1F5F9'
  },
  accent: {
    600: '#2563EB'
  },
  success: {
    600: '#16A34A'
  },
  warning: {
    600: '#D97706'
  },
  danger: {
    600: '#DC2626'
  }
};

export const layout = {
  leftNavWidth: '264px',
  leftNavCollapsed: '80px',
  topRibbonHeight: '56px',
  contentMaxWidth: '1120px',
  buttonHeight: '36px',
  inputHeight: '36px',
  chipHeight: '24px',
  tableRowHeight: '44px',
  sectionHeaderHeight: '40px'
};

export const iconSizes = {
  sm: '16px',
  md: '20px'
};

export const grid = {
  desktop: {
    width: 1440,
    height: 900,
    columns: 12,
    margins: '72px',
    gutters: '24px'
  },
  tablet: {
    width: 834,
    height: 1112
  },
  mobile: {
    width: 390,
    height: 844
  }
};
