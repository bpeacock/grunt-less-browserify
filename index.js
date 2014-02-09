var less		= require('less'),
	CleanCSS	= require('clean-css'),
	through		= require('through'),
	path		= require("path"),
	grunt		= require('grunt');

try {
	require('../../Gruntfile.js')(grunt);
}
catch(err) {}

var settings = grunt.config.data.lessBrowserify || {};

//Global Imports
var imports = '';
if(settings.imports) {
	for(var i=0; i<settings.imports.length; i++) {
		imports += grunt.file.read(settings.imports[i]);
	}
}

//Write The Output File
if(settings.output) {
	grunt.file.write(settings.output, '');
}

var func_start = "(function() { var head = document.getElementsByTagName('head')[0]; style = document.createElement('style'); style.type = 'text/css';",
	func_end = "if (style.styleSheet){ style.styleSheet.cssText = css; } else { style.appendChild(document.createTextNode(css)); } head.appendChild(style);}())";

module.exports = function(file) {
	if (!/\.css|\.less/.test(file)) {
		return through();
	}
	var buffer = "",
		mydirName = path.dirname(file);

	var parser = new(less.Parser)({
		paths: [mydirName, __dirname],
		syncImport: true
	});

	return through(function(chunk) {
		return buffer += chunk.toString();
	}, function() {

		var compiled;

		// CSS is LESS so no need to check extension
		parser.parse(imports + buffer, function(e, r) {
			compiled = r.toCSS();
		});

		// rv comments
		// http://stackoverflow.com/questions/5989315/regex-for-match-replacing-javascript-comments-both-multiline-and-inline
		compiled = compiled.replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:([\s;])+\/\/(?:.*)$)/gm, "");

		compiled = CleanCSS().minify(compiled);

		//Write File
		if(settings.output) {
			grunt.file.write(settings.output, grunt.file.read(settings.output) + compiled);
		}

		//Add to JS
		if(settings.jsAppend !== false) {
			this.queue(func_start + "var css = \"" + compiled.replace(/'/g, "\\'").replace(/"/g, '\\"') + "\";" + func_end);
		}

		return this.queue(null);
	});
};
