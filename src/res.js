try {
    var url=require("url"),
        fs=require("fs"),
        mime=require('./web/mime')(),
        path=require("path");

    function formatPath(dir,ext){
        var pathname=dir+ext;
        if (path.extname(pathname)=="") {
            pathname+="/";
        }
        if (pathname.charAt(pathname.length-1)=="/"){
            pathname+="index.html";
        }
        return pathname;
    }
    (function (){
        function res(req,res,next){
            var info=url.parse(req.url,true);
            var params=info.query;
            var pn="";
            switch(params.action){
                case "prj":
                    pn=formatPath(process.cwd()+"/tmp",info.pathname);
                    break;
                default:
                    pn=formatPath(process.cwd()+"/view",info.pathname);
                    break;
            }
			var r=new fs.ReadStream(pn);
            r.on("error",function(){
				res.writeHead(404, {"Content-Type": "text/html"});
                    res.end("<h1>404 Not Found</h1>");
			})	
			r.on("open",function(){
				res.writeHead(200, {"Content-Type": mime(pn),"Content-Length":data.length});
			});
			r.on("data",function(data){
				res.send(data);
			});
			r.on("close",function(){
				res.end();
			})
            });
        }
        module.exports = res;
    })();
} catch (e) {
    console.log(e.stack);
}