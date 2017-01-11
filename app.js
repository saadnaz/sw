/**
 * Created by saadna on 11/01/2017.
 */

if ('serviceWorker' in navigator)  {

    navigator.serviceWorker
        .register('./service-worker.js',{scope:'./'})
        .then(function(registration){
             console.log("Service Worker Registered") ;
        })
        .catch(function(err){
            console.log("Service Worker failed to register",err)
        })
}


//Function to perform HTTP request

var get = function(url)
{
    return new Promise(function(resolve,reject){

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange=function(){
            if(xhr.readyState===XMLHttpRequest.DONE) {
                if (xhr.status===200) {
                    var result = xhr.responseText;
                    result = JSON.parse(result) ;
                    resolve(result);
                } else{
                    reject(xhr)  ;
                }
            }
        } ;

        xhr.open("GET",url,true) ;
        xhr.send();
    });
};



    get('https://api.nasa.gov/planetary/apod?api_key=NNKOjkoul8n1CH18TWA9gwngW1s1SmjESPjNoUFo')

    .then(function(response){
        //console.log("success",response);
        console.log("success");
        document.getElementsByClassName('targetImage')[0].src=response.url;
    })
    .catch (function(err){
     console.log("Error",err)  ;
    })


