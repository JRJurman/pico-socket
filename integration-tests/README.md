## Integration Tests

These integration tests launch the sample app (included in this repo), and
verify that the GPIO pins are set in the way we expect, and that they are
shared between clients in the way we expect.

We are using the library [Nightmare](https://github.com/segmentio/nightmare),
some of the syntax has is slightly non-standard, in part to enable the tests
to work with jest, in part to handle launching multiple clients at the same time.

### How to run

To run these tests, do the following:

1. Run `npm run sample`
2. Run `npm run int`
