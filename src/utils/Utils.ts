export default class Utils {
  static random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  static placeElementAtBeginning(array: Array<any>, indice: number) {
    if (indice < 0 || indice >= array.length) {
      return array;
    }

    const element = array.splice(indice, 1)[0];
    array.unshift(element);
    return array;
  }
  static handleErrors(error: any) {
    console.log(error);
    if (error) {
      console.log(error.message);
      throw "error";
    }
  }
}
