var ifRegEx = /if\(.*?\)\s*\{?/; //matches if(anything) and any white space and optional "{"
var elseRegEx = /else\s*\{?/;    //matches else and optional "{"
var functionHeaderRegEx = /(\w+\s+)?\w+\s+\w+\s*\(\s*\w+\s+\w+\s*(,\s*\w+\s+\w+\s*)*\{/; //matches optional access modifier with 
    //at least one white space and return type with at least one white space and function name with any number of white space 
    //and "(" with any number of white space and any number of parameters (any word with at least one white space and anyword 
    //with any number of white space) separated by ","and ")" and any number of white space and "{"
var forLoopRegEx = /for\s*(.*)\s*\{?/; //matches for(anyting) and optional "{"
var instructionRegEx = /.*;/; //matches anything ending with ";"
                            //only useful when all other regular expressions failed
var closeBracketRegEx =/\}/;  

var getFirstLine = function(cppCode){
    var a = regex1.exec(str1)[0];
    cppCode = cppCode.replace(/^\s+/g, ""); //removes leading whitspace
    if(cppCode.search(ifRegEx) == 0){
        return ifRegEx.exec(cppCode)[0];
    }else if(cppCode.search(elseRegEx)){
        return elseRegEx.exec(cppCode)[0];
    }else if(cppCode.search(functionHeaderRegEx)){
        return functionHeaderRegEx.exec(cppCode)[0];
    }else if(cppCode.search(forLoopRegEx)){
        return forLoopRegEx.exec(cppCode)[0];
    }else if(cppCode.search(closeBracketRegEx)){
        return closeBracketRegEx.exec(cppCode)[0];
    }else if(cppCode.search(instructionRegEx)){
        return instructionRegEx.exec(cppCode)[0];
    }else return "";
}

var removeFirstLine = function(cppCode){
    cppCode = cppCode.replace(/^\s+/g, ""); //removes leading whitspace
    cppCode = cppCode.replace(getFirstLine(cppCode),"");
    return cppCode;
}

var getLineType = function(line){
    if(ifRegEx.test(line)){
        return 'if statment';
    }else if(elseRegEx.test(line)){
        return 'else statment';
    }else if(ifRfunctionHeaderRegExgEx.test(line)){
        return 'function header';
    }else if(regexEnum.forLoopRegEx.test(line)){
        return 'for loop';
    }else if(closeBracketRegEx.test(line)){
        return 'close bracket';
    }else if(instructionRegEx.test(line)){
        return 'instruction';
    }else return 'empty';
}