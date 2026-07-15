import { useState } from "react";
import type { DateRange } from "react-day-picker";
import "./App.css";
import { Button } from "./components/ui/button";
import CompactDatePicker from "./components/ui/compact/CompactDatePicker";
import { ThemeProvider } from "./providers/ThemeProvider";

// const buahOptions = [
//   { key: "apel", value: "Apel" },
//   { key: "pisang", value: "Pisang" },
//   { key: "jeruk", value: "Jeruk" },
// ];

// const menuOptions = [
//   {
//     label: "Makanan Makanan Makanan",
//     items: [
//       { value: "nasi-goreng", label: "Nasi Goreng" },
//       { value: "mie-ayam", label: "Mie Ayam" },
//     ],
//   },
//   {
//     label: "Minuman Segar",
//     items: [
//       { value: "es-teh", label: "Es Teh Manis" },
//       { value: "kopi-susu", label: "Kopi Susu" },
//     ],
//   },
// ];

function App() {
  const [singleValue, setSingleValue] = useState<Date | undefined>();
  const [multipleValue, setMultipleValue] = useState<Date[] | undefined>();
  const [rangeValue, setRangeValue] = useState<DateRange | undefined>();
  return (
    <ThemeProvider defaultTheme="light">
      <div className="flex flex-wrap gap-1">
        <Button
          fullWidth
          className="bg-amber-500 text-black hover:bg-amber-600"
          loading
        >
          Halo
        </Button>
        {/* 
      <CompactSelect fullWidth loading items={buahOptions} label="Pilih Buah Kesukaan" placeholder="Mau Buah Apa?" valueKey="key" labelKey="value" onValueChange={(val) => console.log("Terpilih:", val)} />
      <CompactSelect fullWidth items={menuOptions} placeholder="Mau Pesan Apa?" onValueChange={(val) => console.log("Pesanan:", val)} /> */}

        <CompactDatePicker
          fullWidth
          mode="single"
          value={singleValue}
          onChange={setSingleValue}
        />
        <CompactDatePicker
          fullWidth
          mode="multiple"
          value={multipleValue}
          onChange={setMultipleValue}
        />
        <CompactDatePicker
          fullWidth
          mode="range"
          value={rangeValue}
          onChange={setRangeValue}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;

