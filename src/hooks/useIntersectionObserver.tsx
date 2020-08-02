import { useEffect } from 'react';

export const useIntersectionObserver = (
  element: HTMLElement | null,
  onIntersection: () => void,
  deps: any[]
) => {
  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(([observerEntry]) => {
      if (!observerEntry.isIntersecting) return;
      onIntersection();
    });

    observer.observe(element);

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [element, ...deps]);
};
