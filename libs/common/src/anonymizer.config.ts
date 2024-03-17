/** TODO: add unit tests */
export class SimpleAnonymizer {
  private static createClone(obj: object) {
    const properties = JSON.parse(JSON.stringify(obj));
    return { ...obj, ...properties };
  }

  static maskFields<T extends object>(obj: T, fields: (string | RegExp)[]): T {
    const fieldsToMask = fields.map((x) =>
      typeof x === 'string' ? new RegExp(x.toLowerCase(), 'i') : x,
    );
    const clone = this.createClone(obj);
    const result = this.applyMaskToFields(clone, fieldsToMask);
    return result;
  }

  private static applyMaskToFields(obj: any, fields: RegExp[]) {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.applyMaskToFields(item, fields));
    }

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (fields.some((x) => x.test(key))) {
          obj[key] = '*****';
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          obj[key] = this.applyMaskToFields(obj[key], fields);
        }
      }
    }

    return obj;
  }
}
// TODO: future implementation would allow passing a specific property on object for anonymizing
// export class PropertiesAnonymizer {
//   anonymizeDataStructure(data: object, properties: string[]) {
//     const clone = this.ensureArray(this.cloneDataStructure(data));
//     clone.forEach((obj) =>
//       properties.forEach((property) => this.anonymizeProperty(obj, property)),
//     );

//     return clone;
//   }

//   private ensureArray<T = unknown>(data: T): T[] {
//     return Array.isArray(data) ? data : [data];
//   }

//   private cloneDataStructure<T = unknown>(data: T): T {
//     return JSON.parse(JSON.stringify(data));
//   }

//   private mutatePropertyValue(key: string) {
//     return (target: unknown) => {
//       const value = target[key];

//       if (value === undefined) {
//         return;
//       }

//       const isArray = Array.isArray(value);
//       const valueType = typeof value;
//       const isObject = valueType === 'object';

//       const mask = '*****';
//       if (isArray) {
//         target[key] = Array[`${mask}`];
//       } else if (isObject) {
//         target[key] = `Object{${mask}}`;
//       } else {
//         target[key] = `${valueType}(${mask})`;
//       }
//     };
//   }

//   private anonymizeProperty(
//     targetObject: unknown,
//     dotNotationProperty: string,
//   ) {
//     const keys = dotNotationProperty.split('.');
//     let currentObject = targetObject;

//     const keysLength = keys.slice(0, -1).length;
//     for (let i = 0; i < keysLength; i++) {
//       const key = keys[i];
//       currentObject = currentObject[key];

//       if (Array.isArray(currentObject)) {
//         const remainingKeys = keys.slice(i + 1).join('.');
//         currentObject.forEach((x) => this.anonymizeProperty(x, remainingKeys));
//         return;
//       }

//       const ignoreInvalidPropertyPath =
//         typeof currentObject !== 'object' || currentObject === null;

//       if (ignoreInvalidPropertyPath) {
//         return;
//       }
//     }

//     const key = keys.at(-1);
//     const target = this.ensureArray(currentObject);
//     target.forEach(this.mutatePropertyValue(key));
//   }
// }
