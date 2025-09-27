import type { DependencyList, EffectCallback } from 'react';
import { useEffect, useRef } from 'react';

/**
 * 컴포넌트가 업데이트될 때만 실행되는 useEffect 훅입니다.
 * 첫 번째 마운트 시에는 실행되지 않고, 의존성이 변경된 이후에만 실행됩니다.
 *
 * useDidUpdate와 비슷하지만 내부 구현이 약간 다릅니다.
 * 이 훅은 무한 루프나 예상치 못한 리렌더링을 방지하는 데 유용합니다.
 *
 * @param effect - 업데이트 시 실행할 effect 콜백 함수
 * @param deps - effect의 실행을 제어하는 의존성 배열 (선택사항)
 *
 * @example
 * ```tsx
 * const Component = ({ search }: { search: string }) => {
 *   const [results, setResults] = useState([]);
 *
 *   // 첫 번째 마운트에는 검색하지 않고, search가 변경될 때만 검색
 *   useUpdateEffect(() => {
 *     if (search) {
 *       searchAPI(search).then(setResults);
 *     }
 *   }, [search]);
 *
 *   return (
 *     <div>
 *       {results.map(item => <div key={item.id}>{item.name}</div>)}
 *     </div>
 *   );
 * };
 * ```
 *
 * @example
 * ```tsx
 * // 디바운싱된 입력과 함께 사용
 * const SearchComponent = () => {
 *   const [query, setQuery] = useState('');
 *   const [results, setResults] = useState([]);
 *
 *   useUpdateEffect(() => {
 *     if (query.length > 2) {
 *       // 첫 로드 시에는 검색하지 않음
 *       performSearch(query).then(setResults);
 *     } else {
 *       setResults([]);
 *     }
 *   }, [query]);
 *
 *   return (
 *     <div>
 *       <input
 *         value={query}
 *         onChange={(e) => setQuery(e.target.value)}
 *         placeholder="검색어 입력"
 *       />
 *       {results.map(result => <div key={result.id}>{result.title}</div>)}
 *     </div>
 *   );
 * };
 * ```
 */
export const useUpdateEffect = (effect: EffectCallback, deps?: DependencyList) => {
  const isMounted = useRef(false);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      return effect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
