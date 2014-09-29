This is a simple static website that attempts to teach the basics
behind the Document Object Model. It assumes learners are familiar with
basic HTML and CSS, but have no JavaScript or other imperative programming
experience.

Because learning the DOM and JavaScript syntax at the same time can be
overwhelming, the tutorial uses [Blockly][] to guide the learner and help
familiarize them with JS syntax.

## Why the DOM?

The DOM is a notoriously verbose, complex API that most people dislike. So
why teach it to people who have never even seen JavaScript before?

One reason is interest-driven: a lot of people want to learn JavaScript as
the next step in their journey to make meaningful webpages. However, most
JS tutorials focus on purely computational aspects for a long time, having
learners use `console.log` to output information that normal users will
never see. My impression is that this focus on computation over practicality
*de-contextualizes* JavaScript in a way that causes a lot of people to
lose interest quickly.

On the other hand, contextualizing imperative programming
within the realm of HTML and CSS that learners already find
useful&mdash;even at the expense of learning syntax and some 
semantics&mdash;may allow them to immediately understand the utility of 
JavaScript, providing them with enough motivation to continue learning it.

## Why not jQuery?

Good question! Teaching jQuery instead of the low-level DOM APIs is
a distinct possibility, but I found it challenging to represent jQuery
methods in a useful way in Blockly.

Also, while jQuery makes for more succinct JavaScript, I'm not sure
whether it actually helps learners understand the DOM at a conceptual
level, and I suspect it might actually make it *harder* to learn basic
imperative programming concepts due to its highly idiosyncratic nature.
But that's just a hunch.

  [Blockly]: https://code.google.com/p/blockly/source/browse/
