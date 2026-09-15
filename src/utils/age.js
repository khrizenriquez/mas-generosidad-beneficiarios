export function calculateAge(dateOfBirth, today = new Date()) {
  if (!dateOfBirth) return null;
  const birth = new Date(`${dateOfBirth}T00:00:00`);
  if (Number.isNaN(birth.getTime()) || birth > today) return null;

  let age = today.getFullYear() - birth.getFullYear();
  const birthdayPassed =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() &&
      today.getDate() >= birth.getDate());
  if (!birthdayPassed) age -= 1;
  return age;
}
