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