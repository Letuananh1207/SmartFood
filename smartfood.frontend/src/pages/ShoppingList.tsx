
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingCart, Plus, X, User, Clock, DollarSign } from "lucide-react";
import { useGroceryItems, GroceryItem } from "@/hooks/useGroceryItems";
import { useFamilyMembers } from "@/hooks/useFamilyMembers";
import { AddToFridgeDialog } from "@/components/AddToFridgeDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const ShoppingList = () => {
  const [newItem, setNewItem] = useState({
    item_name: "",
    item_type: "",
    amount: "",
    family_member_id: "",
    price: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [fridgeDialogOpen, setFridgeDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GroceryItem | null>(null);

  const { items, loading, addItem, toggleItem, completeItem, deleteItem } = useGroceryItems();
  const { members } = useFamilyMembers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.item_name || !newItem.item_type || !newItem.amount || !newItem.family_member_id) return;

    const itemData = {
      ...newItem,
      price: newItem.price ? parseFloat(newItem.price) : undefined,
    };
    delete (itemData as any).price; // Remove the string version
    if (newItem.price) {
      (itemData as any).price = parseFloat(newItem.price);
    }

    await addItem(itemData);
    setNewItem({
      item_name: "",
      item_type: "",
      amount: "",
      family_member_id: "",
      price: "",
    });
    setShowAddForm(false);
  };

  const handleItemClick = (item: GroceryItem) => {
    if (!item.completed) {
      setSelectedItem(item);
      setFridgeDialogOpen(true);
    }
  };

  const handleItemAddedToFridge = () => {
    if (selectedItem) {
      completeItem(selectedItem.id);
    }
    setFridgeDialogOpen(false);
    setSelectedItem(null);
  };

  const completedItems = items.filter(item => item.completed);
  const pendingItems = items.filter(item => !item.completed);

  const formatPrice = (price: number | null) => {
    if (!price) return null;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <ShoppingCart className="h-8 w-8 text-primary" />
          Danh sách mua sắm
        </h1>
        <p className="text-lg text-gray-600">
          Quản lý danh sách mua sắm cho gia đình
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cần mua</p>
                <p className="text-2xl font-bold text-gray-900">{pendingItems.length}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đã mua</p>
                <p className="text-2xl font-bold text-gray-900">{completedItems.length}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Item Form */}
      {showAddForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Thêm sản phẩm mới</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="item_name">Tên sản phẩm *</Label>
                  <Input
                    id="item_name"
                    value={newItem.item_name}
                    onChange={(e) => setNewItem(prev => ({ ...prev, item_name: e.target.value }))}
                    placeholder="VD: Cà chua, Thịt bò..."
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="item_type">Loại sản phẩm *</Label>
                  <Select
                    value={newItem.item_type}
                    onValueChange={(value) => setNewItem(prev => ({ ...prev, item_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại sản phẩm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Rau củ">Rau củ</SelectItem>
                      <SelectItem value="Thịt cá">Thịt cá</SelectItem>
                      <SelectItem value="Trái cây">Trái cây</SelectItem>
                      <SelectItem value="Đồ khô">Đồ khô</SelectItem>
                      <SelectItem value="Sữa & trứng">Sữa & trứng</SelectItem>
                      <SelectItem value="Gia vị">Gia vị</SelectItem>
                      <SelectItem value="Đồ uống">Đồ uống</SelectItem>
                      <SelectItem value="Khác">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Số lượng *</Label>
                  <Input
                    id="amount"
                    value={newItem.amount}
                    onChange={(e) => setNewItem(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="VD: 1kg, 2 hộp, 500g..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Giá dự kiến (VND) *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="1000"
                      value={newItem.price}
                      onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="VD: 25000, 50000..."
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="family_member">Người thêm *</Label>
                  <Select
                    value={newItem.family_member_id}
                    onValueChange={(value) => setNewItem(prev => ({ ...prev, family_member_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn thành viên" />
                    </SelectTrigger>
                    <SelectContent>
                      {members.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm sản phẩm
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Hủy
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="flex justify-center">
          <Button onClick={() => setShowAddForm(true)} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Thêm sản phẩm mới
          </Button>
        </div>
      )}

      {/* Shopping List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-orange-600">Cần mua ({pendingItems.length})</CardTitle>
            <CardDescription>Nhấn vào sản phẩm để thêm vào tủ lạnh</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-gray-600">Đang tải...</p>
              </div>
            ) : pendingItems.length > 0 ? (
              <div className="space-y-3">
                {pendingItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{item.item_name}</h3>
                        {item.price && (
                          <span className="text-sm font-semibold text-green-600">
                            {formatPrice(item.price)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {item.item_type}
                        </span>
                        <span>{item.amount}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Avatar className="h-4 w-4">
                          <AvatarFallback className="text-xs">{item.added_by?.[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-500">{item.added_by}</span>
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {format(new Date(item.created_at), "dd/MM", { locale: vi })}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteItem(item.id);
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Không có sản phẩm nào cần mua</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Completed Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Đã mua ({completedItems.length})</CardTitle>
            <CardDescription>Các sản phẩm đã hoàn thành</CardDescription>
          </CardHeader>
          <CardContent>
            {completedItems.length > 0 ? (
              <div className="space-y-3">
                {completedItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={(checked) => toggleItem(item.id, !!checked)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium line-through text-gray-600">{item.item_name}</h3>
                        {item.price && (
                          <span className="text-sm font-semibold text-green-600">
                            {formatPrice(item.price)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          {item.item_type}
                        </span>
                        <span>{item.amount}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteItem(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 text-xl">✓</span>
                </div>
                <p className="text-gray-600">Chưa có sản phẩm nào được mua</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AddToFridgeDialog
        open={fridgeDialogOpen}
        onOpenChange={setFridgeDialogOpen}
        groceryItem={selectedItem}
        onItemAdded={handleItemAddedToFridge}
      />
    </div>
  );
};

export default ShoppingList;
