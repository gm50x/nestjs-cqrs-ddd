export class SimpleAnonymizer {
  static instance = new SimpleAnonymizer();

  private createClone(obj: any) {
    const properties = JSON.parse(JSON.stringify(obj));
    return { ...obj, ...properties };
  }

  maskFields<T extends object>(obj: T, fields: string[]): T {
    const fieldsToMask = fields.map((x) => x.toLowerCase());
    const clone = this.createClone(obj);
    const result = this.applyMaskToFields(clone, fieldsToMask);
    return result;
  }

  private applyMaskToFields(obj: any, fields: string[]) {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.applyMaskToFields(item, fields));
    }

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          obj[key] = this.applyMaskToFields(obj[key], fields);
          // TODO: make this work with RegEx
        } else if (fields.includes(key.toLowerCase())) {
          obj[key] = '*****';
        }
      }
    }

    return obj;
  }
}

export class PropertiesAnonymizer {
  static instance = new PropertiesAnonymizer();
  private constructor() {}

  anonymizeDataStructure(data: object, properties: string[]) {
    const clone = this.ensureArray(this.cloneDataStructure(data));
    clone.forEach((obj) =>
      properties.forEach((property) => this.anonymizeProperty(obj, property)),
    );

    return clone;
  }

  private ensureArray<T = unknown>(data: T): T[] {
    return Array.isArray(data) ? data : [data];
  }

  private cloneDataStructure<T = unknown>(data: T): T {
    return JSON.parse(JSON.stringify(data));
  }

  private mutatePropertyValue(key: string) {
    return (target: unknown) => {
      const value = target[key];

      if (value === undefined) {
        return;
      }

      const isArray = Array.isArray(value);
      const valueType = typeof value;
      const isObject = valueType === 'object';

      const mask = '*****';
      if (isArray) {
        target[key] = Array[`${mask}`];
      } else if (isObject) {
        target[key] = `Object{${mask}}`;
      } else {
        target[key] = `${valueType}(${mask})`;
      }
    };
  }

  private anonymizeProperty(
    targetObject: unknown,
    dotNotationProperty: string,
  ) {
    const keys = dotNotationProperty.split('.');
    let currentObject = targetObject;

    const keysLength = keys.slice(0, -1).length;
    for (let i = 0; i < keysLength; i++) {
      const key = keys[i];
      currentObject = currentObject[key];

      if (Array.isArray(currentObject)) {
        const remainingKeys = keys.slice(i + 1).join('.');
        currentObject.forEach((x) => this.anonymizeProperty(x, remainingKeys));
        return;
      }

      const ignoreInvalidPropertyPath =
        typeof currentObject !== 'object' || currentObject === null;

      if (ignoreInvalidPropertyPath) {
        return;
      }
    }

    const key = keys.at(-1);
    const target = this.ensureArray(currentObject);
    target.forEach(this.mutatePropertyValue(key));
  }
}
