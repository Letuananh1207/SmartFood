
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface PurchaseHistoryItem {
  id: number;
  item_name: string;
  item_type: string;
  amount: string;
  price: number | null;
  purchased_by: string | null;
  family_member_id: string | null;
  purchased_at: string;
  created_at: string;
}

export const usePurchaseHistory = () => {
  const [items, setItems] = useState<PurchaseHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('purchase_history')
        .select('*')
        .order('purchased_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching purchase history:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải lịch sử mua hàng",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    loading,
    refetch: fetchItems,
  };
};
