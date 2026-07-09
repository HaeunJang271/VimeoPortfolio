export function isMarketingListPage(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname === "/directors" ||
    pathname === "/work" ||
    pathname === "/contact"
  );
}
