export interface IEducation {
    degree: string;
    university: string;
    yearOfCompletion: number;
}

export interface IExperience {
    place: string;
    year: string;
    experience: number;
}

export interface IAddress {
    addressLine: string;
    streetAddress: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
}

import { Document } from 'mongoose';

export interface IDoctor extends Document {
    fullName: string;
    email: string; 
    phone: string; 
    password: string;
    gender: 'Male' | 'Female';
    profileImage: string;
    dob: string;
    registrationNumber: string;
    registrationCouncil: string;
    registrationYear: number;
    identityProof: string;
    medicalRegistration: string;
    establishmentProof: string;
    about: string;
    educationDetails: IEducation;
    education: IEducation[]; 
    experience: IExperience[];
    headline: string;
    address: IAddress;
    specialization: string;
    yearsOfExperience: number;
    languageSpoken: string;
    fees: number;
    rating: number;
    reviewCount: number;
    isBlocked: boolean;
    isProfileCompleted: boolean;
    isApproved: boolean;
    createdAt: Date;
    updatedAt: Date;
}
