BUILD=./build
VERSION=$(shell cat VERSION)
JSBUILD_CMD=jsbuild -includeAPI -license=LICENSE -version=$(VERSION)

.PHONY: all clean test

all: $(BUILD) $(BUILD)/puzzle.web.$(VERSION).js

$(BUILD)/puzzle.web.$(VERSION).js: $(BUILD)/perms.js $(BUILD)/symmetry.js $(BUILD)/pocketcube.js $(BUILD)/rubik.js $(BUILD)/skewb.js $(BUILD)/bigcube.js $(BUILD)/scrambler.js $(BUILD)/pyraminx.js
	cat $+ webscrambler/main.js webscrambler/worker.js >$@

$(BUILD)/scrambler.js: $(BUILD)/rubik.js $(BUILD)/skewb.js $(BUILD)/bigcube.js $(BUILD)/pyraminx.js
	$(JSBUILD_CMD) -output=$@ -name=puzzlejs.scrambler scrambler/*.js

$(BUILD)/pyraminx.js:
	$(JSBUILD_CMD) -output=$@ -name=puzzlejs.pyraminx pyraminx/*.js

$(BUILD)/skewb.js: $(BUILD)/perms.js
	$(JSBUILD_CMD) -output=$@ -name=puzzlejs.skewb skewb/*.js

$(BUILD)/rubik.js: $(BUILD)/pocketcube.js
	$(JSBUILD_CMD) -output=$@ -name=puzzlejs.rubik rubik/*.js

$(BUILD)/pocketcube.js:
	$(JSBUILD_CMD) -output=$@ -name=puzzlejs.pocketcube pocketcube/*.js

$(BUILD)/perms.js:
	$(JSBUILD_CMD) -output=$@ -name=puzzlejs.perms perms/*.js

$(BUILD)/symmetry.js:
	$(JSBUILD_CMD) -output=$@ -name=puzzlejs.symmetry symmetry/*.js

$(BUILD)/bigcube.js:
	$(JSBUILD_CMD) -output=$@ -name=puzzlejs.bigcube bigcube/*.js

$(BUILD):
	mkdir $(BUILD)

test: all
	bash test.sh

bench: test
	bash bench.sh

clean:
	$(RM) -r $(BUILD)
