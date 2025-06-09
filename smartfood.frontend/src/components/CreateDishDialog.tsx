
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { useDishes } from "@/hooks/useDishes";
import { toast } from "@/hooks/use-toast";

export const CreateDishDialog = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("2");
  const [difficulty, setDifficulty] = useState("Dễ");
  const [category, setCategory] = useState("Món chính");
  const [imageEmoji, setImageEmoji] = useState("🍽️");
  const [instructions, setInstructions] = useState("");
  const [ingredients, setIngredients] = useState([{ name: "", amount: "" }]);

  const { addDish } = useDishes();

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: "" }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: 'name' | 'amount', value: string) => {
    const updated = ingredients.map((ing, i) => 
      i === index ? { ...ing, [field]: value } : ing
    );
    setIngredients(updated);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên món ăn",
        variant: "destructive",
      });
      return;
    }

    if (!cookTime || isNaN(parseInt(cookTime))) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập thời gian nấu hợp lệ",
        variant: "destructive",
      });
      return;
    }

    try {
      await addDish({
        name: name.trim(),
        description: description.trim() || null,
        cook_time: parseInt(cookTime),
        servings: parseInt(servings),
        difficulty,
        category,
        image_emoji: imageEmoji,
        instructions: instructions.trim() || null,
        ingredients: ingredients.filter(ing => ing.name.trim() && ing.amount.trim()),
        rating: null,
      });

      // Reset form
      setName("");
      setDescription("");
      setCookTime("");
      setServings("2");
      setDifficulty("Dễ");
      setCategory("Món chính");
      setImageEmoji("🍽️");
      setInstructions("");
      setIngredients([{ name: "", amount: "" }]);
      setOpen(false);
    } catch (error) {
      console.error('Error creating dish:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Thêm món ăn mới
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm món ăn mới</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Tên món ăn</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên món ăn..."
              />
            </div>
            <div>
              <Label htmlFor="emoji">Biểu tượng</Label>
              <Input
                id="emoji"
                value={imageEmoji}
                onChange={(e) => setImageEmoji(e.target.value)}
                placeholder="🍽️"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả về món ăn..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cookTime">Thời gian nấu (phút)</Label>
              <Input
                id="cookTime"
                type="number"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
                placeholder="30"
              />
            </div>
            <div>
              <Label htmlFor="servings">Số người ăn</Label>
              <Input
                id="servings"
                type="number"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                placeholder="2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="difficulty">Độ khó</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dễ">Dễ</SelectItem>
                  <SelectItem value="Trung bình">Trung bình</SelectItem>
                  <SelectItem value="Khó">Khó</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="category">Loại món</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Món chính">Món chính</SelectItem>
                  <SelectItem value="Món phụ">Món phụ</SelectItem>
                  <SelectItem value="Đồ uống">Đồ uống</SelectItem>
                  <SelectItem value="Tráng miệng">Tráng miệng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Nguyên liệu</Label>
            <div className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="grid grid-cols-2 gap-2">
                  <Input
                    value={ingredient.name}
                    onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                    placeholder="Tên nguyên liệu"
                  />
                  <div className="flex gap-2">
                    <Input
                      value={ingredient.amount}
                      onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                      placeholder="Số lượng"
                    />
                    {ingredients.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeIngredient(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm nguyên liệu
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="instructions">Cách làm</Label>
            <Textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Hướng dẫn cách làm món ăn..."
              rows={4}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSubmit} className="flex-1">
              Thêm món ăn
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
