help:

defaut: help

setup:
	cd ./frontend && npm install

dev:
	cd ./frontend && make dev & cd ./output && python -m SimpleHTTPServer 8000

prod:
	cd ./frontend && make prod & cd ./output && python -m SimpleHTTPServer 8000

