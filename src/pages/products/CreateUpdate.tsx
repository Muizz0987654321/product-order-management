import { useEffect, useMemo, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  TextField,
  Box,
  Container,
  Button,
  Stack,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import { useNavigate, useParams } from "react-router-dom";
import { productsApi } from "@services/productService";

/**
 * We keep inputs as strings (TextField value is string)
 * and convert to numbers only when building the API payload.
 */
type FormState = {
  sku: string;
  title: string;
  price: string;
  rating: number;
  brand: string;
  stock: number;
  description: string;
  active: boolean;
  category: string;
};

/** Only locally saved products are persisted in localStorage */
type LocalProduct = FormState & { id: string };

const STORAGE_KEY = "localProducts_v1";

const EMPTY_FORM: FormState = {
  sku: "",
  title: "",
  price: "",
  rating: 0,
  brand: "",
  stock: 0,
  description: "",
  active: true,
  category: "",
};

const readLocalProducts = (): LocalProduct[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveLocalProducts = (items: LocalProduct[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const mapApiToForm = (data: any): FormState => ({
  sku: data?.sku ?? "",
  title: data?.title ?? "",
  price: data?.price != null ? String(data.price) : "",
  rating: data?.rating != null ? Number(data.rating) : 0,
  brand: data?.brand ?? "",
  stock: data?.stock != null ? Number(data.stock) : 0,
  description: data?.description ?? "",
  active: data?.active != null ? Boolean(data.active) : true,
  category: data?.category ?? "",
});

const buildPayload = (form: FormState) => ({
  sku: form.sku.trim(),
  title: form.title.trim(),
  price: form.price ? Number(form.price) : 0,
  rating:
    typeof form.rating === "number" ? form.rating : Number(form.rating) || 0,
  brand: form.brand.trim(),
  stock: typeof form.stock === "number" ? form.stock : Number(form.stock) || 0,
  description: form.description,
  active: Boolean(form.active),
  category: String(form.category || ""),
});

const CreateUpdate: React.FC = () => {
  const { id } = useParams(); // "new", "local-123...", or "12" (server)
  const navigate = useNavigate();

  const isNew = !id || id === "new";
  const isLocal = !!id && id.startsWith("local-");
  const serverId = useMemo(() => Number(id), [id]); // only valid when editing server product

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // simple, readable field updater (accepts string | number | boolean)
  const setField = (key: keyof FormState, value: string | number | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const setActive = (value: boolean) =>
    setForm((prev) => ({ ...prev, active: value }));

  /**
   * LOAD DATA (edit mode)
   * - Read local product when editing a local item
   * - Else read from DummyJSON API for server items
   */
  useEffect(() => {
    const load = async () => {
      if (isNew) {
        setForm(EMPTY_FORM);
        return;
      }

      setLoading(true);
      try {
        if (isLocal && id) {
          const local = readLocalProducts();
          const found = local.find((p) => p.id === id);
          setForm(found ? found : EMPTY_FORM);
          return;
        }

        // server edit
        if (Number.isNaN(serverId)) {
          setForm(EMPTY_FORM);
          return;
        }

        const data = await productsApi.getProductById(serverId);
        setForm(mapApiToForm(data));
      } catch (err) {
        console.error("Failed to load product", err);
        setForm(EMPTY_FORM);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, isNew, isLocal, serverId]);

  /**
   * SAVE
   * - New product => create LOCAL product and persist in localStorage
   * - Edit local product => update localStorage
   * - Edit server product => DummyJSON update is simulated, so we save a local copy
   */
  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = buildPayload(form);

      // 1) Create new (local)
      if (isNew) {
        const local = readLocalProducts();
        const created: LocalProduct = { id: `local-${Date.now()}`, ...form };
        saveLocalProducts([created, ...local]);
        navigate("/products", {
          state: {
            created,
            toast: { message: "Product created", severity: "success" },
          },
        });
        return;
      }

      // 2) Update local
      if (isLocal && id) {
        const local = readLocalProducts();
        const updated = local.map((p) => (p.id === id ? { ...p, ...form } : p));
        saveLocalProducts(updated);
        navigate("/products", {
          state: { toast: { message: "Product updated", severity: "success" } },
        });
        return;
      }

      // 3) Update server product (save as local copy so it persists)
      if (Number.isNaN(serverId)) return;
      const updatedServer = await productsApi.updateProduct(serverId, payload);

      const local = readLocalProducts();
      const localCopyId = `local-${serverId}`; // stable id for edited server copy
      const localCopy: LocalProduct = {
        id: localCopyId,
        ...mapApiToForm(updatedServer),
      };

      const exists = local.some((p) => p.id === localCopyId);
      saveLocalProducts(
        exists
          ? local.map((p) => (p.id === localCopyId ? localCopy : p))
          : [localCopy, ...local]
      );

      navigate("/products", {
        state: { toast: { message: "Product updated", severity: "success" } },
      });
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => navigate("/products");

  return (
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <div>
          <Typography variant="h5">
            {isNew ? "Create Product" : "Update Product"}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {isNew ? "Add a new product" : "Edit product details"}
          </Typography>
        </div>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            color="success"
            onClick={handleSave}
            disabled={saving || loading}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
          <Button variant="outlined" onClick={handleCancel} disabled={saving}>
            Cancel
          </Button>
        </Stack>
      </Stack>

      <Card>
        <CardContent>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="SKU"
                  fullWidth
                  value={form.sku}
                  disabled={loading}
                  onChange={(e) => setField("sku", e.target.value)}
                />
              </Grid>

              {/* Force Title to start on a new line (but keep sm=4 width) */}
              <Grid item xs={12} />

              <Grid item xs={12} sm={4}>
                <TextField
                  label="Title"
                  fullWidth
                  value={form.title}
                  disabled={loading}
                  onChange={(e) => setField("title", e.target.value)}
                />
              </Grid>

              {/* Next row */}
              <Grid item xs={12} />

              <Grid item xs={12} sm={4}>
                <TextField
                  label="Price $"
                  fullWidth
                  value={form.price}
                  disabled={loading}
                  onChange={(e) => setField("price", e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label="Rating"
                  type="number"
                  fullWidth
                  value={form.rating}
                  disabled={loading}
                  onChange={(e) => setField("rating", Number(e.target.value))}
                />
              </Grid>

              <Grid item xs={12} />

              <Grid item xs={12} sm={4}>
                <TextField
                  label="Brand"
                  fullWidth
                  value={form.brand}
                  disabled={loading}
                  onChange={(e) => setField("brand", e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label="Category"
                  fullWidth
                  value={form.category}
                  disabled={loading}
                  onChange={(e) => setField("category", e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label="Stock"
                  type="number"
                  fullWidth
                  value={form.stock}
                  disabled={loading}
                  onChange={(e) => setField("stock", Number(e.target.value))}
                />
              </Grid>

              <Grid item xs={12} sm={12}>
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  minRows={3}
                  value={form.description}
                  disabled={loading}
                  onChange={(e) => setField("description", e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Box
                  sx={{ display: "flex", alignItems: "center", height: "100%" }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={Boolean(form.active)}
                        onChange={(e) => setActive(e.target.checked)}
                        disabled={loading}
                      />
                    }
                    label={form.active ? "Active" : "Inactive"}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
      <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
        <Button
          variant="outlined"
          color="success"
          onClick={handleSave}
          disabled={saving || loading}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
        <Button variant="outlined" onClick={handleCancel} disabled={saving}>
          Cancel
        </Button>
      </Stack>
    </Container>
  );
};

export default CreateUpdate;
