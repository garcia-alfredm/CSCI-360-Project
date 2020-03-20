var ifRegEx = /if\(.*?\)\s*\{?/; //matches if(anything) and any white space and optional "{"
var elseRegEx = /else\s*\{?/;    //matches else and optional "{"
var functionHeaderRegEx = /(\w+\s+)?\w+\s+\w+\s*\(\s*\w+\s+\w+\s*(,\s*\w+\s+\w+\s*)*\{/; //matches optional access modifier with 
//at least one white space and return type with at least one white space and function name with any number of white space 
//and "(" with any number of white space and any number of parameters (any word with at least one white space and anyword 
//with any number of white space) separated by ","and ")" and any number of white space and "{"
var forLoopRegEx = /for\s*(.*)\s*\{?/; //matches for(anyting) and optional "{"
var instructionRegEx = /.*;/; 	//matches anything ending with ";"
								//only useful when all other regular expressions failed
var closeBracketRegEx = /\}/;

var getFirstLine = function (cppCode) {
	var a = regex1.exec(str1)[0];
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
	} else if (ifRfunctionHeaderRegExgEx.test(line)) {
		return 'function header';
	} else if (regexEnum.forLoopRegEx.test(line)) {
		return 'for loop';
	} else if (closeBracketRegEx.test(line)) {
		return 'close bracket';
	} else if (instructionRegEx.test(line)) {
		return 'instruction';
	} else return 'empty';
}
var test = function regExTest(cppCode){
	var line = '';
	var result = '';
	readFirstLine(cppCode);
	while (line.length != 0) {
		var lineType = getLineType(line);
		result.concat(lineType).concat('\t').concat(line).concat('\n');
		cppCode = cppCode.replace(line,'');
		line = readFirstLine(cppCode);
	}
	return result;
}
var cppToAssembly = function convertToAssembly(cppCode) {
	var result = '';
	var lableNum = 0;
	var returnType = '';
	var labelNumberStack = [];
	var nestedStatementStack = [];
	var forLoopIncrentStack = [];
	var loopJumpStack = [];
	var line = '';
	readFirstLine(cppCode);
	while (line.length != 0) {
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
				If(nestedStatementStack.lastIndexOf('for loop') == (nestedStatementStack.length - 1)) {
					result.concat('\n').concat(writeIncrement(forLoopIncrentStack.pop()));
					result.concat('\n').concat(writeJump(loopJumpStack.pop()));
				}
				result.concat('\n').concat(writeLabel(labelNumberStack.pop()));
				nestedStatementStack.pop();
			}
		} else if (lineType == 'close bracket') {
			If(nestedStatementStack.length > 0) {
				If(nestedStatementStack.lastIndexOf('for loop') == (nestedStatementStack.length - 1)) {
					result.concat('\n').concat(writeIncrement(forLoopIncrentStack.pop));
					result.concat('\n').concat(writeJump(loopJumpStack.pop()));
				}
				result.concat('\n').concat(WriteLabel(labelNumberStack.pop()));
				nestedStatementStack.pop();
				while (nestedStatementStack.lastIndexOf('no brackets') == (nestedStatementStack.length - 1)) {
					nestedStatementStack.pop();
					If(nestedStatementStack.lastIndexOf('for loop') == (nestedStatementStack.length - 1)) {
						result.concat('\n').concat(writeIncrement(forLoopIncrentStack.pop));
						result.concat('\n').concat(writeJump(loopJumpStack.pop()));
					}
					result.concat('\n').concat(WriteLabel(labelNumberStack.pop()))
					nestedStatementStack.pop();
				}
			}else {
				result.concat('\n').concat(WriteEndOfFunction(returnType))	//no nested statement means end of function 
			}
		}
		cppCode = cppCode.replace(line,'');
		line = readFirstLine(cppCode);
	}
	return result;
}

var getForLoopInrement = function (line) {
	part1RegEx = /.*;.*;\s*/; 	//part before the increment
	part2RegEx = /\s*).*/;		//part after the increment
	return line.replace(part1RegEx, "").replace(part2RegEx, "");	//returns the increment part
}
var hasNoOpenBracket = function (line) {
	return !(/.*\{/.test(line));
}
var increment = function writeIncrement(increment) {
	//TODO write the for loop increment
}
var instruction = function writeInstruction(line) {
	//TODO writes an instruction in assembly. Difficulty level hard.
}
var ifStatment = function writeIfStatment(line, labelNum) {
	//TODO writes the if statement condition and jump. Difficulty level: medium
}
var label = function writeLable(lableNum) {
	//TODO write lable for the lable number
}
var jump = function writeJump(labelNum) {
	//TODO write a jump instruction to the lable number
}
var removedLastLine = function removeLastLine(asmCode) {
	//TODO removes the last line of assembly code
}
var getReturnType = function (cppCode) {
	//TODO check if return type is void or int or double. 
	return 'void';
}
var getMemSize = function (cppCode) {
	//TODO return the amount of memory needed for the function. Difficulty level: hard
	return 0;
}
var endOfFun = function WriteEndOfFunction(returnType){
	//TODO writes the end of function depending on the return type
}