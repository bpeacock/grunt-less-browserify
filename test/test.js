#!/usr/bin/env node

var fs 		= require("fs"),
    browserify 	= require('browserify'),
    lessify 	= require("../index"),
    assert 	= require("assert"),
    sampleLESS 	= __dirname + "/styles.less",
    sampleCSS 	= __dirname + "/styles.css";

var b = browserify();
b.add(sampleLESS);
b.add(sampleCSS);
b.transform(lessify);

b.bundle(function (err, src) {
	if (err) {
		assert.fail(err);
	}
	fs.writeFile(__dirname + "/bundle.js", src);
	assert.ok(src);
});
