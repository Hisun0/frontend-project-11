install:
	npm ci

build:
	npm run build

lint:
	npx eslint .

fix:
	npx eslint --fix .