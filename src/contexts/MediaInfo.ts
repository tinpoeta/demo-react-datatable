import { createContext } from "react";

export const MediaInfoContext = createContext({
  isDesktop: true,
  isTablet: false,
  isMobile: false,
});
