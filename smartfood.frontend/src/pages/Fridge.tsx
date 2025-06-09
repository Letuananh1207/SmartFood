import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Refrigerator, AlertTriangle, Calendar as CalendarIcon, Search, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useFridgeItems } from "@/hooks/useFridgeItems";

const Fridge = () => {
  const { items, loading, addItem, deleteItem } = useFridgeItems();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    quantity: "",
    location: "",
    expiry: undefined as Date | undefined,
  });

  const categories = ["Rau củ", "Thịt cá", "Sữa & trứng", "Đồ khô", "Gia vị", "Đồ uống", "Đồ đông lạnh", "Khác"];
  const locations = ["Ngăn rau củ", "Ngăn đông", "Ngăn mát", "Cửa tủ lạnh", "Ngăn khô"];

  const handleAddItem = async () => {
    if (newItem.name && newItem.category && newItem.quantity && newItem.location && newItem.expiry) {
      await addItem({
        name: newItem.name,
        category: newItem.category,
        quantity: newItem.quantity,
        location: newItem.location,
        expiry_date: newItem.expiry.toISOString().split('T')[0],
      });
      setNewItem({ name: "", category: "", quantity: "", location: "", expiry: undefined });
    }
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryStatus = (expiryDate: string) => {
    const days = getDaysUntilExpiry(expiryDate);
    if (days < 0) return { status: "expired", label: "Đã hết hạn", color: "destructive" };
    if (days <= 3) return { status: "warning", label: `${days} ngày`, color: "destructive" };
    if (days <= 7) return { status: "soon", label: `${days} ngày`, color: "default" };
    return { status: "good", label: `${days} ngày`, color: "secondary" };
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const expiringItems = items.filter(item => getDaysUntilExpiry(item.expiry_date) <= 3);
  const totalItems = items.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Refrigerator className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-gray-500">Đang tải dữ liệu tủ lạnh...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Refrigerator className="h-8 w-8 text-primary" />
          Quản lý tủ lạnh
        </h1>
        <p className="text-lg text-gray-600">
          Theo dõi thực phẩm trong tủ lạnh và hạn sử dụng
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng thực phẩm</p>
                <p className="text-3xl font-bold text-gray-900">{totalItems}</p>
              </div>
              <Refrigerator className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sắp hết hạn</p>
                <p className="text-3xl font-bold text-orange-600">{expiringItems.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Danh mục</p>
                <p className="text-3xl font-bold text-green-600">{new Set(items.map(item => item.category)).size}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">🥬</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Item */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Thêm thực phẩm mới
          </CardTitle>
          <CardDescription>
            Thêm thực phẩm mới vào tủ lạnh của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên thực phẩm</Label>
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
                placeholder="Ví dụ: 500g"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Vị trí lưu trữ</Label>
              <Select value={newItem.location} onValueChange={(value) => setNewItem({ ...newItem, location: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vị trí" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ngày hết hạn</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newItem.expiry ? format(newItem.expiry, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newItem.expiry}
                    onSelect={(date) => setNewItem({ ...newItem, expiry: date })}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <Button onClick={handleAddItem} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Thêm vào tủ lạnh
          </Button>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm thực phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Lọc theo danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Fridge Items */}
      <Card>
        <CardHeader>
          <CardTitle>Thực phẩm trong tủ lạnh</CardTitle>
          <CardDescription>
            {filteredItems.length} thực phẩm được tìm thấy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Refrigerator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Không tìm thấy thực phẩm nào</p>
                <p className="text-sm">Thử thay đổi bộ lọc hoặc thêm thực phẩm mới</p>
              </div>
            ) : (
              filteredItems.map((item) => {
                const expiryStatus = getExpiryStatus(item.expiry_date);
                return (
                  <div
                    key={item.id}
                    className="p-4 border rounded-lg bg-white hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-lg">{item.name}</h4>
                          <Badge variant={expiryStatus.color as any}>
                            {expiryStatus.status === "expired" ? "Hết hạn" : `Còn ${expiryStatus.label}`}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Danh mục:</span> {item.category}
                          </div>
                          <div>
                            <span className="font-medium">Số lượng:</span> {item.quantity}
                          </div>
                          <div>
                            <span className="font-medium">Vị trí:</span> {item.location}
                          </div>
                          <div>
                            <span className="font-medium">Hết hạn:</span> {format(new Date(item.expiry_date), "dd/MM/yyyy", { locale: vi })}
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
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Fridge;
