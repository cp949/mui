# @cp949/mui

[![npm version](https://img.shields.io/npm/v/@cp949/mui.svg)](https://www.npmjs.com/package/@cp949/mui)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive React component library built on Material-UI, providing 50+ production-ready components and 67+ custom hooks for modern React applications.

## ✨ Features

- **🎨 50+ Components**: Layout, interactive, responsive, and utility components
- **⚡ 67+ Custom Hooks**: State management, event handling, storage, observables, and more
- **📱 Responsive Design**: Built-in breakpoint components and utilities
- **🔧 TypeScript First**: Full TypeScript support with comprehensive type definitions
- **⚛️ React 18/19**: Compatible with both React 18 and 19
- **🏗️ Material-UI v7**: Built on top of the latest Material-UI
- **📦 Tree Shakable**: Optimized bundle size with ES modules
- **🎯 Multiple Entry Points**: Import from main, hooks, or helpers separately
- **🚀 Zero Config**: All utilities included - no additional dependencies required

## 📦 Installation

Just one command and you're ready to go! All utilities are included.

```bash
# npm
npm install @cp949/mui

# yarn
yarn add @cp949/mui

# pnpm
pnpm add @cp949/mui
```

### Peer Dependencies

Make sure you have the following peer dependencies installed:

```bash
npm install @mui/material @mui/system react rxjs
```

> **✨ That's it!** No need to install additional utility libraries - everything you need is included.

## 🚀 Quick Start

```tsx
import React from 'react';
import { FlexRow, Center, DebouncedButton } from '@cp949/mui';
import { useLocalStorage, useDebouncedState } from '@cp949/mui/hooks';

function MyApp() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [searchQuery, setSearchQuery] = useDebouncedState('', 300);

  return (
    <FlexRow spacing={2} sx={{ p: 2 }}>
      <Center sx={{ minHeight: 200, bgcolor: 'background.paper' }}>
        <DebouncedButton
          variant="contained"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          Toggle Theme: {theme}
        </DebouncedButton>
      </Center>
    </FlexRow>
  );
}
```

## 📚 Component Categories

### Layout Components

Perfect for building responsive layouts with flexbox and grid systems:

```tsx
import { FlexRow, FlexColumn, StackRow, Center, Space } from '@cp949/mui';

// Flexible layouts
<FlexRow spacing={2} alignItems="center">
  <FlexColumn.Start>Content</FlexColumn.Start>
  <FlexRow.Between>Navigation</FlexRow.Between>
</FlexRow>

// Centering utilities
<Center vertical sx={{ height: '100vh' }}>
  <h1>Perfectly Centered</h1>
</Center>

// Spacing control
<Space y={4} /> // Vertical spacing
<Space x={2} /> // Horizontal spacing
```

### Interactive Components

Enhanced Material-UI components with additional functionality:

```tsx
import { DebouncedButton, SegmentedControl, FloatingIndicator } from '@cp949/mui';

// Debounced interactions
<DebouncedButton
  debounce={500}
  onClick={handleSearch}
  variant="contained"
>
  Search
</DebouncedButton>

// Modern segmented controls
<SegmentedControl
  value={selectedTab}
  onChange={setSelectedTab}
  data={[
    { label: 'React', value: 'react' },
    { label: 'Vue', value: 'vue' },
    { label: 'Angular', value: 'angular' }
  ]}
/>
```

### Responsive Components

Breakpoint-aware components for responsive design:

```tsx
import { SmOrUp, MdOrDown, LgOrUp, Hide, Show } from '@cp949/mui';

// Conditional rendering based on screen size
<SmOrUp>
  <DesktopNavigation />
</SmOrUp>

<MdOrDown>
  <MobileNavigation />
</MdOrDown>

// Conditional visibility
<Show when={isLoggedIn}>
  <UserProfile />
</Show>

<Hide when={isLoading}>
  <MainContent />
</Hide>
```

### Utility Components

Specialized components for common use cases:

```tsx
import { Portlet, Highlight, FileButton, CopyButtonWrapper } from '@cp949/mui';

// Card-like containers
<Portlet>
  <Portlet.Header>
    <Portlet.Label>User Settings</Portlet.Label>
    <Portlet.Toolbar>
      <Button>Edit</Button>
    </Portlet.Toolbar>
  </Portlet.Header>
  <Portlet.Content>
    Form content here
  </Portlet.Content>
  <Portlet.Footer>
    Action buttons
  </Portlet.Footer>
</Portlet>

// Text highlighting
<Highlight searchValue="React" highlightColor="primary.main">
  React is a JavaScript library for building user interfaces
</Highlight>
```

## 🎣 Custom Hooks

### State Management Hooks

```tsx
import {
  useDebouncedState,
  useLocalStorage,
  useUncontrolled,
  useObservable
} from '@cp949/mui/hooks';

// Debounced state updates
const [searchTerm, setSearchTerm] = useDebouncedState('', 300);

// Persistent storage
const [user, setUser] = useLocalStorage('user', null);

// Controlled/uncontrolled pattern
const [value, setValue] = useUncontrolled({
  value: controlledValue,
  defaultValue: 'default',
  onChange: onControlledChange
});

// RxJS Observable integration
const data = useObservable(dataStream$);
```

### Event & Effect Hooks

```tsx
import {
  useEventListener,
  useWindowSize,
  useElementSize,
  useInterval,
  useTimeout
} from '@cp949/mui/hooks';

// Event handling
useEventListener('keydown', handleKeyPress);

// Responsive utilities
const { width, height } = useWindowSize();
const { width: elWidth } = useElementSize(elementRef);

// Timing utilities
useInterval(() => {
  fetchData();
}, 5000);

const [showNotification] = useTimeout(() => {
  setVisible(false);
}, 3000);
```

### Lifecycle & Performance Hooks

```tsx
import {
  useMount,
  useUnmount,
  useUpdateEffect,
  useDeepCompareEffect,
  useThrottledCallback
} from '@cp949/mui/hooks';

// Lifecycle
useMount(() => {
  initializeApp();
});

useUnmount(() => {
  cleanup();
});

// Performance optimization
const throttledHandler = useThrottledCallback(
  handleScroll,
  100
);

useDeepCompareEffect(() => {
  fetchData();
}, [complexObject]);
```

## 🛠️ Helper Utilities

```tsx
import { muiCssVars, muiMediaQueries } from '@cp949/mui/helper';

// CSS custom properties for theming
const styles = {
  color: muiCssVars.palette.primary.main,
  spacing: muiCssVars.spacing(2)
};

// Media query utilities
const isTablet = muiMediaQueries.up('md');
```

## 📖 API Reference

### Multiple Entry Points

The library provides optimized entry points for different use cases:

```tsx
// Main components and utilities
import { FlexRow, Center, DebouncedButton } from '@cp949/mui';

// Hooks only (smaller bundle)
import { useLocalStorage, useDebouncedState } from '@cp949/mui/hooks';

// Helper utilities only
import { muiCssVars, muiMediaQueries } from '@cp949/mui/helper';
```

### TypeScript Support

All components and hooks come with comprehensive TypeScript definitions:

```tsx
import type { FlexRowProps, CenterProps, DebouncedButtonProps } from '@cp949/mui';

// Fully typed component props
const MyComponent: React.FC<FlexRowProps> = ({ spacing, children, ...props }) => {
  return <FlexRow spacing={spacing} {...props}>{children}</FlexRow>;
};
```

## 🔧 Requirements

- **React**: ^18.0.0 || ^19.0.0
- **Material-UI**: ^7.0.0
- **TypeScript**: ^5.0.0 (recommended)
- **Node.js**: >=18.0.0

## 📄 License

MIT © [CP949](https://github.com/cp949)

## 🤝 Contributing

This is an internal library. For bug reports or feature requests, please contact the maintainers.

---

Built with ❤️ using Material-UI and TypeScript