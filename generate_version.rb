outputFolder = 'version/v0.1/'
print()
Dir.glob("js/**/*.js").each {
	|file|
	cmd = 'uglifyjs ' + file + " -o " + outputFolder + file
	# print(cmd)
	system(cmd)
}