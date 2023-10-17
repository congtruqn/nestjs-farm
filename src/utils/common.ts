import * as moment from 'moment';

export const removeUnicode = (str: string): string => {
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\-|\'| |\"|\&|\#|\[|\]|~|$|_/g,
    '',
  );
  str = str.replace(/-+-/g, ''); //thay thế 2- thành 1-
  str = str.replace(/^\-+|\-+$/g, '');
  return str;
};

export const calculateSkip = (pageNumber: number, pageSize: number) =>
  (pageNumber - 1) * pageSize;

export const regexDateString =
  /^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/i;

export const randomId = (length: number) => {
  let result = '';
  const characters = '0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export const isValidDate = (dateString: string) => {
  const date = moment(dateString, 'DD/MM/YYYY', true);
  return date.isValid();
};

export const isNumeric = (str: string) => {
  if (typeof str != 'string') return false; // we only process strings!
  return (
    !isNaN(Number(str)) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
};

export const groupByProperty = (arr: any, property: string) => {
  const items = arr.reduce(function (memo: any, x: any) {
    if (!memo[x[property]]) {
      memo[x[property]] = [];
    }
    memo[x[property]].push(x);
    return memo;
  }, {});
  return items;
};

export const caculatePicDate = (dob: Date) => {
  const picDate = new Date(process.env.PIC_DATE || '1993-08-22').getTime();
  const dobDate = new Date(dob).getTime();
  const picCalulate = ((dobDate - picDate) / (1000 * 3600 * 24)) % 1000;
  return picCalulate > 0 ? Math.round(picCalulate) : 1;
};

export const caculateWeekAge = (dob: Date) => {
  const cunrentDate = new Date().getTime();
  const dobDate = new Date(dob).getTime();
  const picCalulate = (cunrentDate - dobDate) / (1000 * 3600 * 24 * 7);
  return picCalulate > 0 ? Math.round(picCalulate) + 1 : 1;
};
