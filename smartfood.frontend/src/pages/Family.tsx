import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, UserPlus, Crown, Settings, Mail, Phone, Calendar, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // Import react-query hooks
import familyGroupService from "@/services/familyGroupService"; // Import service

// Định nghĩa kiểu dữ liệu cho thành viên gia đình từ backend
interface FamilyMember {
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string; // Avatar fallback có thể được tạo từ tên
  };
  role: 'admin' | 'member';
  joinedAt: string;
}

// Định nghĩa kiểu dữ liệu cho FamilyGroup từ backend
interface FamilyGroupData {
  _id: string;
  name: string;
  owner: string; // ID của owner
  members: FamilyMember[];
  currentUserRole: 'admin' | 'member' | 'none'; // Vai trò của người dùng hiện tại trong nhóm này
  createdAt: string;
  updatedAt: string;
}

const Family = () => {
  const queryClient = useQueryClient();
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null); // State để theo dõi nhóm gia đình đang được chọn
  const [inviteEmail, setInviteEmail] = useState("");
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [showCreateGroupForm, setShowCreateGroupForm] = useState(false);

  // Lấy dữ liệu các nhóm gia đình của người dùng
  const { data: familyGroups, isLoading, isError, error } = useQuery<FamilyGroupData[]>({
    queryKey: ['familyGroups'],
    queryFn: familyGroupService.getFamilyGroups,
    // Bật fetching lại khi component mount để đảm bảo dữ liệu mới nhất
    staleTime: 5 * 60 * 1000, // Dữ liệu sẽ không bị "stale" trong 5 phút
    // initialData: [] // Có thể dùng nếu bạn muốn có một giá trị khởi tạo
  });

  // Chọn nhóm đầu tiên nếu có, khi dữ liệu được load lần đầu
  // Bạn có thể muốn lưu activeGroupId vào localStorage để nhớ lựa chọn của người dùng
  useState(() => {
    if (familyGroups && familyGroups.length > 0 && !activeGroupId) {
      setActiveGroupId(familyGroups[0]._id);
    }
  });

  const activeGroup = familyGroups?.find(group => group._id === activeGroupId);
  const familyMembers = activeGroup ? activeGroup.members : [];
  const currentUserRole = activeGroup ? activeGroup.currentUserRole : 'none';

  // Mutation để tạo nhóm gia đình mới
  const createGroupMutation = useMutation({
    mutationFn: familyGroupService.createFamilyGroup,
    onSuccess: (data) => {
      toast({
        title: "Tạo nhóm thành công!",
        description: `Nhóm "${data.familyGroup.name}" đã được tạo.`,
      });
      setNewGroupName("");
      setShowCreateGroupForm(false);
      queryClient.invalidateQueries({ queryKey: ['familyGroups'] }); // Invalidate cache để fetch lại danh sách nhóm
      setActiveGroupId(data.familyGroup._id); // Tự động chọn nhóm mới tạo
    },
    onError: (err: any) => {
      toast({
        title: "Tạo nhóm thất bại",
        description: err.response?.data?.message || "Đã có lỗi xảy ra khi tạo nhóm.",
        variant: "destructive",
      });
    },
  });

  // Mutation để mời thành viên
  const inviteMemberMutation = useMutation({
    mutationFn: ({ groupId, email }: { groupId: string, email: string }) => familyGroupService.inviteMember(groupId, email),
    onSuccess: () => {
      toast({
        title: "Đã gửi lời mời",
        description: `Lời mời đã được gửi đến ${inviteEmail} và thành viên đã được thêm vào nhóm.`,
      });
      setInviteEmail("");
      setShowInviteForm(false);
      queryClient.invalidateQueries({ queryKey: ['familyGroups'] }); // Invalidate cache để cập nhật danh sách thành viên
    },
    onError: (err: any) => {
      toast({
        title: "Mời thành viên thất bại",
        description: err.response?.data?.message || "Đã có lỗi xảy ra khi gửi lời mời.",
        variant: "destructive",
      });
    },
  });

  // Mutation để xóa thành viên
  const removeMemberMutation = useMutation({
    mutationFn: ({ groupId, memberId }: { groupId: string, memberId: string }) => familyGroupService.removeMember(groupId, memberId),
    onSuccess: () => {
      toast({
        title: "Đã xóa thành viên",
        description: "Thành viên đã được xóa khỏi nhóm gia đình.",
      });
      queryClient.invalidateQueries({ queryKey: ['familyGroups'] }); // Invalidate cache để cập nhật danh sách thành viên
    },
    onError: (err: any) => {
      toast({
        title: "Xóa thành viên thất bại",
        description: err.response?.data?.message || "Đã có lỗi xảy ra khi xóa thành viên.",
        variant: "destructive",
      });
    },
  });

  // Mutation để cập nhật vai trò thành viên
  const updateMemberRoleMutation = useMutation({
    mutationFn: ({ groupId, memberId, role }: { groupId: string, memberId: string, role: 'admin' | 'member' }) =>
      familyGroupService.updateMemberRole(groupId, memberId, role),
    onSuccess: () => {
      toast({
        title: "Cập nhật vai trò thành công",
        description: "Vai trò thành viên đã được cập nhật.",
      });
      queryClient.invalidateQueries({ queryKey: ['familyGroups'] });
    },
    onError: (err: any) => {
      toast({
        title: "Cập nhật vai trò thất bại",
        description: err.response?.data?.message || "Đã có lỗi xảy ra khi cập nhật vai trò.",
        variant: "destructive",
      });
    },
  });

  const handleCreateGroup = () => {
    if (newGroupName && createGroupMutation.status !== 'pending') {
      createGroupMutation.mutate(newGroupName);
    }
  };

  const handleSendInvite = () => {
    if (activeGroupId && inviteEmail && inviteMemberMutation.status !== 'pending') {
      inviteMemberMutation.mutate({ groupId: activeGroupId, email: inviteEmail });
    }
  };

  const handleRemoveMember = (memberId: string) => {
    if (activeGroupId && removeMemberMutation.status !== 'pending') {
      removeMemberMutation.mutate({ groupId: activeGroupId, memberId });
    }
  };

  const handleUpdateRole = (memberId: string, currentRole: 'admin' | 'member') => {
    if (activeGroupId && updateMemberRoleMutation.status !== 'pending') {
      const newRole = currentRole === 'admin' ? 'member' : 'admin';
      updateMemberRoleMutation.mutate({ groupId: activeGroupId, memberId, role: newRole });
    }
  };


  const roleColors = {
    admin: "destructive",
    member: "secondary"
  };

  const roleLabels = {
    admin: "Quản trị viên",
    member: "Thành viên"
  };

  if (isLoading) {
    return <div className="text-center py-8">Đang tải dữ liệu nhóm gia đình...</div>;
  }

  if (isError) {
    return <div className="text-center py-8 text-red-500">Lỗi: {error?.message || "Không thể tải dữ liệu nhóm gia đình."}</div>;
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

      {/* Group Selection / Creation */}
      <Card>
        <CardHeader>
          <CardTitle>Chọn hoặc tạo nhóm gia đình</CardTitle>
          <CardDescription>Bạn có thể quản lý các nhóm gia đình mình thuộc về.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 mb-4">
            {familyGroups?.map(group => (
              <Button
                key={group._id}
                variant={activeGroupId === group._id ? "default" : "outline"}
                onClick={() => setActiveGroupId(group._id)}
              >
                {group.name} {group.owner === "current_user_id" && "(Chủ sở hữu)"} {/* Thêm logic để hiển thị chủ sở hữu thực sự */}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() => setShowCreateGroupForm(!showCreateGroupForm)}
            >
              {showCreateGroupForm ? "Hủy tạo nhóm" : "Tạo nhóm mới"}
            </Button>
          </div>

          {showCreateGroupForm && (
            <div className="space-y-4 mt-4">
              <Label htmlFor="new-group-name">Tên nhóm mới</Label>
              <div className="flex gap-2">
                <Input
                  id="new-group-name"
                  placeholder="Tên nhóm gia đình của bạn"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
                <Button onClick={handleCreateGroup} disabled={createGroupMutation.status === 'pending'}>
                  {createGroupMutation.status === 'pending' ? 'Đang tạo...' : 'Tạo nhóm'}
                </Button>
              </div>
              {createGroupMutation.isError && (
                <p className="text-red-500 text-sm">
                  {createGroupMutation.error?.message || "Lỗi khi tạo nhóm."}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Family Overview */}
      {activeGroup && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tổng thành viên</p>
                    <p className="text-3xl font-bold text-gray-900">{activeGroup.members.length}</p>
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
                      {activeGroup.members.filter(m => m.role === 'admin').length}
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
                    <p className="text-sm font-medium text-gray-600">Tên nhóm</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {activeGroup.name}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" /> {/* Icon khác nếu muốn */}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Invite New Member */}
          {currentUserRole === 'admin' && ( // Chỉ hiển thị form mời nếu người dùng là admin của nhóm
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
                          <Label htmlFor="invite-email">Email người dùng</Label>
                          <Input
                            id="invite-email"
                            type="email"
                            placeholder="example@email.com"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                          />
                        </div>
                      </div>
                      <Button onClick={handleSendInvite} className="w-full" disabled={inviteMemberMutation.status === 'pending'}>
                        {inviteMemberMutation.status === 'pending' ? 'Đang gửi...' : 'Gửi lời mời'}
                      </Button>
                      {inviteMemberMutation.isError && (
                        <p className="text-red-500 text-sm">
                          {inviteMemberMutation.error?.message || "Lỗi khi gửi lời mời."}
                        </p>
                      )}
                    </div>
                  </CardContent>
                )}
              </CardHeader>
            </Card>
          )}

          {/* Family Members List */}
          <Card>
            <CardHeader>
              <CardTitle>Danh sách thành viên ({activeGroup.name})</CardTitle>
              <CardDescription>
                Quản lý thông tin và quyền của các thành viên trong gia đình này.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {familyMembers.length > 0 ? (
                  familyMembers.map((member) => (
                    <div
                      key={member.user._id} // Sử dụng _id từ backend
                      className="p-6 border rounded-lg bg-white hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-primary text-white">
                              {member.user.avatar || member.user.name?.charAt(0).toUpperCase() || '??'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-lg">{member.user.name}</h4>
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
                                {member.user.email}
                              </span>
                              {/* Phone và Contributions, Last Active không có trong model backend hiện tại.
                                  Bạn có thể thêm chúng vào User model nếu muốn hiển thị. */}
                              {/* <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {member.phone}
                              </span> */}
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Tham gia: {new Date(member.joinedAt).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions for members */}
                        <div className="flex gap-2">
                          {currentUserRole === 'admin' && (
                            <>
                              {/* Nút thay đổi vai trò: Admin -> Member, Member -> Admin */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdateRole(member.user._id, member.role)}
                                disabled={updateMemberRoleMutation.status === 'pending' || (member.role === 'admin' && activeGroup.members.filter(m => m.role === 'admin').length === 1)} // Không cho hạ cấp admin duy nhất
                              >
                                <Settings className="h-4 w-4 mr-1" />
                                {member.role === 'admin' ? "Hạ cấp" : "Nâng cấp"}
                              </Button>

                              {/* Nút xóa thành viên */}
                              {/* Không cho phép admin tự xóa chính mình nếu là admin duy nhất */}
                              {(member.role !== 'admin' || (member.role === 'admin' && activeGroup.members.filter(m => m.role === 'admin').length > 1)) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveMember(member.user._id)}
                                  className="text-red-500 hover:text-red-700"
                                  disabled={removeMemberMutation.status === 'pending'}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Chưa có thành viên nào trong nhóm này. Hãy mời một người!</p>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {!activeGroup && familyGroups && familyGroups.length === 0 && !showCreateGroupForm && (
        <div className="text-center py-8 text-gray-500">
          Bạn chưa thuộc bất kỳ nhóm gia đình nào. Hãy tạo một nhóm mới!
        </div>
      )}
    </div>
  );
};

export default Family;