"use client";

import { useState, useEffect } from "react";
import { X, Search, Fingerprint, SlidersHorizontal, ChevronRight, ChevronLeft, Clock, List } from "lucide-react";

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddAppointmentModal({ isOpen, onClose }: AddAppointmentModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 8, 25)); // September 25, 2025
  const [selectedTime, setSelectedTime] = useState("09:49 AM");
  const [clinic, setClinic] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [repeat, setRepeat] = useState("Does not repeat");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Appointment data:", { searchQuery, selectedDate, selectedTime, clinic, appointmentType, repeat });
    onClose();
  };

  // Calendar generation
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({ day: prevMonthLastDay - i, isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ day: i, isCurrentMonth: false });
    }

    return days;
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const days = getDaysInMonth(selectedDate);

  const previousMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Add new appointment</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Search Patient */}
          <div className="mb-6">
            <div className="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Find patient"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <button type="button" className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <Fingerprint className="w-6 h-6 text-gray-400" />
              </button>
              <button type="button" className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <SlidersHorizontal className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Clinic Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <label className="text-gray-500 font-medium">Clinic</label>
              <button
                type="button"
                className="flex items-center gap-2 text-gray-900 font-semibold hover:text-primary transition-colors"
              >
                Clinic
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Appointment Type */}
          <div className="mb-6">
            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <label className="text-gray-500 font-medium">Title</label>
              <button
                type="button"
                className="flex items-center gap-2 text-gray-900 font-semibold hover:text-primary transition-colors"
              >
                Appointment type
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Time Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between py-4">
              <label className="text-gray-500 font-medium">Time</label>
              <div className="flex items-center gap-4">
                <span className="text-gray-900 font-semibold">
                  {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                </span>
                <span className="text-gray-900 font-semibold">{selectedTime}</span>
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="mb-6 bg-[#6B7A99] rounded-lg p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <button type="button" onClick={previousMonth} className="p-2 hover:bg-white/10 rounded transition-colors">
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              
              <div className="flex items-center gap-4">
                <button type="button" className="p-2 hover:bg-white/10 rounded transition-colors">
                  <List className="w-5 h-5 text-white" />
                </button>
                <h3 className="text-white font-semibold text-lg">
                  {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button type="button" onClick={nextMonth} className="p-2 hover:bg-white/10 rounded transition-colors">
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
                <button type="button" className="p-2 hover:bg-white/10 rounded transition-colors">
                  <Clock className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day Headers */}
              {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                <div key={index} className="text-center text-white/70 font-medium text-sm py-2">
                  {day}
                </div>
              ))}

              {/* Calendar Days */}
              {days.map((dayObj, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    if (dayObj.isCurrentMonth) {
                      setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), dayObj.day));
                    }
                  }}
                  className={`
                    aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all
                    ${!dayObj.isCurrentMonth ? "text-white/30" : "text-white hover:bg-white/10"}
                    ${dayObj.isCurrentMonth && dayObj.day === selectedDate.getDate() ? "bg-white/20 ring-2 ring-white" : ""}
                  `}
                >
                  {dayObj.day}
                </button>
              ))}
            </div>
          </div>

          {/* Repeat */}
          <div className="mb-6">
            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <label className="text-gray-500 font-medium">Repeat</label>
              <button
                type="button"
                className="flex items-center gap-2 text-gray-900 font-semibold hover:text-primary transition-colors"
              >
                {repeat}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors"
            >
              Save & Close
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Create invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

