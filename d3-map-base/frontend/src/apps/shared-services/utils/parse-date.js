Date.prototype.getMonthName = function() {
  var months = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months[this.getMonth()];
};
const parseDate = (timeDateRange) => {
  if (timeDateRange) {
    let resultString = '';
    timeDateRange.map(x => {
      var d = new Date(x);
      let ss =  d.getMonthName() + ' ' + d.getFullYear();
      let addDash = ' - ';
      if (resultString === '') {
        addDash = '';
      }
      resultString = resultString + addDash + ss;
    });
    return resultString;
  } else {
    return '';
  }
};

export default parseDate;
