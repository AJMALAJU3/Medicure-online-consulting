import { IDoctor } from "../../models/doctor/doctorInterface";
import { IAdminRepository } from "../../repositories/interfaces/IAdminRepository";
import { IDoctorRepository } from "../../repositories/interfaces/IDoctorRepostory";
import { IPatientDocument, IPatientRepository } from "../../repositories/interfaces/IPatientRepository";
import { ISlotRepository } from "../../repositories/interfaces/ISlotRepository";
import { ISlot } from "../../types/ISlotInterface";
import { checkBruteForce, deleteBruteForce } from "../../utils/BruteForceHandler";
import { verifyPassword } from "../../utils/passwordUtil";
import { generateAccessToken, generateRefreshToken } from "../../utils/tokenUtil";
import { IAdminServices } from "../interfaces/IAdminServices";
import { authorizedUserResponse } from "./authServices";


export class AdminServices implements IAdminServices {
    private adminRepository: IAdminRepository;
    private doctorRepository: IDoctorRepository;
    private patientRepository: IPatientRepository;
    private slotRepository: ISlotRepository;

    constructor(adminRepository: IAdminRepository, doctorRepository: IDoctorRepository, slotRepository: ISlotRepository, patientRepository:IPatientRepository) {
        this.adminRepository = adminRepository
        this.doctorRepository = doctorRepository
        this.patientRepository = patientRepository
        this.slotRepository = slotRepository
    }

    async signIn(email: string, password: string, role: string): Promise<authorizedUserResponse> {
        try {
            // await checkBruteForce(email, 5, 600)
            if (role !== 'admin') {
                console.log(role, 'rl')
                throw new Error('This is only for admin');
            }
            const admin = await this.adminRepository.findByEmail(email);
            if (!admin) {
                throw new Error('Invalid email or password');
            }
            const isPasswordValid = await verifyPassword(password, admin.password);
            if (!isPasswordValid) {
                throw new Error('Invalid email or password');
            }
            // await deleteBruteForce(email);
            const payload = {
                _id: admin._id.toString(),
                role,
            };

            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);
            return { accessToken, refreshToken, _id: admin._id.toString() };
        } catch (error) {
            console.error('Error during sign-in:', error);
            throw new Error(`Sign-in failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async getDoctorDetails(_id: string): Promise<IDoctor> {
        try {
            if (!_id) {
                throw new Error('Doctor ID is required');
            }
            const doctorData = await this.doctorRepository.findByID(_id);

            if (!doctorData) {
                throw new Error('Doctor not found');
            }

            return doctorData;
        } catch (error: any) {
            throw error
        }
    }


    async getApprovedDoctors(skip: number, limit: number, searchQuery: string): Promise<{ data: IDoctor[], hasMore: boolean }> {
        try {

            const approvedDoctors = await this.doctorRepository.fetchAllApprovedDoctors(skip, limit, searchQuery);

            return approvedDoctors;
        } catch (error: any) {
            console.error('Error fetching approved doctors:', error);

            if (error.name === 'MongoError') {
                throw new Error('Database error occurred while fetching approved doctors.');
            } else if (error instanceof TypeError) {
                throw new Error('Unexpected data processing error occurred.');
            } else {
                throw new Error('An unexpected error occurred. Please try again later.');
            }
        }
    }

    async getDoctorApprovalRequests(skip: number, limit: number): Promise<{ data: IDoctor[], hasMore: boolean }> {
        try {

            const approvedDoctors = await this.doctorRepository.fetchAllRequestedDoctors(skip, limit);

            if (!approvedDoctors.data.length) {
                throw new Error('No approved doctors found.');
            }

            return approvedDoctors;
        } catch (error: any) {
            console.error('Error fetching approved doctors:', error);

            if (error.name === 'MongoError') {
                throw new Error('Database error occurred while fetching approved doctors.');
            } else if (error instanceof TypeError) {
                throw new Error('Unexpected data processing error occurred.');
            } else {
                throw new Error('An unexpected error occurred. Please try again later.');
            }
        }
    }

    async getDoctorAppointmentDetails(_id: string): Promise<ISlot[]> {
        try {
            if (!_id) {
                throw new Error('Doctor ID is required');
            }
            const doctorSlots = await this.slotRepository.getAllSlots(_id);
            return doctorSlots;
        } catch (error: any) {
            throw error
        }
    }

    async approveDoctor(_id: string): Promise<void> {
        try {
            if (!_id) {
                throw new Error('Doctor approval failed: Missing doctor ID.');
            }
    
            const updateDoctor = await this.doctorRepository.approveDoctor(_id);
    
            if (updateDoctor.modifiedCount === 0) {
                throw new Error('Doctor approval failed: No changes were made, please verify the doctor ID.');
            }
        } catch (error: any) {
            throw error
        }
    }

    async rejectDoctor(_id: string): Promise<void> {
        try {
            if (!_id) {
                throw new Error('Doctor rejection failed: Doctor ID is required.');
            }
    
            const deleteDoctor = await this.doctorRepository.deleteDoctor(_id);
    
            if (!deleteDoctor || deleteDoctor.deletedCount === 0) {
                throw new Error('Doctor rejection failed: No doctor found with the provided ID.');
            }
    
        } catch (error: any) {
            throw error
        }
    }

    async getAllPatients(skip: number, limit: number): Promise<{ data: IPatientDocument[], hasMore: boolean }> {
        try {

            const patientData = await this.patientRepository.getAllPatient(skip, limit);

            if (!patientData.data.length) {
                throw new Error('No patients found.');
            }

            return patientData;
        } catch (error: any) {
            console.error('Error fetching patients:', error);

            if (error.name === 'MongoError') {
                throw new Error('Database error occurred while fetching patients.');
            } else if (error instanceof TypeError) {
                throw new Error('Unexpected data processing error occurred.');
            } else {
                throw new Error('An unexpected error occurred. Please try again later.');
            }
        }
    }
    
    async block (_id: string, role: string): Promise<void> {
        try {
            if (!_id) {
                throw new Error(' Missing ID.');
            }

            const respository = role === 'patient' ? this.patientRepository : this.doctorRepository
            const block = await respository.block(_id);
    
            if (block.modifiedCount === 0) {
                throw new Error(`Block ${role} failed: No changes were made, please verify the ID.`);
            }
        } catch (error: any) {
            throw error
        }
    }

    async unblock (_id: string, role: string): Promise<void> {
        try {
            if (!_id) {
                throw new Error(' Missing ID.');
            }

            const respository = role === 'patient' ? this.patientRepository : this.doctorRepository
            const unblock = await respository.unblock(_id);
    
            if (unblock.modifiedCount === 0) {
                throw new Error(`Unblock ${role} failed: No changes were made, please verify the ID.`);
            }
        } catch (error: any) {
            throw error
        }
    }
}