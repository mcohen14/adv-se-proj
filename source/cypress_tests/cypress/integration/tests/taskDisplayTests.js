describe("Task Display Tests", () => {
    beforeEach(() => {
        cy.visit("https://powelldoro.web.app/");
        cy.get('welcome-box > #welcome > .close2').click();
        cy.document().then((o_doc) => {
            if (!o_doc.querySelector("timer-element").B_DEBUG) {
                o_doc.querySelector("timer-element").toggleDebug();
            }
            cy.spy(o_doc.querySelector("task-display"), "enableCheck");
            cy.spy(o_doc.querySelector("task-display"), "disableCheck");
        });
    });

    it("Test enableCheck function is called correctly", () => {

        //Task added so that session could be started for testing
        cy.get("#task-btn").trigger("click");
        cy.get("task-list").within(() => {
            cy.get("#task-input-top").clear().type("First Test Task");
            cy.get("#add-btn").trigger("click");
            cy.get("#close-task").trigger("click");
        });

        cy.clock();

        //Session started
        cy.get("timer-element").within(() => {
            cy.get("#start-btn").trigger("click");
        });

        //enableCheck function called when session starts
        cy.document().then((o_doc) => {
            expect(o_doc.querySelector("task-display").enableCheck).to.have.callCount(1);
        });

        cy.tick(6200);

        //enableCheck function called when break ends and work cycle starts
        cy.document().then((o_doc) => {
            expect(o_doc.querySelector("task-display").enableCheck).to.have.callCount(2);
        });
    });

    it("Test disableCheck function is called correctly", () => {

        //Task added so that session could be started for testing
        cy.get("#task-btn").trigger("click");
        cy.get("task-list").within(() => {
            cy.get("#task-input-top").clear().type("First Test Task");
            cy.get("#add-btn").trigger("click");
            cy.get("#close-task").trigger("click");
        });

        cy.clock();

        //Session started
        cy.get("timer-element").within(() => {
            cy.get("#start-btn").trigger("click");
        });

        cy.tick(3100);

        //disableCheck function called when work cycle ends and short break starts
        cy.document().then((o_doc) => {
            expect(o_doc.querySelector("task-display").enableCheck).to.have.callCount(1);
        });

        cy.tick(6200 * 3);

        //disableCheck function called when work cycle ends and long break starts
        cy.document().then((o_doc) => {
            expect(o_doc.querySelector("task-display").enableCheck).to.have.callCount(4);
        });
    });

    it("Test Task Display Functionality when Session Starts and Ends", () => {

        //Two Tasks added to TaskList
        cy.get("#task-btn").trigger("click");
        cy.get("task-list").within(() => {
            cy.get("#task-input-top").clear().type("First Test Task");
            cy.get("#add-btn").trigger("click");
            cy.get("#task-input-top").clear().type("Second Test Task");
            cy.get("#add-btn").trigger("click");
            cy.get("#close-task").trigger("click");
        });

        //Session started
        cy.get("timer-element").within(() => {
            cy.get("#start-btn").trigger("click");
        });

        cy.get("task-display").within(() => {
            //Current task displays the first task
            cy.get("#current").should("contain", "First Test Task");
        });

        //Session ended
        cy.get("timer-element").within(() => {
            cy.get("#end-btn").trigger("click");
        });

        //Task displays become hidden
        cy.get("task-display").should("be.hidden");

    });

    it("Test Task Display Functionality when Check button is pressed", () => {

        //3 Tasks added to TaskList
        cy.get("#task-btn").trigger("click");
        cy.get("task-list").within(() => {
            cy.get("#task-input-top").clear().type("First Test Task");
            cy.get("#add-btn").trigger("click");
            cy.get("#task-input-top").clear().type("Second Test Task");
            cy.get("#add-btn").trigger("click");
            cy.get("#task-input-top").clear().type("Third Test Task");
            cy.get("#add-btn").trigger("click");
            cy.get("#close-task").trigger("click");
        });

        //Session started
        cy.get("timer-element").within(() => {
            cy.get("#start-btn").trigger("click");
        });

        cy.get("task-display").within(() => {
            //Current task display -> first task & Next task Display -> second task
            cy.get("#current").should("contain", "First Test Task");

            //Check button clicked: Current task checked as complete
            cy.get("#check").trigger("click");

            //Current task display -> second task & Next task Display -> third task
            cy.get("#current").should("contain", "Second Test Task");

        });
    });

    it("Test Check button is disabled during Break", () => {

        //3 Tasks added to TaskList 
        cy.get("#task-btn").trigger("click");
        cy.get("task-list").within(() => {
            cy.get("#task-input-top").clear().type("First Test Task");
            cy.get("#add-btn").trigger("click");
            cy.get("#task-input-top").clear().type("Second Test Task");
            cy.get("#add-btn").trigger("click");
            cy.get("#task-input-top").clear().type("Third Test Task");
            cy.get("#add-btn").trigger("click");
            cy.get("#close-task").trigger("click");
        });

        cy.clock();

        //Session started
        cy.get("timer-element").within(() => {
            cy.get("#start-btn").trigger("click");
        });

        cy.get("task-display").within(() => {
            //Work Cycle
            //Current task display -> first task & Next task Display -> second task
            cy.get("#current").should("contain", "First Test Task");
            //Check button clicked: Current task checked as complete
            cy.get("#check").trigger("click");
            //Current task display -> second task & Next task Display -> third task
            cy.get("#current").should("contain", "Second Test Task");

            //Wait for Short Break
            cy.tick(3100);

            //Short Break
            //Current task display -> second task & Next task Display -> third task
            cy.get("#current").should("contain", "Second Test Task");
            //Check button is disabled during a break
            cy.get("#check").should("be.disabled");
            //Current task display -> second task & Next task Display -> third task
            cy.get("#current").should("contain", "Second Test Task");

            //Wait for the Work Cycle
            cy.tick(3100);

            //Work Cycle
            //Current task display -> second task & Next task Display -> third task
            cy.get("#current").should("contain", "Second Test Task");
            //Check button clicked: Current task checked as complete
            cy.get("#check").trigger("click");
            //Current task display -> third task & Next task Display -> None(hidden)
            cy.get("#current").should("contain", "Third Test Task");

        });
    });

    it("Test Timer Display Functionality on Task Completion", () => {

        //3 Tasks added to TaskLists
        cy.get("#task-btn").trigger("click");
        cy.get("task-list").within(() => {
            cy.get("#task-input-top").clear().type("First Test Task");
            cy.get("#add-btn").trigger("click");
            cy.get("#task-input-top").clear().type("Second Test Task");
            cy.get("#add-btn").trigger("click");
            cy.get("#task-input-top").clear().type("Third Test Task");
            cy.get("#add-btn").trigger("click");
            cy.get("#close-task").trigger("click");
        });

        cy.clock();

        //Session started
        cy.get("timer-element").within(() => {
            cy.get("#start-btn").trigger("click");
        });

        //Work Cycle: Check button enabled
        cy.get("task-display").within(() => {
            //Current task display -> first task & Next task Display -> second task
            cy.get("#current").should("contain", "First Test Task");
            cy.wait(3000)
            //Check button clicked: Current task checked as complete
            cy.get("#check").trigger("click");
            //Current task display -> second task & Next task Display -> third task
            cy.get("#current").should("contain", "Second Test Task");
            //Check button clicked: Current task checked as complete
            cy.get("#check").trigger("click");
            //Current task display -> third task & Next task Display -> None
            cy.get("#current").should("contain", "Third Test Task");
            //Check button clicked: Current task checked as complete
            cy.get("#check").trigger("click");
            //Current task display -> None & Next task Display -> None (both hidden)
            cy.get("#current").should("be.hidden");

        });

        //Session ended on completion of tasks
        cy.get("timer-element").within(() => {
            cy.get("#work-message").should("contain", "Ready to focus?");
        });
    });
});