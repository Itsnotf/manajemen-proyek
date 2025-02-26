"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { updateUsers } from "@/services/users";

export default function ProfilePage() {
  const { toast } = useToast();
  const [userData, setUserData] = useState({
    id:"",
    name: "",
    email: "",
    role_id: null as string | null, // Ubah di sini
  });
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role_id: null as string | null, // Ubah di sini
    confirmPassword: "", 
  });

  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  // Mengambil data dari localStorage saat komponen pertama kali dimuat
  useEffect(() => {
    const userString = localStorage.getItem("users") || "{}";
    const parsedUserData = JSON.parse(userString);
    setUserData(parsedUserData);
    setFormData({
      name: parsedUserData.name || "",
      email: parsedUserData.email || "",
      password: "",
      role_id: parsedUserData.role_id || null, // Ubah di sini
      confirmPassword: "", 
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      name: userData.name || "",
      role_id: userData.role_id || null, // Ubah di sini
      email: userData.email || "",
      password: "",
      confirmPassword: "", 
    });
    setIsEditing(false);
    setError("");
  };

  const handleSave = async () => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Password dan Konfirmasi Password harus sama!");
      return;
    }

    try {
      const response = await updateUsers(userData.id, {
        role_id: formData.role_id,
        name: formData.name,
        email: formData.email,
        password: formData.password || undefined, // ✅ Jangan kirim password jika kosong
      });

      if (response) {
        toast({
          title: "Sukses",
          description: "Profil berhasil diperbarui!",
        });

        // ✅ Perbarui localStorage
        localStorage.setItem("users", JSON.stringify({ ...userData, name: formData.name, email: formData.email }));

        setIsEditing(false);
      }
    } catch (err) {
      console.error("Gagal memperbarui data:", err);
      setError("Gagal memperbarui data.");
    }
  };

  return (
    <Card className="mx-auto mt-10">
      <CardHeader>
        <h2 className="text-xl font-semibold">Edit Profil</h2>
      </CardHeader>
      <CardContent>
        {error && <Label className="text-red-500 mb-3">{error}</Label>}

        <div className="space-y-4">
          <div>
            <Label>Nama</Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          {isEditing && (
            <>
              <div>
                <Label>Password (Opsional)</Label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Konfirmasi Password</Label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div className="flex justify-between">
            {!isEditing ? (
              <Button onClick={handleEdit}>Edit</Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} className="bg-green-500">Simpan</Button>
                <Button onClick={handleCancel} className="bg-gray-500">Cancel</Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
