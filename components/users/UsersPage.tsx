"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  UserCheck,
  UserX,
  Mail,
  Shield,
  Eye,
  EyeOff,
  Phone,
  CalendarIcon,
} from "lucide-react";

// Datos de ejemplo - en producción vendrían de una API/DB
const initialUsers = [
  {
    id: "1",
    name: "Carlos Mendoza",
    email: "carlos.mendoza@empresa.com",
    role: "Admin",
    department: "Dirección",
    status: true,
    avatar: "",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "María García",
    email: "maria.garcia@empresa.com",
    role: "Usuario",
    department: "Arquitectura",
    status: true,
    avatar: "",
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    name: "Juan Pérez",
    email: "juan.perez@empresa.com",
    role: "Usuario",
    department: "Obra",
    status: false,
    avatar: "",
    createdAt: "2024-03-10",
  },
  {
    id: "4",
    name: "Ana Rodríguez",
    email: "ana.rodriguez@empresa.com",
    role: "Moderador",
    department: "AuxAdmin",
    status: true,
    avatar: "",
    createdAt: "2024-04-05",
  },
  {
    id: "5",
    name: "Roberto Sánchez",
    email: "roberto.sanchez@empresa.com",
    role: "Usuario",
    department: "Obra",
    status: true,
    avatar: "",
    createdAt: "2024-05-12",
  },
  {
    id: "6",
    name: "Laura Martínez",
    email: "laura.martinez@empresa.com",
    role: "Usuario",
    department: "Arquitectura",
    status: false,
    avatar: "",
    createdAt: "2024-06-18",
  },
];

const roles = ["Admin", "Moderador", "Usuario"];
const departments = ["Dirección", "AuxAdmin", "Obra", "Arquitectura"];

export function UsersPage() {
  const [users, setUsers] = React.useState(initialUsers);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterRole, setFilterRole] = React.useState<string>("all");
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  const [isNewUserDialogOpen, setIsNewUserDialogOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<
    (typeof initialUsers)[0] | null
  >(null);
  const [newUser, setNewUser] = React.useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    birthDate: "",
    isAreaManager: false,
    role: "Usuario",
    department: "Obra",
  });
  const [showPassword, setShowPassword] = React.useState(false);

  // Filtrar usuarios
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && user.status) ||
      (filterStatus === "inactive" && !user.status);
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Toggle estado del usuario
  const toggleUserStatus = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: !user.status } : user,
      ),
    );
  };

  // Eliminar usuario
  const deleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  // Crear nuevo usuario
  const handleCreateUser = () => {
    const user = {
      id: String(Date.now()),
      ...newUser,
      status: true,
      avatar: "",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setUsers([...users, user]);
    setNewUser({
      name: "",
      email: "",
      password: "",
      phone: "",
      birthDate: "",
      isAreaManager: false,
      role: "Usuario",
      department: "Obra",
    });
    setShowPassword(false);
    setIsNewUserDialogOpen(false);
  };

  // Actualizar usuario
  const handleUpdateUser = () => {
    if (!editingUser) return;
    setUsers(
      users.map((user) => (user.id === editingUser.id ? editingUser : user)),
    );
    setEditingUser(null);
  };

  // Obtener iniciales del nombre
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Obtener color del badge según rol
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "Admin":
        return "default";
      case "Moderador":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
          <p className="text-muted-foreground">
            Gestiona los usuarios del sistema, permisos y accesos.
          </p>
        </div>
        <Dialog
          open={isNewUserDialogOpen}
          onOpenChange={setIsNewUserDialogOpen}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Usuario</DialogTitle>
              <DialogDescription>
                Completa la información para crear un nuevo usuario en el
                sistema.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  placeholder="Juan Pérez"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  placeholder="juan@empresa.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    placeholder="ttarq.123"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {newUser.password && (
                  <p className="text-xs text-muted-foreground">
                    Contraseña:{" "}
                    <span className="font-mono">{newUser.password}</span>
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Teléfono</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={newUser.phone}
                    onChange={(e) =>
                      setNewUser({ ...newUser, phone: e.target.value })
                    }
                    placeholder="+52 55 1234 5678"
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Fecha de nacimiento</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newUser.birthDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newUser.birthDate ? (
                        format(new Date(newUser.birthDate), "PPP", {
                          locale: es,
                        })
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        newUser.birthDate
                          ? new Date(newUser.birthDate)
                          : undefined
                      }
                      onSelect={(date) =>
                        setNewUser({
                          ...newUser,
                          birthDate: date
                            ? date.toISOString().split("T")[0]
                            : "",
                        })
                      }
                      autoFocus
                      captionLayout="dropdown"
                      startMonth={new Date(new Date().getFullYear(), 1)}
                      endMonth={new Date(new Date().getFullYear(), 12)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Rol</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) =>
                    setNewUser({ ...newUser, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="department">Departamento</Label>
                <Select
                  value={newUser.department}
                  onValueChange={(value) =>
                    setNewUser({ ...newUser, department: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="isAreaManager"
                  checked={newUser.isAreaManager}
                  onCheckedChange={(checked) =>
                    setNewUser({ ...newUser, isAreaManager: checked === true })
                  }
                />
                <Label
                  htmlFor="isAreaManager"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Es jefe de área
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsNewUserDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateUser}
                disabled={!newUser.name || !newUser.email}
              >
                Crear Usuario
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary/10 p-2">
              <UserCheck className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Usuarios</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-green-500/10 p-2">
              <UserCheck className="h-4 w-4 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Activos</p>
              <p className="text-2xl font-bold">
                {users.filter((u) => u.status).length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-red-500/10 p-2">
              <UserX className="h-4 w-4 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Inactivos</p>
              <p className="text-2xl font-bold">
                {users.filter((u) => !u.status).length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-blue-500/10 p-2">
              <Shield className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Admins</p>
              <p className="text-2xl font-bold">
                {users.filter((u) => u.role === "Admin").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los roles</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha Creación</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No se encontraron usuarios.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={user.status}
                        onCheckedChange={() => toggleUserStatus(user.id)}
                      />
                      <span
                        className={`text-sm ${
                          user.status ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {user.status ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menú</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setEditingUser(user)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            window.open(`mailto:${user.email}`, "_blank")
                          }
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Enviar correo
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                ¿Eliminar usuario?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. El usuario{" "}
                                <strong>{user.name}</strong> será eliminado
                                permanentemente del sistema.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteUser(user.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>
              Modifica la información del usuario.
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nombre completo</Label>
                <Input
                  id="edit-name"
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Correo electrónico</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Rol</Label>
                <Select
                  value={editingUser.role}
                  onValueChange={(value) =>
                    setEditingUser({ ...editingUser, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-department">Departamento</Label>
                <Select
                  value={editingUser.department}
                  onValueChange={(value) =>
                    setEditingUser({ ...editingUser, department: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateUser}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
