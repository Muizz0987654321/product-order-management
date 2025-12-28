import React from "react";
import {
  Box,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Button,
} from "@mui/material";

export type FilterPanelProps = {
  search?: string;
  onSearch?: (v: string) => void;
  category?: string;
  categories?: string[];
  onCategory?: (c: string) => void;
  priceRange?: [number, number];
  min?: number;
  max?: number;
  onPriceRange?: (r: [number, number]) => void;
  onReset?: () => void;
};

const FilterPanel: React.FC<FilterPanelProps> = ({
  search,
  onSearch,
  category,
  categories = [],
  onCategory,
  priceRange,
  min = 0,
  max = 0,
  onPriceRange,
  onReset,
}) => {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <TextField
        size="small"
        placeholder="Search"
        value={search}
        onChange={(e) => onSearch?.(e.target.value)}
        sx={{ width: 300 }}
      />

      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="filter-category-label">Category</InputLabel>
        <Select
          labelId="filter-category-label"
          value={category ?? "all"}
          label="Category"
          onChange={(e) => onCategory?.(String(e.target.value))}
        >
          <MenuItem value="all">All Categories</MenuItem>
          {categories.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ width: 260 }}>
        <Slider
          value={priceRange ?? [min, max]}
          onChange={(_, v) => onPriceRange?.(v as [number, number])}
          min={min}
          max={max}
          valueLabelDisplay="auto"
        />
      </Box>

      <Button variant="outlined" onClick={onReset}>
        Reset
      </Button>
    </Stack>
  );
};

export default FilterPanel;
