
# Files form the innovaphone JavaScript SDK
FILES += \
	../$(SDK-WEB1)/appwebsocket/innovaphone.appwebsocket.Connection.js \
	../$(SDK-WEB1)/lib1/*.js \
	../$(SDK-WEB1)/lib1/*.css \
	../$(SDK-WEB1)/ui1.lib/*.js \
	../$(SDK-WEB1)/ui1.svg/*.js \
	../$(SDK-WEB1)/fonts/*.ttf
	
# Files for your app
FILES += \
	httpfiles/*

# Files for the service
FILES	+=	\
	build.txt \
	label.txt \
	config.json \
    plugins.json \
	innovaphone-jspdfexampleservice.js \
	global.js \
	es6-shim.js \
	es7-shim.js \
	pdf-lib.js \
	promise.js \
	promise-tests.js
