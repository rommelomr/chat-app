import bcrypt from "bcryptjs";
import Mimetypes from "@/utils/Mimetypes";

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
      if (import.meta.env.DEV)
        alert("Ha ocurrido un error inesperado. Contacte con soporte");
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
  static b64toBlob(base64: String, sliceSize = 512) {
    let base64Data = base64.split(",");

    let { data } = Utils.getMimetypeFromBase64(base64);

    if (data) {
      const byteCharacters = atob(base64Data[1]);
      const byteArrays = [];

      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);

        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: data.mimetype });
      return {
        status: 1,
        data: { blob },
      };
    }
    return {
      status: 0,
      error: {
        message: "error converting base 64 to blob",
      },
    };
  }
  static getMimetypeFromBase64(base_64: String) {
    let _prefix: Array<String> = base_64.split(";");
    if (_prefix.length != 2) {
      _prefix = base_64.split(",");
    }
    if (_prefix.length != 2) {
      return {
        status: 0,
        message: "invalid base 64 string",
      };
    }

    let data_type: Array<String> = _prefix[0].split(":");
    if (data_type.length != 2)
      return {
        status: 0,
        message: "invalid base 64 string",
      };

    return {
      status: 1,
      data: {
        mimetype: data_type[1],
      },
    };
  }
  static async fetchFileWithInfo(url: string) {
    const fetch_response = await fetch(url, {
      method: "GET",
    });

    let { data, error } = Mimetypes(
      fetch_response.headers.get("Content-Type") ?? ""
    );
    if (error) {
      return {
        status: 0,
        error,
      };
    }
    if (data) {
      return {
        status: 1,
        data: {
          mimetype: data.name,
        },
      };
    }
  }
  static async copyContentToClipboard(content: string) {
    const tempTextarea = document.createElement("textarea");
    tempTextarea.value = content;

    // Agregar el elemento de textarea al DOM
    document.body.appendChild(tempTextarea);

    // Seleccionar y copiar el contenido del textarea
    tempTextarea.select();
    document.execCommand("copy");

    // Eliminar el elemento de textarea temporal
    document.body.removeChild(tempTextarea);

    return content == (await navigator.clipboard.readText());
  }
  static utcToLocalDateTime(date: any, type?: string) {
    let fecha = new Date(date);

    // Obtener la hora local
    let horaLocal = fecha.toLocaleTimeString();

    // Obtener la fecha local
    let fechaLocal = fecha.toLocaleDateString();

    if (!type) return fechaLocal + " " + horaLocal;

    if (type == "date") return fechaLocal;

    if (type == "time") return horaLocal;
  }
}
