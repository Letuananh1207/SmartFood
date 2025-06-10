// src/components/ShoppingListTab.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, ShoppingCart } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ShoppingListTabProps {
  activeGroupId: string | null;
  activeGroupName: string | undefined;
  currentUserRole: 'admin' | 'member' | 'none';
}

const ShoppingListTab: React.FC<ShoppingListTabProps> = ({ activeGroupId, activeGroupName, currentUserRole }) => {
  const handleShareShoppingList = () => {
    if (activeGroupId) {
      // Logic thực tế để chia sẻ danh sách đi chợ
      // Bạn có thể gọi API ở đây, ví dụ: shoppingListService.shareList(activeGroupId)
      
      // Để minh họa, sử dụng toast để thông báo
      toast({
        title: "Chia sẻ danh sách đi chợ",
        description: `Bạn đang chia sẻ danh sách đi chợ cho nhóm "${activeGroupName}".`,
        // Bạn có thể thêm hành động sao chép liên kết, gửi email, v.v. tại đây
      });

      // Ví dụ: Tạo link chia sẻ và sao chép vào clipboard
      // const shareableLink = `${window.location.origin}/shopping-list/share/${activeGroupId}`;
      // navigator.clipboard.writeText(shareableLink);
      // toast({
      //   title: "Đã sao chép liên kết chia sẻ!",
      //   description: "Liên kết đã được sao chép vào clipboard. Bạn có thể chia sẻ nó.",
      // });

    } else {
      toast({
        title: "Chưa chọn nhóm",
        description: "Vui lòng chọn một nhóm gia đình để chia sẻ danh sách đi chợ.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-green-600" />
          Danh sách đi chợ
        </CardTitle>
        <CardDescription>Quản lý và chia sẻ danh sách các mặt hàng cần mua cho nhóm của bạn.</CardDescription>
      </CardHeader>
      <CardContent>
        {!activeGroupId ? (
          <p className="text-gray-500 text-center py-4">Vui lòng chọn một nhóm gia đình ở tab "Quản lý nhóm" để xem hoặc chia sẻ danh sách đi chợ.</p>
        ) : (
          <>
            <p className="text-lg font-semibold mb-4">Danh sách đi chợ của nhóm: <span className="text-primary">{activeGroupName}</span></p>
            {/* Đây là nơi bạn sẽ render danh sách các mặt hàng thực tế.
                Bạn có thể cần một API call riêng để lấy dữ liệu danh sách đi chợ. */}
            <div className="border border-dashed p-8 text-center text-gray-500 rounded-md">
              <p className="mb-2">Chưa có mặt hàng nào trong danh sách. (Đây là nội dung placeholder)</p>
              <p>Bạn có thể thêm chức năng hiển thị và quản lý danh sách đi chợ tại đây.</p>
            </div>

            {currentUserRole === 'admin' ? (
              <Button
                onClick={handleShareShoppingList}
                className="w-full mt-6 flex items-center gap-2"
              >
                <Share2 className="h-5 w-5" />
                Chia sẻ danh sách đi chợ
              </Button>
            ) : (
              <p className="text-gray-600 text-center py-4">
                Chỉ quản trị viên nhóm mới có thể chia sẻ danh sách đi chợ.
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ShoppingListTab;