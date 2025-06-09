
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, DollarSign, ShoppingCart, AlertTriangle } from "lucide-react";
import { useGroceryItems } from "@/hooks/useGroceryItems";
import { useFridgeItems } from "@/hooks/useFridgeItems";
import { usePurchaseHistory } from "@/hooks/usePurchaseHistory";

const Reports = () => {
  const { items: groceryItems } = useGroceryItems();
  const { items: fridgeItems } = useFridgeItems();
  const { items: purchaseHistory } = usePurchaseHistory();

  // Calculate total spending from purchase history
  const totalSpending = purchaseHistory.reduce((sum, item) => {
    return sum + (item.price || 0);
  }, 0);

  // Calculate spending by category from purchase history
  const spendingByCategory = purchaseHistory.reduce((acc: any, item) => {
    const category = item.item_type;
    const price = item.price || 0;
    acc[category] = (acc[category] || 0) + price;
    return acc;
  }, {});

  const categoryData = Object.entries(spendingByCategory).map(([category, amount]) => ({
    category,
    amount: amount as number
  }));

  // Calculate monthly spending and waste from real data
  const getMonthlyData = () => {
    const monthlyStats: { [key: string]: { spending: number; waste: number } } = {};
    
    // Initialize months
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `Tháng ${date.getMonth() + 1}`;
      monthlyStats[monthKey] = { spending: 0, waste: 0 };
    }

    // Calculate spending from purchase history
    purchaseHistory.forEach(item => {
      const purchaseDate = new Date(item.purchased_at);
      const monthKey = `Tháng ${purchaseDate.getMonth() + 1}`;
      if (monthlyStats[monthKey]) {
        monthlyStats[monthKey].spending += item.price || 0;
      }
    });

    // Calculate waste from expired fridge items
    fridgeItems.forEach(item => {
      const expiryDate = new Date(item.expiry_date);
      const today = new Date();
      if (expiryDate < today) {
        const monthKey = `Tháng ${expiryDate.getMonth() + 1}`;
        if (monthlyStats[monthKey]) {
          // Estimate waste value - could be improved with actual purchase prices
          monthlyStats[monthKey].waste += 25000; // Rough estimate
        }
      }
    });

    return Object.entries(monthlyStats)
      .map(([month, data]) => ({
        month,
        spending: data.spending,
        waste: data.waste
      }))
      .reverse(); // Show chronologically
  };

  const monthlyData = getMonthlyData();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Calculate actual waste from expired items
  const actualWaste = fridgeItems.filter(item => {
    const expiryDate = new Date(item.expiry_date);
    const today = new Date();
    return expiryDate < today;
  }).length * 25000; // Estimate per expired item

  // Calculate potential savings
  const estimatedSavings = totalSpending * 0.15; // Estimate 15% savings from better planning

  // Count completed grocery items
  const completedItems = groceryItems.filter(item => item.completed);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-primary" />
          Báo cáo và thống kê
        </h1>
        <p className="text-lg text-gray-600">
          Phân tích chi tiêu thực phẩm và hiệu quả quản lý
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng chi tiêu</p>
                <p className="text-3xl font-bold text-gray-900">{totalSpending.toLocaleString()}đ</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Số sản phẩm đã mua</p>
                <p className="text-3xl font-bold text-gray-900">{purchaseHistory.length}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ước tính lãng phí</p>
                <p className="text-3xl font-bold text-red-600">{actualWaste.toLocaleString()}đ</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tiết kiệm ước tính</p>
                <p className="text-3xl font-bold text-green-600">{estimatedSavings.toLocaleString()}đ</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Spending Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Xu hướng chi tiêu theo tháng</CardTitle>
            <CardDescription>So sánh chi tiêu và lãng phí qua các tháng</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `${Number(value).toLocaleString()}đ`} />
                <Legend />
                <Bar dataKey="spending" fill="#8b5cf6" name="Chi tiêu" />
                <Bar dataKey="waste" fill="#ef4444" name="Lãng phí" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Spending by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Chi tiêu theo danh mục</CardTitle>
            <CardDescription>Phân bổ chi tiêu cho các loại thực phẩm</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${Number(value).toLocaleString()}đ`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Nhận xét và đề xuất</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900">💡 Tiết kiệm chi phí</h4>
              <p className="text-blue-800 mt-2">
                Bạn có thể tiết kiệm thêm {estimatedSavings.toLocaleString()}đ bằng cách lên kế hoạch bữa ăn chi tiết hơn.
              </p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-900">⚠️ Giảm lãng phí</h4>
              <p className="text-orange-800 mt-2">
                Hiện có {fridgeItems.filter(item => new Date(item.expiry_date) < new Date()).length} sản phẩm đã hết hạn trong tủ lạnh. 
                Kiểm tra thường xuyên để giảm lãng phí.
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900">📊 Theo dõi chi tiêu</h4>
              <p className="text-green-800 mt-2">
                Tổng cộng đã mua {purchaseHistory.length} sản phẩm với tổng giá trị {totalSpending.toLocaleString()}đ.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
