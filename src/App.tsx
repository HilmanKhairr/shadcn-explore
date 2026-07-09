import { Select } from "@/components/ui/select";
import "./App.css";
import { Button } from "./components/ui/button";
import { ThemeProvider } from "./providers/ThemeProvider";

const buahOptions = [
  { value: "apel", label: "Apel" },
  { value: "pisang", label: "Pisang" },
  { value: "jeruk", label: "Jeruk" },
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
    <ThemeProvider defaultTheme="dark">
      <Button className="bg-amber-500 text-black hover:bg-amber-600" loading fullWidth={false}>
        Halo
      </Button>

      <Select
        items={buahOptions}
        label="Pilih Buah Kesukaan"
        valueProps={{
          placeholder: "Mau Buah Apa?",
        }}
        onValueChange={(val) => console.log("Terpilih:", val)}
      />

      <Select
        items={menuOptions}
        valueProps={{
          placeholder: "Mau Pesan Apa?",
        }}
        onValueChange={(val) => console.log("Pesanan:", val)}
      />
    </ThemeProvider>
  );
}

export default App;