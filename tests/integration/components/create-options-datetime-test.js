import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import moment from 'moment';

moduleForComponent('create-options-datetime', 'Integration | Component | create options datetime', {
  integration: true,
  beforeEach() {
    this.inject.service('store');
  }
});

/*
 * watch out:
 * polyfill adds another input[type="text"] for every input[type="time"]
 * if browser doesn't support input[type="time"]
 * that ones could be identifed by class 'ws-inputreplace'
 */

test('it generates inpute field for options iso 8601 date string (without time)', function(assert) {
  // validation is based on validation of every option fragment
  // which validates according to poll model it belongs to
  // therefore each option needs to be pushed to poll model to have it as
  // it's owner
  Ember.run(() => {
    this.set('poll', this.store.createRecord('poll', {
      isFindADate: true,
      isMakeAPoll: false
    }));
    this.set('options', Ember.computed.alias('poll.options'));
    this.get('options').pushObjects([
      { title: '2015-01-01' }
    ]);
  });
  this.render(hbs`{{create-options-datetime options=options}}`);

  assert.equal(
    this.$('.days .form-group input:not(.ws-inputreplace)').length,
    1,
    'there is one input field'
  );
  assert.equal(
    this.$('.days .form-group input:not(.ws-inputreplace)').val(),
    '',
    'value is an empty string'
  );
});

test('it generates inpute field for options iso 8601 datetime string (with time)', function(assert) {
  // validation is based on validation of every option fragment
  // which validates according to poll model it belongs to
  // therefore each option needs to be pushed to poll model to have it as
  // it's owner
  Ember.run(() => {
    this.set('poll', this.store.createRecord('poll', {
      isFindADate: true,
      isMakeAPoll: false
    }));
    this.set('options', Ember.computed.alias('poll.options'));
    this.get('options').pushObjects([
      { title: '2015-01-01T11:11:00.000Z' }
    ]);
  });
  this.render(hbs`{{create-options-datetime options=options}}`);

  assert.equal(
    this.$('.days .form-group input:not(.ws-inputreplace)').length,
    1,
    'there is one input field'
  );
  assert.equal(
    this.$('.days .form-group input:not(.ws-inputreplace)').val(),
    moment('2015-01-01T11:11:00.000Z').format('HH:mm'),
    'it has time in option as value'
  );
});

test('it groups input fields per date', function(assert) {
  // validation is based on validation of every option fragment
  // which validates according to poll model it belongs to
  // therefore each option needs to be pushed to poll model to have it as
  // it's owner
  Ember.run(() => {
    this.set('poll', this.store.createRecord('poll', {
      isFindADate: true,
      isMakeAPoll: false
    }));
    this.set('options', Ember.computed.alias('poll.options'));
    this.get('options').pushObjects([
      { title: moment('2015-01-01T10:11').toISOString() },
      { title: moment('2015-01-01T22:22').toISOString() },
      { title: '2015-02-02' }
    ]);
  });
  this.render(hbs`{{create-options-datetime options=options}}`);

  assert.equal(
    this.$('.days').length,
    2,
    'there are two form groups for the two different dates'
  );
  assert.equal(
    this.$('.days').eq(0).find('input:not(.ws-inputreplace)').length,
    2,
    'the first form group has two input fields for two different times'
  );
  assert.equal(
    this.$('.days').eq(0).find('input:not(.ws-inputreplace)').length,
    2,
    'the first form group with two differnt times for one day has two input fields'
  );
  assert.equal(
    this.$('.days').eq(1).find('input:not(.ws-inputreplace)').length,
    1,
    'the second form group without time has only one input field'
  );
});

