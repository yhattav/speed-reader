export function splitWord(word: string) {
  const length = word.length;
  const centerIndex = Math.floor((length - 1) / 2);
  return {
    before: word.slice(0, centerIndex),
    center: word[centerIndex],
    after: word.slice(centerIndex + 1)
  };
}

export function splitWords(text: string): string[] {
  return text.split(/\s+/).filter(word => word.length > 0);
}

// Add any other string parsing functions here

