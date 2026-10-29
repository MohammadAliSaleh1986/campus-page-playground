// Turns a Google Drive share link (or a bare file ID) into a file ID and an embeddable player URL.
export function driveFileId(input: string): string | null {
  const s = input.trim();
  const m = s.match(/\/file\/d\/([\w-]{10,})/) ?? s.match(/[?&]id=([\w-]{10,})/);
  if (m) return m[1];
  return /^[\w-]{10,}$/.test(s) ? s : null;
}

export const driveEmbedUrl = (fileId: string) => `https://drive.google.com/file/d/${fileId}/preview`;
