describe("ubi-14450", () => {
  const NEWS_TEXT = "Frequência: 04.01.2023, 18h00, sala 6.26"
  const CU_ROW = 2
  const LAST_LECTURE = {
    row: 6,
    column: 1,
  }

  it("goes to the curricular unit homepage", () => {
    const getCuElement = () => cy.get("ul.ul-dates").eq(CU_ROW).children("li").eq(1)

    cy.visit("https://www.di.ubi.pt/~ngpombo/")
    cy.get("ul#navigation").children("li").eq(2).contains("Teaching").click()
    getCuElement().contains("Qualidade de Software")
    getCuElement().children("div.content").children("p").children("a")
        .should("have.attr", "href", "./units/sq.html")
        .invoke("removeAttr", "target")
        .click()
  })

  it("verifies the news", () => {
    cy.get("div#News > ul").contains("li", NEWS_TEXT).should(elem => {
      expect(elem.text().trim()).to.equal(NEWS_TEXT)
    })
  })

  it("confirms the inexistence of new lectures", () => {
    cy.get("button").contains("Lecture Notes").click()
    cy.get("div#LectureNotes > table > tbody > tr")
        .eq(LAST_LECTURE.row).children("td").eq(LAST_LECTURE.column).should("be.empty")
  })

  it("confirms that the grades are TBD", () => {
    cy.get("button").contains("Grades").click()
    cy.get("div#Grades").contains("TBD").should(elem => {
      expect(elem.text().trim()).to.equal("TBD")
    })
  })
})