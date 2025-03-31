export function createListenerControl<T extends keyof DocumentEventMap>(
  event: T,
  callback: (event: DocumentEventMap[T]) => void,
) {
  return {
    attach: () => document.addEventListener(event, callback),
    cleanup: () => document.removeEventListener(event, callback),
  };
}

export function isInside(container: HTMLElement | null, child: Element | EventTarget | null) {
  if (!container || !child) return false;
  return !!(container.isEqualNode(child as Node) || container.contains(child as Node));
}

export function blurCurrentElement() {
  (document.activeElement as HTMLElement)?.blur?.();
}
