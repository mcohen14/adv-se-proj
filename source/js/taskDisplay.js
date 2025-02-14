
// variable for turning on/off console logs used for debugging
// const B_CONSOLE_LOG = false;

/**
 * Custom HTML element encapsulating the display of current and next task during a pomo
 * @extends HTMLElement
 */

export class TaskDisplay extends HTMLElement {

    /**
     * Attributes that this object observes
     * @static
     * @type {String[]}
     */
    static get observedAttributes() { return ["currtask", "nexttask", "numtasks"]; }

    /**
     * Constructor. Initializes elements of taskdisplay, and default valu of attributes.
     */
    constructor() {
        super();
        //wrapper div
        let o_wrapper_obj = document.createElement("div");
        o_wrapper_obj.className = "middle-container";

        //current task header
        let o_curr_title = document.createElement("h3");
        o_curr_title.innerText = "Current Task:";

        //div for box displaying current
        let o_curr_disp = document.createElement("div");
        o_curr_disp.id = "current";
        o_curr_disp.innerHTML = "Do this";

        let o_wrap_btn = document.createElement("span");
        o_wrap_btn.id = "wrap-check-btn";
        o_wrap_btn.className = "btn-wrapper";

        //check button
        let o_check_btn = document.createElement("button");
        o_check_btn.className = "btn";
        o_check_btn.id = "check";
        o_check_btn.title = TaskDisplay.S_CHECK_BUTTON_TITLE;

        let o_next_btn = document.createElement("i");
        o_next_btn.classList.add("fas", "fa-check-circle", "fa-x", "tool");

        let o_error_mssg = document.createElement("span");
        o_error_mssg.id = "check-error";
        o_error_mssg.className = "error-mssg";
        o_error_mssg.innerHTML = TaskDisplay.S_CHECK_ERROR;

        // assign event handler for checking tasks off
        let f_handle_check = () => { document.EventBus.fireEvent("nextTask") };
        o_check_btn.addEventListener("click", f_handle_check);
        o_check_btn.append(o_next_btn);

        o_wrap_btn.append(o_check_btn, o_error_mssg);

        //header for next task
        let o_next_title = document.createElement("h3");
        o_next_title.innerText = "Next Task";

        //div for box displaying next
        let o_next_disp = document.createElement("div");
        o_next_disp.id = "next";

        // hidden(not added) next tasks When a Session is Active 
        o_wrapper_obj.append(o_curr_title, o_curr_disp, o_wrap_btn);
        this.append(o_wrapper_obj);

        /*keeps track of the number of tasks*/
        this.setAttribute("numtasks", 0);
        this.setAttribute("currtask", -1);
        this.setAttribute("nexttask", -1);

        this.handleEndSession();
    }

    /**
     * Handler for when attributes are changed
     * An attribute name is passed in to select the element in the taskDisplay, append
     * its respective attributes are changed based on the name passed in
     * @param {String} name name of changed attribute
     * @param {*} oldValue old value of attribute
     * @param {*} newValue new value of attribute
     */
    attributeChangedCallback(name, oldValue, newValue) {
        this.wrapperAttributeFunction(name, oldValue, newValue);
    }

    /**
     * Helper function for attributeChangedCallback:
     * When attributes are changed
     * An attribute name is passed in to select the element in the taskDisplay, append
     * its respective attributes are changed based on the name passed in
     * @param {String} name name of changed attribute
     * @param {*} oldValue old value of attribute
     * @param {*} newValue new value of attribute
     */
    wrapperAttributeFunction(name, oldValue, newValue) {
        if (name == "numtasks" && newValue > 1) {
            this.getElementsByTagName("h3")[0].style.display = "";
        }
        else if (name == "currtask") {
            this.querySelector("#current").innerText = newValue;
        }
    }

    /**
     * Helper function called from parent component to disable button during breaks.
     */
    disableCheck() {
        this.querySelector("#check").disabled = true;
        let o_S_CHECK_ERROR = this.querySelector("#check-error");
        o_S_CHECK_ERROR.title = "";
        o_S_CHECK_ERROR.classList.add("color-error");
    }

    /**
     * Helper function called from parent component to enable button.
     */
    enableCheck() {
        this.querySelector("#check").disabled = false;
        this.querySelector("#check-error").title = TaskDisplay.S_CHECK_TOOLTIP;
        this.querySelector("#check-error").classList.remove("color-error");
    }

    /**
     * Hides all TaskDisplay related items within task-display
     */
    handleEndSession() {
        this.querySelector(".middle-container").style.display = "none";
    }


    /**
     * shows all TaskDisplay related items within task-display
     */
    handleStartSession() {
        this.querySelector(".middle-container").style.display = "block";
    }
}

/**
 * Tooltip when check button is hovered upon
 * @static
 * @type {String}
 */
TaskDisplay.S_CHECK_TOOLTIP = "Task completed!";

/**
 * Error message when check button is incorrectly handled
 * @static
 * @type {String}
 */
TaskDisplay.S_CHECK_ERROR = "Tasks cannot be checked off during breaks!";

/**
 * Title message of check button
 * @static
 * @type {String}
 */
TaskDisplay.S_CHECK_BUTTON_TITLE = "Task completed";
customElements.define("task-display", TaskDisplay);


export default { TaskDisplay }
