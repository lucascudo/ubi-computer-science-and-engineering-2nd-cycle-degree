describe('ubi-assistant', () => {
  it('passes', () => {
    const homeText = 'Frequência: 04.01.2023, 18h00, sala 6.26'
    const index = {
      row: 6,
      column: 1,
    };

    cy.visit('/units/sq.html')
    cy.get('div#News > ul').contains('li', homeText)
    cy.get('button').eq(2).contains('Lecture Notes').click()
    cy.get('div#LectureNotes > table > tbody > tr').eq(index.row).children('td').eq(index.column).should('be.empty')
    cy.get('button').eq(3).contains('Grades').click()
    cy.get('div#Grades').contains('TBD').should(elem => {
      expect(elem.text().trim()).to.equal('TBD');
    });
  })
})