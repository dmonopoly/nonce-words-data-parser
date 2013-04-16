/** The primary parser file **/

// Global var
var DELIMITER = ",";
var LEFT_LETTERS = ['q','w','e','r','t','a','s','d','f','g','z','x','c','v','b'];
var RIGHT_LETTERS = ['y','u','i','o','p','h','j','k','l','n','m'];

// left-edge distance; letter at index i has LED stored in i+1
var LED_MAP = [
	'a',2,
	'b',6,
	'c',4,
	'd',4,
	'e',4,
	'f',5,
	'g',6,
	'h',7,
	'i',9,
	'j',8,
	'k',9,
	'l',10,
	'm',8,
	'n',7,
	'o',10,
	'p',11,
	'q',2,
	'r',5,
	's',3,
	't',6,
	'u',8,
	'v',5,
	'w',3,
	'x',3,
	'y',7,
	'z',2
]

// area 4
function getLeftEdgeDist(text) {
	text = text.trim();

	var lines = text.split("\n");
	var numLines = lines.length;

	// resultant rows - 
	var rows = Array(); // can do rows.push(element)

	for (var i=0; i<numLines; i++) {
		var line = lines[i];
		var inputRow = line.split(',');
		// inputRow[0] -> first word
		// inputRow[1] -> second word
		_trim(inputRow);
		// console.log("Trimmed Output 2: ("+inputRow[0]+")("+inputRow[1]+")");
		rows.push(_generateLeftEdgeDist(inputRow[0], inputRow[1]));
	}
	// test
	// rows[0] = "stoofed"
	// rows[1] = "stoofed"
	var result = _flattenArrayByDelimiter(rows, '\n');

	return result;
}

// area 3
function transform1ColumnForLevDist(text) {
	// console.log("Input: \n"+text);
	text = text.trim();

	var lines = text.split("\n");
	var numLines = lines.length;

	// resultant rows - 
	// after algorithm rows[0] could be e.g. "stoofed, XX, 7" with XX as Lev Dist
	var rows = Array(); // can do rows.push(element)

	for (var i=0; i<numLines; i++) {
		var line = lines[i];
		var inputRow = line.split(',');
		// inputRow[0] -> first word
		// inputRow[1] -> second word
		_trim(inputRow);
		// console.log("Trimmed Output 2: ("+inputRow[0]+")("+inputRow[1]+")");
		rows.push(_generateLevDist(inputRow[0], inputRow[1]));
	}
	// test
	// rows[0] = "stoofed"
	// rows[1] = "stoofed"
	var result = _flattenArrayByDelimiter(rows, '\n');
	return result;
}

// area 1
function transform1ColumnForRSAAndLength(text) {
	// console.log("Input: \n"+text);
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
		// console.log("Trimmed Output 2: ("+inputRow[0]+")("+inputRow[1]+")");
		rows.push(_generateRSARowFromOneWord(inputRow[0]));
	}
	// test
	// rows[0] = "stoofed"
	// rows[1] = "stoofed"
	var result = _flattenArrayByDelimiter(rows, '\n');
	return result;
}

// area 2
function transform2ColumnsForRSAAndLength(text) {
	// console.log("Input: \n"+text);
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
		// console.log("Trimmed Output 2: ("+inputRow[0]+")("+inputRow[1]+")");
		rows.push(_generateRSARowFromTwoWords(inputRow[0], inputRow[1]));
	}

	// test
	// rows[0] = "stoofed, 5, 7, hugged, 4, 6, 1"
	// rows[1] = "stoofed, 5, 7, hugged, 4, 6, 1"
	// rows[2] = "stoofed, 5, 7, hugged, 4, 6, 1"
	var result = _flattenArrayByDelimiter(rows, '\n');
	return result;
}