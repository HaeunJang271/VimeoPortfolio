export function isMarketingListPage(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname === "/directors" ||
    pathname === "/work" ||
    pathname === "/contact"
  );
}

export function isDirectorDetailPage(pathname: string): boolean {
  return pathname.startsWith("/directors/") && pathname !== "/directors";
}

export function isSiteChromePage(pathname: string): boolean {
  return isMarketingListPage(pathname) || isDirectorDetailPage(pathname);
}
