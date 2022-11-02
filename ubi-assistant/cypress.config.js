const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "2a6gku",
  e2e: {
    experimentalSessionAndOrigin: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