test('allows to add another option', function(assert) {
  // validation is based on validation of every option fragment
  // which validates according to poll model it belongs to
  // therefore each option needs to be pushed to poll model to have it as
  // it's owner
  let poll;
  Ember.run(() => {
    poll = this.store.createRecord('poll', {
      options: [
        { title: '2015-01-01' },
        { title: '2015-02-02' }
      ]
    });
  });
  this.set('options', poll.get('options'));
  this.render(hbs`{{create-options-datetime options=options}}`);

  assert.equal(
    this.$('.days .form-group input:not(.ws-inputreplace)').length,
    2,
    'there are two input fields before'
  );
  this.$('.days').eq(0).find('.add').click();
  assert.equal(
    this.$('.days .form-group input:not(.ws-inputreplace)').length,
    3,
    'another input field is added'
  );
  assert.equal(
    this.$('.days').eq(0).find('input:not(.ws-inputreplace)').length,
    2,
    'it is added in correct date input'
  );
});

test('allows to delete an option', function(assert) {
  // validation is based on validation of every option fragment
  // which validates according to poll model it belongs to
  // therefore each option needs to be pushed to poll model to have it as
  // it's owner
  Ember.run(() => {
    this.set('poll', this.store.createRecord('poll', {
      isFindADate: true,
      isMakeAPoll: false
    }));
    this.set('options', Ember.computed.alias('poll.options'));
    this.get('options').pushObjects([
      { title: moment('2015-01-01T11:11').toISOString() },
      { title: moment('2015-01-01T22:22').toISOString() }
    ]);
  });
  this.render(hbs`{{create-options-datetime options=options}}`);

  assert.equal(
    this.$('.days input:not(.ws-inputreplace)').length,
    2,
    'there are two input fields before'
  );
  assert.ok(
    this.$('.delete').get().every((el) => {
      return el.disabled === false;
    }),
    'options are deleteable'
  );
  this.$('.days .form-group').eq(0).find('.delete').click();
  Ember.run(() => {
    assert.equal(
      this.$('.days .form-group input:not(.ws-inputreplace)').length,
      1,
      'one input field is removed after deletion'
    );
    assert.equal(
      this.$('.days .form-group input:not(.ws-inputreplace)').val(),
      '22:22',
      'correct input field is deleted'
    );
    assert.equal(
      this.get('options.length'),
      1,
      'is also delete from option'
    );
    assert.equal(
      this.get('options.firstObject.title'),
      moment('2015-01-01T22:22').toISOString(),
      'correct option is deleted'
    );
  });
});

test('adopt times of first day - simple', function(assert) {
  // validation is based on validation of every option fragment
  // which validates according to poll model it belongs to
  // therefore each option needs to be pushed to poll model to have it as
  // it's owner
  let poll;
  Ember.run(() => {
    poll = this.store.createRecord('poll', {
      options: [
        { title: moment().hour(10).minute(0).toISOString() },
        { title: '2015-02-02' },
        { title: '2015-03-03' }
      ]
    });
  });
  this.set('options', poll.get('options'));
  this.render(hbs`{{create-options-datetime options=options}}`);
  Ember.run(() => {
    this.$('button.adopt-times-of-first-day').click();
  });
  assert.equal(
    this.$('.days:eq(0) input:not(.ws-inputreplace)').val(),
    '10:00',
    'time was not changed for first day'
  );
  assert.equal(
    this.$('.days:eq(1) input:not(.ws-inputreplace)').val(),
    '10:00',
    'time was adopted for second day'
  );
  assert.equal(
    this.$('.days:eq(1) input:not(.ws-inputreplace)').val(),
    '10:00',
    'time was adopted for third day'
  );
});

