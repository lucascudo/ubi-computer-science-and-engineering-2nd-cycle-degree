const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.di.ubi.pt/~ngpombo',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
