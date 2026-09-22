import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** A link from the end of the story should open the workspace at its beginning. */
export function RouteViewport() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);
  return null;
}
