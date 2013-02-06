// Global var
var DELIMITER = ",";

// Returns the transformed text
function transform(text) {
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
		rows.push(_generateOutputRow(inputRow[0], inputRow[1]));
	}

	// test
	// rows[0] = "stoofed, 5, 7, hugged, 4, 6, 1"
	// rows[1] = "stoofed, 5, 7, hugged, 4, 6, 1"
	// rows[2] = "stoofed, 5, 7, hugged, 4, 6, 1"
	// var result = _combineRows(rows);
	var result = _flattenArrayByDelimiter(rows, '\n');
	return result;
}

// Generates a single output row based on the given nonce word and interpretation.
function _generateOutputRow(nonceWord, interpretation) {
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
	return '[RSA HERE]'
}

function _countLetters(word) {
	return '[COUNT HERE]'
}

// Combines elements of array into a string, separating each element with delimiter. 
function _flattenArrayByDelimiter(array, delimiter) {
	var result = ""; // a string
	console.log("Flattening array");
	for (var i=0; i<array.length; i++) {
		result += array[i] + delimiter;
	}
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