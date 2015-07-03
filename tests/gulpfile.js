var gulp = require('gulp');
var htmlonline = require('../index');
var imgex = require('@ali/gulp-imgex');

gulp.task('htmlOnline', function() {
    gulp.src(['./*.html'])
        .pipe(htmlonline({
            destDir: './dist',
            appName: 'app-my-property',
            appVersion: '1.0.0',
            publish: true
        }))
        .pipe(gulp.dest('./dist/online'));
});

gulp.task('htmlOnDaily', function() {
    gulp.src(['./*.html'])
        .pipe(htmlonline({
            destDir: './dist',
            appName: 'app-my-property',
            appVersion: '1.0.0',
            publish: false
        }))
        .pipe(gulp.dest('./dist/daily'));
});

gulp.task('imgex', function() {
    gulp.src('./css/*.css')
        .pipe(imgex({
            base64Limit: 8000, // base64化的图片size上限，小于这个size会直接base64化，否则上传cdn
            uploadDest: 'tps' // 或者 `mt`
        }))
        .pipe(gulp.dest('./dist/css'));
});
gulp.task('default', ['htmlOnline','htmlOnDaily'])