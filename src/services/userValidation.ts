// Types for validation
export type SignupData = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    age: string;
};

export type ValidationResult = {
    isValid: boolean;
    error?: string;
};

// Validate all signup fields are filled
export const validateRequiredFields = (data: SignupData): ValidationResult => {
    if (!data.name || !data.email || !data.password || !data.confirmPassword || !data.age) {
        return {
            isValid: false,
            error: 'Please fill in all fields'
        };
    }
    return { isValid: true };
};

// Validate age is within acceptable range
export const validateAge = (age: string): ValidationResult => {
    const ageNumber = parseInt(age);
    if (isNaN(ageNumber) || ageNumber < 13 || ageNumber > 120) {
        return {
            isValid: false,
            error: 'Please enter a valid age between 13 and 120'
        };
    }
    return { isValid: true };
};

// Validate password requirements
export const validatePassword = (password: string, confirmPassword: string): ValidationResult => {
    if (password !== confirmPassword) {
        return {
            isValid: false,
            error: 'Passwords do not match'
        };
    }

    if (password.length < 6) {
        return {
            isValid: false,
            error: 'Password must be at least 6 characters long'
        };
    }

    return { isValid: true };
};

// Main validation function that combines all validations
export const validateSignupData = (data: SignupData): ValidationResult => {
    // Check required fields
    const requiredFieldsValidation = validateRequiredFields(data);
    if (!requiredFieldsValidation.isValid) {
        return requiredFieldsValidation;
    }

    // Check age
    const ageValidation = validateAge(data.age);
    if (!ageValidation.isValid) {
        return ageValidation;
    }

    // Check password
    const passwordValidation = validatePassword(data.password, data.confirmPassword);
    if (!passwordValidation.isValid) {
        return passwordValidation;
    }

    return { isValid: true };
}; 