const Appointment = require("../models/appointment");

async function createAppointment(req, res){
    try{
        const { doctorId, date, slots } = req.body;
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

async function bookSlot(req, res){
    try{
        const { userId, doctorId, date, slotName } = req.body;
        const appointment = await Appointment.findOne({ doctor: doctorId, date: date });
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
        slot.users.push(userId);

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

module.exports = { createAppointment, bookSlot };