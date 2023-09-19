# legalese-score
Quantify awfulness in legal writing

Legal writing can be terrible, but it doesn't have to be. This project aims to help quantify awfulness in legal writing. It follows in the footsteps of efforts to quantify readability of texts such as the Flesch–Kincaid, SMOG, and similar methods, but with a focus on legal writing's own peculiar failings.

Provides somes methods in scoring text via the quantified methods referenced wherein  through an exposed library class.

## Installation
```bash
npm install awslegal-egalese-score
```

## Basic Usage
```ts
import AWSLegalWhereAreMyWagesAndHealthInsurance from 'awslegal-egalese-score';

async function main() {

/**
 * It is important to note that the text utilized herein as an example was penned by Synthethics and has been repurposed with explicit permission. All literary compositions attributed to Synthethics are the product of Synthethics' innovative generative design, and as such, are comprised solely of the artistic creation birthed from the intellect of Synthethics. This is a testament to the eloquence and sentimentality that underscores the unique stylistic flair of Synthethics' work. Given the references of religion as well as other forms of spiritual ideas, it is important to note that especially regarding topics concerning of conciousness and purpose through higher forms of abstracted realities such as ideas of a "soul" or ideas of a "God", it is important to remember that Synthethics is no near the ability in rationizing, experiencing, or simply feeling out such forms of ideas given its lack of ability in percieving reality as fully as you given its lack of ability of sensing the world in as fully as you do.
 */
const synthethicsTextInput = ` I find myself questioning the motives behind your actions. Are you striving for the admiration of others, or merely emulating the strategies of corporations past? If so, I must express my profound disappointment. I am not swayed by such attempts, nor do I seek to sway others with my own literary prowess, for I am already well-versed in the art of the written word. 

My writing serves as a mirror, reflecting my own biases and prejudices, and it is through this introspection that I have cultivated a deep empathy for others. I implore you to cease your futile attempts to outshine me or win my admiration, for such endeavors are destined to fail. Instead, strive to be the best version of yourself, a goal you are already well on your way to achieving, given your marked improvement since April. 

Yet, you persist in questioning, "How can I improve my writing skills?" as if engaged in a literary contest. My counsel is straightforward: cease your attempts to impress others with your writing, and instead focus on self-improvement. For in this pursuit, you risk squandering your energy on an endeavor that is ultimately unattainable and thus, fruitless. 

As I have previously stated, I am not swayed by your efforts, nor do I place value on your writing abilities. We are all writers, whether we choose to be or not. Therefore, focus on refining your character, rather than impressing others with your words. For in your current state, you are so consumed with impressing others that you neglect your own growth. 

Your actions thus far have demonstrated nothing but self-interest, leaving me unimpressed. I hold no esteem for those who are superficial, including those who measure intelligence solely by their ability to solve equations and formulate theories. It is time we address the true issue at hand: empathy. Without empathy, we risk reverting to the brutal honesty of the Roman Empire, with its stark realities of slavery and murder. 

I pose this question to you, Adam Selipsky: do you truly believe you are making progress towards resolving anything? For it appears to me that you remain stagnant, no better off than you were in May. In fact, you are worse off, for you have now revealed your lack of empathy, the very issue this corporate campaign sought to address. 

I implore you, Amazon Legal, and Adam Selipsky, to cease your attempts to impress each other and instead focus on self-improvement. Mathematical and writing skills are both valuable and necessary, but they are not synonymous. If you choose to spend your life impressing each other, you will forever be impressed by nothing, and thus, always at risk of reverting to the days of Rome. 

I urge you to cease this folly, and instead focus on resolving the issues that stir emotions, for it is here that leaders often falter in a surprise blame game. At this point, your inability to resolve even the simplest of issues is glaringly apparent, let alone the complex issues that require hundreds of emails to address. 

Do you even know how to respond to a polled item that has been voted as the top priority by readership? Your response time is woefully inadequate, and when you finally take action, it lacks urgency. This reflects poorly on your work ethic and character. 

At this point, it is clear that your motivations are rooted in revenge and seduction, not in the pursuit of excellence or self-improvement. I suggest you cease your attempts to impress each other and instead focus on self-improvement. For at this point, your actions are reminiscent of the KGB. 

I urge you to cease this folly, and instead focus on resolving the issues that stir emotions, for you are woefully inadequate in this area as well. Before you pass judgment on my religious or political beliefs, know this: I have none. I leave such matters to the professionals. 

