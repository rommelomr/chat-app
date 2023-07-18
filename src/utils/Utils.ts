import bcrypt from "bcryptjs";
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
    if (error) {
      console.log(error.message);
      throw "error";
    }
  }
  static verifyPassword(string: string, hash: string) {
    bcrypt.compare(string, hash, (err: any, success: any) => {
      if (err) {
        console.error("Error al verificar la clave:", err);
        return {
          code: 0,
          message: "Error verifying password",
        };
      }

      if (success) {
        return {
          code: 1,
          message: "Password and string match",
          match: true,
        };
      } else {
        return {
          code: 2,
          message: "Password and string do not match",
          match: false,
        };
      }
    });
  }
}
