import type { FC } from 'react';
import { type ReactNode } from 'react';

/**
 * Show 컴포넌트의 속성을 정의하는 인터페이스입니다.
 */
export interface ShowProps {
  /**
   * 자식 요소를 보여줄지 결정하는 조건입니다.
   * true일 때만 children이 렌더링되고, false, null, undefined일 때는 fallback이 렌더링됩니다.
   */
  when: boolean | null | undefined;
  /**
   * when 조건이 true일 때 렌더링될 요소들입니다.
   */
  children?: ReactNode;
  /**
   * when 조건이 false, null, 또는 undefined일 때 렌더링될 대체 요소입니다.
   * 지정하지 않으면 아무것도 렌더링되지 않습니다.
   */
  fallback?: ReactNode;
}

/**
 * 조건에 따라 자식 요소를 조건부로 렌더링하는 컴포넌트입니다.
 * React의 삼항 연산자를 대체하여 더 명확하고 선언적인 조건부 렌더링을 제공합니다.
 *
 * @param props - Show 컴포넌트의 속성
 * @param props.when - 렌더링 조건 (true일 때 children 표시)
 * @param props.children - 조건이 true일 때 렌더링될 요소
 * @param props.fallback - 조건이 false일 때 렌더링될 대체 요소
 * @returns 조건에 따라 children 또는 fallback
 *
 * @example
 * ```tsx
 * // 기본 사용법
 * <Show when={isLoggedIn}>
 *   <UserDashboard />
 * </Show>
 *
 * // fallback과 함께 사용
 * <Show when={isLoading} fallback={<LoadingSpinner />}>
 *   <DataContent />
 * </Show>
 *
 * // 비교: 삼항 연산자 대신
 * <Show when={user?.isAdmin} fallback={<AccessDenied />}>
 *   <AdminPanel />
 * </Show>
 * ```
 */
export const Show: FC<ShowProps> = ({ when, fallback, children }) => {
  if (when) {
    return children;
  }
  return fallback;
};

Show.displayName = 'Show';
