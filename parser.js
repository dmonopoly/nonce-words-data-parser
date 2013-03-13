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
			if (beginningOfWordsCloseEnough(ourWords[i], theirWords[j])) {
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
			rowsForOneWord.sort(myComparator);

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

// used within gatherOutputMatching to determine if 2 words are close enough to warrant doing a lev dist analysis
// reasoning: before, we got output like drifted,advised,4 as remotely related - but this does not need eyes to see they are very different.
function beginningOfWordsCloseEnough(word1, word2) {
	var count = 0; // if this reaches a certain num, then the words are quite equal and most likely are something like 'drift', 'drifted' or 'sleep', 'slept'
	
	// If either word contains the other word
	var pattern1 = new RegExp('\b'+word1,''); // word boundary + actual word to match
	var pattern2 = new RegExp('\b'+word2,'');
	if (word1.match(pattern2) || word2.match(pattern1))
		return true;

	for (var i=0; i<word1.length; i++) {
		if (word2[i] === undefined)
			break;
		else if (word1[i] === word2[i]) {
			count++;
		} else {
			break; 
		}
	}

	// if we have found some number of letters matching
	if (count >= 3)
		return true;
	else
		return false;
}

// used within gatherOutputMatching to sort rows for one word by lev dist
// a, b are entries of the multi-dimensional array, rowsForOneWord
function myComparator(a,b) {
	// a[2] is lev dist of a, b[2] likewise
	return parseInt(a[2]) - parseInt(b[2]);
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

function _generateLevDist(word1, word2) {
	var output = Array();
	var lev_dist = _computeLevDist(word1, word2);

	output[0] = word1;
	output[1] = word2;
	output[2] = lev_dist;

	return _flattenArrayByDelimiter(output, DELIMITER);
}

function _generateRSARowFromOneWord(word) {
	var output = Array();
	var rsa = _computeRSA(word);

	output[0] = word;
	output[1] = rsa;
	output[2] = _countLetters(word);

	return _flattenArrayByDelimiter(output, DELIMITER);
}

// Generates a single output row based on the given 2 words: nonce word and interpretation.
function _generateRSARowFromTwoWords(nonceWord, interpretation) {
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
		} 
		if (_include(RIGHT_LETTERS, word[i])) {
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
	// console.log("Flattening array");
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
	// console.log("Trimming");
	for (var i=0; i<myArray.length; i++) {
		myArray[i] = myArray[i].trim();
	}
	// console.log("Trimmed Output 1: ("+myArray[0]+")("+myArray[1]+")");
}

// Returns true if array contains the object
function _include(arr, obj) {
    return (arr.indexOf(obj) != -1);
}

// From http://stackoverflow.com/questions/11919065/sort-an-array-by-the-levenshtein-distance-with-best-performance-in-javascript
// @author James Westgate
function _computeLevDist(s, t) {
    var d = []; //2d matrix

    // Step 1
    var n = s.length;
    var m = t.length;

    if (n == 0) return m;
    if (m == 0) return n;

    //Create an array of arrays in javascript (a descending loop is quicker)
    for (var i = n; i >= 0; i--) d[i] = [];

    // Step 2
    for (var i = n; i >= 0; i--) d[i][0] = i;
    for (var j = m; j >= 0; j--) d[0][j] = j;

    // Step 3
    for (var i = 1; i <= n; i++) {
        var s_i = s.charAt(i - 1);

        // Step 4
        for (var j = 1; j <= m; j++) {

            //Check the jagged ld total so far
            if (i == j && d[i][j] > 4) return n;

            var t_j = t.charAt(j - 1);
            var cost = (s_i == t_j) ? 0 : 1; // Step 5

            //Calculate the minimum
            var mi = d[i - 1][j] + 1;
            var b = d[i][j - 1] + 1;
            var c = d[i - 1][j - 1] + cost;

            if (b < mi) mi = b;
            if (c < mi) mi = c;

            d[i][j] = mi; // Step 6

            //Damerau transposition
            if (i > 1 && j > 1 && s_i == t.charAt(j - 2) && s.charAt(i - 2) == t_j) {
                d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
            }
        }
    }

    // Step 7
    return d[n][m];
}

/* Test methods */
function testCloseEnough() {
	var w1 = 'love';
	var w2 = 'loving';
	console.log("close enough? "+beginningOfWordsCloseEnough(w1,w2));
}

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