import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  MenuItem,
} from "@mui/material";
import type { GridProps } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { BuildingInput, Facade, Skylight, Orientation } from "../types";

const orientations: Orientation[] = ["north", "south", "east", "west"];
const cities = ["Bangalore", "Mumbai", "Kolkata", "Delhi"];

const defaultFacade = (orientation: Orientation): Facade => ({
  orientation,
  height: 0,
  width: 0,
  wwr: 0,
});

export default function BuildingForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState<BuildingInput>({
    name: "",
    city: "Bangalore",
    shgc: 0.5,
    cop: 4,
    facades: orientations.map(defaultFacade),
    skylight: { height: 0, width: 0 },
  });

  const handleChange = (key: keyof BuildingInput, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFacadeChange = (i: number, key: keyof Facade, value: number) => {
    const updated = [...form.facades];
    (updated[i] as any)[key] = value;
    setForm((prev) => ({ ...prev, facades: updated }));
  };

  const handleSubmit = () => {
    localStorage.setItem("buildingForm", JSON.stringify(form));
    navigate("/dashboard");
  };

  return (
    <Box mt={4}>
      <Typography variant="h4">Building Configuration</Typography>

      <TextField
        fullWidth
        label="Building Name"
        value={form.name}
        onChange={(e) => handleChange("name", e.target.value)}
        sx={{ mt: 2 }}
      />

      <TextField
        select
        fullWidth
        label="City"
        value={form.city}
        onChange={(e) => handleChange("city", e.target.value)}
        sx={{ mt: 2 }}
      >
        {cities.map((city) => (
          <MenuItem key={city} value={city}>
            {city}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        label="SHGC (0–1)"
        type="number"
        inputProps={{ min: 0, max: 1, step: 0.01 }}
        value={form.shgc}
        onChange={(e) => handleChange("shgc", parseFloat(e.target.value))}
        sx={{ mt: 2 }}
      />

      {form.facades.map((facade, i) => (
        <Box key={facade.orientation} mt={3}>
          <Typography variant="h6">
            {facade.orientation.toUpperCase()} Facade
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
            <TextField
              label="Height"
              type="number"
              value={facade.height}
              onChange={(e) =>
                handleFacadeChange(i, "height", +e.target.value)
              }
              fullWidth
            />
            <TextField
              label="Width"
              type="number"
              value={facade.width}
              onChange={(e) =>
                handleFacadeChange(i, "width", +e.target.value)
              }
              fullWidth
            />
            <TextField
              label="WWR (0–1)"
              type="number"
              value={facade.wwr}
              onChange={(e) => handleFacadeChange(i, "wwr", +e.target.value)}
              fullWidth
            />
          </Box>
        </Box>
      ))}

      <Box mt={3}>
        <Typography variant="h6">Skylight (optional)</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
          <TextField
            label="Height"
            type="number"
            value={form.skylight?.height}
            onChange={(e) =>
              handleChange("skylight", {
                ...form.skylight!,
                height: +e.target.value,
              })
            }
            fullWidth
          />
          <TextField
            label="Width"
            type="number"
            value={form.skylight?.width}
            onChange={(e) =>
              handleChange("skylight", {
                ...form.skylight!,
                width: +e.target.value,
              })
            }
            fullWidth
          />
        </Box>
      </Box>

      <Button
        variant="contained"
        sx={{ mt: 4 }}
        fullWidth
        onClick={handleSubmit}
      >
        Analyze Design
      </Button>
    </Box>
  );
}
