export const getLenis = () => typeof window !== 'undefined' ? (window as any).lenis : undefined;

export const scrollTo = (target: any, options?: any) => {
  if (typeof window !== 'undefined' && (window as any).lenis) {
    (window as any).lenis.scrollTo(target, options);
  } else if (typeof window !== 'undefined') {
    window.scrollTo({
      top: typeof target === 'number' ? target : 0,
      behavior: 'smooth'
    });
  }
};