test('adopt times of first day - more times on first day than on others', function(assert) {
  // validation is based on validation of every option fragment
  // which validates according to poll model it belongs to
  // therefore each option needs to be pushed to poll model to have it as
  // it's owner
  let poll;
  Ember.run(() => {
    poll = this.store.createRecord('poll', {
      options: [
        { title: moment().hour(10).minute(0).toISOString() },
        { title: moment().hour(22).minute(0).toISOString() },
        { title: '2015-02-02' },
        { title: '2015-03-03' }
      ]
    });
  });
  this.set('options', poll.get('options'));
  this.render(hbs`{{create-options-datetime options=options}}`);
  Ember.run(() => {
    this.$('button.adopt-times-of-first-day').click();
  });
  assert.deepEqual(
    this.$('.days:eq(0) input:not(.ws-inputreplace)').map((i, el) => $(el).val()).toArray(),
    ['10:00', '22:00'],
    'time was not changed for first day after additionally time was added to first day'
  );
  assert.deepEqual(
    this.$('.days:eq(1) input:not(.ws-inputreplace)').map((i, el) => $(el).val()).toArray(),
    ['10:00', '22:00'],
    'time was adopted for second day after additionally time was added to first day'
  );
  assert.deepEqual(
    this.$('.days:eq(2) input:not(.ws-inputreplace)').map((i, el) => $(el).val()).toArray(),
    ['10:00', '22:00'],
    'time was adopted for third day after additionally time was added to first day'
  );
});

test('adopt times of first day - excess times on other days got deleted', function(assert) {
  // validation is based on validation of every option fragment
  // which validates according to poll model it belongs to
  // therefore each option needs to be pushed to poll model to have it as
  // it's owner
  Ember.run(() => {
    this.set('poll', this.store.createRecord('poll', {
      isFindADate: true,
      isMakeAPoll: false
    }));
    this.set('options', Ember.computed.alias('poll.options'));
    this.get('options').pushObjects([
      { title: moment().hour(10).minute(0).toISOString() },
      { title: moment().add(1, 'day').hour(10).minute(0).toISOString() },
      { title: moment().add(1, 'day').hour(22).minute(0).toISOString() }
    ]);
  });
  this.render(hbs`{{create-options-datetime options=options}}`);
  Ember.run(() => {
    this.$('button.adopt-times-of-first-day').click();
  });
  assert.deepEqual(
    this.$('.days:eq(1) input:not(.ws-inputreplace)').map((i, el) => $(el).val()).toArray(),
    ['10:00'],
    'additional time on secondary day got deleted'
  );
});

test('validation', function(assert) {
  // validation is based on validation of every option fragment
  // which validates according to poll model it belongs to
  // therefore each option needs to be pushed to poll model to have it as
  // it's owner
  Ember.run(() => {
    this.set('poll', this.store.createRecord('poll', {
      isFindADate: true,
      isMakeAPoll: false
    }));
    this.set('options', Ember.computed.alias('poll.options'));
    this.get('options').pushObjects([
      { title: '2015-01-01' },
      { title: '2015-02-02' }
    ]);
  });
  this.render(hbs`{{create-options-datetime options=options}}`);
  assert.ok(
    this.$('.has-error').length === 0,
    'does not show a validation error before user interaction'
  );
  this.$('.form-group').eq(1).find('input').trigger('focusout');
  assert.ok(
    this.$('.form-group').eq(1).hasClass('has-success'),
    'does show validation errors after user interaction'
  );
  this.$('.form-group').eq(1).find('input').val('10:').trigger('change');
  assert.ok(
    this.$('.form-group').eq(1).hasClass('has-error') ||
    // browsers with input type time support prevent non time input
    this.$('.form-group').eq(1).find('input').val() === '',
    'shows error after invalid input or prevents invalid input'
  );
  // simulate unique violation
  this.$('.form-group').eq(0).find('.add').click();
  this.$('.form-group input').eq(0).val('10:00').trigger('change');
  this.$('.form-group input').eq(1).val('10:00').trigger('change');
  this.$('.form-group input').eq(2).val('10:00').trigger('change');
  this.$('form').submit();
  assert.ok(
    this.$('.form-group').eq(0).hasClass('has-success'),
    'first time shows validation success'
  );
  assert.ok(
    this.$('.form-group').eq(1).hasClass('has-error'),
    'same time for same day shows validation error'
  );
  assert.ok(
    this.$('.form-group').eq(2).hasClass('has-success'),
    'same time for different day shows validation success'
  );
});
