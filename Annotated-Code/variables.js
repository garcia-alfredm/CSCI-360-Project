// The stack starts at address 2000
// The function textt starts at address 1000
var stack_start_address = 2000,
  text_start_address = 1000;

// An array storing all the 64 bit general purpose registers
var register_name_64 = ["rbp", "rsp", "rip", "rax", "rbx", "rdi", "rsi", "rdx", "rcx", "r8", "r9"];
// An array storing all the 32 bit general purpose registers
var register_name_32 = ["ebp", "esp", "rip", "eax", "ebx", "edi", "esi", "edx", "ecx", "r8d", "r9d"];

// A register object that contains the following properties
// The rbp and rsp point to the same starting address 2000
// All registers hold 0, no meaningful data or addresses
var registers = {
  "rbp": stack_start_address,
  "rsp": stack_start_address,
  "rip": 0,
  "rax": 0,
  "rbx": 0,
  "rdi": 0,
  "rsi": 0,
  "rdx": 0,
  "rcx": 0,
  "r8": 0,
  "r9": 0
};

// These arrays will be dynamically updated as JS code executes on the front-end
var function_table = [];
var address_code_table = [];
var stack_table = [];
