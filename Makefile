BUILD=./build
VERSION=$(shell cat VERSION)

.PHONY: all clean test

all: $(BUILD) $(BUILD)/puzzle.web.$(VERSION).js

$(BUILD)/puzzle.web.$(VERSION).js: $(BUILD)/perms.js $(BUILD)/rubik.js $(BUILD)/skewb.js $(BUILD)/scrambler.js $(BUILD)/webscrambler.js
	cat $+ >$@

$(BUILD)/webscrambler.js: $(BUILD)/webscrambler_worker.js
	cp webscrambler/main.js $@

$(BUILD)/webscrambler_worker.js: $(BUILD)/perms.js $(BUILD)/skewb.js $(BUILD)/rubik.js $(BUILD)/scrambler.js
	cat $+ >$@
	cat webscrambler/worker.js >>$@

$(BUILD)/scrambler.js: $(BUILD)/rubik.js $(BUILD)/skewb.js
	cat scrambler/*.js >$@
	sh skeletize.sh scrambler $@

$(BUILD)/skewb.js: $(BUILD)/perms.js
	cat skewb/*.js >$@
	sh skeletize.sh skewb $@

$(BUILD)/rubik.js:
	cat rubik/*.js >$@
	sh skeletize.sh rubik $@

$(BUILD)/perms.js:
	cat perms/*.js >$@
	sh skeletize.sh perms $@

$(BUILD):
	mkdir $(BUILD)

test: all
	node skewb_test/skewb_test.js
	node rubik_test/move_test.js
	node rubik_test/cubie_test.js
	node perms_test/permutation_test.js
	node perms_test/choose_test.js

clean:
	$(RM) -r $(BUILD)
