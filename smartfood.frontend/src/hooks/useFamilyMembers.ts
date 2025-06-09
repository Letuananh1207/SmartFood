
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface FamilyMember {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  avatar_initials: string | null;
  join_date: string;
  contributions: number;
  last_active: string;
  created_at: string;
  updated_at: string;
}

export const useFamilyMembers = () => {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching family members:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách thành viên gia đình",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (member: { name: string; email: string; phone?: string; role?: string }) => {
    try {
      const { data, error } = await supabase
        .from('family_members')
        .insert([{
          ...member,
          role: member.role || 'member',
          avatar_initials: member.name.split(' ').map(n => n[0]).join('').toUpperCase()
        }])
        .select()
        .single();

      if (error) throw error;
      
      setMembers(prev => [data, ...prev]);
      toast({
        title: "Đã thêm thành viên",
        description: `${member.name} đã được thêm vào gia đình`,
      });
    } catch (error) {
      console.error('Error adding family member:', error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm thành viên",
        variant: "destructive",
      });
    }
  };

  const removeMember = async (id: string) => {
    try {
      const { error } = await supabase
        .from('family_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setMembers(prev => prev.filter(member => member.id !== id));
      toast({
        title: "Đã xóa thành viên",
        description: "Thành viên đã được xóa khỏi nhóm gia đình",
      });
    } catch (error) {
      console.error('Error removing family member:', error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa thành viên",
        variant: "destructive",
      });
    }
  };

  const updateMember = async (id: string, updates: Partial<FamilyMember>) => {
    try {
      const { data, error } = await supabase
        .from('family_members')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setMembers(prev => prev.map(member => 
        member.id === id ? data : member
      ));
      toast({
        title: "Đã cập nhật thành viên",
        description: "Thông tin thành viên đã được cập nhật",
      });
    } catch (error) {
      console.error('Error updating family member:', error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật thành viên",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return {
    members,
    loading,
    addMember,
    removeMember,
    updateMember,
    refetch: fetchMembers,
  };
};
