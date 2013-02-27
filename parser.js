// Global var
var DELIMITER = ",";
var LEFT_LETTERS = ['q','w','e','r','t','a','s','d','f','g','z','x','c','y','b'];
var RIGHT_LETTERS = ['y','u','i','o','p','h','j','k','l','n','m'];

function transform1ColumnForRSAAndLength(text) {
	console.log("Input: \n"+text);
	text = text.trim();

	var lines = text.split("\n");
	var numLines = lines.length;

	// resultant rows - 
	// after algorithm rows[0] could be e.g. "stoofed, XX, 7" with XX as RSAs
	var rows = Array(); // can do rows.push(element)

	for (var i=0; i<numLines; i++) {
		var line = lines[i];
		var inputRow = line.split(',');
		// inputRow[0] -> the only word
		_trim(inputRow);
		console.log("Trimmed Output 2: ("+inputRow[0]+")("+inputRow[1]+")");
		rows.push(_generateOutputRowFromOneWord(inputRow[0]));
	}
	// test
	// rows[0] = "stoofed"
	// rows[1] = "stoofed"
	var result = _flattenArrayByDelimiter(rows, '\n');
	return result;
}

// Returns the transformed text
function transform2ColumnsForRSAAndLength(text) {
	console.log("Input: \n"+text);
	text = text.trim();

	var lines = text.split("\n");
	var numLines = lines.length;

	// resultant rows - 
	// after algorithm rows[0] could be e.g. "stoofed, XX, 7, hugged, YY, 6, [XX-YY]" with XX and YY as RSAs
	var rows = Array(); // can do rows.push(element)

	for (var i=0; i<numLines; i++) {
		var line = lines[i];
		var inputRow = line.split(',');
		// inputRow[0] -> nonce word
		// inputRow[1] -> interpretation
		_trim(inputRow);
		console.log("Trimmed Output 2: ("+inputRow[0]+")("+inputRow[1]+")");
		rows.push(_generateOutputRowFromTwoWords(inputRow[0], inputRow[1]));
	}

	// test
	// rows[0] = "stoofed, 5, 7, hugged, 4, 6, 1"
	// rows[1] = "stoofed, 5, 7, hugged, 4, 6, 1"
	// rows[2] = "stoofed, 5, 7, hugged, 4, 6, 1"
	var result = _flattenArrayByDelimiter(rows, '\n');
	return result;
}

function _generateOutputRowFromOneWord(word) {
	var output = Array();
	var rsa = _computeRSA(word);

	output[0] = word;
	output[1] = rsa;
	output[2] = _countLetters(word);

	return _flattenArrayByDelimiter(output, DELIMITER);
}

// Generates a single output row based on the given 2 words: nonce word and interpretation.
function _generateOutputRowFromTwoWords(nonceWord, interpretation) {
	var output = Array();
	var rsa1 = _computeRSA(nonceWord);
	var rsa2 = _computeRSA(interpretation);

	output[0] = nonceWord;
	output[1] = rsa1;
	output[2] = _countLetters(nonceWord);
	output[3] = interpretation;
	output[4] = rsa2;
	output[5] = _countLetters(interpretation);
	output[6] = rsa1 - rsa2;

	return _flattenArrayByDelimiter(output, DELIMITER);
}

function _computeRSA(word) {
	word = word.toLowerCase();

	var leftCount = 0;
	var rightCount = 0;
	for (var i=0; i<word.length; i++) {
		if (_include(LEFT_LETTERS, word[i])) {
			leftCount++;
		} else if (_include(RIGHT_LETTERS, word[i])) {
			rightCount++;
		}
	}

	return rightCount - leftCount;
}

function _countLetters(word) {
	// Note that various characters that are not counted
	word = word.replace(/[\.-\/#!$%\^&\*;:{}@=\-_`~()]/g,"");
	word = word.replace(/\s+/g, '');
	return word.length;
}

// Combines elements of array into a string, separating each element with delimiter. 
function _flattenArrayByDelimiter(array, delimiter) {
	var result = ""; // a string
	console.log("Flattening array");
	for (var i=0; i<array.length-1; i++) {
		result += array[i] + delimiter;
	}
	result += array[array.length-1]; // array.last
	return result;
}

// Trims each element of the given array myArray
// JS _does_ change value directly
// @param myArray - array of strings
function _trim(myArray) {
	console.log("Trimming");
	for (var i=0; i<myArray.length; i++) {
		myArray[i] = myArray[i].trim();
	}
	console.log("Trimmed Output 1: ("+myArray[0]+")("+myArray[1]+")");
}

// Return true if array contains the object
function _include(arr, obj) {
    return (arr.indexOf(obj) != -1);
}

/* Test methods */
function testIncludeMethod() {
	var word = 'myword'
	var result = _include(LEFT_LETTERS, word[0]);
	var result2 = _include(LEFT_LETTERS, word[1]);
	console.log("result: "+result); // should be false
	console.log("result2: "+result2); // should be true
}

function testSpaceRemoval() {
	var str = 'picked on';
	str = str.replace(/\s+/g, '');
	console.log(str);
}