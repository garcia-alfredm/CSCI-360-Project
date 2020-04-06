# CSCI-360-Project

## Goals
- [x] Solve original problem in high level source code such as C++
- [x] Provide an assembly language equivalent to the C++ source code
- [x] Draft pseudocode of the C++ to assembly algorithm
- [ ] Annotate Xiaojie's original source code of the demo to grasp how the HTML and JS interact dynamically (In Progress)
- [x] Devise a JS parser algorithm to capture the C++ code (using regex)
- [ ] Devise a JS conversion code to convert C++ code to assembly language equivalent (In Progress)

## Unique Specifications
- We assume `in` and `out` as pseudo assembly level commands to read keyboard input (equivalent to `cin` and `cout` in C++)
  - `in` - when user types/inputs 100, we have to retrieve 100 from the memory location that hold input for the keyboard and we predefine the keyboard's memory address
  - `out` - move value 100 to the screen? The screen is an output device and 100 is a memory location, so we move 100 to the storage address of the screen
- The starting address of the keyboard (receiving input) and screen (displaying output) are predefined/fixed

Example:
```
in eax, [1000]      eax = [1000]
out[2000], eax      [2000] = eax
```
## Project Description
#### Test Program Set Up
Ask user to continuously input random integers until the number of entered reaches 10. Each time the user enters a new integer, the current maximum and minimum integers in the saved list are output to the screen. You can simply assume that all integers are non-negtive. You can also assume that all integers are small values and can be represented by 1 byte.

- Write a program to solve the above problem in high level source code such as C and C++.
- You have to utilzie the function calls instead of using a single verbose function to do all the works.
- Translate your program into assembly language. Compare your code with https://godbolt.org/.
 
 #### Component Setup - Initial Version 1.0
- Build a memory/stack address system and CPU registers. You can assume that each assembly instruciton takes 4 bytes or 8 bytes. The registers can be accessed by different names upon the data size: only consider 32 and 64. You should consider the program counter/rip as well.
- Use a simplified input/output system. You can assume that the keyboard and screen are just a range of memory spaces.
- Create a GUI. The GUI should contains the source/assmebly editor, the register table, the stack table, the function look-up table, the memory table (stack, bss, data and text).

## Group Members
- Adam Parys
- Kareem Hussein
- Mohammad Mahmud
- Alfred Garcia

## Helpful Links
- [Xiiaojie's Demo](http://47.89.179.142/demo)
- [Software Engineering Basics](https://softwareengineering.stackexchange.com/)
- [Write an Assembler in C](https://softwareengineering.stackexchange.com/questions/324587/write-an-assembler-in-c-why-writing-a-machine-code-translator-for-a-low-level)
- [Building a Compiler](https://compilers.iecc.com/crenshaw/)
