/** The primary parser file **/

// Global var
var DELIMITER = ",";
var LEFT_LETTERS = ['q','w','e','r','t','a','s','d','f','g','z','x','c','v','b'];
var RIGHT_LETTERS = ['y','u','i','o','p','h','j','k','l','n','m'];
var MAX_LEV_DIST = 4; // max lev dist that we care about

// Solely for "Quick matching for our data"
function gatherOutputMatching(ourData, theirData) {
	// Split around any new line, tab, or comma
	var ourWords = ourData.split(/[,\n\t]/);
	var theirWords = theirData.split(/[,\n\t]/);

	var rows = Array();

	for (var i=0; i<ourWords.length; i++) {
		var rowsForOneWord = Array(); // has multiple rows; the final thing added to the rows object
		// this object contains entries like rowsForOneWord[0] = [[joy],[jog],[1]], rowsForOneWord[1] = [[joy],[toy],[1]]
		
		// For each of our words, match with all of the others
		for (var j=0; j<theirWords.length; j++) {
			var rowForOneWord = Array();

			// Only compute lev dist if our word and their word have same beginnings, ~75% equal
			if (_beginningOfWordsCloseEnough(ourWords[i], theirWords[j])) {
				// console.log("--Matching "+ourWords[i]+" with "+theirWords[j]);
				var dist = _computeLevDist(ourWords[i], theirWords[j]);
				// Fill up the single rowForOneWord each time
				rowForOneWord.push(ourWords[i]);
				rowForOneWord.push(theirWords[j]);
				rowForOneWord.push(dist);

				if (dist == 0) { // perfect match, so clear rowsForOneWord and just let it have this one row
					// console.log("   perfect match");
					rowsForOneWord.length = 0; // clear
					rowsForOneWord.push(rowForOneWord);
					break;
				} else if (dist <= MAX_LEV_DIST) { // otherwise, append result to list of possible rows, given dist is small enough
					// console.log("   not perfect match");
					rowsForOneWord.push(rowForOneWord);
				}
			}

			// console.log("  new rowForOneWord: "+rowForOneWord);
			// console.log("this thing: "+rowForOneWord[rowForOneWord.length-1])
		}
		// console.log("Final rowsForOneWord for the word '"+ourWords[i]+"': \n"+rowsForOneWord);
		
		if (rowsForOneWord.length != 0) {
			// Sort the rowsForOneWord by lowest lev dist first
			rowsForOneWord.sort(_myComparator);

			rows.push(_flattenArrayByDelimiter(rowsForOneWord, '\n'));
		}
		// console.log("Ultimate rows list is now this: \n"+rows);
	}
	// console.log("Final rows list, right before flattening: \n"+rows);
	if (rows.length == 0)
		return 'no matches'
	else {
		var result = _flattenArrayByDelimiter(rows, '\n');
		return result;
	}
}

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

// Returns the transformed text
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