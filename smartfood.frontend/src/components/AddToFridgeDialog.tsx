
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFridgeItems } from "@/hooks/useFridgeItems";
import { GroceryItem } from "@/hooks/useGroceryItems";

interface AddToFridgeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groceryItem: GroceryItem | null;
  onItemAdded: () => void;
}

export const AddToFridgeDialog = ({ open, onOpenChange, groceryItem, onItemAdded }: AddToFridgeDialogProps) => {
  const [location, setLocation] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { addItem } = useFridgeItems();

  // Don't render if groceryItem is null
  if (!groceryItem) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !expiryDate || !groceryItem) return;

    setLoading(true);
    try {
      await addItem({
        name: groceryItem.item_name,
        category: groceryItem.item_type,
        quantity: groceryItem.amount,
        location,
        expiry_date: expiryDate,
      });
      onItemAdded();
      onOpenChange(false);
      setLocation("");
      setExpiryDate("");
    } catch (error) {
      console.error('Error adding item to fridge:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm vào tủ lạnh</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Tên sản phẩm</Label>
            <Input value={groceryItem.item_name} disabled />
          </div>
          
          <div className="space-y-2">
            <Label>Số lượng</Label>
            <Input value={groceryItem.amount} disabled />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Vị trí lưu trữ *</Label>
            <Select value={location} onValueChange={setLocation} required>
              <SelectTrigger>
                <SelectValue placeholder="Chọn vị trí lưu trữ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ngăn rau củ">Ngăn rau củ</SelectItem>
                <SelectItem value="Ngăn đông">Ngăn đông</SelectItem>
                <SelectItem value="Ngăn mát">Ngăn mát</SelectItem>
                <SelectItem value="Cửa tủ lạnh">Cửa tủ lạnh</SelectItem>
                <SelectItem value="Ngăn khô">Ngăn khô</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="expiry-date">Ngày hết hạn *</Label>
            <Input
              id="expiry-date"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={loading || !location || !expiryDate}
              className="flex-1"
            >
              {loading ? "Đang thêm..." : "Thêm vào tủ lạnh"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
