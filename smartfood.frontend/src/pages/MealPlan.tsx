import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Clock, Users, MoreVertical, Edit, Trash2 } from "lucide-react";
import { MealPlanDialog } from "@/components/MealPlanDialog";
import { useMealPlans } from "@/hooks/useMealPlans";
import { useDishes } from "@/hooks/useDishes";
import { format, addDays, subDays } from "date-fns";
import { vi } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";

const MealPlan = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<any>(null);
  const [selectedMealTime, setSelectedMealTime] = useState<string>("");
  
  const { mealPlans, loading, addMealPlan, updateMealPlan, deleteMealPlan, refetch } = useMealPlans();
  const { dishes } = useDishes();

  // Set up real-time subscription for meal plans
  useEffect(() => {
    const channel = supabase
      .channel('meal-plans-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'meal_plans'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  // Helper functions and meal time definitions - using English values that match DB constraint
  const mealTimes = [
    { key: "breakfast", label: "Sáng", icon: "🌅" },
    { key: "lunch", label: "Trưa", icon: "☀️" },
    { key: "dinner", label: "Tối", icon: "🌙" },
  ];

  const formatDate = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  };

  const getMealsForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return mealPlans.filter(plan => plan.meal_date === dateStr);
  };

  const getMealForTimeSlot = (date: Date, timeSlot: string) => {
    const meals = getMealsForDate(date);
    return meals.find(meal => meal.time_of_day === timeSlot);
  };

  const getDishById = (dishId: string) => {
    return dishes.find(dish => dish.id === dishId);
  };

  const handleAddMeal = (timeSlot: string) => {
    setSelectedMealTime(timeSlot);
    setEditingMeal(null);
    setDialogOpen(true);
  };

  const handleEditMeal = (meal: any) => {
    setEditingMeal(meal);
    setSelectedMealTime(meal.time_of_day);
    setDialogOpen(true);
  };

  const handleDeleteMeal = async (mealId: string) => {
    await deleteMealPlan(mealId);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setSelectedDate(subDays(selectedDate, 1));
    } else {
      setSelectedDate(addDays(selectedDate, 1));
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Calendar className="h-8 w-8 text-primary" />
          Kế hoạch bữa ăn
        </h1>
        <p className="text-lg text-gray-600">
          Lên kế hoạch và quản lý thực đơn hàng ngày cho gia đình
        </p>
      </div>

      {/* Date Navigation */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={() => navigateDate('prev')}
              className="flex items-center gap-2"
            >
              ← Hôm qua
            </Button>
            
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {format(selectedDate, "EEEE, dd MMMM yyyy", { locale: vi })}
              </h2>
              <p className="text-sm text-gray-600">
                {selectedDate.toDateString() === new Date().toDateString() 
                  ? "Hôm nay" 
                  : format(selectedDate, "dd/MM/yyyy")}
              </p>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => navigateDate('next')}
              className="flex items-center gap-2"
            >
              Ngày mai →
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Meal Planning Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {mealTimes.map((mealTime) => {
          const meal = getMealForTimeSlot(selectedDate, mealTime.key);
          const dish = meal ? getDishById(meal.dish_id) : null;

          return (
            <Card key={mealTime.key} className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{mealTime.icon}</span>
                    <span>{mealTime.label}</span>
                  </div>
                  {meal && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleEditMeal(meal)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteMeal(meal.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                {meal && dish ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{dish.image_emoji}</span>
                      <div>
                        <h3 className="font-semibold text-lg">{dish.name}</h3>
                        <p className="text-sm text-gray-600">{dish.category}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{dish.cook_time} phút</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{meal.planned_servings} phần</span>
                      </div>
                    </div>
                    
                    {meal.notes && (
                      <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {meal.notes}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">
                      <Calendar className="h-12 w-12 mx-auto" />
                    </div>
                    <p className="text-gray-600 mb-4">Chưa có món ăn nào được lên kế hoạch</p>
                    <Button 
                      onClick={() => handleAddMeal(mealTime.key)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Thêm món ăn
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <MealPlanDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedDate={selectedDate}
        selectedMealTime={selectedMealTime}
        editingMeal={editingMeal}
        onMealAdded={() => {
          setDialogOpen(false);
          refetch();
        }}
      />
    </div>
  );
};

export default MealPlan;
