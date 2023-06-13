build:
	cd vue && npm run build

run:
	cd vue && npm run serve

push:
	cd vue && npm run build
	git add .
	git commit -m "auto commit"
	git push origin master