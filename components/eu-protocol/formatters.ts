export const maskDate = (value: string) => {
  const cleaned = value.replace(/\D/g, "");
  let match = cleaned;
  if (cleaned.length > 2) match = `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
  if (cleaned.length > 4) match = `${match.slice(0, 5)}.${cleaned.slice(4, 8)}`;
  return match;
};

export const maskTime = (value: string) => {
  const cleaned = value.replace(/\D/g, "");
  let match = cleaned;
  if (cleaned.length > 2) match = `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}`;
  return match;
};
