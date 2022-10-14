describe("ubi-14464", () => {
  it("goes to UBI`s SAML login page", () => {
    //navigates to UBI`s SAML login page
    cy.visit("https://moodle.ubi.pt/auth/saml/login.php")
    cy.get("div.loginpanel").children("center").children("a")
        .should("have.attr", "href", "index.php").click()

    //authenticates as a student
    cy.get("input#userNameInput").type(Cypress.env("UBI_EMAIL"))
    cy.get("input#passwordInput").type(Cypress.env("UBI_PASSWORD"))
    cy.get("span#submitButton").click()

    //navigates to the curricular unit homepage
    cy.get("li.type_course[data-node-id=\"expandable_branch_20_17353\"] > p > a")
        .contains("14464")
        .should("have.attr", "title", "PROTOCOLOS DE COMUNICACAO")
        .click()

    //verifies the last news
    cy.get("a.aalink")
        .should("have.attr", "href", "https://moodle.ubi.pt/mod/forum/view.php?id=267063")
        .click()
    cy.get("table.table.discussion-list > tbody > tr.discussion").eq(0)
        .children("th").children("div").children("a").contains("Aula 10/10")
        .should("have.attr", "href", "https://moodle.ubi.pt/mod/forum/discuss.php?d=126379")
        .should("have.attr", "title", "Aula 10/10")
        .should("have.attr", "aria-label", "Aula 10/10")
        .click()

    //confirms the inexistence of new lectures
    cy.get("div.forumpost.focus-target.firstpost.starter div.body-content-container a")
        .should("have.length", 2)
          .eq(0)
          .should("have.attr", "href", "https://moodle.ubi.pt/pluginfile.php/598937/mod_forum/attachment/132218/Lecture%202.zip?forcedownload=1")
          .should("have.attr", "aria-label", "Anexo Lecture 2.zip")
          .contains("Lecture 2.zip")

    //TODO check student report in https://moodle.ubi.pt/grade/report/user/index.php?id=17353

    //logout from Moodle
    cy.get("a#action-menu-toggle-0").click()
    cy.get("a.menu-action").eq(-2)
        .should("have.attr", "data-title", "logout,moodle")
        .should("be.visible")
        .click()
    cy.get("div.usermenu > span.login").contains("Utilizador não autenticado")
  })
})