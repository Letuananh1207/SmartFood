
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Refrigerator, Calendar, ChefHat, AlertTriangle, TrendingUp, LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const quickStats = [
    {
      title: "Sản phẩm sắp hết hạn",
      value: "3",
      description: "Trong 3 ngày tới",
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Danh sách mua sắm",
      value: "12",
      description: "Sản phẩm cần mua",
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Thực phẩm trong tủ lạnh",
      value: "25",
      description: "Loại thực phẩm",
      icon: Refrigerator,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Bữa ăn tuần này",
      value: "7",
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Chào mừng đến với Smart Shopping! 👋</h1>
        <p className="text-lg text-gray-600">
          Hệ thống quản lý mua sắm và bữa ăn thông minh cho gia đình bạn
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
            <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Đã thêm 5 sản phẩm vào danh sách mua sắm</p>
                <p className="text-xs text-gray-500">2 giờ trước</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Cập nhật thực phẩm trong tủ lạnh</p>
                <p className="text-xs text-gray-500">5 giờ trước</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Tạo kế hoạch bữa ăn tuần mới</p>
                <p className="text-xs text-gray-500">1 ngày trước</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
