import { IAppointmentDocument } from "../../repositories/interfaces/IAppointmentRepository"

export interface IAppointmentServices {
    createAppointment({doctorId, patientId, slotId, appointmentDate, status, transactionId}: ICreateAppointment): Promise<IAppointmentDocument>
    getUserAppointments(userId: string): Promise<IAppointmentDocument[]>
    getAllAppointments(): Promise<IAppointmentDocument[]> 
    getBookedPatients(slotId: string): Promise<any>
    consultingCompleted(appointmentId: string, slotId: string): Promise<boolean>
}


export interface ICreateAppointment {
    doctorId: string, 
    patientId: string, 
    slotId: string, 
    appointmentDate: Date | string, 
    status: string, 
    transactionId: string
}
