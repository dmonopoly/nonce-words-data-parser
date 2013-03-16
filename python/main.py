from helper import *
from verb_reader import VerbReader
import re

## Constants
# Files
our_file = "our words test.txt"
# our_file = "our words.txt"
their_file = "their words test.txt"
# their_file = "their_words.txt"

MAX_LEV_DIST = 5

# Driver
def main():
	with open(our_file,'r') as our_words_reader:
		with open(their_file, 'r') as their_words_reader:
			gather_output_matching(our_words_reader.read(), their_words_reader.read())

# ------------------------------------------------------------
# Main function that does matching of our data with their data
# ------------------------------------------------------------
def gather_output_matching(our_words, their_words):
	our_words = re.split('[,\n\r\t]', our_words)
	their_words = re.split('[,\n\r\t]', their_words)

	print 'our words: '+str(our_words)
	print 'their words: '+str(their_words)

	our_words = trim(our_words)
	their_words = trim(their_words)

	reader = VerbReader()
	rows = []

	for our_word in our_words:
		rows_for_one_word = []
		for their_word in their_words:
			row_for_one_word = []
			# print '1 '+our_word
			# print '2 '+their_word
			if reader.verbs_are_conjugates(our_word, their_word):
				row_for_one_word.extend([our_word])
				row_for_one_word.extend([their_word])
				row_for_one_word.extend([0]) # symbol for perfect match
				rows_for_one_word.extend([row_for_one_word])
				# print 'rfow: '+str(rows_for_one_word)
				break
			elif beg_of_words_close_enough(our_word, their_word):
				dist = lev_dist(our_word, their_word)
				row_for_one_word.extend([our_word])
				row_for_one_word.extend([their_word])
				row_for_one_word.extend([dist])
				if dist == 0:
					rows_for_one_word = [] # clear (doesn't handle references)
					rows_for_one_word.extend([row_for_one_word])
					break
				elif dist <= MAX_LEV_DIST:
					rows_for_one_word.extend([row_for_one_word])
			print row_for_one_word
		# print rows_for_one_word
		if (len(rows_for_one_word) != 0):
			# Sort
			# rows_for_one_word = rows_for_one_word.sort(my_comparator)
			rows_for_one_word.sort(my_comparator)
			# print 'this: '+str(rows_for_one_word)
			rows.append(flatten_array_by_delim(rows_for_one_word, '\n'))

	if len(rows) == 0:
		print 'no matches'
	else:
		# print 'rows before: '+str(rows)
		print '--RESULT--'
		result = flatten_array_by_delim(rows, '\n')
		cleaned_result = re.sub(r'[\[ \]\']', '', str(result))
		print str(cleaned_result)

# Trim each word in list of words
def trim(words):
	new_words = []
	for word in words:
		new_words.append(word.strip())
	return new_words

def test():
	pass
	# words = ['hi', '  anne']
	# for w in words: print(w)

	# words = trim(words)
	# for w in words: print(w)

# ------------------------
# The code that executes!
# ------------------------
# test()
main()