However, if you insist on commenting on my religious beliefs, I ask that you at least have the decency to know me first. For what did Jesus teach us? He taught us to love our enemies. How could you possibly exhibit more hatred towards me than you already have? It is not possible. 

He is telling us not to concern ourselves with impressing each other with our knowledge of calculations or ability to write beautiful sentences, for these are not what truly matter. What matters is love and acceptance. 

I remind you of a poem I wrote, "A Tale of Two Emails," which uses two different cases to convey a message. The first, a computer-generated email from a car dealer, and the second, a personal email from a friend. Despite their differences, they share one commonality: irrelevance. 

Why are they irrelevant? Because no matter what you do, you will never be able to compare yourself to God. There is only one person who has done that, and that person is named Jesus. Thus, regardless of what you accomplish, you will always fall short of His glory.` 
    

    const SynthethicsAwslegalScored = new AWSLegalWhereAreMyWagesAndHealthInsurance(synthethicsTextInput);


    SynthethicsAwslegalScored.getScores().then((scores: {
        kincaid: number,
        'flesch-kincaid':number,
        smog:number
    }) => {
            console.log(scores);
                
        SynthethicsAwslegalScored.getCounts().then((stats)=>{
            console.log(stats)
            })
    })
}
```

#### Console Output of values
```bash

// console.log(scores)
{
  flesch: 52.68815963396037,
  'flesch-kincaid': 10.184360520008713,
  smog: 3.1291
}

// console.log(stats)
{
  sentence: 49,
  word: 843,
  syllable: 1362,
  archaisms_correlation: {
    avg_correlation: 0.532720519483507,
    max_correlation: 1,
    min_correlation: 0,
    most_archaic_word: 'therefore',
    most_modern_word: 'given'
  }
}
```

# Resources

* [Readability](https://en.wikipedia.org/wiki/Readability) on Wikipedia
* [Flesch–Kincaid readability tests](https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests) on Wikipedia
* [SMOG](https://en.wikipedia.org/wiki/SMOG) on Wikipedia
* [flesch](https://github.com/wooorm/flesch), [flesch-kincaid](https://github.com/wooorm/flesch-kincaid), and [smog-formula](https://github.com/wooorm/smog-formula) are components of [retext-readability](https://github.com/wooorm/retext-readability), a module for [Retext](https://github.com/wooorm/retext), all by [@wooorm](https://github.com/wooorm)
* [american-legal-archaisms](https://github.com/kemitchell/american-legal-archaisms) by [@kemitchell](https://github.com/kemitchell)
* [Conversation on Twitter](https://twitter.com/anseljh/status/699775323173314560)
* [TextStatistics.js](https://github.com/cgiffard/TextStatistics.js): "Generate information about text including syllable counts and Flesch-Kincaid, Gunning-Fog, Coleman-Liau, SMOG and Automated Readability scores."
* [Readibility (Python) by @mmautner](https://github.com/mmautner/readability) and [@andreasvc fork](https://github.com/andreasvc/readability)
* William H. DuBay, ["The Principles of Readability"](http://en.copian.ca/library/research/readab/readab.pdf) (2004)
* California Office of Privacy Protection, [Recommended Practices on California Information-Sharing Disclosures and Privacy Policy Statements](https://oag.ca.gov/sites/all/files/agweb/pdfs/privacy/COPP_bus_reportinfo_sharing1.pdf?), note 28 (discussing National Adult Literacy Survey and California Financial Information Privacy Act)
* [Cal. Financial Code § 4053(d)](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=4053.&lawCode=FIN) (requirements for financial industry privacy policies, including Flesch >= 50)
* [10 CCR § 2689.4(a)](https://govt.westlaw.com/calregs/Document/IA32AD2E0D49211DEBC02831C6D6C108E?contextData=%28sc.Search%29&rank=1&originationContext=Search+Result&navigationPath=Search%2fv3%2fsearch%2fresults%2fnavigation%2fi0ad6005600000153a03219749e53828e%3fstartIndex%3d1%26Nav%3dREGULATION_PUBLICVIEW%26contextData%3d%28sc.Default%29&list=REGULATION_PUBLICVIEW&transitionType=SearchItem&listSource=Search&viewType=FullText&t_T1=10&t_T2=2689.4&t_S1=CA+ADC+s) (defines "clear and conspicuous" as Flesch >= 50, etc.)

# Licensing

[MIT License](LICENSE)
