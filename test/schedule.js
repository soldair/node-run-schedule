
var test = require('tape')
var runner = require('../');


var schedule = [
  {
    duration:1000,
    data:{
      a:1,
      b:2
    }
  }
]

runner.time = require('mocktimers')();

test('schedule.',function(t){
  var manager = runner(schedule,function(){
    
  })
})




