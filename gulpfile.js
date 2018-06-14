var gulp = require('gulp');
var run = require('gulp-run');

gulp.task('default', function() {
    // default..
});

gulp.task('start', function() {
    return run('node index.js').exec();
});

gulp.task('watch', function() {
    gulp.watch('**/*.js', ['start']);
});
