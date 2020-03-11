# CSCI-360-Project

## Goals
- [x] Solve original problem in high level source code such as C++
- [x] Provide an assembly language equivalent to the C++ source code
- [x] Draft pseudocode of the C++ to assembly algorithm
- [ ] Annotate Xiaojie's original source code of the demo to grasp how the HTML and JS interact dynamically (In Progress)
- [ ] Devise a JS parser algorithm to convert the C++ code into assembly language (In Progress)

## Unique Specifications
- We assume `in` and `out` as pseudo assembly level commands to read keyboard input (equivalent to `cin` and `cout` in C++)
- The starting address of the keyboard (receiving input) and screen (displaying output) are fixed

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
