const editorialFields = Object.freeze([
  'school_grade',
  'favorite_subject',
  'hobby',
  'future_goal',
  'public_story',
]);

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isCompleteLocalization(localization) {
  return Boolean(
    localization &&
    editorialFields.every((field) => hasText(localization[field])),
  );
}

export function selectLocalization(beneficiary, locale) {
  const localization = beneficiary?.localizations?.[locale];
  return isCompleteLocalization(localization) ? localization : null;
}

export function getLocalizedImageAlt(image, locale) {
  const value = image?.alt_texts?.[locale];
  return hasText(value) ? value.trim() : null;
}
