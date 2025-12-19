import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import * as supabaseService from '../services/supabaseService';

interface NutritionEntry {
  id: string;
  date: string;
  mealType: string;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

const NutritionPage: React.FC = () => {
  const [entries, setEntries] = useState<NutritionEntry[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mealType, setMealType] = useState('breakfast');
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await supabaseService.getNutrition({ date });
        setEntries(data);
      } catch (error: any) {
        console.error('Error loading nutrition:', error);
      }
    };
    fetchEntries();
  }, [date]);

  const handleAdd = async () => {
    if (!foodName || !calories) {
      return;
    }

    try {
      await supabaseService.createNutritionEntry({
        date,
        mealType,
        foodName,
        calories: parseInt(calories),
        protein: protein ? parseFloat(protein) : 0,
        carbs: carbs ? parseFloat(carbs) : 0,
        fats: fats ? parseFloat(fats) : 0,
      });
      setFoodName('');
      setCalories('');
      setProtein('');
      setCarbs('');
      setFats('');
      // Reload entries
      const data = await supabaseService.getNutrition({ date });
      setEntries(data);
    } catch (error: any) {
      console.error('Error creating nutrition entry:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await supabaseService.deleteNutritionEntry(id);
      // Reload entries
      const data = await supabaseService.getNutrition({ date });
      setEntries(data);
    } catch (error: any) {
      console.error('Error deleting nutrition entry:', error);
    }
  };

  const totals = entries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fats: acc.fats + entry.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  return (
    <Box className="nutrition-page">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <RestaurantIcon sx={{ fontSize: 30, color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Nutrition Tracker
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', mt: 0.5 }}>
              Log your meals and track your daily nutrition
            </Typography>
          </Box>
        </Box>

        {/* Date Selector */}
        <Card sx={{ mb: 4, border: '1px solid #e0e0e0' }}>
          <CardContent sx={{ p: 3 }}>
            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{ maxWidth: 300 }}
            />
          </CardContent>
        </Card>

        {/* Add Entry Form */}
        <Card sx={{ mb: 4, border: '1px solid #e0e0e0' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Add Food Entry
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>Meal Type</InputLabel>
                  <Select value={mealType} onChange={(e) => setMealType(e.target.value)} label="Meal Type">
                    <MenuItem value="breakfast">Breakfast</MenuItem>
                    <MenuItem value="lunch">Lunch</MenuItem>
                    <MenuItem value="dinner">Dinner</MenuItem>
                    <MenuItem value="snack">Snack</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Food Name"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="e.g., Grilled Chicken Breast"
                />
              </Grid>
              <Grid item xs={12} sm={1.5}>
                <TextField
                  fullWidth
                  label="Calories"
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={1.5}>
                <TextField
                  fullWidth
                  label="Protein (g)"
                  type="number"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={1.5}>
                <TextField
                  fullWidth
                  label="Carbs (g)"
                  type="number"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={0.5}>
                <Button
                  variant="contained"
                  onClick={handleAdd}
                  startIcon={<AddIcon />}
                  fullWidth
                  sx={{
                    height: '56px',
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #3a9cee 0%, #00e2ee 100%)',
                    },
                  }}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Daily Totals */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={3}>
            <Card sx={{ border: '1px solid #e0e0e0', textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#ff6b6b' }}>
                  {totals.calories}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Calories
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ border: '1px solid #e0e0e0', textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#4ecdc4' }}>
                  {totals.protein.toFixed(1)}g
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Protein
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ border: '1px solid #e0e0e0', textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#ffe66d' }}>
                  {totals.carbs.toFixed(1)}g
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Carbs
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ border: '1px solid #e0e0e0', textAlign: 'center' }}>
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#95e1d3' }}>
                  {totals.fats.toFixed(1)}g
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Fats
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Entries Table */}
        <Card sx={{ border: '1px solid #e0e0e0' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Food Entries
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Meal</TableCell>
                    <TableCell>Food</TableCell>
                    <TableCell align="right">Calories</TableCell>
                    <TableCell align="right">Protein (g)</TableCell>
                    <TableCell align="right">Carbs (g)</TableCell>
                    <TableCell align="right">Fats (g)</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {entries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4, color: '#888' }}>
                        No entries for this date. Add your first meal above!
                      </TableCell>
                    </TableRow>
                  ) : (
                    entries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell sx={{ textTransform: 'capitalize' }}>{entry.mealType}</TableCell>
                        <TableCell>{entry.foodName}</TableCell>
                        <TableCell align="right">{entry.calories}</TableCell>
                        <TableCell align="right">{entry.protein.toFixed(1)}</TableCell>
                        <TableCell align="right">{entry.carbs.toFixed(1)}</TableCell>
                        <TableCell align="right">{entry.fats.toFixed(1)}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={() => handleDelete(entry.id)}
                            sx={{ color: '#ff6b6b' }}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default NutritionPage;

