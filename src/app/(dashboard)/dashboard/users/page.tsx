"use client";

import { useState } from "react";
import {
  Ban,
  Check,
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  Shield,
  Trash,
  UserIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import TitleDashboard from "@/components/custom-component/TitleDashboard";

// Mock data for users
const initialUsers = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "admin",
    status: "active",
    lastLogin: "2024-02-15T10:30:00Z",
    createdAt: "2023-05-10T08:00:00Z",
    avatar: "/placeholder.svg?height=40&width=40",
    mangaCount: 45,
    favoriteCategories: ["Action", "Adventure", "Fantasy"],
  },
  {
    id: "2",
    name: "Sarah Williams",
    email: "sarah@example.com",
    role: "editor",
    status: "active",
    lastLogin: "2024-02-14T14:20:00Z",
    createdAt: "2023-06-15T09:30:00Z",
    avatar: "/placeholder.svg?height=40&width=40",
    mangaCount: 32,
    favoriteCategories: ["Romance", "Drama", "Slice of Life"],
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael@example.com",
    role: "user",
    status: "active",
    lastLogin: "2024-02-10T09:15:00Z",
    createdAt: "2023-07-20T11:45:00Z",
    avatar: "/placeholder.svg?height=40&width=40",
    mangaCount: 18,
    favoriteCategories: ["Horror", "Supernatural", "Mystery"],
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@example.com",
    role: "user",
    status: "inactive",
    lastLogin: "2024-01-05T16:40:00Z",
    createdAt: "2023-08-05T13:20:00Z",
    avatar: "/placeholder.svg?height=40&width=40",
    mangaCount: 7,
    favoriteCategories: ["Comedy", "Sci-Fi"],
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david@example.com",
    role: "editor",
    status: "active",
    lastLogin: "2024-02-13T11:10:00Z",
    createdAt: "2023-09-12T10:00:00Z",
    avatar: "/placeholder.svg?height=40&width=40",
    mangaCount: 29,
    favoriteCategories: ["Action", "Fantasy", "Sci-Fi"],
  },
  {
    id: "6",
    name: "Jessica Martinez",
    email: "jessica@example.com",
    role: "user",
    status: "suspended",
    lastLogin: "2023-12-20T08:30:00Z",
    createdAt: "2023-10-18T15:30:00Z",
    avatar: "/placeholder.svg?height=40&width=40",
    mangaCount: 5,
    favoriteCategories: ["Romance", "Comedy"],
  },
  {
    id: "7",
    name: "Robert Taylor",
    email: "robert@example.com",
    role: "admin",
    status: "active",
    lastLogin: "2024-02-14T17:45:00Z",
    createdAt: "2023-11-05T09:15:00Z",
    avatar: "/placeholder.svg?height=40&width=40",
    mangaCount: 38,
    favoriteCategories: ["Action", "Adventure", "Fantasy", "Sci-Fi"],
  },
  {
    id: "8",
    name: "Jennifer Anderson",
    email: "jennifer@example.com",
    role: "user",
    status: "active",
    lastLogin: "2024-02-12T13:20:00Z",
    createdAt: "2023-12-10T14:00:00Z",
    avatar: "/placeholder.svg?height=40&width=40",
    mangaCount: 12,
    favoriteCategories: ["Slice of Life", "Drama"],
  },
  {
    id: "9",
    name: "Thomas Clark",
    email: "thomas@example.com",
    role: "editor",
    status: "inactive",
    lastLogin: "2024-01-15T10:10:00Z",
    createdAt: "2024-01-05T11:30:00Z",
    avatar: "/placeholder.svg?height=40&width=40",
    mangaCount: 8,
    favoriteCategories: ["Mystery", "Horror"],
  },
  {
    id: "10",
    name: "Lisa Rodriguez",
    email: "lisa@example.com",
    role: "user",
    status: "active",
    lastLogin: "2024-02-11T09:50:00Z",
    createdAt: "2024-01-20T16:45:00Z",
    avatar: "/placeholder.svg?height=40&width=40",
    mangaCount: 3,
    favoriteCategories: ["Romance", "Comedy", "Slice of Life"],
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "user",
    status: "active",
  });
  const [editingUser, setEditingUser] = useState<any>(null);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // Filter and sort users
  const filteredUsers = users
    .filter(
      (user) =>
        (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (roleFilter === "all" || user.role === roleFilter) &&
        (statusFilter === "all" || user.status === statusFilter)
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "lastLogin") {
        return (
          new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime()
        );
      } else if (sortBy === "mangaCount") {
        return b.mangaCount - a.mangaCount;
      } else {
        return a.name.localeCompare(b.name);
      }
    });

  const handleAddUser = () => {
    if (newUser.name.trim() === "" || newUser.email.trim() === "") return;

    const newId = (
      Math.max(...users.map((u) => Number.parseInt(u.id))) + 1
    ).toString();

    setUsers([
      ...users,
      {
        id: newId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        lastLogin: "Never",
        createdAt: new Date().toISOString(),
        avatar: "/placeholder.svg?height=40&width=40",
        mangaCount: 0,
        favoriteCategories: [],
      },
    ]);

    setNewUser({ name: "", email: "", role: "user", status: "active" });
    setIsAddDialogOpen(false);
  };

  const handleEditUser = () => {
    if (
      !editingUser ||
      editingUser.name.trim() === "" ||
      editingUser.email.trim() === ""
    )
      return;

    setUsers(
      users.map((user) => (user.id === editingUser.id ? editingUser : user))
    );

    setEditingUser(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleStatusChange = (id: string, status: string) => {
    setUsers(
      users.map((user) => (user.id === id ? { ...user, status } : user))
    );
  };

  const handleRoleChange = (id: string, role: string) => {
    setUsers(users.map((user) => (user.id === id ? { ...user, role } : user)));
  };

  const openEditDialog = (user: any) => {
    setEditingUser({ ...user });
    setIsEditDialogOpen(true);
  };

  // Stats calculations
  const activeUsers = users.filter((u) => u.status === "active").length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const editorCount = users.filter((u) => u.role === "editor").length;
  const userCount = users.filter((u) => u.role === "user").length;
  const totalManga = users.reduce((sum, user) => sum + user.mangaCount, 0);

  const formatDate = (dateString: string) => {
    if (dateString === "Never") return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge variant="default" className="bg-primary">
            Admin
          </Badge>
        );
      case "editor":
        return <Badge variant="secondary">Editor</Badge>;
      default:
        return <Badge variant="outline">User</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge
            variant="outline"
            className="text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900/30 dark:text-green-400"
          >
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge
            variant="outline"
            className="text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-900/30 dark:text-yellow-400"
          >
            Inactive
          </Badge>
        );
      case "suspended":
        return (
          <Badge
            variant="outline"
            className="text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900/30 dark:text-red-400"
          >
            Suspended
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <TitleDashboard
          title="Users"
          description="Manage user accounts and permissions"
        />

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new user account</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  placeholder="Full name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  placeholder="Email address"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value) =>
                      setNewUser({ ...newUser, role: value })
                    }
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newUser.status}
                    onValueChange={(value) =>
                      setNewUser({ ...newUser, status: value })
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddUser}>Add User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update user information</DialogDescription>
            </DialogHeader>
            {editingUser && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    value={editingUser.name}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, name: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editingUser.email}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, email: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-role">Role</Label>
                    <Select
                      value={editingUser.role}
                      onValueChange={(value) =>
                        setEditingUser({ ...editingUser, role: value })
                      }
                    >
                      <SelectTrigger id="edit-role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                      value={editingUser.status}
                      onValueChange={(value) =>
                        setEditingUser({ ...editingUser, status: value })
                      }
                    >
                      <SelectTrigger id="edit-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleEditUser}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full md:max-w-md grid-cols-2">
          <TabsTrigger
            value="list"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            User List
          </TabsTrigger>
          <TabsTrigger
            value="stats"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            User Stats
          </TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="mt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1 space-y-1">
              <Label htmlFor="search-users" className="text-sm">
                Search
              </Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search-users"
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="space-y-1">
                <Label htmlFor="role-filter" className="text-sm">
                  Role
                </Label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger id="role-filter" className="w-[150px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="status-filter" className="text-sm">
                  Status
                </Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status-filter" className="w-[150px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="sort-users" className="text-sm">
                  Sort By
                </Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger id="sort-users" className="w-[150px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="lastLogin">Last Login</SelectItem>
                    <SelectItem value="mangaCount">Manga Count</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="text-center">Role</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Last Login
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-muted-foreground md:hidden">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {user.email}
                      </TableCell>
                      <TableCell className="text-center">
                        {getRoleBadge(user.role)}
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(user.status)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(user.lastLogin)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => openEditDialog(user)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                            <DropdownMenuItem
                              disabled={user.role === "admin"}
                              onClick={() => handleRoleChange(user.id, "admin")}
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              Make Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={user.role === "editor"}
                              onClick={() =>
                                handleRoleChange(user.id, "editor")
                              }
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Make Editor
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={user.role === "user"}
                              onClick={() => handleRoleChange(user.id, "user")}
                            >
                              <UserIcon className="mr-2 h-4 w-4" />
                              Make User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                            <DropdownMenuItem
                              disabled={user.status === "active"}
                              onClick={() =>
                                handleStatusChange(user.id, "active")
                              }
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Set Active
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={user.status === "inactive"}
                              onClick={() =>
                                handleStatusChange(user.id, "inactive")
                              }
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              Set Inactive
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={user.status === "suspended"}
                              onClick={() =>
                                handleStatusChange(user.id, "suspended")
                              }
                              className="text-destructive"
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              Suspend User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-destructive"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="stats" className="mt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-xs text-muted-foreground">
                  {activeUsers} active users
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  User Roles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {adminCount + editorCount + userCount}
                </div>
                <p className="text-xs text-muted-foreground">
                  {adminCount} admins, {editorCount} editors, {userCount} users
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Manga
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalManga}</div>
                <p className="text-xs text-muted-foreground">
                  Across all users
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Manga
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(totalManga / users.length)}
                </div>
                <p className="text-xs text-muted-foreground">Per user</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Users</CardTitle>
                <CardDescription>Users with the most manga</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[...users]
                    .sort((a, b) => b.mangaCount - a.mangaCount)
                    .slice(0, 5)
                    .map((user) => (
                      <div key={user.id} className="flex items-center">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user.mangaCount} manga
                          </p>
                        </div>
                        <div className="ml-auto font-medium">
                          {getRoleBadge(user.role)}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>User Status</CardTitle>
                <CardDescription>Distribution of user status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="font-medium">Active</div>
                      <div>
                        {users.filter((u) => u.status === "active").length}{" "}
                        users
                      </div>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-green-500"
                        style={{
                          width: `${
                            (users.filter((u) => u.status === "active").length /
                              users.length) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="font-medium">Inactive</div>
                      <div>
                        {users.filter((u) => u.status === "inactive").length}{" "}
                        users
                      </div>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-yellow-500"
                        style={{
                          width: `${
                            (users.filter((u) => u.status === "inactive")
                              .length /
                              users.length) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="font-medium">Suspended</div>
                      <div>
                        {users.filter((u) => u.status === "suspended").length}{" "}
                        users
                      </div>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-red-500"
                        style={{
                          width: `${
                            (users.filter((u) => u.status === "suspended")
                              .length /
                              users.length) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
