describe('payment methods', () => {
  beforeEach(() => {
    cy.visit('/admin');
    cy.get('[id="_username"]').type('sylius');
    cy.get('[id="_password"]').type('sylius');
    cy.get('.primary').click();
  });
  // Remove .only and implement others test cases!
  it('change cash on delivery position', async () => {
    // Click in payment methods in side menu
    cy.clickInFirst('a[href="/admin/payment-methods/"]');
    // Type in value input to search for specify payment method
    cy.get('[id="criteria_search_value"]').type('cash');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in edit of the last payment method
    cy.get('*[class^="ui labeled icon button "]').last().click();
    // Type 1 in position field
    cy.get('[id="sylius_payment_method_position"]').type('1');
    // Click on Save changes button
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    // Assert that payment method has been updated
    cy.get('body').should('contain', 'Payment method has been successfully updated.');
  });

  it('test case 2', () => {
    cy.clickInFirst('a[href="/admin/payment-methods/"]');

    cy.get('[id="criteria_search_value"]').type('bank_transfer');

    cy.get('*[class^="ui blue labeled icon button"]').click();
    cy.get('*[class^="ui labeled icon button "]').click();
    
    cy.get('[id="sylius_payment_method_enabled"]').click({force:true});
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    cy.get('body').should('contain', 'Payment method has been successfully updated.');
  });
  
  it('test case 3', () => {
    cy.clickInFirst('a[href="/admin/payment-methods/"]');
    
    cy.get('*[class^="ui labeled icon top right floating dropdown button primary link"]').click();
    
    cy.get('[id="offline"]').click()

    cy.get('[id="sylius_payment_method_code"]').type('credit_card')
    cy.get('[id="sylius_payment_method_position"]').type('2')
    cy.get('[id="sylius_payment_method_translations_en_US_name"]').type('Credit Card')

    cy.get('*[class^="ui labeled icon primary button"]').last().click();

    cy.get('body').should('contain', 'Payment method has been successfully created.');
  });

  it('test case 4', () => {
    cy.clickInFirst('a[href="/admin/payment-methods/"]');

    cy.get('[id="criteria_search_value"]').type('credit_card');
    cy.get('*[class^="ui blue labeled icon button"]').click();
    
    cy.get('*[class^="ui red labeled icon button"]').last().click();
    cy.get('[id="confirmation-button"]').click();
    cy.get('body').should('contain', 'Payment method has been successfully deleted.');
  });

});
