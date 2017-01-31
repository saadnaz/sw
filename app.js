/**
 * Created by saadna on 11/01/2017.
 */
var swRegistration = null;
var applicationServerPublicKey = 'BBrm10zUdMNDKHWp5UnCLm0dKbTyhWY9yQuta-ULKIajqc3ndP_Fahdtb3Y_cJtn0pCODpkx2RIBAdH2TvtY8AI';

var pushButton = document.querySelector('.js-push-btn');
var isSubscribed = false;



function urlB64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function updateBtn() {
    if (Notification.permission === 'denied') {
        pushButton.textContent = 'Push Messaging Blocked.';
        pushButton.disabled = true;
        updateSubscriptionOnServer(null);
        return;
    }

    if (isSubscribed) {
        pushButton.textContent = 'Disable Push Messaging';
    } else {
        pushButton.textContent = 'Enable Push Messaging';
    }

    pushButton.disabled = false;
}


function updateSubscriptionOnServer(subscription) {
    // TODO: Send subscription to application server

    const subscriptionJson = document.querySelector('.js-subscription-json');
    const subscriptionDetails =
        document.querySelector('.js-subscription-details');

    if (subscription) {
        subscriptionJson.textContent = JSON.stringify(subscription);
        subscriptionDetails.classList.remove('is-invisible');
    } else {
        subscriptionDetails.classList.add('is-invisible');
    }
}

function subscribeUser() {
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
    })
        .then(function(subscription) {
            console.log('User is subscribed:', subscription);

            updateSubscriptionOnServer(subscription);

            isSubscribed = true;

            updateBtn();
        })
        .catch(function(err) {
            console.log('Failed to subscribe the user: ', err);
            updateBtn();
        });
}

function unsubscribeUser() {
    swRegistration.pushManager.getSubscription()
        .then(function(subscription) {
            if (subscription) {
                return subscription.unsubscribe();
            }
        })
        .catch(function(error) {
            console.log('Error unsubscribing', error);
        })
        .then(function() {
            updateSubscriptionOnServer(null);

            console.log('User is unsubscribed.');
            isSubscribed = false;

            updateBtn();
        });
}

function initialiseUI() {
    pushButton.addEventListener('click', function() {
        pushButton.disabled = true;
        if (isSubscribed) {
            unsubscribeUser();
        } else {
            subscribeUser();
        }
    });
    // Set the initial subscription value
    swRegistration.pushManager.getSubscription()
        .then(function(subscription) {
            isSubscribed = !(subscription === null);

            updateSubscriptionOnServer(subscription);

            if (isSubscribed) {
               // console.log('User IS subscribed.');
                unsubscribeUser();
            } else {

               // console.log('User is NOT subscribed.');
                subscribeUser();
            }

            updateBtn();
        });
}

if ('serviceWorker' in navigator && 'PushManager' in window)  {

    console.log('Service Worker and Push is supported');

    navigator.serviceWorker
        .register('./service-worker.js',{scope:'./'})
        .then(function(registration){
             console.log("Service Worker Registered") ;
            swRegistration = registration;
            initialiseUI();
        })
        .catch(function(err){
            console.log("Service Worker failed to register",err)
        })
}
else {
    console.warn('Push messaging is not supported');
    pushButton.textContent = 'Push Not Supported';
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
        console.log("got image from nasa");
        var secureUrl = response.url.replace('http://','https://');
        document.getElementsByClassName('targetImage')[0].src=secureUrl;
    })
    .catch (function(err){
     console.log("Error",err)  ;
    });


