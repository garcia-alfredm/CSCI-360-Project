var ifRegEx = /if\(.*?\)\s*\{?/; //matches if(anything) and any white space and optional "{"
var elseRegEx = /else\s*\{?/;    //matches else and optional "{"
var functionHeaderRegEx = /(\w+\s+)?\w+\s+\w+\s*\(((\s*const\s)?\s*\w+((\s*(\*|&)\s*)|\s+)\w+\s*(,(\s*const\s)?\s*\w+((\s*(\*|&)\s*)|\s+)\w+\s*)*)?\)\s*\{/; //matches optional access modifier with 
//at least one white space and return type with at least one white space and function name with any number of white space 
//and "(" with any number of white space and any number of parameters (any word with at least one white space and anyword 
//with any number of white space) separated by ","and ")" and any number of white space and "{"
var forLoopRegEx = /for\s*\(.*\)\s*\{?/; //matches for(anyting) and optional "{"
var instructionRegEx = /.*;/; 	//matches anything ending with ";"
//only useful when all other regular expressions failed
var closeBracketRegEx = /\}/;
/*
At this point, this project is able to recognize some C++ code. Does not recognize comments or while loops. 
Does something wierd when it reaches the end of the C++ code. It has trouble removing the last line of cppCode 
and I am forced to use substring(1) to removed unrecognized characters one by one. This is not ideal and a fix will be needed.
*/
function regExTest(cppCode) {
	var result = '';
	while (cppCode.length > 0 ) {
		var line = getFirstLine(cppCode);
		var lineType = getLineType(line);
		result = result + (lineType) + ('\t') + (line) + ('\n');
		if(line.length == 0){
			cppCode = cppCode.substring(1);	//This is a quick fix to reach the end of cppCode when a character is not recognized.
		}
		cppCode = cppCode.replace(line, '');
	}
	return result;
}

var getFirstLine = function (cppCode) {
	cppCode = cppCode.replace(/^\s+/g, ""); //removes leading whitspace
	if (cppCode.search(ifRegEx) == 0) {
		return ifRegEx.exec(cppCode)[0];
	} else if (cppCode.search(elseRegEx) == 0) {
		return elseRegEx.exec(cppCode)[0];
	} else if (cppCode.search(functionHeaderRegEx) == 0) {
		return functionHeaderRegEx.exec(cppCode)[0];
	} else if (cppCode.search(forLoopRegEx) == 0) {
		return forLoopRegEx.exec(cppCode)[0];
	} else if (cppCode.search(closeBracketRegEx) == 0) {
		return closeBracketRegEx.exec(cppCode)[0];
	} else if (cppCode.search(instructionRegEx) == 0) {
		return instructionRegEx.exec(cppCode)[0];
	} else return "";
}

var removeFirstLine = function (cppCode) {
	cppCode = cppCode.replace(/^\s+/g, ""); //removes leading whitspace
	cppCode = cppCode.replace(getFirstLine(cppCode), "");
	return cppCode;
}

var getLineType = function (line) {
	if (ifRegEx.test(line)) {
		return 'if statment';
	} else if (elseRegEx.test(line)) {
		return 'else statment';
	} else if (functionHeaderRegEx.test(line)) {
		return 'function header';
	} else if (forLoopRegEx.test(line)) {
		return 'for loop';
	} else if (closeBracketRegEx.test(line)) {
		return 'close bracket';
	} else if (instructionRegEx.test(line)) {
		return 'instruction';
	} else return 'empty';
}
function convertToAssembly(cppCode) {
	var result = '';
	var lableNum = 0;
	var returnType = '';
	var labelNumberStack = [];
	var nestedStatementStack = [];
	var forLoopIncrentStack = [];
	var loopJumpStack = [];
	var line = '';
	while (cppCode.length != 0) {
		line = readFirstLine(cppCode);
		cppCode = cppCode.replace(line, '');
		var lineType = getLineType(line);
		if (lineType == 'function header') {
			let memSize = getMemSize(cpp);
			result.concat('\n').concat(writeFunctionHeader(line, memSize));
			returnType = getReturnType(line);
		} else if (lineType == 'else') {
			result = removeLastLine(result);
			result.concat('\n').concat(writeJump(lableNum));
			labelNumberStack.push(lableNum);
			lableNum--;
			result.concat('\n').concat(writeLable(lableNum));
			lableNum += 2;
			nestedStatementStack.push('else');
			if (hasNoOpenBracket(line)) {
				nestedStatementStack.push('no brackets');
			}
		} else if (lineType == 'if statment') {
			result.concat('\n').concat(writeIfStatment(line, lableNum));
			nestedStatementStack.push('if statement');
			labelNumberStack.push(labelNum);
			labelNum++;
			if (hasNoOpenBracket(line)) {
				nestedStatementStack.push('no brackets')
			}
		} else if (lineType == 'for loop') {
			result.concat('\n').concat(writeLable(labelNum));
			loopJumpStack.push(labelNum);
			labelNum++;
			result.concat('\n').concat(writeForLoop(line, lableNum));
			nestedStatementStack.push('for loop');
			labelNumberStack.push(labelNum);
			labelNum++;
			forLoopIncrentStak.push(getForLoopInrement(line));
			if (hasNoOpenBracket(line)) {
				nestedStatementStack.push('no brackets');
			}
		} else if (lineType == 'instruction') {
			result.concat('\n').concat(writeInstruction(line));
			while (nestedStatementStack.lastIndexOf('no brackets') == (nestedStatementStack.length - 1)) {
				nestedStatementStack.pop();
				if (nestedStatementStack.lastIndexOf('for loop') == (nestedStatementStack.length - 1)) {
					result.concat('\n').concat(writeIncrement(forLoopIncrentStack.pop()));
					result.concat('\n').concat(writeJump(loopJumpStack.pop()));
				}
				result.concat('\n').concat(writeLabel(labelNumberStack.pop()));
				nestedStatementStack.pop();
			}
		} else if (lineType == 'close bracket') {
			if (nestedStatementStack.length > 0) {
				if (nestedStatementStack.lastIndexOf('for loop') == (nestedStatementStack.length - 1)) {
					result.concat('\n').concat(writeIncrement(forLoopIncrentStack.pop));
					result.concat('\n').concat(writeJump(loopJumpStack.pop()));
				}
				result.concat('\n').concat(WriteLabel(labelNumberStack.pop()));
				nestedStatementStack.pop();
				while (nestedStatementStack.lastIndexOf('no brackets') == (nestedStatementStack.length - 1)) {
					nestedStatementStack.pop();
					if (nestedStatementStack.lastIndexOf('for loop') == (nestedStatementStack.length - 1)) {
						result.concat('\n').concat(writeIncrement(forLoopIncrentStack.pop));
						result.concat('\n').concat(writeJump(loopJumpStack.pop()));
					}
					result.concat('\n').concat(WriteLabel(labelNumberStack.pop()))
					nestedStatementStack.pop();
				}
			} else {
				result.concat('\n').concat(WriteEndOfFunction(returnType))	//no nested statement means end of function 
			}
		}
	}
	return result;
}

function getForLoopInrement(line) {
	var part1RegEx = /.*;.*;\s*/; 	//part before the increment
	var part2RegEx = /\s*\).*/;		//part after the increment
	return line.replace(part1RegEx, "").replace(part2RegEx, "");	//returns the increment part
}
function hasNoOpenBracket(line) {
	return !(/.*\{/.test(line));
}
function writeIncrement(increment) {
	//TODO write the for loop increment
	return '';
}
function writeInstruction(line) {
	//TODO writes an instruction in assembly. Difficulty level hard.
	return '';
}
function writeIfStatment(line, labelNum) {
	//TODO writes the if statement condition and jump. Difficulty level: medium
	return '';
}
var label = function writeLable(lableNum) {
	return `L${lableNum}:`;
}
var jump = function writeJump(labelNum) {
	//TODO write a jump instruction to the lable number
	return '';
}
function removeLastLine(asmCode) {
	//TODO removes the last line of assembly code
	return '';
}
var getReturnType = function (cppCode) {
	//TODO check if return type is void or int or double. 
	return 'void';
}
function memSize(cppCode) {
	//TODO return the amount of memory needed for the function. Difficulty level: hard
	return 0;
}
function WriteEndOfFunction(returnType) {
	//TODO writes the end of function depending on the return type
	return '';
}