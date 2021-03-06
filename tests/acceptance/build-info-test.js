import { test } from 'qunit';
import moduleForAcceptance from 'croodle/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | build info');

test('version is included as html meta tag', function(assert) {
  visit('/');

  andThen(function() {
    assert.ok($('head meta[name="build-info"]').length === 1, 'tag exists');
    assert.ok(
      $('head meta[name="build-info"]').attr('content').match(/^version=v\d[\d\.]+\d(-(alpha|beta|rc)\d)?(\+[\da-z]{8})?$/) !== null,
      'format '.concat($('head meta[name="build-info"]').attr('content'), ' is correct')
    );
  });
});
