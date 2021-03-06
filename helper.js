/** Helper methods solely for main.js, test.js, verbs_reader.js **/

// creates row of word, LED, LED &divide; letter count of word
function _generateLeftEdgeDist(word) {
	var output = Array();
	var led = _computeLED(word);

	output[0] = word;
	output[1] = led;
	output[2] = led/_countLetters(word);

	return _flattenArrayByDelimiter(output, DELIMITER);
}

function _computeLED(word) {
	var sumOfLeds = 0;
	for (var i=0; i<word.length; i++) {
		sumOfLeds += LED_MAP[(LED_MAP.indexOf(word[i])+1)]
	}
	return sumOfLeds;
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

// Returns true if array contains the object
function _include(arr, obj) {
    return (arr.indexOf(obj) != -1);
}