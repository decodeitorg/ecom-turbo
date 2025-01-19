export const slugify = (str: string): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^a-z-]/g, '')
    .replace(/ /g, '-');
};
