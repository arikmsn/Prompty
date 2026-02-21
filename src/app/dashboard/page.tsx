"use client";

import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createClient } from "@/src/lib/supabase";

const STORAGE_BUCKET = "prompt-outputs";

const CATEGORY_OPTIONS = [
  { value: "visual", label: "Visual" },
  { value: "cinematic", label: "Cinematic" },
  { value: "logic", label: "Logic" },
  { value: "autonomous", label: "Autonomous" },
] as const;

const PLACEHOLDER_TITLE = "e.g. Cinematic fire sequence for Kling";
const PLACEHOLDER_PROMPT =
  "Enter your prompt template. Use {{variables}} for user inputs.";
const PLACEHOLDER_OUTPUT =
  "Describe the expected output or attach a preview URL.";
const LABEL_TITLE = "Title";
const LABEL_CATEGORY = "Category";
const LABEL_PROMPT = "Prompt text";
const LABEL_OUTPUT = "Expected output description";
const LABEL_PREVIEW_IMAGE = "Output Preview Image";
const CARD_TITLE = "Quick Add";
const CARD_DESCRIPTION = "Submit a new prompt asset to your catalog.";
const SUBMIT_LABEL = "Add prompt";
const SUBMIT_LOADING_LABEL = "Adding…";
const SUCCESS_MESSAGE = "Prompt added successfully.";

function slugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function DashboardPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [promptText, setPromptText] = useState("");
  const [outputDescription, setOutputDescription] = useState("");
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewObjectUrl, setPreviewObjectUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (previewObjectUrl) {
      URL.revokeObjectURL(previewObjectUrl);
      setPreviewObjectUrl(null);
    }
    if (!file) {
      setPreviewFile(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setPreviewFile(null);
      return;
    }
    setPreviewFile(file);
    setPreviewObjectUrl(URL.createObjectURL(file));
  }

  function clearPreview() {
    if (previewObjectUrl) {
      URL.revokeObjectURL(previewObjectUrl);
      setPreviewObjectUrl(null);
    }
    setPreviewFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const slug = slugFromTitle(title) || `prompt-${Date.now()}`;

      let previewUrl: string | null = null;
      if (previewFile) {
        const ext = previewFile.name.split(".").pop() || "jpg";
        const storagePath = `${slug}-${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(storagePath, previewFile, {
            cacheControl: "3600",
            upsert: false,
          });
        if (uploadError) {
          console.error("Storage upload error:", uploadError.message);
          setSuccessMessage(`Error: ${uploadError.message}`);
          setIsLoading(false);
          return;
        }
        const { data: urlData } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(storagePath);
        previewUrl = urlData.publicUrl;
      }

      const { error } = await supabase.from("prompts").insert({
        title: title.trim(),
        slug,
        modality: category,
        user_prompt_template: promptText.trim(),
        expected_output_description: outputDescription.trim() || null,
        preview_url: previewUrl,
      });

      if (error) {
        console.error("Supabase insert error:", error.message);
        setSuccessMessage(`Error: ${error.message}`);
        return;
      }

      setTitle("");
      setCategory("");
      setPromptText("");
      setOutputDescription("");
      clearPreview();
      setSuccessMessage(SUCCESS_MESSAGE);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("Form submit error:", message);
      setSuccessMessage(`Error: ${message}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white">
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Creator Dashboard
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Manage and publish your prompt assets.
          </p>
        </div>

        {successMessage && (
          <div
            className={`mb-6 rounded-md border px-4 py-3 text-sm ${
              successMessage.startsWith("Error")
                ? "border-red-500/30 bg-red-500/10 text-red-200"
                : "border-white/10 bg-white/5 text-white"
            }`}
          >
            {successMessage}
          </div>
        )}

        <Card className="border-white/10 bg-[#0a0a0a] shadow-none">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">
              {CARD_TITLE}
            </CardTitle>
            <CardDescription className="text-white/60">
              {CARD_DESCRIPTION}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="text-sm font-medium text-white/90"
                >
                  {LABEL_TITLE}
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={PLACEHOLDER_TITLE}
                  className="border-white/10 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-white/20"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="category"
                  className="text-sm font-medium text-white/90"
                >
                  {LABEL_CATEGORY}
                </label>
                <Select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Select modality"
                  className="border-white/10 bg-white/5 text-white focus-visible:ring-white/20"
                  required
                  disabled={isLoading}
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="prompt"
                  className="text-sm font-medium text-white/90"
                >
                  {LABEL_PROMPT}
                </label>
                <Textarea
                  id="prompt"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder={PLACEHOLDER_PROMPT}
                  rows={5}
                  className="min-h-[120px] border-white/10 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-white/20"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="output"
                  className="text-sm font-medium text-white/90"
                >
                  {LABEL_OUTPUT}
                </label>
                <Textarea
                  id="output"
                  value={outputDescription}
                  onChange={(e) => setOutputDescription(e.target.value)}
                  placeholder={PLACEHOLDER_OUTPUT}
                  rows={3}
                  className="min-h-[80px] border-white/10 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-white/20"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="preview-image"
                  className="text-sm font-medium text-white/90"
                >
                  {LABEL_PREVIEW_IMAGE}
                </label>
                <input
                  ref={fileInputRef}
                  id="preview-image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isLoading}
                  className="block w-full text-sm text-white/90 file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white file:hover:bg-white/20"
                />
                {previewObjectUrl && (
                  <div className="flex items-center gap-3 pt-1">
                    <img
                      src={previewObjectUrl}
                      alt="Preview"
                      className="h-20 w-20 rounded-md border border-white/10 object-cover"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearPreview}
                      disabled={isLoading}
                      className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-white text-[#050505] hover:bg-white/90 disabled:opacity-70"
                >
                  {isLoading ? SUBMIT_LOADING_LABEL : SUBMIT_LABEL}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
