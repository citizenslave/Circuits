# Circuits

An EXTREMELY quick and dirty start to a clone of Sebastian Lague's [Digital Logic Sim](https://sebastian.itch.io/digital-logic-sim) now for the JavaScript Console...

The test script currently expands the default library of NAND, INPUT, and OUTPUT components by combining and saving them into NOT, AND, and OR gates and then laying out the `currentBoard` for an XOR gate.

The serialization hasn't been fully tested as in "can I actually dump this out to text and read it back in".  I suspect that doesn't actually work.  The XOR gate works though and it's 2-3 layers deep with saved components so as long as the script is rebuilding and saving them each time, it works.  That isn't sustainable though so this needs a more robust platform than a web browser JS interpreter with proper access to the filesystem to save the `componentLibrary` when it's updated.

That's before we even start on the absolutely atrocious excuse for a UX.  The fucking thing runs in the JavaScript Dev Console.
