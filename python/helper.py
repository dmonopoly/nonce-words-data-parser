import re
# Credit: http://hetland.org/coding/python/levenshtein.py
def lev_dist(a,b):
    "Calculates the Levenshtein distance between a and b."
    n, m = len(a), len(b)
    if n > m:
        # Make sure n <= m, to use O(min(n,m)) space
        a,b = b,a
        n,m = m,n
        
    current = range(n+1)
    for i in range(1,m+1):
        previous, current = current, [i]+[0]*n
        for j in range(1,n+1):
            add, delete = previous[j]+1, current[j-1]+1
            change = previous[j-1]
            if a[j-1] != b[i-1]:
                change = change + 1
            current[j] = min(add, delete, change)
            
    return current[n]

# Pre: words already determined to not be irregular conjugates of each other
def beg_of_words_close_enough(word1, word2):
	if either_word_contains_the_other(word1, word2):
		print '1 word has other in it'
		return True

	count = 0
	for i in range(len(word1)):
		if i in range(len(word2)) and word1[i] == word2[i]:
			count += 1
		else:
			break

	if count >= 3:
		return True
	else:
		return False

def either_word_contains_the_other(w1, w2):
	# if re.match(r''+word1+'$')
	# If a word contains it simply, like kick and kicked
	pattern1 = re.compile(r'\b'+w1)
	pattern2 = re.compile(r'\b'+w2)
	either_word_contains_the_other = pattern2.match(w1) or pattern1.match(w2)
	if either_word_contains_the_other:
		return True

	# Try checking for ing or ed at end in both, and reduce one to 
	patt_ing = re.compile(r'ing\b')
	patt_ed = re.compile(r'ed\b')
	w1 = re.sub(patt_ing, '', w1)
	w1 = re.sub(patt_ed, '', w1)
	w2 = re.sub(patt_ing, '', w2)
	w2 = re.sub(patt_ed, '', w2)
	print 'w1: '+w1
	print 'w2: '+w2

	either_word_contains_the_other = w1 == w2

	return either_word_contains_the_other

# Combines elements of array into a string, separating each element with delimiter. 
def flatten_array_by_delim(array, delimiter):
	result = ''
	for i in range(len(array)-1): # all except last
		result += str(array[i])
		result += str(delimiter)
	result += str(array[-1])
	return result

# Custom comparator - for rows_for_one_word in gather_o.. method
def my_comparator(a, b):
	return int(a[2]) - int(b[2])

# print 'here:'
# print beg_of_words_close_enough('love','lovely')
# print beg_of_words_close_enough('love','loving')
# arr = ['I','am','here']
# res = flatten_array_by_delim(arr, '\n')
# print res