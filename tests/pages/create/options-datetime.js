import PageObject from 'croodle/tests/page-object';

let {
  clickable,
  collection,
  fillable,
  hasClass,
  text
} = PageObject;

export default PageObject.create({
  days: collection({
    itemScope: '.form-group',
    labels: text('label:not(.sr-only)', { multiple: true })
  }),
  times: collection({
    itemScope: '.form-group',
    item: {
      add: clickable('button.add'),
      delete: clickable('button.delete'),
      label: text('label'),
      labelIsHidden: hasClass('label', 'sr-only'),
      time: fillable('input')
    }
  }),
  next: clickable('button[type="submit"]')
});
