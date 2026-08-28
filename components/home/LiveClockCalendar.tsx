"use client";

import React, { useState, useEffect } from "react";
import { Clock, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

export default function LiveClockCalendar() {
  const [time, setTime] = useState<string>("");
  const [dateStr, setDateStr] = useState<string>("");
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
      setDateStr(
        now.toLocaleDateString("en-IN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calendar logic
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const todayDate = today.getDate();

  const prevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  // Generate calendar day cells
  const calendarCells = [];
  // Empty leading cells
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(<div key={`empty-${i}`} className="h-7 w-7 text-center text-slate-300" />);
  }
  // Days of current month
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const isToday = isCurrentMonth && d === todayDate;
    calendarCells.push(
      <div
        key={`day-${d}`}
        className={`h-7 w-7 flex items-center justify-center text-xs font-semibold rounded-full mx-auto transition-all ${
          isToday
            ? "bg-brand-accent text-white font-bold shadow-md scale-110 ring-2 ring-amber-300"
            : "text-slate-700 hover:bg-slate-100"
        }`}
      >
        {d}
      </div>
    );
  }

  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className="bg-white rounded-xl shadow-card border border-slate-200 overflow-hidden flex flex-col h-full">
      
      {/* Live Time Header Bar */}
      <div className="bg-brand-blue text-white p-4 flex items-center justify-between border-b border-brand-primary">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-amber-400 animate-spin" style={{ animationDuration: '20s' }} />
          <div>
            <span className="text-[10px] text-slate-300 uppercase tracking-widest block font-semibold">Live Time (IST)</span>
            <p className="text-xl font-black tracking-wider text-amber-300 font-mono">{time || "00:00:00 AM"}</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-300 uppercase tracking-widest block font-semibold">Today</span>
          <p className="text-xs font-bold text-white max-w-[150px] leading-tight truncate">{dateStr || "Loading date..."}</p>
        </div>
      </div>

      {/* Interactive Calendar Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1.5 text-brand-blue" />
            {monthNames[month]} {year}
          </h3>

          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition"
              aria-label="Previous Month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition"
              aria-label="Next Month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Weekday Labels */}
        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {weekdays.map((wd, i) => (
            <div key={wd} className={`text-[11px] font-bold ${i === 0 ? "text-rose-600" : "text-slate-500"}`}>
              {wd}
            </div>
          ))}
        </div>

        {/* Month Grid */}
        <div className="grid grid-cols-7 gap-y-1 text-center">
          {calendarCells}
        </div>

        {/* Footer Note */}
        <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
          <span className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-brand-accent inline-block mr-1.5" />
            Today's Date
          </span>
          <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
            Portal Active 24×7
          </span>
        </div>

      </div>

    </div>
  );
}
