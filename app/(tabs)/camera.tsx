import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TesseractOcr, { LANG_ENGLISH, TesseractOptions, TesseractResult } from 'react-native-tesseract-ocr';
import { Camera, PhotoFile, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { searchMedicines } from '../../utils/api';

const tessOptions: TesseractOptions = {
    whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    blacklist: '',
    psm: 6, // Assume uniform text block
    oem: 1, // Use LSTM only
    dpi: 300, // Optimal DPI for OCR
    preserve_interword_spaces: true,
};

export default function CameraScreen() {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const camera = useRef<Camera>(null);
    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice('back');
    const [isProcessing, setIsProcessing] = useState(false);
    const [flash, setFlash] = useState<'off' | 'on'>('off');
    const [processingStatus, setProcessingStatus] = useState<string>('');

    useEffect(() => {
        if (!hasPermission) {
            requestPermission();
        }
    }, [hasPermission, requestPermission]);

    const processImageWithOCR = async (photo: PhotoFile): Promise<TesseractResult> => {
        try {
            setProcessingStatus(t('processingImage'));

            // Check if Tesseract is available
            const isAvailable = await TesseractOcr.isAvailable();
            if (!isAvailable) {
                throw new Error('OCR engine is not available');
            }

            // Optimize image for OCR
            const manipResult = await ImageManipulator.manipulateAsync(
                photo.path,
                [
                    { resize: { width: 1000 } }, // Resize for better performance
                ],
                {
                    compress: 0.8,
                    format: ImageManipulator.SaveFormat.JPEG,
                }
            );

            // Convert to base64
            const base64 = await FileSystem.readAsStringAsync(manipResult.uri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            // Process with Tesseract OCR
            const result = await TesseractOcr.recognize(
                `data:image/jpeg;base64,${base64}`,
                LANG_ENGLISH,
                tessOptions
            );

            // Clean up temporary files
            await FileSystem.deleteAsync(manipResult.uri, { idempotent: true });
            await FileSystem.deleteAsync(photo.path, { idempotent: true });

            // Stop Tesseract to free resources
            await TesseractOcr.stop();

            return result;
        } catch (error) {
            console.error('OCR Error:', error);
            // Try to stop Tesseract even if there was an error
            try {
                await TesseractOcr.stop();
            } catch (stopError) {
                console.error('Error stopping Tesseract:', stopError);
            }
            throw new Error('Failed to process image');
        }
    };

    const handleCapture = useCallback(async () => {
        if (camera.current && !isProcessing) {
            try {
                setIsProcessing(true);
                setProcessingStatus(t('processingImage'));

                const photo = await camera.current.takePhoto({
                    flash: flash,
                });

                // Process the photo with OCR
                const ocrResult = await processImageWithOCR(photo);

                // Extract text and clean it up
                const extractedText = ocrResult.text
                    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
                    .trim()
                    .split(/\s+/) // Split into words
                    .filter((word: string) => word.length > 2) // Remove very short words
                    .join(' '); // Join back with spaces

                if (!extractedText) {
                    throw new Error('No text detected in image');
                }

                // Search for medicine using the extracted text
                const searchResult = await searchMedicines(extractedText);

                if (searchResult.medicines && searchResult.medicines.length > 0) {
                    // Navigate to medicine details or show results
                    Alert.alert(
                        t('scanMedicine'),
                        `${t('medicineFound')}: ${searchResult.medicines[0].name}`,
                        [
                            {
                                text: t('viewDetails'),
                                onPress: () => {
                                    // TODO: Navigate to medicine details
                                    console.log('Navigate to medicine details');
                                },
                            },
                            {
                                text: t('continue'),
                                style: 'cancel',
                            },
                        ]
                    );
                } else {
                    Alert.alert(
                        t('error'),
                        t('noMedicinesFound'),
                        [{ text: t('continue') }]
                    );
                }
            } catch (error) {
                console.error('Error capturing photo:', error);
                Alert.alert(
                    t('error'),
                    error instanceof Error ? error.message : t('scanFailed'),
                    [{ text: t('continue') }]
                );
            } finally {
                setIsProcessing(false);
                setProcessingStatus('');
            }
        }
    }, [camera, isProcessing, flash, t]);

    const toggleFlash = () => {
        setFlash(current => current === 'off' ? 'on' : 'off');
    };

    if (!hasPermission) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <Text style={[styles.text, { color: theme.colors.text }]}>
                    {t('cameraPermissionRequired')}
                </Text>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.colors.primary }]}
                    onPress={requestPermission}
                >
                    <Text style={[styles.buttonText, { color: theme.colors.buttonText }]}>
                        {t('grantPermission')}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!device) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <Text style={[styles.text, { color: theme.colors.text }]}>
                    {t('cameraNotAvailable')}
                </Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Camera
                ref={camera}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                photo={true}
                enableZoomGesture
            />

            <View style={[styles.overlay, { paddingTop: insets.top }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color={theme.colors.buttonText} />
                </TouchableOpacity>
            </View>

            {isProcessing && (
                <View style={styles.processingOverlay}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text style={[styles.processingText, { color: theme.colors.text }]}>
                        {processingStatus}
                    </Text>
                </View>
            )}

            <View style={[styles.controls, { paddingBottom: insets.bottom + 20 }]}>
                <TouchableOpacity
                    style={[styles.flashButton, { backgroundColor: theme.colors.card }]}
                    onPress={toggleFlash}
                    disabled={isProcessing}
                >
                    <Ionicons
                        name={flash === 'on' ? 'flash' : 'flash-off'}
                        size={24}
                        color={theme.colors.text}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.captureButton,
                        { backgroundColor: theme.colors.primary },
                        isProcessing && styles.captureButtonDisabled
                    ]}
                    onPress={handleCapture}
                    disabled={isProcessing}
                >
                    {isProcessing ? (
                        <ActivityIndicator color={theme.colors.buttonText} />
                    ) : (
                        <View style={[styles.captureButtonInner, { backgroundColor: theme.colors.buttonText }]} />
                    )}
                </TouchableOpacity>

                <View style={styles.placeholder} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    controls: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    flashButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButtonDisabled: {
        opacity: 0.5,
    },
    captureButtonInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    placeholder: {
        width: 50,
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    processingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    processingText: {
        marginTop: 10,
        fontSize: 16,
        textAlign: 'center',
    },
});