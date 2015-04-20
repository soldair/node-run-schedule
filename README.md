# node-run-schedule
run functions at the right time with the right frequency or know why it didn't work out.

```js
var run = require('run-schedule');
var readable = run([
  {
    id: 'optional. for logging otherwise [0]'
    duration: 1000
    data: {hi: 1} // is passed as the argument to the job function
  }
],{
  repeat:true // optional. just keep going through this schedule forever.
},function(job, cb){
  console.log(job.data) // logs "{hi: 1}"
  cb() // callback must be called
})
```


api
---

### run = require('run-schedule')

export is the run function

### var readable = run(schedule,[options,] step)

- schedule - an array of "job" objects that define intervals. Each job has these keys..

  - duration, the time in ms to wait after running this job. Required. 
  - id, the uniquie id of this step in the schedule. Optional.
  - data, the job's data. This is convention more than requirement. I pass the whole job in as the first argument to your step function. if I add new optional keys to the schedule object I will only increment the patch version though it may break your program if you opt to not use data to contain your job's data.

- options - optional options object.
  - repeat, default false.

- step(job,cb) - required. this is the function that processes each job when it's time.
  - job, the job object
  - cb, the callback. you must call this when you are done or your job will be reported as failed.


- RETURN readable - this is an object stream of events related to the progress and result of jobs.
```js
  {state:"start",job:job id,start:time in ms,end:time in ms, error: if state is error this is the message,data: the data from the step callback }
```
  - state - state may be start, running, error, or success. both error and success are "done" state but this breaks the handling code into 2 distinct paths so it should be more obvious that you are not handling error because you will want to handle "done".
  - job - the id or position in the schedule array
  - start - the wallclock time of the job start
  - end - the wallclock time of the job end
  - error - the error message if this job is state error.
  - data - the data from the step callback function. when you are done and call `cb(false,"tacp")` this will be "taco"




