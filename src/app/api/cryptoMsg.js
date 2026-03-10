import crypto from "crypto";

export function encryptMsg(strToEncrypt) {
  const secret_key = process.env.ENCRYPTION_KEY;
  try {
      const key = Buffer.from(secret_key, "utf-8");

      const cipher = crypto.createCipheriv(
        "aes-128-ecb", // use aes-192-ecb or aes-256-ecb if key length matches
        key,
        null
      );

      cipher.setAutoPadding(true); // PKCS5/PKCS7 padding

      let encrypted = cipher.update(strToEncrypt, "utf8", "base64");
      encrypted += cipher.final("base64");

      return encrypted;
    } catch (err) {
      console.error(err);
      return null;
    }
}
