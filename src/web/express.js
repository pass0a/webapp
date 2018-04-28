(function (){
    var fs   = require("fs");
    function express(){
        var routes=[];
        var nextflag=0;
        var pathToRegexp = require('./path-to-regexp');
        var url=require("url");
        var http=require("http").createServer(function(req,res){
			var body;
			req.on("data",function(buf){
                switch(buf.constructor.name){
                    case "Uint8Array":
                        if(body==undefined){
                            body=buf;
                        }else{
                            if(body.constructor.name=="Uint8Array"){
                                var len=body.length;
                                var tmp=body;
                                body=new Uint8Array(body.length+buf.length);
                                body.set(tmp,0);
                                body.set(buf,len);
                            }
                        }    
                    break;
                    case "String":
                        if(body==undefined){
                            body=buf;
                        }else{
                            body+=buf;
                        }
                    break;
                    default:

                    break;
                }
			});
			req.on("end",function(){
                try{
                    var info=url.parse(req.url,true);
                    var params=info.query;
                    req.info=info;
                    req.body=body;
                    // console.log(body);
                    for(var idx=0;idx<routes.length;idx++){
                        var re=pathToRegexp("("+routes[idx].path+")");
                        var ret=re.exec(info.pathname);
                        if(ret){
                            nextflag=0;
                            routes[idx].fn(req,res,next)
                            if(!nextflag){
                                return 0;
                            }
                        }
                    }
                }catch(e){
                    console.log(e.stack);
                }
            });
        });
        function next(){
            nextflag=1;
        }
        this.use=function(){
            var obj={};
            switch(arguments.length){
                case 0:
                    return ;
                break;
                case 1:
                    obj.fn=arguments[0];
                    obj.path=".*";
                break;
                default:
                    obj.fn=arguments[1];
                    obj.path=arguments[0];
                break;
            }
            routes.push(obj);
            // if(arguments.length==1){
            //     if(typeof routes[".*"]!="object"){
            //         routes[".*"]=[];
            //     }
            //     routes[".*"].push(arguments[0]);
            // }
            // if(arguments.length==2){
            //     if(typeof routes[arguments[0]]!="object"){
            //         routes[arguments[0]]=[];
            //     }
            //     routes[arguments[0]].push(arguments[1]);
            // }
        }
        this.listen=function(port){
            http.listen(port);
        }
    }
    function createServer(){
        return new express();
    }
    module.exports = createServer;
})();
