BUILD=./build
VERSION=$(shell cat VERSION)

.PHONY: all clean

all: $(BUILD) $(BUILD)/puzzle.web.$(VERSION).js

$(BUILD)/puzzle.web.$(VERSION).js: $(BUILD)/rubik.js $(BUILD)/skewb.js $(BUILD)/scrambler.js $(BUILD)/webscrambler.js $(BUILD)/perms.js
	cat $+ >$@

$(BUILD)/webscrambler.js: $(BUILD)/webscrambler_worker.js
	cp webscrambler/main.js $@

$(BUILD)/webscrambler_worker.js: $(BUILD)/skewb.js $(BUILD)/rubik.js $(BUILD)/scrambler.js
	cat $+ >$@
	cat webscrambler/worker.js >>$@

$(BUILD)/scrambler.js: $(BUILD)/rubik.js $(BUILD)/skewb.js
	cat scrambler/*.js >$@
	sh skeletize.sh scrambler $@

$(BUILD)/%.js: %
	cat $(<)/*.js >$@
	sh skeletize.sh $< $@

$(BUILD):
	mkdir $(BUILD)

clean:
	$(RM) -r $(BUILD)
