import gulp from 'gulp';

import babel from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';
import del from 'del';
import imagemin from 'gulp-imagemin';


const paths = {
    styles: {
        src: './public/stylesheets/style.css',
        dest: './public/dist/'
    },
    scripts: {
        src: ['./public/javascripts/main.js', './public/javascripts/game.js'],
        dest: './public/dist/'
    },
    images: {
        src: './public/images/*.{jpg,jpeg,png}',
        dest: './public/dist/'
    }
};

/*
 * For small tasks you can export arrow functions
 */
export const clean = () => del([ 'assets' ]);

/*
 * You can also declare named functions and export them as tasks
 */
export function styles() {
    return gulp.src(paths.styles.src)
        .pipe(cleanCSS())
        // pass in options to the stream
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.styles.dest));
}

export function scripts() {
    return gulp.src(paths.scripts.src, { sourcemaps: true })
        .pipe(babel({ presets: [
            ["@babel/preset-env", {"modules" : false}]
          ] 
        }))
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest(paths.scripts.dest));
        
}

export function images(){

    return gulp.src(paths.images.src, {since: gulp.lastRun(images)})
        .pipe(imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest(paths.images.dest));

}

/*
 * You could even use `export as` to rename exported tasks
 */
function watchFiles() {
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.styles.src, styles);
}
export { watchFiles as watch };

const build = gulp.series(clean, gulp.parallel(styles, scripts));
/*
 * Export a default task
 */
export default build;

