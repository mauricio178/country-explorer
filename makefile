.PHONY: clean clean-all prune stop remove-containers remove-images remove-volumes

clean:
	docker system prune -f

clean-all:
	docker container stop $$(docker container ls -aq)
	docker container rm -f $$(docker container ls -aq)
	docker image rm -f $$(docker image ls -aq)
	docker volume rm -f $$(docker volume ls -q)
	docker network rm $$(docker network ls -q 2>/dev/null | grep -v '^bridge$$\|^host$$\|^none$$') || true

remove-containers:
	docker container rm -f $$(docker container ls -aq)

remove-images:
	docker image rm -f $$(docker image ls -aq)

remove-volumes:
	docker volume rm -f $$(docker volume ls -q)

stop:
	docker stop $$(docker ps -q)
