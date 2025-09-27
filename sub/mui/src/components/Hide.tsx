import { type ReactNode } from 'react';

/**
 * Hide 컴포넌트의 속성을 정의하는 인터페이스입니다.
 */
export interface HideProps {
  /**
   * 개발자 설명이나 메모를 위한 속성입니다.
   * 컴포넌트가 숨겨진 이유나 조건을 기록하는 데 사용할 수 있습니다.
   */
  devComment?: unknown;

  /**
   * 숨겨질 자식 요소들입니다.
   * 이 요소들은 렌더링되지 않습니다.
   */
  children?: ReactNode;
}

/**
 * 자식 요소들을 완전히 숨기는 컴포넌트입니다.
 * 조건부 렌더링에서 특정 요소를 완전히 제거하고 싶을 때 사용합니다.
 * null을 반환하여 DOM에서 완전히 제거됩니다.
 *
 * @param props - Hide 컴포넌트의 속성
 * @param props.devComment - 개발자 메모 (실제 렌더링에는 영향 없음)
 * @param props.children - 숨겨질 자식 요소들
 * @returns null (아무것도 렌더링하지 않음)
 *
 * @example
 * ```tsx
 * // 개발 중 임시로 요소 숨기기
 * <Hide devComment="임시로 숨김 - 다음 스프린트에서 구현">
 *   <ComplexComponent />
 * </Hide>
 *
 * // 조건부 숨기기
 * {shouldHide && (
 *   <Hide>
 *     <SensitiveContent />
 *   </Hide>
 * )}
 * ```
 */
export function Hide(_props: HideProps) {
  return null;
}
