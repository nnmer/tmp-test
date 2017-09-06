var gulp        = require( 'gulp' )
    ,browsersync= require( 'browser-sync' )
    ,notifier   = require( 'node-notifier')
;

var reload = browsersync.reload;
var browsersyncConfig = {
    reloadDelay: 100
    ,server: true
    ,ghostMode: {
        clicks: true,
        forms: true,
        scroll: false
    }
    ,open: false
};


gulp.task('watch', function() {
    browsersync(browsersyncConfig);
    gulp.watch([
        '*.js',
        '*.html'
    ])
    .on('change',function(){notifier.notify({title:' ',message:'reloading '});reload();});
});