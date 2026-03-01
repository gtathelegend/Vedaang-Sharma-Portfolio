import { useRef, useState } from "react";

const CloudinaryUploader = ({ value = [], onChange }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const uploadFiles = async (files) => {
    if (!files?.length) return;

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary is not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.");
    }

    setUploading(true);
    try {
      const uploadedUrls = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: formData,
        });

        const payload = await response.json();
        if (payload.secure_url) {
          uploadedUrls.push(payload.secure_url);
        }
      }

      onChange([...(value || []), ...uploadedUrls]);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (imageUrl) => {
    onChange((value || []).filter((item) => item !== imageUrl));
  };

  return (
    <div className="space-y-3">
      <div
        className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center cursor-pointer hover:border-slate-500 transition"
        onClick={() => inputRef.current?.click()}
        onDrop={(event) => {
          event.preventDefault();
          uploadFiles(Array.from(event.dataTransfer.files || []));
        }}
        onDragOver={(event) => event.preventDefault()}
      >
        <p className="text-sm text-slate-600">
          {uploading ? "Uploading images..." : "Drag and drop images here, or click to browse"}
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(event) => uploadFiles(Array.from(event.target.files || []))}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(value || []).map((imageUrl) => (
          <div key={imageUrl} className="relative rounded-lg overflow-hidden border border-slate-200">
            <img src={imageUrl} alt="Project" className="w-full h-28 object-cover" />
            <button
              type="button"
              onClick={() => removeImage(imageUrl)}
              className="absolute top-1 right-1 text-xs px-2 py-1 rounded bg-black/70 text-white"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CloudinaryUploader;
