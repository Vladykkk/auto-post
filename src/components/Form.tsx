import { useState } from "react";

import { SpinnerIcon } from "@/components/Icons";

interface FormData {
  text: string;
  image: File | null;
  video: File | null;
}

const Form = () => {
  const [formData, setFormData] = useState<FormData>({
    text: "",
    image: null,
    video: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, text: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, video: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement API calls to post to LinkedIn, X, and Substack
      console.log("Form Data:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert("Content posted successfully to all platforms!");

      // Reset form
      setFormData({ text: "", image: null, video: null });

      // Reset file inputs
      const imageInput = document.getElementById("image") as HTMLInputElement;
      const videoInput = document.getElementById("video") as HTMLInputElement;
      if (imageInput) imageInput.value = "";
      if (videoInput) videoInput.value = "";
    } catch (error) {
      console.error("Error posting content:", error);
      alert("Error posting content. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-lg">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">
        Social Media Post Creator
      </h1>
      <p className="mb-8 text-gray-600">
        Create and post content to LinkedIn, X, and Substack simultaneously
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Text Input */}
        <div>
          <label
            htmlFor="text"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Post Content
          </label>
          <textarea
            id="text"
            value={formData.text}
            onChange={handleTextChange}
            placeholder="What's on your mind? Share your thoughts..."
            className="resize-vertical min-h-[120px] w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            {formData.text.length} characters
          </p>
        </div>

        {/* Image Upload */}
        <div>
          <label
            htmlFor="image"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Upload Image (Optional)
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100 focus:border-transparent focus:ring-2 focus:ring-blue-500"
          />
          {formData.image && (
            <div className="mt-2 rounded-lg border border-green-200 bg-green-50 p-3">
              <p className="text-sm text-green-700">
                ✓ Selected: {formData.image.name} (
                {(formData.image.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
          )}
        </div>

        {/* Video Upload */}
        <div>
          <label
            htmlFor="video"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Upload Video (Optional)
          </label>
          <input
            type="file"
            id="video"
            accept="video/*"
            onChange={handleVideoChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 file:mr-4 file:rounded-lg file:border-0 file:bg-purple-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-purple-700 hover:file:bg-purple-100 focus:border-transparent focus:ring-2 focus:ring-blue-500"
          />
          {formData.video && (
            <div className="mt-2 rounded-lg border border-green-200 bg-green-50 p-3">
              <p className="text-sm text-green-700">
                ✓ Selected: {formData.video.name} (
                {(formData.video.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
          )}
        </div>

        {/* Platform Info */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h3 className="mb-2 text-sm font-medium text-blue-800">
            Posting to:
          </h3>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
              LinkedIn
            </span>
            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
              X (Twitter)
            </span>
            <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800">
              Substack
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!formData.text || isSubmitting}
          className="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <SpinnerIcon className="mr-3 -ml-1 h-5 w-5 text-white" />
              Posting...
            </span>
          ) : (
            "Post to All Platforms"
          )}
        </button>
      </form>
    </div>
  );
};

export default Form;
