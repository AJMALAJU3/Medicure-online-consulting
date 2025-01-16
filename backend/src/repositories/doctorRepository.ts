import mongoose from "mongoose";
import { IProfileVerificationInput, ICreateUser } from "../interfaces/doctorInterface";
import { DoctorModel, IDoctor } from "../models/doctorModel";




export class DoctorRepository {
    async createDoctor({ fullName, email, phone, password }: ICreateUser) {
        if (!email) {
            throw new Error('Email cannot be null or empty');
        }
        const existingUser = await DoctorModel.findOne({ email });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        const doctor = new DoctorModel({ fullName, email, phone, password });
        console.log(doctor, 'doctor');
        return await doctor.save();
    }

    async updateDoctor(
        _id: string, 
        { fullName, headline, about, address }): Promise<void> {
        console.log('hres',fullName,headline,about,address)

        const result = await DoctorModel.updateOne({ _id },{$set: { fullName, headline, about, address }})
        console.log(result,'res')
    }

    async findByEmail(email: string) {
        return await DoctorModel.findOne({ email });
    }

    async findByID(_id: string) {
        return await DoctorModel.findById(_id)
    }


    async updateProfileData({
        _id,
        registrationNumber,
        registrationCouncil,
        registrationYear,
        yearsOfExperience,
        degree,
        university,
        yearOfCompletion
    }: IProfileVerificationInput): Promise<{ modifiedCount: number }> {
        try {
            const updateResult = await DoctorModel.updateOne(
                { _id },
                {
                    $set: {
                        registrationNumber,
                        registrationCouncil,
                        registrationYear,
                        educationDetails: {
                            degree,
                            university,
                            yearOfCompletion
                        },
                        yearsOfExperience
                    }
                }
            );
            return updateResult;
        } catch (error: any) {
            console.error(`Error updating profile data: ${error.message}`);
            throw new Error('Error updating profile data, please try again.');
        }
    }

    async updateVerficationProofs(_id: string, establishmentProof: string | null, identityProof: string | null, medicalRegistration: string | null) {
        try {
            const updateData: any = {};
            if (establishmentProof !== null) {
                updateData.establishmentProof = establishmentProof;
            }
            if (identityProof !== null) {
                updateData.identityProof = identityProof;
            }
            if (medicalRegistration !== null) {
                updateData.medicalRegistration = medicalRegistration;
            }
            if (Object.keys(updateData).length > 0) {
                const updateResult = await DoctorModel.updateOne(
                    { _id },
                    { $set: updateData }
                );
                return updateResult;
            } else {
                throw new Error('No data to update');
            }
            
        } catch (error: any) {
            console.error(`Error updating proof verification data: ${error.message}`);
            throw new Error('Error updating proof verification data, please try again.');
        }
    }

    async updatekProfileComplete (_id: string) {
        return await DoctorModel.updateOne({_id},{$set:{isProfileCompleted:true}})
    }

    async updateFees(_id: string, fees: number) {
        return await DoctorModel.updateMany({_id},{$set:{fees}})
    }

    async getFees(doctorId: string): Promise<number | null> {
        const _id = new mongoose.Types.ObjectId(doctorId);
        const doctor = await DoctorModel.findById(_id).select('fees');
        return doctor ? doctor.fees : null;
    }

    async changePassword(_id: string, password: string) {
        return await DoctorModel.updateOne(
            { _id },
            { $set: { password } }
        );
    }
}