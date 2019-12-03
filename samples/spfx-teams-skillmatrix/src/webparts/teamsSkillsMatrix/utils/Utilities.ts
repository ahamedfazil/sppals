export const compareTwoArray = (array1: any[], array2: any[]): boolean => {
  if (array1 && array2) {
    return array1.filter(val => array2.includes(val)).length > 0 ? true : false;
  } else {
    return false;
  }
};
