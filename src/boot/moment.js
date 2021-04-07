import vue from 'vue';
import moment from 'moment';

vue.prototype.$moment = moment;

vue.prototype.$time = function (t) {
  const today = this.$moment(Date.now());
  const date = this.$moment(t);
  let format;

  if (date.isAfter(today.startOf('day'))) {
    format = 'HH:mm';
  } else if (date.isAfter(today.startOf('week'))) {
    format = 'ddd';
  } else if (date.isAfter(today.startOf('year'))) {
    format = 'MM-DD';
  } else {
    format = 'YYYY-MM-DD';
  }

  return date.format(format);
};

vue.prototype.$ctime = function (t) {
  const today = this.$moment(Date.now());
  const date = this.$moment(t);
  let format;

  if (date.isAfter(today.startOf('day'))) {
    format = 'HH:mm';
  } else if (date.isAfter(today.startOf('week'))) {
    format = 'ddd LT';
  } else if (date.isAfter(today.startOf('year'))) {
    format = 'MM-DD LT';
  } else {
    format = 'YYYY-MM-DD';
  }

  return date.format(format);
};
