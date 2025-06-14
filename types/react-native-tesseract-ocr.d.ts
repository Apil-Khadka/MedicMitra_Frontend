declare module 'react-native-tesseract-ocr' {
    export const LANG_ENGLISH: string;
    export const LANG_NEPALI: string;
    export const LANG_HINDI: string;

    export interface TesseractOptions {
        whitelist?: string;
        blacklist?: string;
        psm?: number;
        oem?: number;
        dpi?: number;
        preserve_interword_spaces?: boolean;
    }

    export interface TesseractResult {
        text: string;
        confidence: number;
        blocks: Array<{
            text: string;
            confidence: number;
            boundingBox: {
                x0: number;
                y0: number;
                x1: number;
                y1: number;
            };
        }>;
    }

    export interface TesseractModule {
        recognize(
            imagePath: string,
            language: string,
            options?: TesseractOptions
        ): Promise<TesseractResult>;

        stop(): Promise<void>;
        isAvailable(): Promise<boolean>;
    }

    const TesseractOcr: TesseractModule;
    export default TesseractOcr;
}