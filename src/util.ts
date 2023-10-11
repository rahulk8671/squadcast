interface Occurrence {
    start: number;
    end: number;
}

interface WordOccurrences {
    count: number;
    occurrences: Occurrence[];
}

const util = {
    findWordOccurrences: (inputString: string, word: string): WordOccurrences => {
        const regex = new RegExp(word, 'g');
        let match;
        const occurrences: Occurrence[] = [];
      
        while ((match = regex.exec(inputString)) !== null) {
            const start = match.index;
            const end = start + word.length - 1;
            occurrences.push({ start, end });
        }
      
        const count = occurrences.length;
        return { count, occurrences };
    },

    getWordBasedOnCursorPosition: (inputString: string, cursorPosition: number): string => {
        // Find the start of the word (or non-word character) before the cursor
		let wordStart = cursorPosition || 0
		while (wordStart > 0 && /\S/.test(inputString.charAt(wordStart - 1))) {
			wordStart--;
		}

		// Find the end of the word after the cursor
		let wordEnd = cursorPosition || 0
		while (wordEnd < inputString.length && /\S/.test(inputString.charAt(wordEnd))) {
			wordEnd++;
		}

		// Extract the word under the cursor
		const wordUnderCursor = inputString.slice(wordStart, wordEnd);

        return wordUnderCursor;
    },

    getStartEndOfWord: (occurrences: Occurrence[], cursorPosition: number): { start: number, end: number } => {
        // check cursor falls in which occurrence and get start end value
		let start = 0
		let end = 0
		occurrences.forEach((occurrence) => {
			if (cursorPosition >= occurrence.start && cursorPosition <= occurrence.end) {
				start = occurrence.start
				end = occurrence.end
			}
		})
        return {
            start,
            end
        }
    }
}

export default util;