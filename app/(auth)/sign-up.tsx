import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ActivityIndicator, Keyboard, Pressable, StyleSheet, Text, TextInput, TextStyle, TouchableOpacity, TouchableWithoutFeedback, useColorScheme, View, ViewStyle } from 'react-native';
import Animated, {
    FadeInDown,
    FadeInUp,
    interpolateColor,
    Layout,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

type SignUpStep = 'method' | 'phone' | 'email' | 'password' | 'name';

interface FormErrors {
    phone?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    firstName?: string;
    lastName?: string;
}

interface Styles {
    container: ViewStyle;
    header: ViewStyle;
    backButton: ViewStyle;
    title: TextStyle;
    subtitle: TextStyle;
    content: ViewStyle;
    inputContainer: ViewStyle;
    input: TextStyle;
    inputError: TextStyle;
    errorContainer: ViewStyle;
    errorText: TextStyle;
    continueButton: ViewStyle;
    continueButtonText: TextStyle;
    signInContainer: ViewStyle;
    signInText: TextStyle;
    signInLink: TextStyle;
    emailContainer: ViewStyle;
    emailText: TextStyle;
    emailIcon: ViewStyle;
    changeEmailButton: ViewStyle;
    changeEmailButtonText: TextStyle;
    nameContainer: ViewStyle;
    nameInputContainer: ViewStyle;
    skipButton: ViewStyle;
    skipButtonText: TextStyle;
    passwordContainer: ViewStyle;
    passwordInput: TextStyle;
    visibilityToggle: ViewStyle;
    logoContainer: ViewStyle;
    logo: ViewStyle;
    methodContainer: ViewStyle;
    methodButton: ViewStyle;
    methodTextContainer: ViewStyle;
    methodButtonText: TextStyle;
    methodButtonSubtext: TextStyle;
    iconContainer: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function SignUp() {
    const insets = useSafeAreaInsets();
    const { signUp } = useAuth();
    const { language, translations: t } = useLanguage();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const [step, setStep] = useState<SignUpStep>('method');
    const [signUpMethod, setSignUpMethod] = useState<'phone' | 'email'>('email');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});
    const [apiError, setApiError] = useState<string>('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const scale = useSharedValue(1);
    const buttonScale = useSharedValue(1);
    const logoScale = useSharedValue(1);

    // Animation styles
    const animatedIconStyle = useAnimatedStyle(() => ({
        transform: [
            {
                scale: withSpring(showPassword ? 1.2 : 1, {
                    damping: 12,
                    stiffness: 300,
                }),
            },
        ],
    }));

    const animatedConfirmIconStyle = useAnimatedStyle(() => ({
        transform: [
            {
                scale: withSpring(showConfirmPassword ? 1.2 : 1, {
                    damping: 12,
                    stiffness: 300,
                }),
            },
        ],
    }));

    const animatedButtonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }],
        backgroundColor: interpolateColor(
            buttonScale.value,
            [0.95, 1],
            [colors.primary + '20', colors.buttonPrimary]
        ),
    }));

    const animatedLogoStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: logoScale.value }
        ],
    }));

    const animatedMethodIconStyle = useAnimatedStyle(() => ({
        transform: [{ scale: withSpring(buttonScale.value * 1.1) }]
    }));

    React.useEffect(() => {
        logoScale.value = withSequence(
            withSpring(1.1, { damping: 10, stiffness: 300 }),
            withSpring(1, { damping: 12, stiffness: 300 })
        );
    }, []);

    const validatePhone = (): boolean => {
        const newErrors: FormErrors = {};
        if (!phone.trim()) {
            newErrors.phone = language === 'en' ? 'Phone number is required' : 'फोन नम्बर आवश्यक छ';
        } else if (!/^[0-9]{10}$/.test(phone.replace(/\D/g, ''))) {
            newErrors.phone = language === 'en' ? 'Please enter a valid 10-digit phone number' : 'कृपया मान्य १० अंकको फोन नम्बर प्रविष्ट गर्नुहोस्';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePhoneSubmit = async () => {
        buttonScale.value = withSequence(
            withSpring(0.95, { damping: 10 }),
            withSpring(1, { damping: 15, stiffness: 200 })
        );
        if (!validatePhone()) return;
        setTimeout(() => setStep('email'), 200);
    };

    const formatPhoneNumber = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3];
        }
        return cleaned;
    };

    const handlePhoneChange = (text: string) => {
        const formatted = formatPhoneNumber(text);
        setPhone(formatted);
    };

    const validateEmail = (): boolean => {
        const newErrors: FormErrors = {};
        if (!email.trim()) {
            newErrors.email = language === 'en' ? 'Email is required' : 'इमेल आवश्यक छ';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = language === 'en' ? 'Please enter a valid email address' : 'कृपया मान्य इमेल ठेगाना प्रविष्ट गर्नुहोस्';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePassword = (): boolean => {
        const newErrors: FormErrors = {};
        if (!password) {
            newErrors.password = language === 'en' ? 'Password is required' : 'पासवर्ड आवश्यक छ';
        } else if (password.length < 6) {
            newErrors.password = language === 'en' ? 'Password must be at least 6 characters' : 'पासवर्ड कम्तिमा ६ वर्णको हुनुपर्छ';
        }
        if (!confirmPassword) {
            newErrors.confirmPassword = language === 'en' ? 'Please confirm your password' : 'कृपया आफ्नो पासवर्ड पुष्टि गर्नुहोस्';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = language === 'en' ? 'Passwords do not match' : 'पासवर्डहरू मेल खाँदैनन्';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateName = (): boolean => {
        const newErrors: FormErrors = {};
        if (!firstName.trim()) {
            newErrors.firstName = language === 'en' ? 'First name is required' : 'पहिलो नाम आवश्यक छ';
        }
        if (!lastName.trim()) {
            newErrors.lastName = language === 'en' ? 'Last name is required' : 'थर आवश्यक छ';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEmailSubmit = () => {
        buttonScale.value = withSequence(
            withSpring(0.95, { damping: 12, stiffness: 300 }),
            withSpring(1, { damping: 15, stiffness: 300 })
        );
        if (!validateEmail()) return;
        setTimeout(() => setStep('password'), 150);
    };

    const handlePasswordSubmit = async () => {
        buttonScale.value = withSequence(
            withSpring(0.95, { damping: 10 }),
            withSpring(1, { damping: 15, stiffness: 200 })
        );
        if (!validatePassword()) return;
        setTimeout(() => setStep('name'), 200);
    };

    const handleNameSubmit = async () => {
        buttonScale.value = withSequence(
            withSpring(0.95, { damping: 10 }),
            withSpring(1, { damping: 15, stiffness: 200 })
        );
        if (!validateName()) return;

        setIsVerifying(true);
        setApiError('');

        try {
            await signUp(email, password, firstName, lastName);
        } catch (error) {
            setApiError(language === 'en' ? 'Failed to create account' : 'खाता सिर्जना गर्न सकिएन');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleSkipName = async () => {
        buttonScale.value = withSequence(
            withSpring(0.95, { damping: 10 }),
            withSpring(1, { damping: 15, stiffness: 200 })
        );
        setIsVerifying(true);
        setApiError('');

        try {
            await signUp(email, password, '', '');
        } catch (error) {
            setApiError(language === 'en' ? 'Failed to create account' : 'खाता सिर्जना गर्न सकिएन');
        } finally {
            setIsVerifying(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleMethodSelect = (method: 'phone' | 'email') => {
        setSignUpMethod(method);
        buttonScale.value = withSequence(
            withSpring(0.95, { damping: 12, stiffness: 300 }),
            withSpring(1, { damping: 15, stiffness: 300 })
        );
        if (method === 'phone') {
            setStep('phone');
        } else {
            setStep('email');
        }
    };

    const renderStep = () => {
        switch (step) {
            case 'method':
                return (
                    <Animated.View
                        entering={FadeInUp.delay(200).duration(800).springify()}
                        exiting={FadeInDown.duration(400)}
                        layout={Layout.springify()}
                        style={styles.inputContainer}
                    >
                        <Animated.View
                            style={[styles.logoContainer, animatedLogoStyle]}
                            entering={FadeInDown.delay(200).duration(1000).springify()}
                        >
                            <View style={[styles.logo, { backgroundColor: colors.primary }]}>
                                <Ionicons name="medical" size={32} color={colors.buttonText} />
                            </View>
                        </Animated.View>

                        <Animated.Text
                            entering={FadeInDown.delay(400).duration(800).springify()}
                            style={[styles.title, { color: colors.text, textAlign: 'center', marginBottom: Spacing.xl }]}
                        >
                            {language === 'en' ? 'Choose Sign Up Method' : 'साइन अप विधि चयन गर्नुहोस्'}
                        </Animated.Text>

                        <Animated.View
                            entering={FadeInUp.delay(600).duration(800).springify()}
                            style={styles.methodContainer}
                        >
                            <AnimatedPressable
                                style={[styles.methodButton, animatedButtonStyle]}
                                onPress={() => handleMethodSelect('phone')}
                                android_ripple={{ color: colors.primary + '20', radius: 200 }}
                            >
                                <Animated.View
                                    style={[
                                        styles.iconContainer,
                                        { backgroundColor: colors.primary },
                                        animatedMethodIconStyle
                                    ]}
                                >
                                    <Ionicons name="call" size={24} color={colors.buttonText} />
                                </Animated.View>
                                <View style={styles.methodTextContainer}>
                                    <Text style={[styles.methodButtonText, { color: colors.text }]}>
                                        {language === 'en' ? 'Sign up with Phone' : 'फोनबाट साइन अप गर्नुहोस्'}
                                    </Text>
                                    <Text style={[styles.methodButtonSubtext, { color: colors.textSecondary }]}>
                                        {language === 'en' ? 'Use your phone number' : 'आफ्नो फोन नम्बर प्रयोग गर्नुहोस्'}
                                    </Text>
                                </View>
                            </AnimatedPressable>

                            <AnimatedPressable
                                style={[styles.methodButton, animatedButtonStyle]}
                                onPress={() => handleMethodSelect('email')}
                                android_ripple={{ color: colors.primary + '20', radius: 200 }}
                            >
                                <Animated.View
                                    style={[
                                        styles.iconContainer,
                                        { backgroundColor: colors.primary },
                                        animatedMethodIconStyle
                                    ]}
                                >
                                    <Ionicons name="mail" size={24} color={colors.buttonText} />
                                </Animated.View>
                                <View style={styles.methodTextContainer}>
                                    <Text style={[styles.methodButtonText, { color: colors.text }]}>
                                        {language === 'en' ? 'Sign up with Email' : 'इमेलबाट साइन अप गर्नुहोस्'}
                                    </Text>
                                    <Text style={[styles.methodButtonSubtext, { color: colors.textSecondary }]}>
                                        {language === 'en' ? 'Use your email address' : 'आफ्नो इमेल ठेगाना प्रयोग गर्नुहोस्'}
                                    </Text>
                                </View>
                            </AnimatedPressable>
                        </Animated.View>
                    </Animated.View>
                );

            case 'phone':
                return (
                    <Animated.View
                        entering={FadeInUp.delay(200).duration(800).springify()}
                        exiting={FadeInDown.duration(400)}
                        layout={Layout.springify()}
                        style={styles.inputContainer}
                    >
                        <Animated.View
                            style={[styles.logoContainer, animatedLogoStyle]}
                            entering={FadeInDown.delay(200).duration(1000).springify()}
                        >
                            <View style={[styles.logo, { backgroundColor: colors.primary }]}>
                                <Ionicons name="medical" size={32} color={colors.buttonText} />
                            </View>
                        </Animated.View>

                        <Animated.Text
                            entering={FadeInDown.delay(400).duration(800).springify()}
                            style={[styles.title, { color: colors.text, textAlign: 'center', marginBottom: Spacing.xl }]}
                        >
                            {language === 'en' ? 'Enter your phone number' : 'आफ्नो फोन नम्बर प्रविष्ट गर्नुहोस्'}
                        </Animated.Text>

                        <View>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor: colors.inputBackground,
                                        borderColor: errors.phone ? colors.error : colors.inputBorder,
                                        color: colors.text
                                    }
                                ]}
                                placeholder={language === 'en' ? '(123) 456-7890' : '(९८७) ६५४-३२१०'}
                                placeholderTextColor={colors.textSecondary}
                                value={phone}
                                onChangeText={handlePhoneChange}
                                keyboardType="phone-pad"
                                maxLength={14}
                                autoComplete="tel"
                            />
                            {errors.phone ? (
                                <Animated.Text
                                    entering={FadeInDown.duration(200)}
                                    style={[styles.errorText, { color: colors.error }]}
                                >
                                    {errors.phone}
                                </Animated.Text>
                            ) : null}
                        </View>

                        <AnimatedPressable
                            style={[styles.continueButton, animatedButtonStyle]}
                            onPress={handlePhoneSubmit}
                            android_ripple={{ color: colors.primary + '20', radius: 200 }}
                        >
                            <Text style={[styles.continueButtonText, { color: colors.buttonText }]}>
                                {t[language].continue}
                            </Text>
                        </AnimatedPressable>

                        <TouchableOpacity
                            style={styles.skipButton}
                            onPress={() => setStep('method')}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.skipButtonText, { color: colors.textSecondary }]}>
                                {language === 'en' ? 'Change method' : 'विधि परिवर्तन गर्नुहोस्'}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                );

            case 'email':
                return (
                    <Animated.View
                        entering={FadeInUp.delay(200).duration(800).springify()}
                        exiting={FadeInDown.duration(400)}
                        layout={Layout.springify()}
                        style={styles.inputContainer}
                    >
                        <Animated.View
                            style={[styles.logoContainer, animatedLogoStyle]}
                            entering={FadeInDown.delay(200).duration(1000).springify()}
                        >
                            <View style={[styles.logo, { backgroundColor: colors.primary }]}>
                                <Ionicons name="medical" size={32} color={colors.buttonText} />
                            </View>
                        </Animated.View>

                        <Animated.Text
                            entering={FadeInDown.delay(400).duration(800).springify()}
                            style={[styles.title, { color: colors.text, textAlign: 'center', marginBottom: Spacing.xl }]}
                        >
                            {language === 'en' ? 'Enter your email' : 'आफ्नो इमेल प्रविष्ट गर्नुहोस्'}
                        </Animated.Text>

                        <View>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor: colors.inputBackground,
                                        borderColor: errors.email ? colors.error : colors.inputBorder,
                                        color: colors.text
                                    }
                                ]}
                                placeholder={t[language].email}
                                placeholderTextColor={colors.textSecondary}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                autoComplete="email"
                            />
                            {errors.email ? (
                                <Animated.Text
                                    entering={FadeInDown.duration(200)}
                                    style={[styles.errorText, { color: colors.error }]}
                                >
                                    {errors.email}
                                </Animated.Text>
                            ) : null}
                        </View>

                        <AnimatedPressable
                            style={[styles.continueButton, animatedButtonStyle]}
                            onPress={handleEmailSubmit}
                            android_ripple={{ color: colors.primary + '20', radius: 200 }}
                        >
                            <Text style={[styles.continueButtonText, { color: colors.buttonText }]}>
                                {t[language].continue}
                            </Text>
                        </AnimatedPressable>

                        <TouchableOpacity
                            style={styles.skipButton}
                            onPress={() => setStep('method')}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.skipButtonText, { color: colors.textSecondary }]}>
                                {language === 'en' ? 'Change method' : 'विधि परिवर्तन गर्नुहोस्'}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                );

            case 'password':
                return (
                    <Animated.View
                        entering={FadeInUp.delay(200).duration(800).springify()}
                        exiting={FadeInDown.duration(400)}
                        layout={Layout.springify()}
                        style={styles.inputContainer}
                    >
                        <Animated.View
                            entering={FadeInDown.delay(100).duration(400)}
                            style={[
                                styles.emailContainer,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                    ...Shadows.sm
                                }
                            ]}
                        >
                            <View style={styles.emailIcon}>
                                <Ionicons name="mail" size={20} color={colors.textSecondary} />
                            </View>
                            <Text style={[styles.emailText, { color: colors.text }]}>{email}</Text>
                            <TouchableOpacity
                                style={[
                                    styles.changeEmailButton,
                                    {
                                        backgroundColor: colors.background,
                                        borderColor: colors.primary,
                                        borderWidth: 1
                                    }
                                ]}
                                onPress={() => setStep('email')}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.changeEmailButtonText, { color: colors.primary }]}>
                                    {language === 'en' ? 'Change' : 'परिवर्तन गर्नुहोस्'}
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>

                        <Animated.View
                            entering={FadeInUp.delay(200).duration(400)}
                            style={styles.passwordContainer}
                        >
                            <TextInput
                                style={[
                                    styles.input,
                                    styles.passwordInput,
                                    {
                                        backgroundColor: colors.card,
                                        borderColor: errors.password ? colors.error : colors.border,
                                        color: colors.text,
                                        ...Shadows.sm
                                    }
                                ]}
                                placeholder={t[language].password}
                                placeholderTextColor={colors.textSecondary}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoComplete="password-new"
                            />
                            <TouchableOpacity
                                style={styles.visibilityToggle}
                                onPress={togglePasswordVisibility}
                                activeOpacity={0.7}
                            >
                                <Animated.View style={animatedIconStyle}>
                                    <Ionicons
                                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                                        size={24}
                                        color={colors.textSecondary}
                                    />
                                </Animated.View>
                            </TouchableOpacity>
                            {errors.password ? (
                                <Animated.Text
                                    entering={FadeInDown.duration(200)}
                                    style={[styles.errorText, { color: colors.error }]}
                                >
                                    {errors.password}
                                </Animated.Text>
                            ) : null}
                        </Animated.View>

                        <Animated.View
                            entering={FadeInUp.delay(300).duration(400)}
                            style={styles.passwordContainer}
                        >
                            <TextInput
                                style={[
                                    styles.input,
                                    styles.passwordInput,
                                    {
                                        backgroundColor: colors.card,
                                        borderColor: errors.confirmPassword ? colors.error : colors.border,
                                        color: colors.text,
                                        ...Shadows.sm
                                    }
                                ]}
                                placeholder={t[language].confirmPassword}
                                placeholderTextColor={colors.textSecondary}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirmPassword}
                                autoComplete="password-new"
                            />
                            <TouchableOpacity
                                style={styles.visibilityToggle}
                                onPress={toggleConfirmPasswordVisibility}
                                activeOpacity={0.7}
                            >
                                <Animated.View style={animatedConfirmIconStyle}>
                                    <Ionicons
                                        name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                                        size={24}
                                        color={colors.textSecondary}
                                    />
                                </Animated.View>
                            </TouchableOpacity>
                            {errors.confirmPassword ? (
                                <Animated.Text
                                    entering={FadeInDown.duration(200)}
                                    style={[styles.errorText, { color: colors.error }]}
                                >
                                    {errors.confirmPassword}
                                </Animated.Text>
                            ) : null}
                        </Animated.View>

                        <AnimatedPressable
                            style={[styles.continueButton, animatedButtonStyle]}
                            onPress={handlePasswordSubmit}
                            android_ripple={{ color: colors.primary + '20', radius: 200 }}
                        >
                            <Text style={[styles.continueButtonText, { color: colors.buttonText }]}>
                                {t[language].continue}
                            </Text>
                        </AnimatedPressable>
                    </Animated.View>
                );

            case 'name':
                return (
                    <Animated.View
                        entering={FadeInUp.delay(200).duration(800).springify()}
                        exiting={FadeInDown.duration(400)}
                        layout={Layout.springify()}
                        style={styles.inputContainer}
                    >
                        <Animated.Text
                            entering={FadeInDown.delay(100).duration(400)}
                            style={[styles.title, { color: colors.text, marginBottom: Spacing.lg, textAlign: 'center' }]}
                        >
                            {language === 'en' ? 'Would you like to introduce yourself?' : 'आफ्नो परिचय दिन चाहनुहुन्छ?'}
                        </Animated.Text>

                        <Animated.View
                            entering={FadeInUp.delay(200).duration(400)}
                            style={styles.nameContainer}
                        >
                            <Animated.View
                                entering={FadeInUp.delay(200).duration(400)}
                                style={styles.nameInputContainer}
                            >
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: colors.card,
                                            borderColor: errors.firstName ? colors.error : colors.border,
                                            color: colors.text,
                                            ...Shadows.sm
                                        }
                                    ]}
                                    placeholder={t[language].firstName}
                                    placeholderTextColor={colors.textSecondary}
                                    value={firstName}
                                    onChangeText={setFirstName}
                                    autoCapitalize="words"
                                    autoComplete="given-name"
                                />
                                {errors.firstName ? (
                                    <Animated.Text
                                        entering={FadeInDown.duration(200)}
                                        style={[styles.errorText, { color: colors.error }]}
                                    >
                                        {errors.firstName}
                                    </Animated.Text>
                                ) : null}
                            </Animated.View>

                            <Animated.View
                                entering={FadeInUp.delay(300).duration(400)}
                                style={styles.nameInputContainer}
                            >
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: colors.card,
                                            borderColor: errors.lastName ? colors.error : colors.border,
                                            color: colors.text,
                                            ...Shadows.sm
                                        }
                                    ]}
                                    placeholder={t[language].lastName}
                                    placeholderTextColor={colors.textSecondary}
                                    value={lastName}
                                    onChangeText={setLastName}
                                    autoCapitalize="words"
                                    autoComplete="family-name"
                                />
                                {errors.lastName ? (
                                    <Animated.Text
                                        entering={FadeInDown.duration(200)}
                                        style={[styles.errorText, { color: colors.error }]}
                                    >
                                        {errors.lastName}
                                    </Animated.Text>
                                ) : null}
                            </Animated.View>
                        </Animated.View>

                        <AnimatedPressable
                            style={[
                                styles.continueButton,
                                animatedButtonStyle,
                                isVerifying && { opacity: 0.7 }
                            ]}
                            onPress={handleNameSubmit}
                            disabled={isVerifying}
                            android_ripple={{ color: colors.primary + '20', radius: 200 }}
                        >
                            {isVerifying ? (
                                <ActivityIndicator color={colors.buttonText} />
                            ) : (
                                <Text style={[styles.continueButtonText, { color: colors.buttonText }]}>
                                    {t[language].continue}
                                </Text>
                            )}
                        </AnimatedPressable>

                        <Animated.View
                            entering={FadeInUp.delay(500).duration(400)}
                            style={styles.skipButton}
                        >
                            <TouchableOpacity
                                onPress={handleSkipName}
                                disabled={isVerifying}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.skipButtonText, { color: colors.textSecondary }]}>
                                    {language === 'en' ? 'Skip for now' : 'अहिलेलाई छोड्नुहोस्'}
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </Animated.View>
                );
        }
    };

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                    gestureEnabled: false,
                }}
            />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
                    <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

                    <Animated.View
                        entering={FadeInDown.duration(800).springify()}
                        style={styles.header}
                    >
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={[styles.backButton, { backgroundColor: colors.card }]}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="arrow-back" size={24} color={colors.text} />
                        </TouchableOpacity>
                    </Animated.View>

                    <View style={styles.content}>
                        {apiError ? (
                            <Animated.View
                                entering={FadeInDown.duration(400)}
                                style={[styles.errorContainer, { backgroundColor: colors.error + '20' }]}
                            >
                                <Text style={[styles.errorText, { color: colors.error }]}>{apiError}</Text>
                            </Animated.View>
                        ) : null}

                        {renderStep()}

                        <Animated.View
                            entering={FadeInUp.delay(400).duration(800).springify()}
                            style={styles.signInContainer}
                        >
                            <Text style={[styles.signInText, { color: colors.textSecondary }]}>
                                {language === 'en' ? 'Already have an account? ' : 'पहिले नै खाता छ? '}
                            </Text>
                            <TouchableOpacity
                                onPress={() => router.push('/(auth)/sign-in' as any)}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.signInLink, { color: colors.primary }]}>{t[language].signIn}</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </>
    );
}

