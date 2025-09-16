export declare function symmetricEncrypt(text: string): Promise<{
    encrypted: string;
    key: Buffer<ArrayBufferLike>;
    iv: string;
    path: string;
}>;
export declare function symmetricDecrypt(text: string, key: any, iv: string): string | undefined;
//# sourceMappingURL=symmetric-keys.d.ts.map