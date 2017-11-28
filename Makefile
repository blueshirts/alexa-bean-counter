
jshint:
	jshint *.js ./src/ ./test/

deploy: beta

remove:
	serverless remove

init: jshint

beta: init
	serverless deploy

prod: init
	serverless deploy --stage prod

update-beta: init
	serverless deploy --function skill

update-prod: init
	serverless deploy --function skill --stage prod

.PHONY: deploy remove init jshint beta prod update-beta update-prod