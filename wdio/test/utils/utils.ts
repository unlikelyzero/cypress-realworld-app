export const isMobile = async (): Promise<boolean> => {
  const viewport = await browser.getWindowSize();
  return viewport.width < 768;
};
