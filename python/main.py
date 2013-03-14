import re

# Files
our_file = "our words test.txt"
# our_file = "our words.txt"
their_file = "their words test.txt"
# their_file = "their_words.txt"

# Driver
def main():
	with open(our_file,'r') as our_words:
		with open(their_file, 'r') as their_words:
			gatherOutputMatching(our_words, their_words)

# ------------------------------------------------------------
# Main function that does matching of our data with their data
# ------------------------------------------------------------
def gatherOutputMatching(our_words, their_words):
	our_words = re.split('[,\n\t]', our_words);
	their_words = re.split('[,\n\t]', their_words);
	our_words = trim(our_words);
	their_words = trim(their_words);

	reader = VerbReader()
	rows = []

	for our_word in our_words:
		rowsForOneWord = []
		for their_word in their_words:


# Trim each word in list of words
def trim(words):
	new_words = []
	for word in words:
		new_words.append(word.strip())
	return new_words

def test():
	# words = ['hi', '  anne']
	# for w in words: print(w)

	# words = trim(words)
	# for w in words: print(w)

# ------------------------
# The code that executes!
# ------------------------
test()
# main()