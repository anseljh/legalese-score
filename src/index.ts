const Spearman = require("spearman-rho");
import chalk from "chalk";
import flesch from "flesch";
import fleschKincaid from "flesch-kincaid";
import smog from "smog-formula";
import wordcount from "wordcount";
import syllable from "syllable";
import async from "async";
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
  private counts: Counts | null;

  scores?: Score;
  sentenceRegex: RegExp;
  wordRegex: RegExp;
  constructor(
    text: string,
    sentenceRegex: RegExp = /(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s/g,
    wordRegex = /[\w]*[aeiou]{1,}(?<=[bcdfghjklmnpqrstvwxyz]*)(?<=[aeiou]*)[^aeiou\p{P}\s]+[\w]{2,}/giu,
  ) {
    this.text = text;
    this.counts = null;
    this.sentenceRegex = sentenceRegex;
    this.wordRegex = wordRegex;

    this.getCounts = this.getCounts.bind(this);
    this.getScores = this.getScores.bind(this);
    this.getArchaisms = this.getArchaisms.bind(this);
  }

  /**
   * Returns the sentence, syllable, and word count of the text
   * @return {Counts}
   */
  async getCounts() {
    
    const returnCountsSaved = async.ensureAsync ((callback:
        async.AsyncResultCallback<Counts | null, Error | null>
      ) => {
        callback(null, this.counts);
    });
    if(this.counts) {
      return  (new Promise<
        Counts | null
        >( function (resolve, reject) {
        returnCountsSaved((err, result) => {
          if(err) {
            reject(err)
          }
          resolve(result)
        })
      }))
    }  else {
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
  
      const correlateEveryArchaismForEveryWord = 
        // inputArrayWordsToCharNumbs.map(async (word) => {
        //   const wordCoeffArray = await correlationCoefficients.map((archaism) => {
        //     if (word?.length !== archaism?.length) {
        //       return 0;
        //     } else {
        //       const spearman = new Spearman(word, archaism);
  
        //       return spearman.calc() as Promise<number>;
        //     }
        //   });
        //   return Promise.all(wordCoeffArray);
        // }),
       await  async.map<number[] | null, number[],Error | null>(
          inputArrayWordsToCharNumbs,
          async.asyncify(async (word) => {
            // const wordCoeffArray = await correlationCoefficients.map((archaism) => {
            //   if (word?.length !== archaism?.length) {
            //     return 0; 
            //   } else {
            //     const spearman = new Spearman(word, archaism);
                
            //     return spearman.calc() as Promise<number>;
            //   }
            // });
            // return Promise.all(wordCoeffArray);

            return async.map<number[] | null, number,Error | null>(
              correlationCoefficients,
              async.asyncify(async (archaism) => {
                if (word?.length !== archaism?.length) {
                  return 0;
                } else {
                  const spearman = new Spearman(word, archaism);
                  return spearman.calc() as Promise<number>;
                }
              }
              )
            );
          }),
        );


      

      // const correlateEveryArchaismForEveryWord = await async.map<number[] | null, number[],Error | null>(
      //   inputArrayWordsToCharNumbs,
      //   (word, callback) => {
      //     // const wordCoeffArray = correlationCoefficients.map((archaism) => {
      //     //   if (word?.length !== archaism?.length) {
      //     //     return 0;
      //     //   } else {
      //     //     return Spearman(word, archaism);
      //     //   }
      //     // });
      //      const wordCoeffArray = correlationCoefficients.map((archaism) => {
      //       if (word?.length !== archaism?.length) {
      //         return 0;
      //       } else {
      //         return  new Spearman(word, archaism).calc();
      //       }
      //     });
      //     callback(null, wordCoeffArray);
      //   },
         
      // );



         
 
      const wordCorrelationSum = 
          await async.map<number[] | null, number,Error | null>(
            correlateEveryArchaismForEveryWord,
            async.asyncify(async (wordCoeffArray) => {
              let maxCoeif = 0;
              wordCoeffArray.forEach((coefficient) => {
                if (coefficient > maxCoeif) {
                  maxCoeif = coefficient;
                }
              }
              
              );
              return maxCoeif;
            }),
          );
            

  
      const maxCorrelation = Math.max(...wordCorrelationSum);
      const indexOfMaxCorrelation = wordCorrelationSum.indexOf(maxCorrelation);
  
      const minCorrelation = Math.min(...wordCorrelationSum);
      const indexOfMinCorrelation = wordCorrelationSum.indexOf(minCorrelation);
  
      const avg =
        wordCorrelationSum.reduce((acc, curr) => {
          return acc + curr;
        }, 0) / wordCorrelationSum.length;
  
   
       const counts = {
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

      this.counts = counts;
      return counts;
    }
    
  }
  getFleschScore() {
    return flesch(this.text);
  }

  async getScores() {
    const returnSavedScores = async.ensureAsync(( callback:

      async.AsyncResultCallback<Score | null, Error | null>
    ) => {
      callback(null, this.scores);
    });
 
  

    const getCountsMemoized = async.memoize(
      (callback:
          async.AsyncResultCallback<Counts | null, Error | null>
        ) =>{
        this.getCounts().then((counts) => {
          callback(null, counts);
        }).catch((err) => {
          callback(err, null);
        }
        )
      }

    ) ;

  

    if (this.scores) {
      return (new Promise( function (resolve, reject) {
        returnSavedScores((err, result) => {
          if(err) {
            reject(err)
          }
          resolve(result)
        })
      }))
    } else {
      return  async.waterfall<
    
        Score |  null
      >([
        function (callback: 
            (err: Error | null, result?: Counts | null) => void
          ) {
          getCountsMemoized(callback);
        },
        function (counts: Counts | undefined |null, callback?: (err: Error | null, result: Score | null) => void) {
          
          async.parallel(
            {
              flesch: function (cb_parallel: (err: Error | null, result: number | null) => void) {
                cb_parallel(null, flesch(counts));
              },
              "flesch-kincaid": function ( cb_parallel: (err: Error | null, result: number | null) => void) {
                cb_parallel(null, fleschKincaid(counts));
              },
              "smog": function (cb_parallel: (err: Error | null, result: number | null) => void) {
                cb_parallel(null, smog(counts));
                          },

            },
            function (err: Error | null, results: Score | null) {
        
              callback(err, results);
            },
          )
        }
      ])
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
