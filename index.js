chalk = require('chalk');
flesch = require('flesch');
fleschKincaid = require('flesch-kincaid');
smog = require('smog-formula');
wordcount = require('wordcount');
syllable = require('syllable');
archaisms = require('american-legal-archaisms');

example1 = "I am herewith returning the stipulation to dismiss in the above entitled matter; the same being duly executed by me."
console.log(chalk.blue(example1));

counts = {
  'sentence': 1,
  'word': wordcount(example1),
  'syllable': syllable(example1)
};
console.log(chalk.white("Flesch: " + flesch(counts)));
console.log(chalk.white("Flesch-Kincaid: " + fleschKincaid(counts)));
console.log(chalk.white("SMOG: " + smog(counts)));
