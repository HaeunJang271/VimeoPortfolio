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

export function isWorkDetailPage(pathname: string): boolean {
  return pathname.startsWith("/work/") && pathname !== "/work";
}

export function isSiteChromePage(pathname: string): boolean {
  return (
    isMarketingListPage(pathname) ||
    isDirectorDetailPage(pathname) ||
    isWorkDetailPage(pathname)
  );
}
