/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
export default function replaceSpecialChars(str: string): string {
    return str.replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase();
}
