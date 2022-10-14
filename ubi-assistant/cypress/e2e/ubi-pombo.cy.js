describe('ubi-pombo', () => {
  const newsText = 'Frequência: 04.01.2023, 18h00, sala 6.26'
  const cuRow = 2
  const lectureIndex = {
    row: 6,
    column: 1,
  }

  it('goes to ngpombo\'s curricular unit homepage', () => {
    const getCuElement = () => cy.get('ul.ul-dates').eq(cuRow).children('li').eq(1)

    cy.visit('~ngpombo/')
    cy.get('ul#navigation').children('li').eq(2).contains('Teaching').click()
    getCuElement().contains('Qualidade de Software')
    getCuElement().children('div.content').children('p').children('a')
        .should('have.attr', 'href', './units/sq.html')
        .invoke('removeAttr', 'target')
        .click()
  })

  it('verifies the news', () => {
    cy.get('div#News > ul').contains('li', newsText).should(elem => {
      expect(elem.text().trim()).to.equal(newsText)
    })
  })

  it('confirms the inexistence of new lectures', () => {
    cy.get('button').contains('Lecture Notes').click()
    cy.get('div#LectureNotes > table > tbody > tr')
        .eq(lectureIndex.row).children('td').eq(lectureIndex.column).should('be.empty')
  })

  it('confirms that the grades are TBD', () => {
    cy.get('button').contains('Grades').click()
    cy.get('div#Grades').contains('TBD').should(elem => {
      expect(elem.text().trim()).to.equal('TBD')
    })
  })
})