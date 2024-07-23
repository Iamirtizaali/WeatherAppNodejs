const http= require('http');
const fs= require('fs');
const requests=require('requests');

const homefile=fs.readFileSync("home.html","utf-8");

const replaceval=(tempval,orgval)=>{
    let temperature=tempval.replace("{%tempval%}",Number(orgval.main.temp-273.15).toFixed(2));
     temperature=temperature.replace("{%tempmin%}",Number(orgval.main.temp_min-273.15).toFixed(2));
     temperature=temperature.replace("{%tempmax%}",Number(orgval.main.temp_max-273.15).toFixed(2));
     temperature=temperature.replace("{%location%}",orgval.name);
     temperature=temperature.replace("{%country%}",orgval.sys.country);
     temperature=temperature.replace("{%tempstatus%}",orgval.weather[0].main);
    console.log(orgval.weather[0].main);
    return temperature;
}

const server=http.createServer(function(req,res){
    if (req.url=="/"){
        requests('https://api.openweathermap.org/data/2.5/weather?q=Sahiwal&appid=1792906c1c406c69e1567a9ac9956d10')
        .on('data', function (chunk) {
            const dataobj = JSON.parse(chunk);
            const arr=[dataobj];
           //console.log(dataobj);
            //console.log(arr[0].main.temp)
            //console.log(arr[0].)
            const realtimedata=arr.map((val)=>replaceval(homefile, val)).join('');
            res.writeHead(200,{'Content-Type': 'text/html'});
            res.write(realtimedata);
           //console.log(realtimedata);
        })
        .on('end', function (err) {
            if (err) return console.log('connection closed due to errors', err);
            res.end();
           // console.log('end');
        });
    }
    else{
        res.writeHead(404,{"Content-Type":"text/html"});
        res.write("<h1>404 Not Found</h1>");
        res.end();
    }
    //res.writeHead(200,{"Content-Type":"text/html"});
   // res.write(homefile);
    //res.end();
});


server.listen(8080);