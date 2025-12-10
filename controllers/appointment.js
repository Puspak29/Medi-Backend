const Appointment = require("../models/appointment");

// create appointments (for doctors)
async function createAppointment(req, res){
    try{
        const doctorId = req.user.id;
        if(req.user.role !== 'doctor'){
            return res.status(403).json({
                success: false,
                message: "Access denied. Only doctors can create appointments."
            });
        }

        const { date, slots } = req.body;
        const formattedSlots = {};
        const slotNames = ["slot1", "slot2", "slot3", "slot4"];

        slotNames.forEach((slot) => {
            formattedSlots[slot] = {
                capacity: slots[slot]?.capacity || 10,
                booked: 0,
                disabled: slots[slot]?.disabled || false,
                users: []
            };
        });

        const newAppointment = await Appointment.create({
            doctor: doctorId,
            date: date,
            slots: formattedSlots
        });

        return res.status(201).json({
            success: true,
            message: "Appointment created successfully"
        });
    }
     catch(err){
        return res.status(500).json({
            success: false,
            message: "An error occurred while creating appointment"
        })
    }
}

// book a slot for a user (for users)
async function bookSlot(req, res){
    try{
        const userId = req.user.id;
        const role = req.user.role;
        if(role !== 'user'){
            return res.status(403).json({
                success: false,
                message: "Access denied. Only patients can book slots."
            });
        }
        const { appointmentId, slotName } = req.body;
        const appointment = await Appointment.findById(appointmentId);
        if(!appointment){
            return res.status(404).json({
                success: false,
                message: "Appointment not found for the given doctor and date"
            });
        }

        const slot = appointment.slots[slotName];
        if(!slot){
            return res.status(400).json({
                success: false,
                message: "Invalid slot name"
            });
        }
        if(slot.disabled){
            return res.status(400).json({
                success: false,
                message: "This slot is disabled"
            });
        }
        if(slot.booked >= slot.capacity){
            return res.status(400).json({
                success: false,
                message: "This slot is fully booked"
            });
        }
        if(slot.users.includes(userId)){
            return res.status(400).json({
                success: false,
                message: "User has already booked this slot"
            });
        }
        slot.booked += 1;
        slot.users.push({ user: userId });

        await appointment.save();
        
        return res.status(200).json({
            success: true,
            message: "Slot booked successfully"
        });
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "An error occurred while booking slot"
        });
    }
}

// get all appointments for a specific doctor (for doctors)
async function getDoctorAppointments(req, res){
    try{
        const doctorId = req.user.id;
        const role = req.user.role;
        if(role !== 'doctor'){
            return res.status(403).json({
                success: false,
                message: "Access denied. Only doctors can access their appointments."
            });
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const appointments = await Appointment.find({ 
            doctor: doctorId, 
            date: { $gte: today } 
        }).sort({ date: 1 });

        return res.status(200).json({
            success: true,
            message: "Appointments fetched successfully",
            appointments: appointments
        });
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching appointments"
        });
    }
}

// get users appointed in a specific slot (for doctors view)
async function getAppointedUsers(req, res){
    try{
        const doctorId = req.user.id;
        const role = req.user.role;
        if(role !== 'doctor'){
            return res.status(403).json({
                success: false,
                message: "Access denied. Only doctors can access their appointed users."
            });
        }
        const { appointmentId, slotName } = req.query;
        const validSlots = ["slot1", "slot2", "slot3", "slot4"];
        if (!validSlots.includes(slotName)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid slot name" 
            });
        }
        const slot = await Appointment.findOne({ _id: appointmentId, doctor: doctorId }).populate(`slots.${slotName}.users.user`, "name email");
        if(!slot){
            return res.status(404).json({
                success: false,
                message: "Appointment or slot not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Appointed users fetched successfully",
            slot: slot.slots[slotName]
        });
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching appointed users"
        });
    }
}

// get available slots for a specific doctor (for users to book)
async function getAvailableSlots(req, res){
    try{
        const { doctorId } = req.query;
        const role = req.user.role;
        if(role !== 'user'){
            return res.status(403).json({
                success: false,
                message: "Access denied. Only patients can access available slots."
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const appointments = await Appointment.find({ 
            doctor: doctorId, 
            date: { $gte: today } 
        }).sort({ date: 1 }).select({
        doctor: 1,
        date: 1,
        "slots.slot1.capacity": 1,
        "slots.slot1.booked": 1,
        "slots.slot1.disabled": 1,
        "slots.slot2.capacity": 1,
        "slots.slot2.booked": 1,
        "slots.slot2.disabled": 1,
        "slots.slot3.capacity": 1,
        "slots.slot3.booked": 1,
        "slots.slot3.disabled": 1,
        "slots.slot4.capacity": 1,
        "slots.slot4.booked": 1,
        "slots.slot4.disabled": 1,
        }).lean();

        if(appointments.length === 0){
            return res.status(404).json({
                success: false,
                message: "No available slots found for the given doctor"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Available slots fetched successfully",
            appointments: appointments
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching available slots"
        });
    }
}

// get all appointments for a specific user (for users)
async function getUserAppointments(req, res){
    try{
        const userId = req.user.id;
        const role = req.user.role;
        if(role !== 'user'){
            return res.status(403).json({
                success: false,
                message: "Access denied. Only patients can access their appointments."
            });
        }

        const appointments = await Appointment.find({
            $or: [
                { "slots.slot1.users.user": userId },
                { "slots.slot2.users.user": userId },
                { "slots.slot3.users.user": userId },
                { "slots.slot4.users.user": userId },
            ]
        }).populate("doctor", "name email").lean();

        const results = [];
        appointments.forEach(apt => {
            Object.entries(apt.slots).forEach(([slotKey, slot]) => {
                if (slot.users.some(u => u.user.toString() === userId.toString())) {
                results.push({
                    _id: apt._id,
                    date: apt.date,
                    slot: slotKey,
                    doctor: apt.doctor
                });
                }
            });
        })

        return res.status(200).json({
            success: true,
            message: "User appointments fetched successfully",
            appointments: results
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching user appointments"
        });
    }
}

module.exports = { 
    createAppointment, 
    bookSlot, 
    getDoctorAppointments, 
    getAppointedUsers, 
    getAvailableSlots,
    getUserAppointments
};