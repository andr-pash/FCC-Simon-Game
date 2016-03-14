var gulp = require('gulp'),
  sass = require('gulp-ruby-sass'),
  autoprefixer = require('gulp-autoprefixer');
  babel = require('gulp-babel');

  gulp.task('babel', () => {
  	return gulp.src('./es6/main.js')
  		.pipe(babel({
			presets: ['es2015']
		}))
  		.pipe(gulp.dest('js'));
  });
gulp.task('autoprefixer', function() {
  return gulp.src('./css/*.css')
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./css'));
});

function errorLog(error) {
  console.error.bind(error);
  this.emit('end');
}

gulp.task('sass', function() {
  return sass('./sass/*.sass')
    .on('error', sass.logError)
    .pipe(gulp.dest('./css'));
});

gulp.task('watch', function() {
  gulp.watch('sass/*.sass', ['sass']);
  gulp.watch('css/*.css', ['autoprefixer']);
  gulp.watch('es6/*.js', ['babel']);
});


gulp.task('default', ['sass', 'autoprefixer', 'babel', 'watch']);
