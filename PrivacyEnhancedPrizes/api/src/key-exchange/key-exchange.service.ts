import { Injectable } from '@nestjs/common';
import * as nacl from 'tweetnacl-ts';

@Injectable()
export class KeyExchangeService {
  private alice = nacl.box_keyPair();

  getPublicKey(): Uint8Array {
    return this.alice.publicKey;
  }

  getOneTimeCode(): Uint8Array {
    return nacl.randomBytes(24);
  }

  decryptMessage(
    oneTimeCode: Uint8Array,
    bobPublicKey: Uint8Array,
    cipherText: Uint8Array,
  ): string {
    let plainText = '';
    const sharedKey = nacl.box_before(bobPublicKey, this.alice.secretKey);
    const decodedMessage = nacl.box_open_after(
      cipherText ?? new Uint8Array(),
      oneTimeCode,
      sharedKey,
    );
    if (decodedMessage) {
      plainText = nacl.encodeUTF8(decodedMessage);
    }
    return plainText;
  }

  encryptMessage(
    oneTimeCode: Uint8Array,
    bobPublicKey: Uint8Array,
    plainText: string,
  ): Uint8Array {
    const sharedKey = nacl.box_before(bobPublicKey, this.alice.secretKey);
    return nacl.box_after(nacl.decodeUTF8(plainText), oneTimeCode, sharedKey);
  }

  encryptPlainText(plainText: string, bobPublicKey: Uint8Array) {
    const publicKey = this.getPublicKey();
    const oneTimeCode = this.getOneTimeCode();
    const cipherText = this.encryptMessage(
      oneTimeCode,
      bobPublicKey,
      plainText,
    );
    return {
      oneTimeCode: Array.from(oneTimeCode),
      publicKey: Array.from(publicKey),
      cipherText: Array.from(cipherText),
    };
  }
}
