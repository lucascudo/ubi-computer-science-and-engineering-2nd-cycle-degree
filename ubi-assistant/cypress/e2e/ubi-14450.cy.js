describe("ubi-14450", () => {
  const env = Cypress.env("14450")

  it("navigates to the curricular unit homepage", () => {
    const getCuElement = () => cy.get("ul.ul-dates").eq(env.CU_ROW).children("li").eq(1)

    cy.visit("https://www.di.ubi.pt/~ngpombo/")
    cy.get("ul#navigation").children("li").eq(2).contains("Teaching").click()
    getCuElement().contains("Qualidade de Software")
    getCuElement().children("div.content").children("p").children("a")
        .should("have.attr", "href", "./units/sq.html")
        .invoke("removeAttr", "target")
        .click()
  })

  it("verifies the last news", () => {
    cy.get("div#News > ul").contains("li", env.NEWS_TEXT).should(elem => {
      expect(elem.text().trim()).to.equal(env.NEWS_TEXT)
    })
  })

  it("confirms the inexistence of new lectures", () => {
    cy.get("button").contains("Lecture Notes").click()
    cy.get("div#LectureNotes > table > tbody > tr")
        .eq(env.LAST_LECTURE.row).children("td")
        .eq(env.LAST_LECTURE.column).should("be.empty")
  })

  it("confirms that the grades are TBD", () => {
    cy.get("button").contains("Grades").click()
    cy.get("div#Grades").contains("TBD").should(elem => {
      expect(elem.text().trim()).to.equal("TBD")
    })
  })
})