import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import dayjs from "dayjs";
import { useState } from "react";

export default function AvailabilityCalendar({ value, onChange, disabledDays=[] }) {
  const [selected, setSelected] = useState(value ? new Date(value) : undefined);
  function handle(d) {
    setSelected(d);
    onChange?.(d ? dayjs(d).format("YYYY-MM-DD") : "");
  }
  return (
    <div className="card p-4">
      <div className="font-semibold mb-2">Preferred date</div>
      <DayPicker mode="single" selected={selected} onSelect={handle} disabled={disabledDays} />
      {selected && (
        <div className="text-sm text-white/70 mt-2">
          You selected {dayjs(selected).format("ddd D MMM YYYY")}
        </div>
      )}
    </div>
  );
}