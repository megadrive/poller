import { verify as argonverify, hash as argonhash } from "argon2";

type HashParameters = Parameters<typeof argonhash>;
export function hash(
  plaintext: HashParameters[0],
  options?: HashParameters[1]
) {
  return argonhash(plaintext, options);
}

type VerifyParameters = Parameters<typeof argonverify>;
export function verify(
  hashedText: VerifyParameters[0],
  plaintext: VerifyParameters[1]
) {
  return argonverify(hashedText, plaintext);
}
