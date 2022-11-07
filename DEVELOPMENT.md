## Developing Pico-Socket

### Project structure

The pico-socket project is composed of several pieces:

- `/bin`
  - contains files for running the server and creating the `package.json`
  - these files power the `pico-socket` command that can be run with `npx`
- `/lib`
  - exposed functions for adding client logic and running the express / socket-io server
  - if javascript-inclined users want to do change the internal behavior, they can use some of these functions
- `/integration-tests`
  - integration tests that verify websocket configuration and behavior
  - these depend on running the app already, using `npm run sample`
- `/sample`
  - sample pico-8 game to verify the behavior of pico-socket

### Verifying changes

When making / proposing changes to pico-8, be sure to run the following:

- unit tests (via `npm run test`)
- integration tets (by running `npm run sample` and `npm run int`)
