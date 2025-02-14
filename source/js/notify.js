
// variable for turning on/off console logs used for debugging
// const B_CONSOLE_LOG = false;
/**
 * Sends web notifications to the user representing the state of the timer.
 * @param {number} n_state number denoting the state of the timer. 
 * See timerContainer.js for timer state values.
 */
function notify(n_state){
    let o_options = {
        silent: true
    }

    //check if notifications are supported
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notifications.");
        return;
    }
  
    //check if notifications are turned on
    if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
            //ask user to enable notifications
            if (permission !== "granted") {
                alert("Please enable notifications.");
            }
        
            //send notification
            else if(Notification.permission !== "denied") {
                let s_alert = "All tasks completed. Good work!";
                //start new pomo notif
                if(n_state==0){ 
                    s_alert = "Time to start the next work session!";
                } else if(n_state==1) {
                    s_alert = "Time for a short break!";
                } else if(n_state==2) {
                    s_alert = "Time for a long break!";
                }
          
                let o_notification = new Notification(s_alert, o_options);

                // check safari
                let b_isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.
                    test(navigator.userAgent);

                //start new pomo notif
                if (b_isSafari) {
                    let o_promise = document.getElementById("notifs").play();

                    if (o_promise !== undefined) {
                        o_promise.catch(() => {
                            // Auto-play was prevented
                            // Show a UI element to let the user manually start playback

                            const b_showErrorNotification_preference = localStorage.
                                getItem("safari-error-notification-preference");

                            
                            if (b_showErrorNotification_preference === null || 
                                b_showErrorNotification_preference === "false") {
                                // show error notification view
                                let o_notifi = document.querySelector("notification-box");
                                o_notifi.showNotificationBox();
                            } 
                        }).then(() => {
                            // Auto-play started successfully
                        });
                    }

                } else {
                    let o_audio = document.getElementById("notifs");
                    if (o_audio){
                        o_audio.play();
                    }
                    
                }
                return o_notification;
            }
        }).catch(error => console.error(error));
    }
}

export { notify };
