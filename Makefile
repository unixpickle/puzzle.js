all: rubik.js

rubik.js:
	cat rubik/*.js >rubik.js

clean:
	rm rubik.js
