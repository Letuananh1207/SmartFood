import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Plus, ChefHat } from "lucide-react";

const MealPlan = () => {
  const [selectedWeek, setSelectedWeek] = useState(new Date());

  const weekDays = [
    "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"
  ];

  const sampleMeals = {
    "Thứ Hai": {
      breakfast: { name: "Phở Bò", cookTime: "30 phút", servings: 2 },
      lunch: { name: "Cơm Rang", cookTime: "20 phút", servings: 3 },
      dinner: { name: "Bún Chả", cookTime: "45 phút", servings: 4 }
    },
    "Thứ Ba": {
      breakfast: { name: "Bánh Mì", cookTime: "10 phút", servings: 2 },
      lunch: { name: "Bún Riêu", cookTime: "40 phút", servings: 3 },
      dinner: { name: "Gà Rán", cookTime: "35 phút", servings: 4 }
    },
    "Thứ Tư": {
      breakfast: { name: "Xôi Gà", cookTime: "25 phút", servings: 2 },
      lunch: { name: "Mì Xào", cookTime: "25 phút", servings: 3 },
      dinner: { name: "Lẩu Thái", cookTime: "60 phút", servings: 4 }
    },
    "Thứ Năm": {
      breakfast: { name: "Bún Bò", cookTime: "35 phút", servings: 2 },
      lunch: { name: "Cơm Gà", cookTime: "30 phút", servings: 3 },
      dinner: { name: "Canh Chua", cookTime: "40 phút", servings: 4 }
    },
    "Thứ Sáu": {
      breakfast: { name: "Bánh Cuốn", cookTime: "40 phút", servings: 2 },
      lunch: { name: "Bánh Xèo", cookTime: "35 phút", servings: 3 },
      dinner: { name: "Cá Kho Tộ", cookTime: "50 phút", servings: 4 }
    },
    "Thứ Bảy": {
      breakfast: { name: "Hủ Tiếu", cookTime: "30 phút", servings: 2 },
      lunch: { name: "Gỏi Cuốn", cookTime: "20 phút", servings: 3 },
      dinner: { name: "Thịt Kho Tàu", cookTime: "55 phút", servings: 4 }
    },
    "Chủ Nhật": {
      breakfast: { name: "Ốp La", cookTime: "15 phút", servings: 2 },
      lunch: { name: "Bò Bía", cookTime: "25 phút", servings: 3 },
      dinner: { name: "Nem Rán", cookTime: "45 phút", servings: 4 }
    },
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Calendar className="h-8 w-8 text-primary" />
          Kế hoạch bữa ăn
        </h1>
        <p className="text-lg text-gray-600">
          Lên kế hoạch bữa ăn cho tuần để tiết kiệm thời gian và chi phí
        </p>
      </div>

      {/* Week Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>Tuần hiện tại</CardTitle>
          <CardDescription>
            Chọn tuần để xem hoặc chỉnh sửa kế hoạch bữa ăn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Button variant="outline">
              ← Tuần trước
            </Button>
            <span className="text-lg font-semibold">
              Tuần 1, Tháng 6 2025
            </span>
            <Button variant="outline">
              Tuần sau →
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Meal Plan Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {weekDays.map((day, index) => (
          <Card key={day} className="min-h-[400px]">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{day}</CardTitle>
              <CardDescription className="text-sm">
                {new Date(Date.now() + index * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Breakfast */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Sáng</h4>
                  <Badge variant="secondary" className="text-xs">🌅</Badge>
                </div>
                {sampleMeals[day as keyof typeof sampleMeals]?.breakfast ? (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-sm">
                      {sampleMeals[day as keyof typeof sampleMeals].breakfast.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                      <Clock className="h-3 w-3" />
                      {sampleMeals[day as keyof typeof sampleMeals].breakfast.cookTime}
                      <Users className="h-3 w-3 ml-2" />
                      {sampleMeals[day as keyof typeof sampleMeals].breakfast.servings} người
                    </div>
                  </div>
                ) : (
                  <Button variant="ghost" size="sm" className="w-full justify-start h-auto p-3 border-2 border-dashed">
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm món ăn sáng
                  </Button>
                )}
              </div>

              {/* Lunch */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Trưa</h4>
                  <Badge variant="secondary" className="text-xs">☀️</Badge>
                </div>
                {sampleMeals[day as keyof typeof sampleMeals]?.lunch ? (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-sm">
                      {sampleMeals[day as keyof typeof sampleMeals].lunch.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                      <Clock className="h-3 w-3" />
                      {sampleMeals[day as keyof typeof sampleMeals].lunch.cookTime}
                      <Users className="h-3 w-3 ml-2" />
                      {sampleMeals[day as keyof typeof sampleMeals].lunch.servings} người
                    </div>
                  </div>
                ) : (
                  <Button variant="ghost" size="sm" className="w-full justify-start h-auto p-3 border-2 border-dashed">
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm món ăn trưa
                  </Button>
                )}
              </div>

              {/* Dinner */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Tối</h4>
                  <Badge variant="secondary" className="text-xs">🌙</Badge>
                </div>
                {sampleMeals[day as keyof typeof sampleMeals]?.dinner ? (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-sm">
                      {sampleMeals[day as keyof typeof sampleMeals].dinner.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                      <Clock className="h-3 w-3" />
                      {sampleMeals[day as keyof typeof sampleMeals].dinner.cookTime}
                      <Users className="h-3 w-3 ml-2" />
                      {sampleMeals[day as keyof typeof sampleMeals].dinner.servings} người
                    </div>
                  </div>
                ) : (
                  <Button variant="ghost" size="sm" className="w-full justify-start h-auto p-3 border-2 border-dashed">
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm món ăn tối
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            Thao tác nhanh
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button>
              Tạo kế hoạch tự động
            </Button>
            <Button variant="outline">
              Sao chép từ tuần trước
            </Button>
            <Button variant="outline">
              Tạo danh sách mua sắm
            </Button>
            <Button variant="outline">
              Xuất thực đơn
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MealPlan;
