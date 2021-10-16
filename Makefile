run:
	docker-compose up

rebuild:
	docker-compose down -v && docker compose up --build

stop:
	docker-compose down
