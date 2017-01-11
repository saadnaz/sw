/**
 * Created by saadna on 11/01/2017.
 */
var gulp = require('gulp') ,
    connect =require('gulp-connect') ;


gulp.task('connect',function(){
      connect.server({
          port:8885
      }) ;
});

gulp.task('default',['connect']);
