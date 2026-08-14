import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { FileButtonPage } from './pages/FileButtonPage';
import { UseAbsolutePositionPage } from './pages/UseAbsolutePositionPage';
import { UseAudioUnlockedPage } from './pages/UseAudioUnlockedPage';
import { UseConstantPage } from './pages/UseConstantPage';
import { UseDebouncedCallbackPage } from './pages/UseDebouncedCallbackPage';
import { UseLatestPage } from './pages/UseLatestPage';
import { UseMountedPage } from './pages/UseMountedPage';
import { UseObservableLocalStoragePage } from './pages/UseObservableLocalStoragePage';
import { UseObservableSessionStoragePage } from './pages/UseObservableSessionStoragePage';
import { UseScriptPage } from './pages/UseScriptPage';
import { UseThrottledCallbackWithClearTimeoutPage } from './pages/UseThrottledCallbackWithClearTimeoutPage';
import { UseTimeoutDataPage } from './pages/UseTimeoutDataPage';

type Route = {
  label: string;
  hash: string;
  element: React.ReactNode;
};

function getHashRoute(): string {
  const raw = window.location.hash || '#/';
  // normalize '#/foo' → '/foo'
  return raw.startsWith('#') ? raw.slice(1) : raw;
}

export function App() {
  const [route, setRoute] = useState(() => getHashRoute());

  useEffect(() => {
    const onHashChange = () => setRoute(getHashRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const routes: Route[] = useMemo(
    () => [
      {
        label: 'useLatest',
        hash: '#/useLatest',
        element: <UseLatestPage />,
      },
      {
        label: 'useConstant',
        hash: '#/useConstant',
        element: <UseConstantPage />,
      },
      {
        label: 'useDebouncedCallback',
        hash: '#/useDebouncedCallback',
        element: <UseDebouncedCallbackPage />,
      },
      {
        label: 'useMounted',
        hash: '#/useMounted',
        element: <UseMountedPage />,
      },
      {
        label: 'useTimeoutData',
        hash: '#/useTimeoutData',
        element: <UseTimeoutDataPage />,
      },
      {
        label: 'useScript',
        hash: '#/useScript',
        element: <UseScriptPage />,
      },
      {
        label: 'useObservableLocalStorage',
        hash: '#/useObservableLocalStorage',
        element: <UseObservableLocalStoragePage />,
      },
      {
        label: 'useObservableSessionStorage',
        hash: '#/useObservableSessionStorage',
        element: <UseObservableSessionStoragePage />,
      },
      {
        label: 'useAbsolutePosition',
        hash: '#/useAbsolutePosition',
        element: <UseAbsolutePositionPage />,
      },
      {
        label: 'useThrottledCallbackWithClearTimeout',
        hash: '#/useThrottledCallbackWithClearTimeout',
        element: <UseThrottledCallbackWithClearTimeoutPage />,
      },
      {
        label: 'useAudioUnlocked',
        hash: '#/useAudioUnlocked',
        element: <UseAudioUnlockedPage />,
      },
      {
        label: 'FileButton',
        hash: '#/FileButton',
        element: <FileButtonPage />,
      },
    ],
    [],
  );

  const active = routes.find((r) => route === r.hash.slice(1)) ?? routes[0];

  return (
    <div className='app'>
      <header className='header'>
        <div className='title'>cp949/mui E2E</div>
        <nav className='nav' aria-label='E2E routes'>
          {routes.map((r) => (
            <a
              key={r.hash}
              href={r.hash}
              className={r.hash === `#${route}` ? 'navLink active' : 'navLink'}
              data-testid={`nav:${r.label}`}
            >
              {r.label}
            </a>
          ))}
        </nav>
      </header>

      <main className='main'>{active.element}</main>
    </div>
  );
}
