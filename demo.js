// This function will highlight the current code in the Instruction Assembly Panel
// $ is abbreviated to be: document.querySelect()
// Find all HTML elements with id:#code_numberHere
// Retrieve the address name from the registers object and tap into the rip property which will retrieve the address of the current function
// For example, HTML element could have id="code_1000" which refers to the row with address 1000
function highlightCurrentCode() {
  // Change the css property by applying a highlighted background color of orange
  $("#code_" + registers["rip"]).css('background-color', '#df9857');
}

// This function will un-highlight the current code in the Instruction Assembly Panel (since we move onto the next instruction)
// $ is abbreviated to be: document.querySelect()
// Find all HTML elements with id:#code_numberHere
// Retrieve the address name from the registers object and tap into the rip property which will retrieve the address of the current function
// For example, HTML element could have id="code_1000" which refers to the row with address 1000
function undoHighlightCurrentCode() {
  // Change the css property by applying no highlighted background color
  $("#code_" + registers["rip"]).css("background-color", "");
}

// This function populates the values of each 64 bit register tag in Register Panel
// Basically display the register's contents on the HTML page
var show_registers_64 = function() {
  // Loop through the array holding the 64 bit general purpose register
  for (var x = 0; x < register_name_64.length; x++) {
    // .html: A string of HTML to set as the content of each matched element
    // Query the entire document to find the id of all 64 bit registers (found in the register panel section)
    // Extract the value of that 64 bit register from its property found in the register's object and set it as the innerHTML
    $("#" + register_name_64[x]).html(registers[register_name_64[x]]);
  }
};

// Address
var get_current_code = function() {
  for (var x = 0; x < address_code_table.length; x++) {
    // If the rip key (whose value is current address) is equal to an object's address in the address_code_table array
    if (address_code_table[x]["address"] == registers["rip"]) {
      // Return the value of the code property of that object/element in address_code_table
      // Code corresponds to instruction the assembly panel
      // For example, mov rbp,rsp would be "code" and 992 would be address
      return address_code_table[x]["code"];
    }
  }
  return "";
};


/*
  The most important part!!!!
  1. Run each code line step by step.
  2. Here, you need to build functions to handle individual operation codes.
  3. In this demo, we have "mov", "sub", "push", "pop", "ret", "leave", "call".
*/
var execute = function() {
  // If the table is empty, there is nothing to execute
  if (address_code_table.length == 0) {
    return false
  }
  /*The $.trim() function removes all newlines, spaces (including non-breaking spaces), and
  tabs from the beginning and end of the supplied string. If these whitespace characters occur in
  the middle of the string, they are preserved.*/
  // Reformat current code (the one line of assembly code) if there are whitespaces
  var current_code = $.trim(get_current_code());

  // If there is no current code, there is nothing to execute
  if (current_code.length == 0) {
    return false
  }
  // Unhighlight the instruction rip register points to
  undoHighlightCurrentCode();
  //current_code is a JavaScript string representing one line of assembly code
  //The indexOf() method returns the position of the first occurrence of a specified value in a string

  if (current_code.indexOf('mov') == 0) {           // If mov is the first word in the string
    mov_handler(current_code);                      // Take the line of assembly code and pass it to the function that handles mov
    registers["rip"] -= 4;                          // Stack grows downward, adjust instruction pointer
  }
  else if (current_code.indexOf('sub') == 0) {      // If sub is the first word in the string
    sub_handler(current_code);                      // Take the line of assembly code and pass it to the function that handles sub
    registers["rip"] -= 4;                          // Stack grows downward, adjust instruction pointer
  }
  else if (current_code.indexOf('add') == 0) {      // If add is the first word in the string
    add_handler(current_code);                      // Take the line of assembly code and pass it to the function that handles add
    registers["rip"] -= 4;                          // Stack grows downward, adjust instruction pointer
  }
  else if (current_code.indexOf('push') == 0) {     // If push is the first word in the string
    push_handler(current_code);                     // Take the line of assembly code and pass it to the function that handles push
    registers["rip"] -= 4;                          // Stack grows downward, adjust instruction pointer
  }
  else if (current_code.indexOf('pop') == 0) {      // If pop is the first word in the string
    pop_handler(current_code);                      // Take the line of assembly code and pass it to the function that handles pop
    registers["rip"] -= 4;                          // Stack grows downward, adjust instruction pointer
  }
  else if (current_code.indexOf('ret') == 0) {      // If ret is the first word in the string
    ret_handler(current_code);                      // Take the line of assembly code and pass it to the function that handles ret
  }
  else if (current_code.indexOf('leave') == 0) {    // If leave is the first word in the string
    leave_handler(current_code);                    // Take the line of assembly code and pass it to the function that handles leave
    registers["rip"] -= 4;                          // Stack grows downward, adjust instruction pointer
  }
  else if (current_code.indexOf('call') == 0) {     // If call is the first word in the string
    function_handler(current_code);                 // Take the line of assembly code and pass it to the function that handles call
  }
  else {
    registers["rip"] -= 4;                          // Stack grows downward, adjust instruction pointer
  }
  // rip register is adjusted so that it points to the next instruction
  // The next instruction is highlighed
  highlightCurrentCode();
  // Update the stack panel (located in opcode.js)
  update_stack_table_view();
  // Display the updated registers contents
  show_registers_64();
  return true
}

