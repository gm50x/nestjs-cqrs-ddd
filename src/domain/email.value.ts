export class Email {
  readonly value: string;

  constructor(email: string) {
    if (!email?.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
      throw new Error(`${email} is not a valid email`);
    }
    this.value = email;
  }
}
