import { useEffect, useRef, useState } from 'react';

type LoadingState = 'unknown' | 'loading' | 'ready' | 'error';

export function useScript(
  src: string,
  options: { removeOnUnmount?: boolean } = { removeOnUnmount: false },
): LoadingState {
  const [status, setStatus] = useState<LoadingState>('loading');
  const optionsRef = useRef(options);

  useEffect(() => {
    const setStatusAsync = (next: LoadingState) => {
      Promise.resolve().then(() => setStatus(next));
    };

    const prevScript = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;

    const domStatus = prevScript?.getAttribute('data-status');
    if (domStatus) {
      setStatusAsync(domStatus as LoadingState);
      return;
    }

    if (prevScript === null) {
      const script = document.createElement('script') as HTMLScriptElement;
      script.src = src;
      script.async = true;
      script.setAttribute('data-status', 'loading');
      document.body.appendChild(script);

      const handleScriptLoad = () => {
        script.setAttribute('data-status', 'ready');
        setStatus('ready');
        removeEventListeners();
      };

      const handleScriptError = () => {
        script.setAttribute('data-status', 'error');
        setStatus('error');
        removeEventListeners();
      };

      const removeEventListeners = () => {
        script.removeEventListener('load', handleScriptLoad);
        script.removeEventListener('error', handleScriptError);
      };

      script.addEventListener('load', handleScriptLoad);
      script.addEventListener('error', handleScriptError);

      const removeOnUnmount = optionsRef.current.removeOnUnmount;

      return () => {
        if (removeOnUnmount === true) {
          script.remove();
          removeEventListeners();
        }
      };
    } else {
      setStatusAsync('unknown');
    }
  }, [src]);

  return status;
}
