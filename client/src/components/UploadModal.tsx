import { useState, useCallback } from "react";
import { useUploadVideo } from "@/hooks/use-videos";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, FileVideo, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";

export function UploadModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { mutate: uploadVideo, isPending } = useUploadVideo();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      // Auto-fill title from filename if empty
      if (!title) {
        setTitle(acceptedFiles[0].name.replace(/\.[^/.]+$/, ""));
      }
    }
  }, [title]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': []
    },
    maxFiles: 1,
    multiple: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    uploadVideo(
      { file, title, description },
      {
        onSuccess: () => {
          setIsOpen(false);
          // Reset form
          setFile(null);
          setTitle("");
          setDescription("");
        }
      }
    );
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" variant="gradient" className="gap-2">
          <Upload className="w-4 h-4" />
          Upload Video
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-white/10 text-foreground">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">Upload Video</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Share your video with the world. Supports MP4, WebM, and Ogg.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-4">
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
                ${isDragActive ? "border-primary bg-primary/5" : "border-white/10 hover:border-white/20 hover:bg-white/5"}
                ${file ? "bg-primary/5 border-primary/50" : ""}
              `}
            >
              <input {...getInputProps()} />
              <AnimatePresence mode="wait">
                {file ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center justify-between gap-4 p-2"
                  >
                    <div className="flex items-center gap-3 text-left overflow-hidden">
                      <div className="p-2 bg-primary/20 rounded-lg text-primary">
                        <FileVideo className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate text-sm">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0 hover:bg-destructive/10 hover:text-destructive"
                      onClick={removeFile}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="p-4 rounded-full bg-white/5 mb-2">
                      <Upload className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground">Maximum file size 100MB</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Awesome Video"
                className="bg-white/5 border-white/10 focus:border-primary/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's this video about?"
                className="bg-white/5 border-white/10 focus:border-primary/50 min-h-[100px]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!file || !title || isPending}
              className="min-w-[100px]"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Video"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
