"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, FolderOpen } from "lucide-react"
import { toast } from "sonner"

import { useQuery, useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import type { Id } from "../../../../convex/_generated/dataModel"

interface Category {
  _id: Id<"categories">
  name: string
  description: string
  isActive: boolean
  createdAt: number
}

export default function CategoriesPage() {
  const categories = useQuery(api.categories.list) || []
  const categoryStats = useQuery(api.categories.getStats)
  const createCategory = useMutation(api.categories.create)
  const updateCategory = useMutation(api.categories.update)
  const deleteCategory = useMutation(api.categories.remove)

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error("Category name is required")
      return
    }

    setIsLoading(true)
    try {
      await createCategory({
        name: newCategory.name.trim(),
        description: newCategory.description.trim(),
      })

      toast.success("Category created successfully!")
      setNewCategory({ name: "", description: "" })
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Failed to create category:", error)
      toast.error("Failed to create category. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCategory = async (id: Id<"categories">, name: string) => {
    try {
      await deleteCategory({ id })
      toast.success(`Category "${name}" deleted successfully!`)
    } catch (error) {
      console.error("Failed to delete category:", error)
      toast.error("Failed to delete category. Please try again.")
    }
  }

  const handleToggleActive = async (id: Id<"categories">, isActive: boolean, name: string) => {
    try {
      await updateCategory({ id, isActive: !isActive })
      toast.success(`Category "${name}" ${!isActive ? "activated" : "deactivated"} successfully!`)
    } catch (error) {
      console.error("Failed to update category:", error)
      toast.error("Failed to update category status. Please try again.")
    }
  }

  const resetForm = () => {
    setNewCategory({ name: "", description: "" })
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new category for organizing your bag products (e.g., Tote, Medium, Small, Backpack).
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="e.g., Tote Bags, Medium Bags, etc."
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  placeholder="Enter category description"
                  rows={3}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleAddCategory} disabled={isLoading || !newCategory.name.trim()}>
                {isLoading ? "Creating..." : "Add Category"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoryStats?.totalCategories || 0}</div>
            <p className="text-xs text-muted-foreground">All categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Categories</CardTitle>
            <FolderOpen className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoryStats?.activeCategories || 0}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Categories</CardTitle>
            <FolderOpen className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoryStats?.inactiveCategories || 0}</div>
            <p className="text-xs text-muted-foreground">Currently inactive</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Bag Categories
          </CardTitle>
          <CardDescription>Manage categories for your bag types (Tote, Medium, Small, Backpack, etc.).</CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-8">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No categories yet</h3>
              <p className="text-muted-foreground mb-4">Create your first category to organize your bag products.</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {category.description || <span className="text-muted-foreground">No description</span>}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`cursor-pointer ${
                          category.isActive
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                        onClick={() => handleToggleActive(category._id, category.isActive, category.name)}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" title="Edit Category">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCategory(category._id, category.name)}
                          title="Delete Category"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
