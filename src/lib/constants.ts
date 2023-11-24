export const BREAKING_CHANGE_REGEX = /BREAKING CHANGE[S]?:?([\s\S]*)/;
export const CLOSE_REGEX =
  /(?:close(?:s|d)?|fix(?:es|ed)?|resolve(?:s|d)?)\s+#(\d+)/i;
export const TITLE_REGEX = /^([^(]+)\s*\(([^)]+)\):?\s+(.+)/;

export const NEW_LINE = '\n';