const styles = StyleSheet.create<Styles>({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.lg,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadows.sm,
    },
    title: {
        ...Typography.h1,
        fontSize: 32,
    },
    subtitle: {
        ...Typography.body1,
        textAlign: 'center',
        opacity: 0.8,
    },
    content: {
        flex: 1,
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.xl,
    },
    inputContainer: {
        gap: Spacing.md,
    },
    input: {
        ...Typography.body1,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.lg,
        borderRadius: BorderRadius.xl,
        borderWidth: 1,
    },
    continueButton: {
        paddingVertical: Spacing.lg,
        borderRadius: BorderRadius.xl,
        alignItems: 'center',
        marginTop: Spacing.xl,
        ...Shadows.lg,
    },
    continueButtonText: {
        ...Typography.button,
        fontSize: 18,
    },
    emailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.lg,
        borderRadius: BorderRadius.xl,
        marginBottom: Spacing.lg,
        borderWidth: 1,
    },
    emailIcon: {
        width: 24,
        height: 24,
        marginRight: Spacing.sm,
        opacity: 0.8,
    },
    emailText: {
        ...Typography.body1,
        flex: 1,
        marginRight: Spacing.md,
        opacity: 0.8,
    },
    changeEmailButton: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.lg,
    },
    changeEmailButtonText: {
        ...Typography.body2,
        fontWeight: '600',
    },
    passwordContainer: {
        position: 'relative',
        marginBottom: Spacing.md,
    },
    passwordInput: {
        paddingRight: 48,
    },
    visibilityToggle: {
        position: 'absolute',
        right: Spacing.md,
        top: '50%',
        transform: [{ translateY: -12 }],
        padding: Spacing.xs,
        zIndex: 1,
    },
    skipButton: {
        alignItems: 'center',
        paddingVertical: Spacing.lg,
    },
    skipButtonText: {
        ...Typography.body2,
        opacity: 0.8,
    },
    signInContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 'auto',
        paddingBottom: Spacing.xl,
    },
    signInText: {
        ...Typography.body2,
    },
    signInLink: {
        ...Typography.body2,
        fontWeight: '700',
    },
    errorContainer: {
        padding: Spacing.lg,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.lg,
        ...Shadows.sm,
    },
    errorText: {
        ...Typography.caption,
        marginTop: Spacing.xs,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    logo: {
        width: 80,
        height: 80,
        borderRadius: BorderRadius.xl,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadows.lg,
    },
    nameContainer: {
        gap: Spacing.md,
    },
    nameInputContainer: {
        width: '100%',
    },
    inputError: {
        borderColor: Colors.light.error,
    },
    methodContainer: {
        gap: Spacing.md,
    },
    methodButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.lg,
        borderRadius: BorderRadius.xl,
        backgroundColor: Colors.light.card,
        ...Shadows.sm,
    },
    methodTextContainer: {
        marginLeft: Spacing.md,
        flex: 1,
    },
    methodButtonText: {
        ...Typography.button,
        fontSize: 16,
        marginBottom: Spacing.xs,
    },
    methodButtonSubtext: {
        ...Typography.caption,
        opacity: 0.8,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadows.sm,
    },
});