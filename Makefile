
#build: init jshint

#init:
#	mkdir -p dist

templates:
	./node_modules/.bin/pug-ssml --templates ./templates

jshint:
	jshint index.js ./src/ ./test/

build: jshint templates

deploy: beta

remove:
	serverless remove

beta: build
	serverless deploy

prod: build
	serverless deploy --stage prod

update-beta: build
	serverless deploy --function skill

update-prod: build
	serverless deploy --function skill --stage prod

clean:
	rm -rf ./ssml-speech.js

.PHONY: init jshint templates build deploy remove beta prod update-beta update-prod clean