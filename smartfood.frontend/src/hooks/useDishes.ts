
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Dish {
  id: string;
  name: string;
  description: string | null;
  cook_time: number;
  servings: number;
  difficulty: string;
  category: string;
  ingredients: any[];
  instructions: string | null;
  image_emoji: string | null;
  rating: number | null;
  created_at: string;
  updated_at: string;
}

export const useDishes = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDishes = async () => {
    try {
      const { data, error } = await supabase
        .from('dishes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to ensure ingredients is always an array
      const transformedData = (data || []).map(dish => ({
        ...dish,
        ingredients: Array.isArray(dish.ingredients) ? dish.ingredients : []
      }));
      
      setDishes(transformedData);
    } catch (error) {
      console.error('Error fetching dishes:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách món ăn",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addDish = async (dish: Omit<Dish, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('dishes')
        .insert([dish])
        .select()
        .single();

      if (error) throw error;
      
      const transformedData = {
        ...data,
        ingredients: Array.isArray(data.ingredients) ? data.ingredients : []
      };
      
      setDishes(prev => [transformedData, ...prev]);
      toast({
        title: "Đã thêm món ăn",
        description: `${dish.name} đã được thêm vào danh sách`,
      });
      return transformedData;
    } catch (error) {
      console.error('Error adding dish:', error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm món ăn",
        variant: "destructive",
      });
    }
  };

  const updateDish = async (id: string, updates: Partial<Dish>) => {
    try {
      const { data, error } = await supabase
        .from('dishes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      const transformedData = {
        ...data,
        ingredients: Array.isArray(data.ingredients) ? data.ingredients : []
      };
      
      setDishes(prev => prev.map(dish => 
        dish.id === id ? transformedData : dish
      ));
      toast({
        title: "Đã cập nhật món ăn",
        description: "Thông tin món ăn đã được cập nhật",
      });
    } catch (error) {
      console.error('Error updating dish:', error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật món ăn",
        variant: "destructive",
      });
    }
  };

  const deleteDish = async (id: string) => {
    try {
      const { error } = await supabase
        .from('dishes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setDishes(prev => prev.filter(dish => dish.id !== id));
      toast({
        title: "Đã xóa món ăn",
        description: "Món ăn đã được xóa khỏi danh sách",
      });
    } catch (error) {
      console.error('Error deleting dish:', error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa món ăn",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  return {
    dishes,
    loading,
    addDish,
    updateDish,
    deleteDish,
    refetch: fetchDishes,
  };
};
