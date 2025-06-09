
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Clock, Users, Search, Heart, Star, Refrigerator } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useDishes } from "@/hooks/useDishes";
import { useMealPlans } from "@/hooks/useMealPlans";
import { CreateDishDialog } from "@/components/CreateDishDialog";

const Recipes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [favorites, setFavorites] = useState(new Set<string>());

  const { dishes, loading: dishesLoading } = useDishes();
  const { addMealPlan } = useMealPlans();

  const toggleFavorite = (dishId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(dishId)) {
      newFavorites.delete(dishId);
      toast({
        title: "Đã xóa khỏi yêu thích",
        description: "Công thức đã được xóa khỏi danh sách yêu thích",
      });
    } else {
      newFavorites.add(dishId);
      toast({
        title: "Đã thêm vào yêu thích",
        description: "Công thức đã được thêm vào danh sách yêu thích",
      });
    }
    setFavorites(newFavorites);
  };

  const addToMealPlan = async (dishId: string, dishName: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await addMealPlan({
        dish_id: dishId,
        meal_date: today,
        time_of_day: 'Trưa',
        planned_servings: 2,
        notes: null,
        created_by: 'Tôi',
        family_member_id: null
      });
      
      toast({
        title: "Đã thêm vào kế hoạch",
        description: `${dishName} đã được thêm vào kế hoạch bữa trưa hôm nay`,
      });
    } catch (error) {
      console.error('Error adding to meal plan:', error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm vào kế hoạch bữa ăn",
        variant: "destructive",
      });
    }
  };

  const filteredDishes = dishes.filter(dish => {
    const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (dish.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === "all" || dish.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  if (dishesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <ChefHat className="h-8 w-8 text-primary" />
              Gợi ý món ăn
            </h1>
            <p className="text-lg text-gray-600">
              Khám phá các công thức nấu ăn từ cơ sở dữ liệu món ăn của bạn
            </p>
          </div>
          <CreateDishDialog />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng công thức</p>
                <p className="text-3xl font-bold text-gray-900">{dishes.length}</p>
              </div>
              <ChefHat className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Dễ nấu</p>
                <p className="text-3xl font-bold text-green-600">
                  {dishes.filter(d => d.difficulty === 'Dễ').length}
                </p>
              </div>
              <Refrigerator className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Yêu thích</p>
                <p className="text-3xl font-bold text-red-600">{favorites.size}</p>
              </div>
              <Heart className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm công thức..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {["all", "Dễ", "Trung bình", "Khó"].map((difficulty) => (
                <Button
                  key={difficulty}
                  variant={selectedDifficulty === difficulty ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDifficulty(difficulty)}
                >
                  {difficulty === "all" ? "Tất cả" : difficulty}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* All Dishes */}
      <Card>
        <CardHeader>
          <CardTitle>Tất cả công thức</CardTitle>
          <CardDescription>
            {filteredDishes.length} công thức được tìm thấy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDishes.map((dish) => (
              <Card key={dish.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-3xl">{dish.image_emoji || '🍽️'}</div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{dish.category}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(dish.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Heart className={`h-4 w-4 ${favorites.has(dish.id) ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-lg">{dish.name}</h4>
                      <p className="text-sm text-gray-600 mt-2">{dish.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {dish.cook_time} phút
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        {dish.servings} người
                      </Badge>
                      {dish.rating && (
                        <Badge variant="outline" className="text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          {dish.rating}
                        </Badge>
                      )}
                      <Badge 
                        variant={dish.difficulty === "Dễ" ? "secondary" : 
                                dish.difficulty === "Trung bình" ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {dish.difficulty}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <p className="font-medium text-green-600">Nguyên liệu ({dish.ingredients?.length || 0}):</p>
                        <p className="text-green-600">
                          {dish.ingredients?.map((ing: any) => `${ing.name} (${ing.amount})`).join(", ") || "Chưa có thông tin"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        Xem công thức
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => addToMealPlan(dish.id, dish.name)}
                      >
                        Thêm vào kế hoạch
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Recipes;
