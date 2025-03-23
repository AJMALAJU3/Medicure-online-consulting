import { useEffect, useState } from "react";
import { CalendarCheck, ChevronLeft, ChevronRight, Clock, Undo2 } from "lucide-react";
import { fetchAllAppointmentDetailsApi } from "../../sevices/appointments/fetchAppointments";
import { IFetchAllAppointmentResponse } from "../../types/appointment/fetchAppointments";
import { useDispatch } from "react-redux";
import { setError, setExtra, setLoading, setWarning } from "../../store/slices/commonSlices/notificationSlice";
import { refundApi } from "../../sevices/payment/payment";

const isExpired = (createdAt: string) => {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 2);
    return new Date(createdAt) < twentyFourHoursAgo;
};

const Appointments = () => {
    const [appointments, setAppointments] = useState<IFetchAllAppointmentResponse[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [transactionId, setTransactionId] = useState('')

    const appointmentsPerPage = 5;
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                dispatch(setLoading(true));
                const response = await fetchAllAppointmentDetailsApi();
                if (response) {
                    setAppointments(response.userAppointmentsList.reverse());
                } else {
                    setError("No appointments found.");
                }
            } catch (err) {
                setError("Failed to load appointments.");
            } finally {
                dispatch(setLoading(false));
            }
        };
        fetchAppointments();
    }, []);

    const filteredAppointments = appointments.filter((appointment) => {
        const matchesSearch =
            appointment.doctorDetails?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.patientDetails?.fullName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDate = selectedDate ? appointment.appointmentDate.startsWith(selectedDate) : true;
        const matchesTime = selectedTime ? appointment.slotDetails?.startTime === selectedTime : true;
        const matchesStatus = statusFilter ? appointment.status === statusFilter : true;

        return matchesSearch && matchesDate && matchesTime && matchesStatus;
    });

    const indexOfLastAppointment = currentPage * appointmentsPerPage;
    const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
    const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

    const nextPage = () => {
        if (indexOfLastAppointment < filteredAppointments.length) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const refundHandlerApi = async () => {
        try {
            const { message } = await refundApi(transactionId);
            console.log(message);
        } catch (error: any) {
            dispatch(setError(error.message));
        }
    };

    const refundHandler = async (transactionId: string) => {
        setTransactionId(transactionId)
        dispatch(setWarning("Do you want to refund these payment?"))
        dispatch(setExtra(refundHandlerApi))
    }

    return (
        <div className="w-full mx-auto p-6 rounded-lg shadow-lg flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                <CalendarCheck className="w-6 h-6 text-green-700" />
                Appointments
            </h2>
            
            <div className="flex flex-wrap gap-4 my-4">
                <input
                    type="text"
                    placeholder="Search by doctor or patient"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border p-2 rounded-md"
                />
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border p-2 rounded-md"
                />
                <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="border p-2 rounded-md"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border p-2 rounded-md"
                >
                    <option value="">All Status</option>
                    <option value="Completed">Completed</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
                <div className="cursor-pointer ml-auto mt-auto flex gap-2">
                    <div onClick={prevPage} className="flex font-medium items-center"><ChevronLeft /> prev</div>
                    <div onClick={nextPage} className="flex font-medium items-center">next <ChevronRight /></div>
                </div>
            </div>
            
            <div className="flex flex-col justify-between flex-1">
                <div className="mt-4 space-y-2">
                    {currentAppointments.length > 0 ? (
                        currentAppointments.map((appointment) => (
                            <div key={appointment._id} className="flex flex-col md:flex-row items-center justify-between bg-gray-100 p-4 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={appointment.doctorDetails?.profileImage || "/default-doctor.png"}
                                        alt="Doctor"
                                        className="w-12 h-12 rounded-full object-cover border border-gray-300"
                                    />
                                    <div>
                                        <p className="text-lg font-semibold text-gray-800">Dr. {appointment.doctorDetails?.fullName || "Unknown"}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center text-gray-600">
                                    <Clock className="w-5 h-5 text-blue-500 mb-1" />
                                    <p className="text-sm">{new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                                    <p className="text-sm">{appointment.slotDetails?.startTime} - {appointment.slotDetails?.endTime}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <img src={appointment.patientDetails?.profileImage || "/default-patient.png"} alt="Patient" className="w-12 h-12 rounded-full object-cover border border-gray-300" />
                                    <div>
                                        <p className="text-lg font-semibold text-gray-800">{appointment.patientDetails?.fullName || "Unknown"}</p>
                                        <p className="text-sm text-gray-500">Contact: {appointment.patientDetails?.phone || "N/A"}</p>
                                    </div>
                                </div>
                                {appointment.status === "Scheduled" && isExpired(appointment.createdAt) ?
                                <div className="text-center flex flex-col">
                                     <span className="text-red-500 text-sm ">time out</span>
                                     <span className="text-gray-500 text-sm font-semibold flex gap-1 items-center cursor-pointer" onClick={() => refundHandler(appointment.transactionId)}><Undo2 size={15} strokeWidth={3} />refund</span>
                                </div> :
                                <div className="text-center flex flex-col gap-2">
                                    <span className={`text-sm font-semibold ${appointment.status === "Completed" ? "text-green-600" : appointment.status === "Cancelled" ? "text-gray-500" : "text-orange-400"}`}>{appointment.status}</span>
                                </div>}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center mt-4">No appointments available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Appointments;
