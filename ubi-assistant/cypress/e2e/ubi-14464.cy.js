describe("ubi-14464", () => {
  it("goes to UBI's SAML login page", () => {
    cy.visit("https://moodle.ubi.pt/auth/saml/login.php")
    cy.get("div.loginpanel").children("center").children("a")
        .should("have.attr", "href", "index.php").click()
  })

  it("authenticates as student", () => {
    console.log(process.env)
    cy.get("input#userNameInput").type(Cypress.env('UBI_EMAIL'))
    cy.get("input#passwordInput").type(Cypress.env('UBI_PASSWORD'))
    cy.get("span#submitButton").click()
  })

  it("logout from Moodle", () => {
    cy.get("a#action-menu-toggle-0").click()
    cy.get("a.menu-action").eq(-1)
        .should("have.attr", "data-title", "logout,moodle")
        .should("be.visible")
        .click()
    cy.get("div.usermenu > span.login").contains("Utilizador não autenticado")
  })
})