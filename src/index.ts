const Spearman = require("spearman-rho");
import chalk from "chalk";
import flesch from "flesch";
import fleschKincaid from "flesch-kincaid";
import smog from "smog-formula";
import wordcount from "wordcount";
import syllable from "syllable";
import _archaism from "american-legal-archaisms/index.json";

/**
 * @interface Counts
 * @property {number} sentence - The number of sentences in the text, adjustable through specifying a custom sentenceRegex when construction a Legalese score class
 * @property {number} word - The number of words in the text
 * @property {number} syllable - The number of syllables in the text
 */
interface Counts {
  sentence: number;
  word: number;
  syllable: number;
  archaisms_correlation: {
    avg_correlation: number;
    max_correlation: number;
    min_correlation: number;
    most_archaic_word: string;

    most_modern_word: string;
  };
}

type Score = {
  flesch: number;
  "flesch-kincaid": number;
  smog: number;
};

class Legalese {
  text: string;
  private counts?: Counts;

  scores?: Score;
  sentenceRegex: RegExp;
  wordRegex: RegExp;
  constructor(
    text: string,
    sentenceRegex: RegExp = /(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s/g,
    wordRegex = /[\w]*[aeiou]{1,}(?<=[bcdfghjklmnpqrstvwxyz]*)(?<=[aeiou]*)[^aeiou\p{P}\s]+[\w]{2,}/giu,
  ) {
    this.text = text;

    this.sentenceRegex = sentenceRegex;
    this.wordRegex = wordRegex;
  }

  /**
   * Returns the sentence, syllable, and word count of the text
   * @return {Counts}
   */
  async getCounts() {
    const text = this.text;
    const input = text.matchAll(this.wordRegex);
    const inputArray = (Array.from(input) || [])
      .map((match) => {
        return match[0];
      })
      .map(
        (word) => {
          return word.toLowerCase();
        }, //remove duplicates
      )
      ?.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });

    const inputArrayWordsToCharNumbs = inputArray.map((word) => {
      return word.split("").map((char) => {
        return char.charCodeAt(0);
      });
    });

    const correlationCoefficients = _archaism.map((archaism) => {
      return archaism.split("").map((char) => {
        return char.charCodeAt(0);
      });
    });

    const correlateEveryArchaismForEveryWord = await Promise.all(
      inputArrayWordsToCharNumbs.map(async (word) => {
        const wordCoeffArray = await correlationCoefficients.map((archaism) => {
          if (word?.length !== archaism?.length) {
            return 0;
          } else {
            const spearman = new Spearman(word, archaism);

            return spearman.calc() as Promise<number>;
          }
        });
        return Promise.all(wordCoeffArray);
      }),
    );

    const wordCorrelationSum = correlateEveryArchaismForEveryWord.map(
      (word) => {
        let maxCoeif = 0;
        word.forEach((coefficient) => {
          if (coefficient > maxCoeif) {
            maxCoeif = coefficient;
          }
        });
        return maxCoeif;
      },
    );

    const maxCorrelation = Math.max(...wordCorrelationSum);
    const indexOfMaxCorrelation = wordCorrelationSum.indexOf(maxCorrelation);

    const minCorrelation = Math.min(...wordCorrelationSum);
    const indexOfMinCorrelation = wordCorrelationSum.indexOf(minCorrelation);

    const avg =
      wordCorrelationSum.reduce((acc, curr) => {
        return acc + curr;
      }, 0) / wordCorrelationSum.length;

 
    this.counts = {
      sentence: text.split(this.sentenceRegex).length,
      word: wordcount(text),
      syllable: syllable(text),
      archaisms_correlation: {
        avg_correlation: avg,
        max_correlation: maxCorrelation,
        min_correlation: minCorrelation,
        most_archaic_word: inputArray[indexOfMaxCorrelation],
        most_modern_word: inputArray[indexOfMinCorrelation],
      },
    };

    return this.counts;
  }
  getFleschScore() {
    return flesch(this.text);
  }

  async getScores() {
    if (this.scores) {
      return this.scores;
    } else {
      const counts = this.counts
        ? Promise.resolve(this.counts)
        : this.getCounts();

      this.counts = await counts;

      this.scores = {
        flesch: flesch(this.counts),
        "flesch-kincaid": fleschKincaid(this.counts),
        smog: smog(this.counts),
      };
      return this.scores;
    }
  }

  toString() {
    return Object.keys(this.getScores)
      .map((score) => {
        return chalk.white(`${score}: ${this.scores![score as keyof Score]}`);
      })
      .join("\n");
  }

  getArchaisms() {
    return _archaism;
  }
}

export default Legalese;
