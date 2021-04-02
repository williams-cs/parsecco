build: node_modules
	npm run build

clean:
	rm -rf docs
	rm -rf node_modules

node_modules:
	npm install

test: build
	npm test
