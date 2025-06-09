
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Refrigerator, Calendar, ChefHat, AlertTriangle, TrendingUp, LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useGroceryItems } from "@/hooks/useGroceryItems";
import { useFridgeItems } from "@/hooks/useFridgeItems";
import { useMealPlans } from "@/hooks/useMealPlans";
import { useDishes } from "@/hooks/useDishes";
import { useEffect, useState } from "react";

const Index = () => {
  const { items: groceryItems } = useGroceryItems();
  const { items: fridgeItems } = useFridgeItems();
  const { mealPlans } = useMealPlans();
  const { dishes } = useDishes();
  
  const [expiringItems, setExpiringItems] = useState(0);

  useEffect(() => {
    // Calculate items expiring in the next 3 days
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    
    const expiring = fridgeItems.filter(item => {
      const expiryDate = new Date(item.expiry_date);
      return expiryDate <= threeDaysFromNow && expiryDate >= new Date();
    }).length;
    
    setExpiringItems(expiring);
  }, [fridgeItems]);

  // Get current week meal plans
  const currentWeek = new Date();
  const weekStart = new Date(currentWeek.setDate(currentWeek.getDate() - currentWeek.getDay()));
  const weekEnd = new Date(currentWeek.setDate(currentWeek.getDate() - currentWeek.getDay() + 6));
  
  const thisWeekMeals = mealPlans.filter(plan => {
    const mealDate = new Date(plan.meal_date);
    return mealDate >= weekStart && mealDate <= weekEnd;
  }).length;

  const pendingGroceryItems = groceryItems.filter(item => !item.completed).length;

  const quickStats = [
    {
      title: "Sản phẩm sắp hết hạn",
      value: expiringItems.toString(),
      description: "Trong 3 ngày tới",
      icon: AlertTriangle,
      color: expiringItems > 0 ? "text-orange-600" : "text-green-600",
      bgColor: expiringItems > 0 ? "bg-orange-50" : "bg-green-50",
    },
    {
      title: "Danh sách mua sắm",
      value: pendingGroceryItems.toString(),
      description: "Sản phẩm cần mua",
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Thực phẩm trong tủ lạnh",
      value: fridgeItems.length.toString(),
      description: "Loại thực phẩm",
      icon: Refrigerator,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Bữa ăn tuần này",
      value: thisWeekMeals.toString(),
      description: "Món ăn đã lên kế hoạch",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  const quickActions = [
    {
      title: "Thêm sản phẩm mua sắm",
      description: "Thêm mới vào danh sách mua sắm",
      icon: ShoppingCart,
      href: "/shopping-list",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Quản lý tủ lạnh",
      description: "Cập nhật thực phẩm trong tủ lạnh",
      icon: Refrigerator,
      href: "/fridge",
      gradient: "from-green-500 to-green-600",
    },
    {
      title: "Lên kế hoạch bữa ăn",
      description: "Tạo thực đơn cho tuần mới",
      icon: Calendar,
      href: "/meal-plan",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      title: "Tìm công thức nấu ăn",
      description: "Khám phá món ăn mới",
      icon: ChefHat,
      href: "/recipes",
      gradient: "from-orange-500 to-orange-600",
    },
  ];

  // Get recent activity based on real data
  const recentActivity = [
    {
      message: `Đã thêm ${groceryItems.filter(item => {
        const itemDate = new Date(item.created_at);
        const today = new Date();
        return itemDate.toDateString() === today.toDateString();
      }).length} sản phẩm vào danh sách mua sắm`,
      time: "Hôm nay",
      color: "green"
    },
    {
      message: `Cập nhật ${fridgeItems.filter(item => {
        const itemDate = new Date(item.updated_at);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return itemDate.toDateString() === yesterday.toDateString();
      }).length} thực phẩm trong tủ lạnh`,
      time: "Hôm qua",
      color: "blue"
    },
    {
      message: `Có ${dishes.length} công thức nấu ăn trong hệ thống`,
      time: "Tổng cộng",
      color: "purple"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Chào mừng trở lại! 👋</h1>
        <p className="text-lg text-gray-600">
          Hôm nay là một ngày tuyệt vời để quản lý bữa ăn gia đình bạn
        </p>
        {/* Auth CTA */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Bắt đầu ngay hôm nay!</h3>
                <p className="text-gray-600">Đăng ký tài khoản để lưu trữ và đồng bộ dữ liệu của bạn</p>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline">
                  <Link to="/login" className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Đăng nhập
                  </Link>
                </Button>
                <Button asChild className="bg-gradient-fresh hover:opacity-90">
                  <Link to="/register" className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Đăng ký miễn phí
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Thao tác nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
              <CardContent className="p-0">
                <Link to={action.href} className="block">
                  <div className={`h-32 bg-gradient-to-br ${action.gradient} flex items-center justify-center relative overflow-hidden`}>
                    <action.icon className="h-12 w-12 text-white group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors duration-300"></div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors duration-300">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Hoạt động gần đây
          </CardTitle>
          <CardDescription>
            Những thay đổi mới nhất trong hệ thống của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className={`flex items-center gap-4 p-3 bg-${activity.color}-50 rounded-lg`}>
                <div className={`w-2 h-2 bg-${activity.color}-500 rounded-full`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
