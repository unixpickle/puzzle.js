BUILD=./build
VERSION=$(shell cat VERSION)

.PHONY: all clean test

all: $(BUILD) $(BUILD)/puzzle.web.$(VERSION).js

$(BUILD)/puzzle.web.$(VERSION).js: $(BUILD)/perms.js $(BUILD)/pocketcube.js $(BUILD)/rubik.js $(BUILD)/skewb.js $(BUILD)/scrambler.js
	cat $+ webscrambler/main.js webscrambler/worker.js >$@

$(BUILD)/scrambler.js: $(BUILD)/rubik.js $(BUILD)/skewb.js
	cat scrambler/*.js >$@
	bash skeletize.sh scrambler $@

$(BUILD)/skewb.js: $(BUILD)/perms.js
	cat skewb/*.js >$@
	bash skeletize.sh skewb $@

$(BUILD)/rubik.js: $(BUILD)/pocketcube.js
	cat rubik/*.js >$@
	bash skeletize.sh rubik $@

$(BUILD)/pocketcube.js:
	cat pocketcube/*.js >$@
	bash skeletize.sh pocketcube $@

$(BUILD)/perms.js:
	cat perms/*.js >$@
	bash skeletize.sh perms $@

$(BUILD):
	mkdir $(BUILD)

test: all
	node perms/test/permutation_test.js
	node perms/test/choose_test.js
	node skewb/test/skewb_test.js
	node pocketcube/test/cubie_test.js
	node pocketcube/test/heuristics_test.js
	node pocketcube/test/move_test.js
	node pocketcube/test/solve_test.js
	node rubik/test/move_test.js
	node rubik/test/cubie_test.js
	node rubik/test/phase1_cube_test.js
	node scrambler/test/scrambler_test.js

clean:
	$(RM) -r $(BUILD)
