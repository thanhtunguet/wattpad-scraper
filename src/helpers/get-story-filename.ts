export function getStoryFilename(url: string): string {
  return unescape(url.split('/').splice(-1)[0] + '.html');
}
