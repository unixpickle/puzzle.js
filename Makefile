BUILD=./build
VERSION=$(shell cat VERSION)

.PHONY: all clean test

all: $(BUILD) $(BUILD)/puzzle.web.$(VERSION).js

$(BUILD)/puzzle.web.$(VERSION).js: $(BUILD)/perms.js $(BUILD)/symmetry.js $(BUILD)/pocketcube.js $(BUILD)/rubik.js $(BUILD)/skewb.js $(BUILD)/bigcube.js $(BUILD)/scrambler.js
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

$(BUILD)/symmetry.js:
	cat symmetry/*.js >$@
	bash skeletize.sh symmetry $@

$(BUILD)/bigcube.js:
	cat bigcube/*.js >$@
	bash skeletize.sh bigcube $@

$(BUILD):
	mkdir $(BUILD)

test: all
	bash test.sh

bench: test
	bash bench.sh

clean:
	$(RM) -r $(BUILD)
