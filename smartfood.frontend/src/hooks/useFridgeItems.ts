
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface FridgeItem {
  id: string;
  name: string;
  category: string;
  quantity: string;
  location: string;
  expiry_date: string;
  added_date: string;
  created_at: string;
  updated_at: string;
}

export const useFridgeItems = () => {
  const [items, setItems] = useState<FridgeItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('fridge_items')
        .select('id, name, category, quantity, location, expiry_date, added_date, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching fridge items:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách thực phẩm trong tủ lạnh",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item: { name: string; category: string; quantity: string; location: string; expiry_date: string }) => {
    try {
      const { data, error } = await supabase
        .from('fridge_items')
        .insert([item])
        .select('id, name, category, quantity, location, expiry_date, added_date, created_at, updated_at')
        .single();

      if (error) throw error;
      
      setItems(prev => [data, ...prev]);
      toast({
        title: "Đã thêm thực phẩm",
        description: `${item.name} đã được thêm vào tủ lạnh`,
      });
    } catch (error) {
      console.error('Error adding fridge item:', error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm thực phẩm",
        variant: "destructive",
      });
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('fridge_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setItems(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Đã xóa thực phẩm",
        description: "Thực phẩm đã được xóa khỏi tủ lạnh",
      });
    } catch (error) {
      console.error('Error deleting fridge item:', error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa thực phẩm",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    loading,
    addItem,
    deleteItem,
    refetch: fetchItems,
  };
};
