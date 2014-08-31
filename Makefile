release:
	gulp

debug:
	gulp debug

clean:
	@echo Removing the "build" folder
	@rm -rf build

.PHONY: release
