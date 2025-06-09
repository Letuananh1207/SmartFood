import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, UserPlus, Crown, Settings, Mail, Phone, Calendar, Trash2, Loader2 } from "lucide-react";
import { useFamilyMembers } from "@/hooks/useFamilyMembers";

const Family = () => {
  const navigate = useNavigate();
  const { members, loading, addMember, removeMember } = useFamilyMembers();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [invitePhone, setInvitePhone] = useState("");
  const [showInviteForm, setShowInviteForm] = useState(false);

  const sendInvite = async () => {
    if (inviteEmail && inviteName) {
      await addMember({
        name: inviteName,
        email: inviteEmail,
        phone: invitePhone,
        role: 'member'
      });
      setInviteEmail("");
      setInviteName("");
      setInvitePhone("");
      setShowInviteForm(false);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    removeMember(memberId);
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const roleColors = {
    admin: "destructive",
    member: "secondary"
  };

  const roleLabels = {
    admin: "Quản trị viên",
    member: "Thành viên"
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Đang tải thông tin gia đình...</span>
      </div>
    );
  }

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
                <p className="text-3xl font-bold text-gray-900">{members.length}</p>
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
                  {members.filter(m => m.role === 'admin').length}
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
                  {members.filter(m => {
                    const lastActive = new Date(m.last_active);
                    const today = new Date();
                    return lastActive.toDateString() === today.toDateString();
                  }).length}
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invite-name">Tên</Label>
                    <Input
                      id="invite-name"
                      type="text"
                      placeholder="Nguyễn Văn A"
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                    />
                  </div>
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
                  <div className="space-y-2">
                    <Label htmlFor="invite-phone">Số điện thoại</Label>
                    <Input
                      id="invite-phone"
                      type="tel"
                      placeholder="0901234567"
                      value={invitePhone}
                      onChange={(e) => setInvitePhone(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={sendInvite} className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Thêm thành viên
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
            {members.map((member) => (
              <div
                key={member.id}
                className="p-6 border rounded-lg bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-white">
                        {member.avatar_initials || member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-lg">{member.name}</h4>
                        <Badge variant={roleColors[member.role as keyof typeof roleColors] as any}>
                          {roleLabels[member.role as keyof typeof roleLabels]}
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
                        {member.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {member.phone}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Tham gia: {new Date(member.join_date).toLocaleDateString('vi-VN')}
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
                        Hoạt động: {new Date(member.last_active).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleSettingsClick}
                        title="Chỉnh sửa thông tin trong Cài đặt"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      {member.role !== 'admin' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMember(member.id)}
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
    </div>
  );
};

export default Family;
