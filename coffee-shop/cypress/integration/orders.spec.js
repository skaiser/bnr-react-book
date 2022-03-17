describe('Orders', () => {
  before(() => {
    cy.request('DELETE', '/api/orders');
  });

  it('User can build a cart and place an order', () => {
    cy.visit('/');
    cy.findByRole('link', { name: /Apple/ }).click();
    cy.findByText(/Price:/).should('exist');
    cy.findByRole('button', { name: 'Add to Cart' }).click();
    cy.findByTestId('cart-quantity').should('contain', '1');
    cy.findByRole('button', { name: 'Add to Cart' }).click();
    cy.findByTestId('cart-quantity').should('contain', '2');
    cy.findByRole('link', { name: /Cart/i }).click();
    cy.findByLabelText(/Name/).should('exist');
    cy.findByRole('button', { name: 'Place Order' }).should('be.disabled');
    cy.findByLabelText(/Name/).type('Big Nerd Ranch');
    cy.findByLabelText(/Zip Code/).type('30307');
    cy.findByRole('button', { name: 'Place Order' }).should('be.enabled');
    cy.findByRole('button', { name: 'Place Order' }).click();
    cy.findByText(/Thanks for your order/).should('exist');
    cy.findByRole('button', { name: /Return home/i }).click();
    cy.findAllByTestId('thumbnail-component');
  });

  it('Can View and Delete Orders', () => {
    cy.visit('/');
    cy.login();
    cy.findByRole('link', { name: 'Orders' }).click();
    cy.findByRole('button', { name: 'Delete Order' }).click();
    cy.findByText(/No Orders/).should('exist');
  });
});
