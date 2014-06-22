Thank you for your intention to contribute!

If you want to provide feedback, make a suggestion, or report a bug, create an
[issue on GitHub](https://github.com/denis-sokolov/frozen-express/issues).

## Develop

If you want to experiment with the code and maybe even send a pull request,
use `npm install` and `npm test`. The code should be test-driven.
`npm run coverage` will show you your code coverage.

Before you start doing really big changes,
it is advisable to open an issue to discuss it up front in case to
avoid doing work that I will be hesitant to merge in for whatever reason.

### Server configuration

If you work on anything related to serving the resulting files, such as `.htaccess` files, you need server tests on a real Apache:

1. Build a test app using `node test/server/build.js --server SERVER <path>`;
2. Serve it using the server;
3. Run `FROZEN_TEST_URL=http://localhost/ npm run test-server-run`.
