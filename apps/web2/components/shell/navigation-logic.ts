export type NavigationTargetLike = {
  href: string;
  children?: ReadonlyArray<{ href: string }>;
};

export function getNavigationTargetHref(item: NavigationTargetLike) {
  return item.children?.[0]?.href ?? item.href;
}

export function getDesktopSelectionSync(
  activeChildParentId: string | null,
  selectedParentId: string | null,
) {
  if (!activeChildParentId) {
    return null;
  }

  return {
    parentChanged: activeChildParentId !== selectedParentId,
    selectedParentId: activeChildParentId,
  };
}
