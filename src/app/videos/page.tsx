"use client";

import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Video,
  Upload,
  Play,
  Trash2,
  Search,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Video {
  id: number;
  title: string;
  description: string;
  uploader: string;
  upload_date: string;
  file_path: string;
  tags: string[];
}

export default function VideoUploadPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch videos on mount
  useState(() => {
    fetchVideos();
  });

  const fetchVideos = async () => {
    try {
      const response = await fetch(`${API_URL}/api/video/list`);
      if (response.ok) {
        const data = await response.json();
        setVideos(data);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-zinc-950">
      <div
        className="fixed inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#0d0d0d_1px,transparent_1px),linear-gradient(to_bottom,#0d0d0d_1px,transparent_1px)] bg-[size:4rem_4rem]"
        aria-hidden="true"
      />
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Video Library
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Upload, share, and discover educational videos
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Upload Form */}
          <div className="lg:col-span-1">
            <UploadForm onUploadSuccess={fetchVideos} />
          </div>

          {/* Video List */}
          <div className="lg:col-span-2">
            <VideoList
              videos={filteredVideos}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onDelete={fetchVideos}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function UploadForm({ onUploadSuccess }: { onUploadSuccess: () => void }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    uploader: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const uploadData = new FormData();
      uploadData.append("title", formData.title);
      uploadData.append("description", formData.description);
      uploadData.append("tags", formData.tags);
      uploadData.append("uploader", formData.uploader || "Anonymous");
      if (file) {
        uploadData.append("file", file);
      }

      const response = await fetch(`${API_URL}/api/video/upload`, {
        method: "POST",
        body: uploadData,
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ title: "", description: "", tags: "", uploader: "" });
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        onUploadSuccess();
        
        setTimeout(() => setSuccess(false), 3000);
      } else {
        console.error("Upload failed");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-purple-500" />
          Upload Video
        </CardTitle>
        <CardDescription>
          Share your knowledge with the community
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Introduction to FastAPI"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your video..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="bg-zinc-800 border-zinc-700"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              placeholder="python, fastapi, tutorial"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <div>
            <Label htmlFor="uploader">Your Name (Optional)</Label>
            <Input
              id="uploader"
              placeholder="John Doe"
              value={formData.uploader}
              onChange={(e) => setFormData({ ...formData, uploader: e.target.value })}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <div>
            <Label htmlFor="file">Video File (Optional for demo)</Label>
            <div
              className="border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center hover:border-zinc-600 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                id="file"
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <Video className="w-8 h-8 mx-auto mb-2 text-zinc-500" />
              <p className="text-sm text-zinc-400">
                {file ? file.name : "Click to select a video"}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                MP4, WebM, or Ogg (Max 100MB)
              </p>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Video
              </>
            )}
          </Button>

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-green-400 text-sm"
            >
              <CheckCircle className="w-4 h-4" />
              Video uploaded successfully!
            </motion.div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

function VideoList({
  videos,
  searchTerm,
  setSearchTerm,
  onDelete,
}: {
  videos: Video[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onDelete: () => void;
}) {
  const handleDelete = async (videoId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      const response = await fetch(`${API_URL}/api/video/${videoId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onDelete();
      } else {
        console.error("Delete failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <Input
          placeholder="Search videos by title or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-zinc-900 border-zinc-800"
        />
      </div>

      {/* Video Grid */}
      {videos.length === 0 ? (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="py-12 text-center">
            <Video className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
            <h3 className="text-lg font-semibold mb-2">No videos yet</h3>
            <p className="text-zinc-400">
              {searchTerm ? "No videos match your search" : "Be the first to upload a video!"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {videos.map((video) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Thumbnail placeholder */}
                    <div className="w-48 h-28 bg-zinc-800 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Play className="w-8 h-8 text-zinc-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{video.title}</h3>
                          <p className="text-zinc-400 text-sm line-clamp-2 mb-3">
                            {video.description}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => handleDelete(video.id, e)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-zinc-500">
                          By {video.uploader}
                        </span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-zinc-500">
                          {new Date(video.upload_date).toLocaleDateString()}
                        </span>
                      </div>

                      {video.tags && video.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {video.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="cursor-pointer hover:bg-zinc-700"
                              onClick={() => setSearchTerm(tag)}
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
