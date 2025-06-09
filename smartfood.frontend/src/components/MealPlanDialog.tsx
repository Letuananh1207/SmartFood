
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit } from "lucide-react";
import { useDishes } from "@/hooks/useDishes";
import { useMealPlans, MealPlan } from "@/hooks/useMealPlans";
import { toast } from "@/hooks/use-toast";

interface MealPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
  selectedMealTime: string;
  editingMeal?: MealPlan | null;
  onMealAdded: () => void;
}

export const MealPlanDialog = ({ 
  open, 
  onOpenChange, 
  selectedDate, 
  selectedMealTime, 
  editingMeal, 
  onMealAdded 
}: MealPlanDialogProps) => {
  const [selectedDishId, setSelectedDishId] = useState(editingMeal?.dish_id || "");
  const [servings, setServings] = useState(editingMeal?.planned_servings?.toString() || "2");
  const [notes, setNotes] = useState(editingMeal?.notes || "");

  const { dishes } = useDishes();
  const { addMealPlan, updateMealPlan } = useMealPlans();

  const handleSubmit = async () => {
    if (!selectedDishId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn món ăn",
        variant: "destructive",
      });
      return;
    }

    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      
      if (editingMeal) {
        await updateMealPlan(editingMeal.id, {
          dish_id: selectedDishId,
          planned_servings: parseInt(servings),
          notes: notes.trim() || null,
        });
      } else {
        await addMealPlan({
          dish_id: selectedDishId,
          meal_date: dateStr,
          time_of_day: selectedMealTime, // This will be 'breakfast', 'lunch', or 'dinner'
          planned_servings: parseInt(servings),
          notes: notes.trim() || null,
          created_by: 'Tôi',
          family_member_id: null,
        });
      }
      
      onMealAdded();
      
      // Reset form if not editing
      if (!editingMeal) {
        setSelectedDishId("");
        setServings("2");
        setNotes("");
      }
    } catch (error) {
      console.error('Error saving meal plan:', error);
    }
  };

  const getMealTimeLabel = (mealTime: string) => {
    const mealTimeMap: { [key: string]: string } = {
      'breakfast': 'sáng',
      'lunch': 'trưa', 
      'dinner': 'tối'
    };
    return mealTimeMap[mealTime] || mealTime?.toLowerCase() || 'bữa ăn';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingMeal ? `Chỉnh sửa món ${getMealTimeLabel(selectedMealTime)}` : `Thêm món ${getMealTimeLabel(selectedMealTime)}`}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="dish">Món ăn</Label>
            <Select value={selectedDishId} onValueChange={setSelectedDishId}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn món ăn..." />
              </SelectTrigger>
              <SelectContent>
                {dishes.map((dish) => (
                  <SelectItem key={dish.id} value={dish.id}>
                    <div className="flex items-center gap-2">
                      <span>{dish.image_emoji}</span>
                      <span>{dish.name}</span>
                      <span className="text-xs text-gray-500">({dish.cook_time}m)</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="servings">Số người ăn</Label>
            <Input
              id="servings"
              type="number"
              min="1"
              max="20"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
            <Textarea
              id="notes"
              placeholder="Thêm ghi chú về món ăn..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSubmit} className="flex-1">
              {editingMeal ? "Cập nhật" : "Thêm vào kế hoạch"}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
