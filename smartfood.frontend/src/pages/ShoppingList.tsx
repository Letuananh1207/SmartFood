
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Users, Calendar, ShoppingCart } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ShoppingList = () => {
  const [items, setItems] = useState([
    { id: 1, name: "Cà chua", category: "Rau củ", quantity: "1 kg", completed: false, addedBy: "Mẹ" },
    { id: 2, name: "Thịt bò", category: "Thịt cá", quantity: "500g", completed: false, addedBy: "Ba" },
    { id: 3, name: "Gạo tẻ", category: "Đồ khô", quantity: "5 kg", completed: true, addedBy: "Mẹ" },
    { id: 4, name: "Sữa tươi", category: "Sữa & trứng", quantity: "1 lít", completed: false, addedBy: "Con" },
  ]);

  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    quantity: "",
  });

  const categories = ["Rau củ", "Thịt cá", "Đồ khô", "Sữa & trứng", "Gia vị", "Đồ uống", "Khác"];

  const addItem = () => {
    if (newItem.name && newItem.category && newItem.quantity) {
      const item = {
        id: Date.now(),
        ...newItem,
        completed: false,
        addedBy: "Tôi",
      };
      setItems([...items, item]);
      setNewItem({ name: "", category: "", quantity: "" });
      toast({
        title: "Đã thêm sản phẩm",
        description: `${newItem.name} đã được thêm vào danh sách mua sắm`,
      });
    }
  };

  const toggleItem = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
    toast({
      title: "Đã xóa sản phẩm",
      description: "Sản phẩm đã được xóa khỏi danh sách mua sắm",
    });
  };

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <ShoppingCart className="h-8 w-8 text-primary" />
          Danh sách mua sắm
        </h1>
        <p className="text-lg text-gray-600">
          Quản lý danh sách mua sắm của gia đình bạn
        </p>
      </div>

      {/* Progress Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Tiến độ mua sắm</h3>
              <p className="text-sm text-gray-600">
                {completedCount} / {totalCount} sản phẩm đã hoàn thành
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">
                {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-500">Hoàn thành</div>
            </div>
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Item */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Thêm sản phẩm mới
          </CardTitle>
          <CardDescription>
            Thêm sản phẩm mới vào danh sách mua sắm của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên sản phẩm</Label>
              <Input
                id="name"
                placeholder="Ví dụ: Cà chua"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Danh mục</Label>
              <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Số lượng</Label>
              <Input
                id="quantity"
                placeholder="Ví dụ: 1 kg"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={addItem} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Thêm vào danh sách
          </Button>
        </CardContent>
      </Card>

      {/* Shopping List Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Danh sách hiện tại
            </span>
            <Badge variant="outline">{totalCount} sản phẩm</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Chưa có sản phẩm nào trong danh sách</p>
                <p className="text-sm">Hãy thêm sản phẩm đầu tiên của bạn!</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 border rounded-lg transition-all duration-200 ${
                    item.completed 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white border-gray-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={() => toggleItem(item.id)}
                      />
                      <div className={item.completed ? 'opacity-60' : ''}>
                        <h4 className={`font-medium ${item.completed ? 'line-through' : ''}`}>
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {item.category}
                          </Badge>
                          <span className="text-sm text-gray-600">{item.quantity}</span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {item.addedBy}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShoppingList;
