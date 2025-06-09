
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface GroceryItem {
  id: number;
  item_name: string;
  item_type: string;
  amount: string;
  completed: boolean;
  added_by: string;
  family_member_id: string | null;
  price: number | null;
  created_at: string;
  updated_at: string;
}

export const useGroceryItems = () => {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('grocery_items')
        .select(`
          id, 
          item_name, 
          item_type, 
          amount, 
          completed, 
          added_by, 
          family_member_id,
          price,
          created_at, 
          updated_at
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách mua sắm",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item: { item_name: string; item_type: string; amount: string; family_member_id: string; price?: number }) => {
    try {
      // Get the family member name for added_by field
      const { data: memberData, error: memberError } = await supabase
        .from('family_members')
        .select('name')
        .eq('id', item.family_member_id)
        .single();

      if (memberError) throw memberError;

      const { data, error } = await supabase
        .from('grocery_items')
        .insert([{
          ...item,
          added_by: memberData.name
        }])
        .select(`
          id, 
          item_name, 
          item_type, 
          amount, 
          completed, 
          added_by, 
          family_member_id,
          price,
          created_at, 
          updated_at
        `)
        .single();

      if (error) throw error;
      
      setItems(prev => [data, ...prev]);
      toast({
        title: "Đã thêm sản phẩm",
        description: `${item.item_name} đã được thêm vào danh sách mua sắm`,
      });
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm sản phẩm",
        variant: "destructive",
      });
    }
  };

  const completeItem = async (id: number) => {
    try {
      const item = items.find(i => i.id === id);
      if (!item) return;

      // Add to purchase history
      await supabase
        .from('purchase_history')
        .insert([{
          item_name: item.item_name,
          item_type: item.item_type,
          amount: item.amount,
          price: item.price,
          purchased_by: item.added_by,
          family_member_id: item.family_member_id,
        }]);

      const { error } = await supabase
        .from('grocery_items')
        .update({ completed: true, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, completed: true } : item
      ));

      toast({
        title: "Đã mua sản phẩm",
        description: "Sản phẩm đã được thêm vào lịch sử mua hàng",
      });
    } catch (error) {
      console.error('Error completing item:', error);
      toast({
        title: "Lỗi",
        description: "Không thể hoàn thành sản phẩm",
        variant: "destructive",
      });
    }
  };

  const toggleItem = async (id: number, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('grocery_items')
        .update({ completed, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, completed } : item
      ));
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật sản phẩm",
        variant: "destructive",
      });
    }
  };

  const deleteItem = async (id: number) => {
    try {
      const { error } = await supabase
        .from('grocery_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setItems(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Đã xóa sản phẩm",
        description: "Sản phẩm đã được xóa khỏi danh sách mua sắm",
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa sản phẩm",
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
    toggleItem,
    completeItem,
    deleteItem,
    refetch: fetchItems,
  };
};
