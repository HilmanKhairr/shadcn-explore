import CompactSelect from "../registry/block/CompactSelect";
import "./App.css";
import { Button } from "../registry/ui/button";
import { ThemeProvider } from "./providers/ThemeProvider";

const buahOptions = [
  { key: "apel", value: "Apel" },
  { key: "pisang", value: "Pisang" },
  { key: "jeruk", value: "Jeruk" },
];

const menuOptions = [
  {
    label: "Makanan Makanan Makanan",
    items: [
      { value: "nasi-goreng", label: "Nasi Goreng" },
      { value: "mie-ayam", label: "Mie Ayam" },
    ],
  },
  {
    label: "Minuman Segar",
    items: [
      { value: "es-teh", label: "Es Teh Manis" },
      { value: "kopi-susu", label: "Kopi Susu" },
    ],
  },
];

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <Button fullWidth className="bg-amber-500 text-black hover:bg-amber-600" loading>
        Halo
      </Button>

      <CompactSelect fullWidth items={buahOptions} label="Pilih Buah Kesukaan" placeholder="Mau Buah Apa?" valueKey="key" labelKey="value" onValueChange={(val) => console.log("Terpilih:", val)} />
      <CompactSelect fullWidth items={menuOptions} placeholder="Mau Pesan Apa?" onValueChange={(val) => console.log("Pesanan:", val)} />
    </ThemeProvider>
  );
}

export default App;