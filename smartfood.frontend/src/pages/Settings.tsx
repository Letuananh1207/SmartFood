
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings as SettingsIcon, Bell, Shield, Palette, Globe, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Settings = () => {
  const [settings, setSettings] = useState({
    // Notification settings
    expireNotifications: true,
    shoppingReminders: true,
    mealPlanNotifications: false,
    emailDigest: true,
    
    // Display settings
    language: "vi",
    theme: "light",
    currency: "VND",
    
    // Privacy settings
    profilePublic: false,
    shareData: true,
    
    // Account settings
    name: "Nguyễn Văn A",
    email: "vana@email.com",
    phone: "0901234567",
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    toast({
      title: "Đã lưu cài đặt",
      description: "Các thay đổi của bạn đã được lưu thành công",
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <SettingsIcon className="h-8 w-8 text-primary" />
          Cài đặt
        </h1>
        <p className="text-lg text-gray-600">
          Tùy chỉnh các thiết lập cho ứng dụng của bạn
        </p>
      </div>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Thông tin tài khoản
          </CardTitle>
          <CardDescription>
            Quản lý thông tin cá nhân và bảo mật tài khoản
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Họ và tên</Label>
              <Input
                id="name"
                value={settings.name}
                onChange={(e) => updateSetting('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => updateSetting('email', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) => updateSetting('phone', e.target.value)}
              />
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <Button variant="outline" className="mr-4">
              Đổi mật khẩu
            </Button>
            <Button variant="outline">
              Xác thực 2 bước
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Thông báo
          </CardTitle>
          <CardDescription>
            Chọn loại thông báo bạn muốn nhận
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="expire-notifications">Thông báo hết hạn</Label>
                <p className="text-sm text-gray-600">
                  Nhận thông báo khi thực phẩm sắp hết hạn
                </p>
              </div>
              <Switch
                id="expire-notifications"
                checked={settings.expireNotifications}
                onCheckedChange={(checked) => updateSetting('expireNotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="shopping-reminders">Nhắc nhở mua sắm</Label>
                <p className="text-sm text-gray-600">
                  Nhận nhắc nhở về danh sách mua sắm
                </p>
              </div>
              <Switch
                id="shopping-reminders"
                checked={settings.shoppingReminders}
                onCheckedChange={(checked) => updateSetting('shoppingReminders', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="meal-plan-notifications">Kế hoạch bữa ăn</Label>
                <p className="text-sm text-gray-600">
                  Nhận thông báo về kế hoạch bữa ăn
                </p>
              </div>
              <Switch
                id="meal-plan-notifications"
                checked={settings.mealPlanNotifications}
                onCheckedChange={(checked) => updateSetting('mealPlanNotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-digest">Báo cáo email hàng tuần</Label>
                <p className="text-sm text-gray-600">
                  Nhận tóm tắt hoạt động qua email
                </p>
              </div>
              <Switch
                id="email-digest"
                checked={settings.emailDigest}
                onCheckedChange={(checked) => updateSetting('emailDigest', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Display Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Giao diện & Hiển thị
          </CardTitle>
          <CardDescription>
            Tùy chỉnh giao diện và ngôn ngữ hiển thị
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">Ngôn ngữ</Label>
              <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vi">Tiếng Việt</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="theme">Giao diện</Label>
              <Select value={settings.theme} onValueChange={(value) => updateSetting('theme', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Sáng</SelectItem>
                  <SelectItem value="dark">Tối</SelectItem>
                  <SelectItem value="auto">Tự động</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Đơn vị tiền tệ</Label>
              <Select value={settings.currency} onValueChange={(value) => updateSetting('currency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VND">VND (₫)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Quyền riêng tư
          </CardTitle>
          <CardDescription>
            Quản lý quyền riêng tư và chia sẻ dữ liệu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="profile-public">Hồ sơ công khai</Label>
                <p className="text-sm text-gray-600">
                  Cho phép người khác xem hồ sơ của bạn
                </p>
              </div>
              <Switch
                id="profile-public"
                checked={settings.profilePublic}
                onCheckedChange={(checked) => updateSetting('profilePublic', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="share-data">Chia sẻ dữ liệu phân tích</Label>
                <p className="text-sm text-gray-600">
                  Giúp cải thiện dịch vụ bằng dữ liệu ẩn danh
                </p>
              </div>
              <Switch
                id="share-data"
                checked={settings.shareData}
                onCheckedChange={(checked) => updateSetting('shareData', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Quản lý dữ liệu</CardTitle>
          <CardDescription>
            Sao lưu, khôi phục và xóa dữ liệu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline">
              Xuất dữ liệu
            </Button>
            <Button variant="outline">
              Sao lưu dữ liệu
            </Button>
            <Button variant="outline">
              Khôi phục dữ liệu
            </Button>
            <Button variant="destructive">
              Xóa tất cả dữ liệu
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveSettings} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Lưu tất cả thay đổi
        </Button>
      </div>
    </div>
  );
};

export default Settings;
