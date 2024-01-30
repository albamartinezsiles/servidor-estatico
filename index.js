//hay que escribirle una cabecera de respuesta. Debe incluir el status y el content type.  Esto se hace a partir de la respuesta con el método ->
//respuesta.writeHead(status,headers-objeto)
//fs.stat(ruta/a/un/fichero) -> retorna las propiedades de un fichero/directorio. NO lo abre.


//IaaS -> infreaestructura como servicio. Tienes que armarlo tu
//PaaS -> Plataforma como servicio
//CICD -> Integración contínua y despliegue contínuo. Permite utilizando GIT como eje central desarrollo y producción dividido

const {createServer} = require("http");
const fs = require("fs");

function contentType(extension){ //funcion para determinar el content : type
    switch(extension){
        case "html" : return "text/html";
        case "css" : return "text/css";
        case "js" : return "text/javascript";
        case "jpg" : return "image/jpeg";
        case "png" : return "image/png";
        case "json" : return "application/json";
        default : return "text/plain";
    }
}

function servirFichero(respuesta,ruta,tipo,status){
    respuesta.writeHead(status, {"Content-Type" : tipo}); 
    
    let fichero = fs.createReadStream(ruta);

    fichero.pipe(respuesta);
    
    fichero.on("end", () => {
        respuesta.end();
    });
}

const servidor = createServer((peticion, respuesta) => {
    if(peticion.url == "/"){ 
        servirFichero(respuesta,"./estaticos/index.html","text/html",200) // Corregido a index.html
    }else{
        let ruta = "./estaticos" + peticion.url;
        fs.stat(ruta,(error, datos) => {
            if(!error && datos.isFile()){ //si lo que busco existe y ES un fichero
                return servirFichero(respuesta,ruta,contentType(ruta.split(".").pop()),200); // Faltaba un paréntesis aquí
            }
            servirFichero(respuesta,"./404.html","text/html",404); 
        });
    }
});

servidor.listen(process.env.PORT || 3000); //env es enviroment -> process.env es un objeto que guarda TODAS las variables de entorno. Si hay una variable puerto(port) dentro usala, si no, usa la 3000. Esto va a hacer que funcione el puerto 3000 en local y uno random que te de el servidor