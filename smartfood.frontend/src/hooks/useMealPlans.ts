
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface MealPlan {
  id: string;
  dish_id: string;
  meal_date: string;
  time_of_day: string;
  planned_servings: number;
  notes: string | null;
  created_by: string | null;
  family_member_id: string | null;
  created_at: string;
  updated_at: string;
  dishes?: {
    id: string;
    name: string;
    cook_time: number;
    servings: number;
    ingredients: any[];
    image_emoji: string | null;
  };
}

export const useMealPlans = () => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMealPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .select(`
          *,
          dishes (
            id,
            name,
            cook_time,
            servings,
            ingredients,
            image_emoji
          )
        `)
        .order('meal_date', { ascending: true });

      if (error) throw error;
      
      // Transform the data to ensure ingredients is always an array
      const transformedData = (data || []).map(plan => ({
        ...plan,
        dishes: plan.dishes ? {
          ...plan.dishes,
          ingredients: Array.isArray(plan.dishes.ingredients) ? plan.dishes.ingredients : []
        } : undefined
      }));
      
      setMealPlans(transformedData);
    } catch (error) {
      console.error('Error fetching meal plans:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải kế hoạch bữa ăn",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addMealPlan = async (mealPlan: Omit<MealPlan, 'id' | 'created_at' | 'updated_at' | 'dishes'>) => {
    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .insert([mealPlan])
        .select(`
          *,
          dishes (
            id,
            name,
            cook_time,
            servings,
            ingredients,
            image_emoji
          )
        `)
        .single();

      if (error) throw error;
      
      const transformedData = {
        ...data,
        dishes: data.dishes ? {
          ...data.dishes,
          ingredients: Array.isArray(data.dishes.ingredients) ? data.dishes.ingredients : []
        } : undefined
      };
      
      setMealPlans(prev => [...prev, transformedData]);
      toast({
        title: "Đã thêm kế hoạch bữa ăn",
        description: "Kế hoạch bữa ăn đã được thêm vào lịch",
      });
      return transformedData;
    } catch (error) {
      console.error('Error adding meal plan:', error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm kế hoạch bữa ăn",
        variant: "destructive",
      });
    }
  };

  const updateMealPlan = async (id: string, updates: Partial<MealPlan>) => {
    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          dishes (
            id,
            name,
            cook_time,
            servings,
            ingredients,
            image_emoji
          )
        `)
        .single();

      if (error) throw error;
      
      const transformedData = {
        ...data,
        dishes: data.dishes ? {
          ...data.dishes,
          ingredients: Array.isArray(data.dishes.ingredients) ? data.dishes.ingredients : []
        } : undefined
      };
      
      setMealPlans(prev => prev.map(plan => 
        plan.id === id ? transformedData : plan
      ));
      toast({
        title: "Đã cập nhật kế hoạch",
        description: "Kế hoạch bữa ăn đã được cập nhật",
      });
    } catch (error) {
      console.error('Error updating meal plan:', error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật kế hoạch bữa ăn",
        variant: "destructive",
      });
    }
  };

  const deleteMealPlan = async (id: string) => {
    try {
      const { error } = await supabase
        .from('meal_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setMealPlans(prev => prev.filter(plan => plan.id !== id));
      toast({
        title: "Đã xóa kế hoạch",
        description: "Kế hoạch bữa ăn đã được xóa",
      });
    } catch (error) {
      console.error('Error deleting meal plan:', error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa kế hoạch bữa ăn",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchMealPlans();
  }, []);

  return {
    mealPlans,
    loading,
    addMealPlan,
    updateMealPlan,
    deleteMealPlan,
    refetch: fetchMealPlans,
  };
};
