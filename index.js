const http=require("http");
const fs=require("fs");
var requests = require("requests");

const homeFile=fs.readFileSync("home.html","utf-8");

const replaceVal=(tempVal,orgVal)=>{
  let temperature=tempVal.replace("{%tempval%}",orgVal.main.temp);

  temperature= temperature.replace("{%tempmin%}",orgVal.main.temp_min);
  temperature= temperature.replace("{%tempmax%}",orgVal.main.temp_max);
  temperature= temperature.replace("{%location%}",orgVal.name);
  temperature= temperature.replace("{%country%}",orgVal.sys.country);
  temperature= temperature.replace("{%tempstatus%}",orgVal.weather[0].main);
  return temperature;

}
const server=http.createServer((req, res)=>{

if(req.url=="/"){
  requests("https://api.openweathermap.org/data/2.5/weather?q=Bangalore&appid=4b70f22d38949426d1483ca6a5983c82")
    .on("data",(chunk)=>{
      const objdata=JSON.parse(chunk);
      const arrData=[objdata];

      //console.log(arrData[0].main.temp);
      const realTimedata=arrData.map((val)=> replaceVal(homeFile,val)).join("");
      res.write(realTimedata);
       //console.log(realTimedata)
    })
    .on("end", (err)=>{
      if(err) return console.log("connection close due to error",err);
      res.end();
    
    });
  }
});


server.listen(8000, "127.0.0.1");