import i18next from 'i18next';

/** Translates a backend auth error `code` (e.g. "EMAIL_IN_USE") via the authErrors.* locale keys. */
export function translateAuthError(code: string | undefined, fallback: string): string {
  if (!code) return fallback;
  const translated = i18next.t(`authErrors.${code}`);
  return translated === `authErrors.${code}` ? fallback : translated;
}
