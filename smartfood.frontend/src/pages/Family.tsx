
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, UserPlus, Crown, Settings, Mail, Phone, Calendar, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Family = () => {
  const [familyMembers, setFamilyMembers] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "vana@email.com",
      role: "admin",
      joinDate: "2024-01-15",
      avatar: "VA",
      phone: "0901234567",
      contributions: 15,
      lastActive: "Hôm nay"
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "thib@email.com",
      role: "member",
      joinDate: "2024-01-20",
      avatar: "TB",
      phone: "0907654321",
      contributions: 8,
      lastActive: "2 giờ trước"
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "vanc@email.com",
      role: "member",
      joinDate: "2024-02-01",
      avatar: "LC",
      phone: "0912345678",
      contributions: 3,
      lastActive: "1 ngày trước"
    },
  ]);

  const [inviteEmail, setInviteEmail] = useState("");
  const [showInviteForm, setShowInviteForm] = useState(false);

  const sendInvite = () => {
    if (inviteEmail) {
      toast({
        title: "Đã gửi lời mời",
        description: `Lời mời đã được gửi đến ${inviteEmail}`,
      });
      setInviteEmail("");
      setShowInviteForm(false);
    }
  };

  const removeMember = (memberId: number) => {
    setFamilyMembers(familyMembers.filter(member => member.id !== memberId));
    toast({
      title: "Đã xóa thành viên",
      description: "Thành viên đã được xóa khỏi nhóm gia đình",
    });
  };

  const roleColors = {
    admin: "destructive",
    member: "secondary"
  };

  const roleLabels = {
    admin: "Quản trị viên",
    member: "Thành viên"
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          Quản lý gia đình
        </h1>
        <p className="text-lg text-gray-600">
          Quản lý thành viên gia đình và phân quyền sử dụng hệ thống
        </p>
      </div>

      {/* Family Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng thành viên</p>
                <p className="text-3xl font-bold text-gray-900">{familyMembers.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Quản trị viên</p>
                <p className="text-3xl font-bold text-gray-900">
                  {familyMembers.filter(m => m.role === 'admin').length}
                </p>
              </div>
              <Crown className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hoạt động hôm nay</p>
                <p className="text-3xl font-bold text-gray-900">
                  {familyMembers.filter(m => m.lastActive === 'Hôm nay').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invite New Member */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Mời thành viên mới
            </span>
            <Button 
              onClick={() => setShowInviteForm(!showInviteForm)}
              size="sm"
            >
              {showInviteForm ? "Hủy" : "Mời thành viên"}
            </Button>
          </CardTitle>
          {showInviteForm && (
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invite-email">Email</Label>
                    <Input
                      id="invite-email"
                      type="email"
                      placeholder="example@email.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={sendInvite} className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Gửi lời mời
                </Button>
              </div>
            </CardContent>
          )}
        </CardHeader>
      </Card>

      {/* Family Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách thành viên</CardTitle>
          <CardDescription>
            Quản lý thông tin và quyền của các thành viên trong gia đình
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {familyMembers.map((member) => (
              <div
                key={member.id}
                className="p-6 border rounded-lg bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-white">
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-lg">{member.name}</h4>
                        <Badge variant={roleColors[member.role] as any}>
                          {roleLabels[member.role]}
                        </Badge>
                        {member.role === 'admin' && (
                          <Crown className="h-4 w-4 text-yellow-600" />
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {member.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {member.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Tham gia: {new Date(member.joinDate).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right space-y-1">
                      <div className="text-sm font-medium">
                        {member.contributions} đóng góp
                      </div>
                      <div className="text-xs text-gray-500">
                        Hoạt động: {member.lastActive}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      {member.role !== 'admin' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMember(member.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-green-600 text-white text-xs">VA</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">Nguyễn Văn A đã thêm 5 sản phẩm vào danh sách mua sắm</p>
                <p className="text-xs text-gray-500">2 giờ trước</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-600 text-white text-xs">TB</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">Trần Thị B đã cập nhật thực phẩm trong tủ lạnh</p>
                <p className="text-xs text-gray-500">5 giờ trước</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-purple-600 text-white text-xs">LC</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">Lê Văn C đã tạo kế hoạch bữa ăn tuần mới</p>
                <p className="text-xs text-gray-500">1 ngày trước</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Family;
