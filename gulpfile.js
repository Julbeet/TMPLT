'use strict';

var gulp 		    = require('gulp'),
	browserSync     = require('browser-sync').create(),
	rigger          = require('gulp-rigger'),
	chokidar 	    = require('gulp-chokidar')(gulp),
	sass        	= require('gulp-sass'),
	rename        	= require('gulp-rename'),
	rimraf        	= require('rimraf'),
	imagemin      	= require('gulp-imagemin'),
	pngquant      	= require('gulp-pngquant'),
    autoprefixer  	= require('gulp-autoprefixer'),
    sourcemaps      = require('gulp-sourcemaps'),
    uglify          = require('gulp-uglify');

var src = 'src/',      //folder
	build= 'build/';	//final folder

var conf = {
	src   : {
		html   : '*.html',
		styles : 'scss/**/*.scss',
		js     : 'js/main.js',
		fonts  : 'fonts/*',
		img    : 'img/*'
	},
	build : {
		html   : '',
		styles : 'css/',
		js     : 'js/',
		fonts  : 'fonts/',
		img    : 'img/'

	},
	watch   : {
		html   : '*.html',
		styles : 'scss/**/*.scss',
		js     : 'js/**/*.js',
		fonts  : 'fonts/*',
		img    : 'img/*'
	},
};


gulp.task('server', ['html', 'styles', 'js', 'fonts', 'img'], function(){
	browserSync.init({
		 server: {
        baseDir: "./" + build
	    },
	    tunnel : true,
	    host   : 'myhost',
	    port   : 3000
	});
	chokidar(src + conf.watch.html, 'html');
	chokidar(src + conf.watch.styles, 'styles');
	chokidar(src + conf.watch.js, 'js');
	chokidar(src + conf.watch.fonts, 'fonts');
	chokidar(src + conf.watch.img, 'img');
});

gulp.task('html', function() {
	gulp.src([src+conf.src.html,'!**/_*'])
		.pipe(rigger())
		.pipe(gulp.dest(build+conf.build.html))
		.pipe(browserSync.stream());
});


gulp.task('styles', function() {

    return gulp.src(src+conf.src.styles)
   		.pipe(sourcemaps.init())
        .pipe(sass({
        	outputStyle: 'compressed',
        	sourceMap: true
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: [
                "last 3 versions",
                "opera 12-13",
                "ie >= 9",
                "ff ESR"
            ],
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(build+conf.build.styles))
        .pipe(browserSync.stream());
});

gulp.task('js', function() {

	gulp.src(src + 'js/jquery.js')
		.pipe(uglify())
		.pipe(gulp.dest(build + conf.build.js));

	gulp.src(src + conf.src.js)
		.pipe(rigger())
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(rename({
			basename: 'script',
			suffix  :   '.min',
			extname : '.js'
		}))
		.pipe(gulp.dest(build + conf.build.js))
		.pipe(browserSync.stream());
});

gulp.task('clean', function(cb){
	rimraf('./'+ build, cb);

})

gulp.task('fonts', function() {
	gulp.src(src + conf.src.fonts)
		.pipe(gulp.dest(build + conf.build.fonts))
		.pipe(browserSync.stream());

});

gulp.task('img', function () {
    gulp.src(src + conf.src.img) 
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(build + conf.build.img))
        .pipe(browserSync.stream());
});

gulp.task('default', ['server']);