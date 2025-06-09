
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Clock, Users, Search, Heart, Star, Refrigerator } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Recipes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [favorites, setFavorites] = useState(new Set([1, 3]));

  const recipes = [
    {
      id: 1,
      name: "Phở bò truyền thống",
      description: "Món phở bò đậm đà hương vị Việt Nam với nước dùng trong veo",
      cookTime: "2 giờ",
      servings: 4,
      difficulty: "Khó",
      ingredients: ["Xương bò", "Thịt bò", "Bánh phở", "Hành tây", "Gừng", "Quế"],
      availableIngredients: ["Thịt bò", "Hành tây", "Gừng"],
      missingIngredients: ["Xương bò", "Bánh phở", "Quế"],
      image: "🍜",
      rating: 4.8,
      category: "Món chính"
    },
    {
      id: 2,
      name: "Gỏi cuốn tôm thịt",
      description: "Gỏi cuốn tươi ngon với tôm và thịt heo, ăn kèm tương đậu phộng",
      cookTime: "30 phút",
      servings: 2,
      difficulty: "Dễ",
      ingredients: ["Bánh tráng", "Tôm", "Thịt heo", "Bún", "Rau thơm", "Dưa leo"],
      availableIngredients: ["Tôm", "Rau thơm", "Dưa leo"],
      missingIngredients: ["Bánh tráng", "Thịt heo", "Bún"],
      image: "🥬",
      rating: 4.6,
      category: "Khai vị"
    },
    {
      id: 3,
      name: "Cơm gà Hải Nam",
      description: "Cơm gà thơm ngon nấu với nước dùng gà, ăn kèm nước chấm đặc biệt",
      cookTime: "1 giờ",
      servings: 3,
      difficulty: "Trung bình",
      ingredients: ["Gà", "Gạo", "Gừng", "Hành tây", "Dầu mè", "Nước mắm"],
      availableIngredients: ["Gà", "Gạo", "Gừng", "Hành tây"],
      missingIngredients: ["Dầu mè", "Nước mắm"],
      image: "🍚",
      rating: 4.7,
      category: "Món chính"
    },
    {
      id: 4,
      name: "Bánh xèo miền Tây",
      description: "Bánh xèo giòn rụm với nhân tôm thịt, ăn kèm rau sống và nước chấm",
      cookTime: "45 phút",
      servings: 4,
      difficulty: "Trung bình",
      ingredients: ["Bột bánh xèo", "Tôm", "Thịt ba chỉ", "Giá đỗ", "Rau thơm", "Dừa"],
      availableIngredients: ["Tôm", "Giá đỗ", "Rau thơm"],
      missingIngredients: ["Bột bánh xèo", "Thịt ba chỉ", "Dừa"],
      image: "🥞",
      rating: 4.5,
      category: "Món chính"
    },
    {
      id: 5,
      name: "Chè đậu xanh",
      description: "Chè đậu xanh ngọt mát, thích hợp cho ngày hè",
      cookTime: "40 phút",
      servings: 4,
      difficulty: "Dễ",
      ingredients: ["Đậu xanh", "Đường", "Nước cốt dừa", "Muối", "Lá dứa"],
      availableIngredients: ["Đậu xanh", "Đường"],
      missingIngredients: ["Nước cốt dừa", "Muối", "Lá dứa"],
      image: "🍨",
      rating: 4.4,
      category: "Tráng miệng"
    },
    {
      id: 6,
      name: "Canh chua cá",
      description: "Canh chua cá đậm đà hương vị miền Nam với dứa và đậu bắp",
      cookTime: "30 phút",
      servings: 4,
      difficulty: "Dễ",
      ingredients: ["Cá", "Dứa", "Đậu bắp", "Cà chua", "Giá đỗ", "Me"],
      availableIngredients: ["Cá", "Cà chua", "Giá đỗ"],
      missingIngredients: ["Dứa", "Đậu bắp", "Me"],
      image: "🍲",
      rating: 4.6,
      category: "Canh"
    }
  ];

  const toggleFavorite = (recipeId: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(recipeId)) {
      newFavorites.delete(recipeId);
      toast({
        title: "Đã xóa khỏi yêu thích",
        description: "Công thức đã được xóa khỏi danh sách yêu thích",
      });
    } else {
      newFavorites.add(recipeId);
      toast({
        title: "Đã thêm vào yêu thích",
        description: "Công thức đã được thêm vào danh sách yêu thích",
      });
    }
    setFavorites(newFavorites);
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === "all" || recipe.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const canMakeRecipes = recipes.filter(recipe => recipe.missingIngredients.length <= 2);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <ChefHat className="h-8 w-8 text-primary" />
          Gợi ý món ăn
        </h1>
        <p className="text-lg text-gray-600">
          Khám phá các công thức nấu ăn phù hợp với nguyên liệu có sẵn
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng công thức</p>
                <p className="text-3xl font-bold text-gray-900">{recipes.length}</p>
              </div>
              <ChefHat className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Có thể nấu ngay</p>
                <p className="text-3xl font-bold text-green-600">{canMakeRecipes.length}</p>
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

      {/* Can Make Now Section */}
      {canMakeRecipes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Refrigerator className="h-5 w-5 text-green-600" />
              Có thể nấu ngay hôm nay
            </CardTitle>
            <CardDescription>
              Các món ăn bạn có thể nấu với nguyên liệu hiện có (thiếu tối đa 2 nguyên liệu)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {canMakeRecipes.slice(0, 3).map((recipe) => (
                <Card key={recipe.id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-2xl">{recipe.image}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(recipe.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Heart className={`h-4 w-4 ${favorites.has(recipe.id) ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                      <div>
                        <h4 className="font-semibold">{recipe.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{recipe.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {recipe.cookTime}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          {recipe.servings} người
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          {recipe.rating}
                        </Badge>
                      </div>
                      {recipe.missingIngredients.length > 0 && (
                        <div className="text-xs">
                          <p className="text-red-600 font-medium">Cần mua thêm:</p>
                          <p className="text-red-600">{recipe.missingIngredients.join(", ")}</p>
                        </div>
                      )}
                      <Button size="sm" className="w-full">
                        Xem công thức
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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

      {/* All Recipes */}
      <Card>
        <CardHeader>
          <CardTitle>Tất cả công thức</CardTitle>
          <CardDescription>
            {filteredRecipes.length} công thức được tìm thấy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <Card key={recipe.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-3xl">{recipe.image}</div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{recipe.category}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(recipe.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Heart className={`h-4 w-4 ${favorites.has(recipe.id) ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-lg">{recipe.name}</h4>
                      <p className="text-sm text-gray-600 mt-2">{recipe.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {recipe.cookTime}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        {recipe.servings} người
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        {recipe.rating}
                      </Badge>
                      <Badge 
                        variant={recipe.difficulty === "Dễ" ? "secondary" : 
                                recipe.difficulty === "Trung bình" ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {recipe.difficulty}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <p className="font-medium text-green-600">Có sẵn ({recipe.availableIngredients.length}):</p>
                        <p className="text-green-600">{recipe.availableIngredients.join(", ")}</p>
                      </div>
                      {recipe.missingIngredients.length > 0 && (
                        <div>
                          <p className="font-medium text-red-600">Cần mua ({recipe.missingIngredients.length}):</p>
                          <p className="text-red-600">{recipe.missingIngredients.join(", ")}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        Xem công thức
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
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
