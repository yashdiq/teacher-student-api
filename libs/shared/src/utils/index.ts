export const extractMentionedEmails = (text: string): string[] => {
  const emailRegex = /@([\w.-]+@[\w.-]+\.\w+)/g;
  const matches = [...text.matchAll(emailRegex)];
  return matches.map((match) => match[1]);
};
