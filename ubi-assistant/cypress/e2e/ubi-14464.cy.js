require('dotenv').config()

describe("ubi-14464", () => {
  it("goes to UBI's SAML login page", () => {
    cy.visit("https://moodle.ubi.pt/auth/saml/login.php")
    cy.get("div.loginpanel").children("center").children("a")
        .should("have.attr", "href", "index.php").click()
  })

  it("authenticates as student", () => {
    cy.get("input#userNameInput").type(env.UBI_EMAIL)
    cy.get("input#passwordInput").type(env.UBI_PASSWORD)
    cy.get("span#submitButton").click()
  })

  it("logout from moodle", () => {
    cy.get("a#action-menu-toggle-0").click()
    cy.get("a.menu-action").eq(-1)
        .should("have.attr", "data-title", "logout,moodle")
        .should("be.visible")
        .click()
  })
})