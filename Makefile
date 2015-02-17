BUILD=./build

.PHONY: all clean

all: build $(BUILD)/webscrambler.js $(BUILD)/perms.js

$(BUILD)/webscrambler.js: $(BUILD)/webscrambler_worker.js
	cp webscrambler/main.js $@

$(BUILD)/webscrambler_worker.js: $(BUILD)/skewb.js $(BUILD)/rubik.js $(BUILD)/scrambler.js
	cat $^ >$@
	cat webscrambler/worker.js >>$@

$(BUILD)/scrambler.js: $(BUILD)/rubik.js $(BUILD)/skewb.js
	cat scrambler/*.js >$@
	sh skeletize.sh scrambler $@

$(BUILD)/%.js: %
	cat $(<)/*.js >$@
	sh skeletize.sh $^ $@

build:
	mkdir build

clean:
	$(RM) -r $(BUILD)
