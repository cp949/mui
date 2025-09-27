import { useRef } from 'react';

/**
 * 값의 최신 참조를 유지하는 React 훅입니다.
 * 콜백 함수나 비동기 작업에서 항상 최신 값을 참조하도록 보장합니다.
 *
 * 이 훅은 클로저(closure) 문제를 해결하는 데 유용합니다.
 * 비동기 콜백이나 이벤트 핸들러에서 오래된 state를 참조하는 문제를 방지합니다.
 *
 * @template T - 최신 참조를 유지할 값의 타입
 * @param value - 최신 참조를 유지할 값
 * @returns 최신 값을 포함하는 ref 객체
 *
 * @example
 * ```tsx
 * const Component = () => {
 *   const [count, setCount] = useState(0);
 *   const countRef = useLatest(count);
 *
 *   useEffect(() => {
 *     const timer = setInterval(() => {
 *       // 클로저로 인해 count는 항상 0이지만,
 *       // countRef.current는 항상 최신 값을 참조
 *       console.log('최신 count:', countRef.current);
 *     }, 1000);
 *
 *     return () => clearInterval(timer);
 *   }, []); // 빈 의존성 배열
 *
 *   return (
 *     <button onClick={() => setCount(c => c + 1)}>
 *       Count: {count}
 *     </button>
 *   );
 * };
 * ```
 *
 * @example
 * ```tsx
 * // 비동기 작업에서 최신 state 사용
 * const Component = () => {
 *   const [data, setData] = useState(null);
 *   const dataRef = useLatest(data);
 *
 *   const fetchData = useCallback(async () => {
 *     const response = await api.getData();
 *     // 비동기 작업 완료 시 최신 data 상태 확인
 *     if (dataRef.current !== null) {
 *       setData(response);
 *     }
 *   }, []);
 *
 *   return <div>{data}</div>;
 * };
 * ```
 *
 * @example
 * ```tsx
 * // 콜백 함수의 최신 참조 유지
 * const Component = ({ onDataChange }: { onDataChange: (data: any) => void }) => {
 *   const onDataChangeRef = useLatest(onDataChange);
 *
 *   useEffect(() => {
 *     const subscription = dataSource.subscribe((data) => {
 *       // 항상 최신 onDataChange 콜백 호출
 *       onDataChangeRef.current(data);
 *     });
 *
 *     return () => subscription.unsubscribe();
 *   }, []); // onDataChange가 변경되어도 재구독하지 않음
 *
 *   return <div>데이터 수신 중...</div>;
 * };
 * ```
 */
export function useLatest<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}
