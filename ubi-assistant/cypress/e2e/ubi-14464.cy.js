const CLASS_ID = "14464"

describe("ubi-" + CLASS_ID, () => {

  const SESSION_ID = "ubi-" + CLASS_ID + "session"
  const MOODLE_URL = Cypress.env("MOODLE_URL")
  const env = Cypress.env(CLASS_ID)

  before(() => {
    cy.session(SESSION_ID, () => {
      cy.visit(MOODLE_URL + "auth/saml/login.php")
      cy.get("div.loginpanel").children("center").children("a")
          .should("have.attr", "href", "index.php").click()
      cy.get("input#userNameInput").type(Cypress.env("UBI_EMAIL"))
      cy.get("input#passwordInput").type(Cypress.env("UBI_PASSWORD"))
      cy.get("span#submitButton").click()
      cy.url().should("eq", MOODLE_URL + "my/")
      cy.get("header#page-header").should("contain.text", "Bem-vindo(a) novamente,")
    })
  })

  after(() =>{
    Cypress.session.clearAllSavedSessions()
  })

  it("verifies the curricular unit homepage", () => {
    cy.session(SESSION_ID)
    cy.visit(MOODLE_URL)
    cy.get(`li.type_course[data-node-id="expandable_branch_20_${env.COURSE_ID}"] > p > a`)
        .contains("14464")
        .should("have.attr", "title", env.CLASS_NAME)
  })

  it("verifies the latest lectures", () => {
    cy.session(SESSION_ID)
    cy.visit(MOODLE_URL + "course/view.php?id=" + env.COURSE_ID)
    cy.get("header#page-header").should("contain.text", env.CLASS_NAME)
    cy.get("a.aalink").eq(-1)
        .should("contain.text", env.LAST_FILE_NAME)
        .should("have.attr", "href", MOODLE_URL + "mod/resource/view.php?id=" + env.LAST_FILE_ID)

  })

  it("verifies the latest discussions", () => {
    cy.session(SESSION_ID)
    cy.visit(MOODLE_URL + "course/view.php?id=" + env.COURSE_ID)
    cy.get("a.aalink").eq(0)
        .should("contain.text", "Anúncios")
        .should("have.attr", "href", MOODLE_URL + "mod/forum/view.php?id=" + env.FORUM_ID)
        .click()
    cy.get("table.table.discussion-list > tbody > tr.discussion").eq(0)
        .children("th").children("div").children("a").contains(env.LAST_DISCUSS_TITLE)
        .should("have.attr", "title", env.LAST_DISCUSS_TITLE)
        .should("have.attr", "aria-label", env.LAST_DISCUSS_TITLE)
  })

  //TODO check student report at https://moodle.ubi.pt/grade/report/user/index.php?id=17353
})