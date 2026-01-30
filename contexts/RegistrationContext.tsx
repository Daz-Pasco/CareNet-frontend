import React, { createContext, ReactNode, useContext, useState } from 'react';

export interface RegistrationData {
    // Personal Info (Step 1)
    dateOfBirth: string;
    patientPhone: string;
    caregiverPhone: string;
    gender: 'male' | 'female' | 'other' | null;
    // Physical Data (Step 2)
    heightCm: number;
    weightKg: number;
    // Address (Step 3)
    address: string;
    // Medical Info (Step 4)
    allergies: string[];
    conditions: string[];
    medications: string[];
    // From Auth (Google)
    fullName: string;
    email: string;
}

interface RegistrationContextType {
    data: RegistrationData;
    updatePersonalInfo: (info: Partial<Pick<RegistrationData, 'dateOfBirth' | 'patientPhone' | 'caregiverPhone' | 'gender'>>) => void;
    updatePhysicalData: (info: Partial<Pick<RegistrationData, 'heightCm' | 'weightKg'>>) => void;
    updateAddress: (address: string) => void;
    updateMedicalInfo: (info: Partial<Pick<RegistrationData, 'allergies' | 'conditions' | 'medications'>>) => void;
    updateAuthInfo: (info: Partial<Pick<RegistrationData, 'fullName' | 'email'>>) => void;
    resetData: () => void;
}

const defaultData: RegistrationData = {
    dateOfBirth: '',
    patientPhone: '',
    caregiverPhone: '',
    gender: null,
    heightCm: 170,
    weightKg: 70,
    address: '',
    allergies: [],
    conditions: [],
    medications: [],
    fullName: '',
    email: '',
};

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export function RegistrationProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<RegistrationData>(defaultData);

    const updatePersonalInfo = (info: Partial<Pick<RegistrationData, 'dateOfBirth' | 'patientPhone' | 'caregiverPhone' | 'gender'>>) => {
        setData(prev => ({ ...prev, ...info }));
    };

    const updatePhysicalData = (info: Partial<Pick<RegistrationData, 'heightCm' | 'weightKg'>>) => {
        setData(prev => ({ ...prev, ...info }));
    };

    const updateAddress = (address: string) => {
        setData(prev => ({ ...prev, address }));
    };

    const updateMedicalInfo = (info: Partial<Pick<RegistrationData, 'allergies' | 'conditions' | 'medications'>>) => {
        setData(prev => ({ ...prev, ...info }));
    };

    const updateAuthInfo = (info: Partial<Pick<RegistrationData, 'fullName' | 'email'>>) => {
        setData(prev => ({ ...prev, ...info }));
    };

    const resetData = () => {
        setData(defaultData);
    };

    return (
        <RegistrationContext.Provider value={{
            data,
            updatePersonalInfo,
            updatePhysicalData,
            updateAddress,
            updateMedicalInfo,
            updateAuthInfo,
            resetData,
        }}>
            {children}
        </RegistrationContext.Provider>
    );
}

export function useRegistration() {
    const context = useContext(RegistrationContext);
    if (!context) {
        throw new Error('useRegistration must be used within a RegistrationProvider');
    }
    return context;
}