/*
  initial the stack, the registers
  1.  Return address for "main" function is assumed to be 200.
  2.  The rbp of the function that calls the main function is assumed to be 3000.
  3.  The current stack/stack start address is assumed to be 2000.
  4.  The text section is started at 1000.
*/
var initial_stack_table_and_registers = function() {
  stack_table = [];
  stack_start_address = 2000;
  text_start_address = 1000;
  registers = {
    "rbp": 3000,
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
  }
  update_stack_table_value(registers["rsp"], 200, 8); // push return address for main function, assumed 200
  // registers["rsp"] -= 8;
  // update_stack_table_value(registers["rsp"], 3000, 8);  // push the rbp of the function that calls the main function, assumed 3000
}


/*
  initial the address system for all the code lines and create the function look-up table
  1. each function is assumed 4 bytes
  2. allocate each code line an address
  4. save function starting address and function name
  3. target the "main" function
*/
var initial_code_address = function() {
  // Address code table refers to the assembly stack panel
  address_code_table = [];    // initialize to empty
  function_table = [];        // function table is initialized to empty
  // Query the document to find the HTML element with id="address_code_table" (found in <tbody> HTML element of the assembly instruction panel code)
  // Set its innerHTML to empty
  $("#address_code_table").html("");
  // Query the document to find the HTML element with id="assemblyCode"
  // This HTML element is the <textarea> that holds the literal, static assembly code
  // Store the entirety of the assembly code within textarea and store it inside assemblyCode
  var assemblyCode = document.getElementById('assemblyCode');
  //
  var lines = assemblyCode.value.split("\n");
  var length = lines.length;
  for (var x = 0; x < length; x++) {
    address_code_table.push({
      "address": text_start_address,
      "code": lines[x]
    });
    if (lines[x].indexOf("main") == 0) { // for main function, set RIP register
      function_table.push({
        "label": lines[x].substring(0, lines[x].length - 1),
        "address": text_start_address
      })
      registers["rip"] = text_start_address;
    }
    if (lines[x].indexOf("fun_") == 0) { // for other functions, push into function table
      function_table.push({
        "label": lines[x].substring(0, lines[x].length - 1),
        "address": text_start_address
      })
    }
    $("#address_code_table").append("<tr id='code_" + text_start_address + "'><td>" + text_start_address + "</td><td>" + lines[x] + "</td></tr>");
    text_start_address -= 4;
  }
  $("#function_address_table").html("");
  for (var x = 0; x < function_table.length; x++) {
    $("#function_address_table").append("<tr><td>" + function_table[x]["label"] + "</td><td>" + function_table[x]["address"] + "</td></tr>")
  }
}

/*
  load assembly codes into memory, do the following:
  1.  initial the stack, the registers
  2.  initial the address system for all the code lines and create the function look-up table, target the "main" function
  3.  set the RIP register to "main" function
*/
var load = function() {
  initial_stack_table_and_registers();
  initial_code_address();
  highlightCurrentCode();
  update_stack_table_view();
  show_registers_64();
  $("#assemblyCode").hide();
  $("#address_code").show();
}

var testRegExClick = function() {
  var cppCode =  $("#cppCode").val();
  var test = regExTest(cppCode);          // Function found in CPPReader.js
  $('#translateAssemblyCode').val(test);
}
var convertToAsmClick = function() {
  var cppCode =  $("#cppCode").val();
  var assemblyCode = convertToAssembly(cppCode);
  //$('#translateAssemblyCode').val("TODO: Implement convertToAsm() in demo.js to call convertToAssembly(cppCode) and Implement functions in CPPReader.js");
   $('#translateAssemblyCode').val(assemblyCode);

}


/*
  show assembly editor
*/
var edit = function() {
  $("#assemblyCode").show();
  $("#address_code").hide();
}

/*
  document.ready is just like the main function in C/C++ and Java
*/
$(document).ready(function() {
  show_registers_64(registers);
  /*
      run "execute" function when click on button "step"
  */
  $("#step").click(function() {
    execute();
  });
});
