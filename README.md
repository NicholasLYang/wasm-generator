# WASM Generator

The beginnings of a compiler. Basically takes some simple arithmatic
expression and compiles it to a
[WAT](https://developer.mozilla.org/en-US/docs/WebAssembly/Understanding_the_text_format)
file (I'm totally convinced that this name is a reference to the [Gary
Bernhardt talk](https://www.destroyallsoftware.com/talks/wat) by the
way). Right now supports floating point and integers (but no mixing of
the two) with some extremely simple typechecking.

Uses PEG.js for the parsing. Ideally will replace with recursive
descent with some sort of shunting yard/Pratt expression parser.

In the middle of adding functions, so don't be surprised if it doesn't
work.


# Roadmap
- (current) Functions
- Statements and local variables
- Garbage collection
- Closures/arrays/maps/etc.
- A better parser
