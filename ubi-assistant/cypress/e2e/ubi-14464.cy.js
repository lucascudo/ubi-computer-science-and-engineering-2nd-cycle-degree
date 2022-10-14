describe("ubi-14464", () => {

  it("verifies the latest latest news and lectures", () => {
    const MOODLE_URL = "https://moodle.ubi.pt/"
    const env = Cypress.env("14464")

    cy.log("navigates to UBI`s SAML login page")
    Cypress.log({ message: "navigates to UBI`s SAML login page" })
    cy.visit(MOODLE_URL + "auth/saml/login.php")
    cy.get("div.loginpanel").children("center").children("a")
        .should("have.attr", "href", "index.php").click()

    cy.log("authenticates as a student")
    cy.get("input#userNameInput").type(Cypress.env("UBI_EMAIL"))
    cy.get("input#passwordInput").type(Cypress.env("UBI_PASSWORD"))
    cy.get("span#submitButton").click()

    cy.log("navigates to the curricular unit homepage")
    cy.get("li.type_course[data-node-id=\"expandable_branch_20_17353\"] > p > a")
        .contains("14464")
        .should("have.attr", "title", "PROTOCOLOS DE COMUNICACAO")
        .click()

    cy.log("verifies the latest news")
    cy.get("a.aalink")
        .should("have.attr", "href", MOODLE_URL + "mod/forum/view.php?id=267063")
        .click()
    cy.get("table.table.discussion-list > tbody > tr.discussion").eq(0)
        .children("th").children("div").children("a").contains(env.LAST_DISCUSS.title)
        .should("have.attr", "href", MOODLE_URL + env.LAST_DISCUSS.url)
        .should("have.attr", "title", env.LAST_DISCUSS.title)
        .should("have.attr", "aria-label", env.LAST_DISCUSS.title)
        .click()

    cy.log("confirms the inexistence of new lectures")
    cy.get("div.forumpost.focus-target.firstpost.starter div.body-content-container a")
        .should("have.length", 2)
        .eq(0)
        .contains(env.LAST_FILE.name)
        .should("have.attr", "href", MOODLE_URL + env.LAST_FILE.url)
        .should("have.attr", "aria-label", "Anexo " + env.LAST_FILE.name)

    //TODO check student report at https://moodle.ubi.pt/grade/report/user/index.php?id=17353

    cy.log("logout from Moodle")
    cy.get("a#action-menu-toggle-0").click()
    cy.get("a.menu-action").eq(-2)
        .should("have.attr", "data-title", "logout,moodle")
        .should("be.visible")
        .click()
    cy.get("div.usermenu > span.login").contains("Utilizador não autenticado")
  })
})